"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { routeSchema } from "@/lib/validation";

export async function createRouteAction(data) {
  await requireAdmin();

  const validation = routeSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid route data.",
    };
  }

  const { busNumber, routeName, description, isActive, stopIds } =
    validation.data;

  // Verify unique sequence stops
  if (new Set(stopIds).size !== stopIds.length) {
    // Check if duplicate stops exist adjacent or multiple times
    // Requirement: A route must not contain the same stop twice at the same sequence position
  }

  const startingPointId = stopIds[0];
  const destinationId = stopIds[stopIds.length - 1];

  try {
    const newRoute = await prisma.$transaction(async (tx) => {
      const created = await tx.route.create({
        data: {
          busNumber,
          routeName: routeName || null,
          description: description || null,
          startingPointId,
          destinationId,
          isActive: isActive !== undefined ? isActive : true,
          routeStops: {
            create: stopIds.map((stopId, index) => ({
              stopId,
              stopOrder: index + 1,
            })),
          },
        },
      });

      return created;
    });

    revalidatePath("/routes");
    revalidatePath("/admin/routes");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true, routeId: newRoute.id };
  } catch (error) {
    console.error("Create route error:", error);
    return {
      success: false,
      error: "Failed to create route. Please check constraints and try again.",
    };
  }
}

export async function updateRouteAction(routeId, data) {
  await requireAdmin();

  if (!routeId) return { success: false, error: "Route ID is required." };

  const validation = routeSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid route data.",
    };
  }

  const { busNumber, routeName, description, isActive, stopIds } =
    validation.data;

  const startingPointId = stopIds[0];
  const destinationId = stopIds[stopIds.length - 1];

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing route stops
      await tx.routeStop.deleteMany({
        where: { routeId },
      });

      // 2. Update route details
      await tx.route.update({
        where: { id: routeId },
        data: {
          busNumber,
          routeName: routeName || null,
          description: description || null,
          startingPointId,
          destinationId,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      // 3. Insert newly ordered route stops
      for (let i = 0; i < stopIds.length; i++) {
        await tx.routeStop.create({
          data: {
            routeId,
            stopId: stopIds[i],
            stopOrder: i + 1,
          },
        });
      }
    });

    revalidatePath(`/routes/${routeId}`);
    revalidatePath("/routes");
    revalidatePath("/admin/routes");
    revalidatePath(`/admin/routes/${routeId}/edit`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update route error:", error);
    return {
      success: false,
      error: "Failed to update route. Transaction rolled back.",
    };
  }
}

export async function deleteRouteAction(routeId) {
  await requireAdmin();

  if (!routeId) return { success: false, error: "Route ID is required." };

  try {
    await prisma.route.delete({
      where: { id: routeId },
    });

    revalidatePath("/routes");
    revalidatePath("/admin/routes");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete route error:", error);
    return { success: false, error: "Failed to delete route." };
  }
}

export async function toggleRouteStatusAction(routeId) {
  await requireAdmin();

  try {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      select: { isActive: true },
    });

    if (!route) return { success: false, error: "Route not found." };

    await prisma.route.update({
      where: { id: routeId },
      data: { isActive: !route.isActive },
    });

    revalidatePath("/routes");
    revalidatePath("/admin/routes");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Toggle route status error:", error);
    return { success: false, error: "Failed to update route status." };
  }
}
