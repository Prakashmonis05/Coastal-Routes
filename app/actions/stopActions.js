"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { stopSchema } from "@/lib/validation";
import { normalizeName } from "@/lib/utils/string";

export async function createStopAction(data) {
  await requireAdmin();

  const validation = stopSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid stop data.",
    };
  }

  const { name, description, aliases, isActive } = validation.data;
  const normalizedName = normalizeName(name);

  // Check if a stop with the exact normalized name already exists
  const existing = await prisma.stop.findFirst({
    where: { normalizedName },
  });

  if (existing) {
    return {
      success: false,
      error: `A bus stop with the name "${name}" already exists.`,
    };
  }

  try {
    const createdStop = await prisma.stop.create({
      data: {
        name,
        normalizedName,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        aliases: {
          create: (aliases || []).map((alias) => ({
            aliasName: alias,
            normalizedAlias: normalizeName(alias),
          })),
        },
      },
      include: { aliases: true },
    });

    revalidatePath("/admin/stops");
    revalidatePath("/admin/routes");
    revalidatePath("/admin/routes/new");
    revalidatePath("/admin/dashboard");
    revalidatePath("/routes");
    revalidatePath("/");

    return { success: true, stop: createdStop };
  } catch (error) {
    console.error("Create stop error:", error);
    return { success: false, error: "Failed to create stop." };
  }
}

export async function updateStopAction(stopId, data) {
  await requireAdmin();

  if (!stopId) return { success: false, error: "Stop ID is required." };

  const validation = stopSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid stop data.",
    };
  }

  const { name, description, aliases, isActive } = validation.data;
  const normalizedName = normalizeName(name);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update stop
      await tx.stop.update({
        where: { id: stopId },
        data: {
          name,
          normalizedName,
          description: description || null,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      // 2. Refresh aliases
      await tx.stopAlias.deleteMany({
        where: { stopId },
      });

      if (aliases && aliases.length > 0) {
        // Unique aliases by normalized string
        const uniqueAliases = [];
        const seen = new Set();
        for (const a of aliases) {
          const normA = normalizeName(a);
          if (normA && !seen.has(normA)) {
            seen.add(normA);
            uniqueAliases.push({
              stopId,
              aliasName: a.trim(),
              normalizedAlias: normA,
            });
          }
        }

        if (uniqueAliases.length > 0) {
          await tx.stopAlias.createMany({
            data: uniqueAliases,
          });
        }
      }
    });

    revalidatePath("/admin/stops");
    revalidatePath("/admin/routes");
    revalidatePath("/admin/dashboard");
    revalidatePath("/routes");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update stop error:", error);
    return { success: false, error: "Failed to update stop." };
  }
}

export async function deleteStopAction(stopId) {
  await requireAdmin();

  if (!stopId) return { success: false, error: "Stop ID is required." };

  try {
    // Check if the stop is used in any routes
    const [routeStopCount, startCount, destCount] = await Promise.all([
      prisma.routeStop.count({ where: { stopId } }),
      prisma.route.count({ where: { startingPointId: stopId } }),
      prisma.route.count({ where: { destinationId: stopId } }),
    ]);

    const totalUsages = routeStopCount + startCount + destCount;
    if (totalUsages > 0) {
      return {
        success: false,
        error: `Cannot delete this stop because it is currently part of ${routeStopCount} active route sequence(s). Please remove it from those routes first or deactivate the stop instead.`,
      };
    }

    await prisma.stop.delete({
      where: { id: stopId },
    });

    revalidatePath("/admin/stops");
    revalidatePath("/admin/dashboard");
    revalidatePath("/routes");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete stop error:", error);
    return { success: false, error: "Failed to delete stop." };
  }
}

export async function toggleStopStatusAction(stopId) {
  await requireAdmin();

  try {
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      select: { isActive: true },
    });

    if (!stop) return { success: false, error: "Stop not found." };

    await prisma.stop.update({
      where: { id: stopId },
      data: { isActive: !stop.isActive },
    });

    revalidatePath("/admin/stops");
    revalidatePath("/admin/routes");
    revalidatePath("/admin/dashboard");
    revalidatePath("/routes");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Toggle stop status error:", error);
    return { success: false, error: "Failed to update stop status." };
  }
}
