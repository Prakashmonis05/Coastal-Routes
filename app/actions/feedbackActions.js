"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { feedbackSchema, feedbackReviewSchema } from "@/lib/validation";
import { normalizeName } from "@/lib/utils/string";

// Simple in-memory rate limiting map for public submissions: IP/Identifier -> timestamp[]
const rateLimitMap = new Map();

function checkRateLimit(identifier) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const timestamps = rateLimitMap.get(identifier) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return false;
  }

  recent.push(now);
  rateLimitMap.set(identifier, recent);
  return true;
}

export async function submitFeedbackAction(data) {
  // Enforce basic rate limit
  if (!checkRateLimit("public-client")) {
    return {
      success: false,
      error: "Too many feedback submissions. Please wait a minute and try again.",
    };
  }

  const validation = feedbackSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid feedback data.",
    };
  }

  const {
    feedbackType,
    description,
    routeId,
    stopId,
    suggestedStopName,
    suggestedStartPoint,
    suggestedDestination,
  } = validation.data;

  try {
    // If routeId is provided, verify it exists
    if (routeId) {
      const routeExists = await prisma.route.findUnique({
        where: { id: routeId },
      });
      if (!routeExists) {
        return { success: false, error: "Referenced bus route not found." };
      }
    }

    // If stopId is provided, verify it exists
    if (stopId) {
      const stopExists = await prisma.stop.findUnique({
        where: { id: stopId },
      });
      if (!stopExists) {
        return { success: false, error: "Referenced bus stop not found." };
      }
    }

    await prisma.feedback.create({
      data: {
        feedbackType,
        description,
        routeId: routeId || null,
        stopId: stopId || null,
        suggestedStopName: suggestedStopName || null,
        suggestedStartPoint: suggestedStartPoint || null,
        suggestedDestination: suggestedDestination || null,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/feedback");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message:
        "Thank you for helping improve our bus route information. Your report has been submitted for review.",
    };
  } catch (error) {
    console.error("Submit feedback error:", error);
    return {
      success: false,
      error: "Unable to submit your feedback at this time. Please try again.",
    };
  }
}

export async function reviewFeedbackAction(feedbackId, data) {
  await requireAdmin();

  if (!feedbackId) return { success: false, error: "Feedback ID is required." };

  const validation = feedbackReviewSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid review data.",
    };
  }

  const { status, reviewNote } = validation.data;

  try {
    const updated = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status,
        reviewNote: reviewNote || null,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin/feedback");
    revalidatePath("/admin/dashboard");

    return { success: true, feedback: updated };
  } catch (error) {
    console.error("Review feedback error:", error);
    return { success: false, error: "Failed to update feedback status." };
  }
}

/**
 * Convenience admin action to apply an approved missing stop suggestion:
 * Creates the stop and marks the feedback as APPROVED.
 */
export async function applyMissingStopFeedbackAction(feedbackId, stopData) {
  await requireAdmin();

  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) return { success: false, error: "Feedback not found." };

    const name = stopData.name || feedback.suggestedStopName;
    if (!name || name.trim().length < 2) {
      return { success: false, error: "Valid stop name is required." };
    }

    const normalizedName = normalizeName(name);

    // Create the stop
    const newStop = await prisma.stop.create({
      data: {
        name: name.trim(),
        normalizedName,
        description: stopData.description || feedback.description,
        isActive: true,
      },
    });

    // Update feedback as APPROVED with note
    await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status: "APPROVED",
        reviewNote: `Approved and created stop: "${newStop.name}" (ID: ${newStop.id}).`,
        reviewedAt: new Date(),
        stopId: newStop.id,
      },
    });

    revalidatePath("/admin/feedback");
    revalidatePath("/admin/stops");
    revalidatePath("/admin/dashboard");

    return { success: true, stop: newStop };
  } catch (error) {
    console.error("Apply missing stop error:", error);
    return { success: false, error: "Failed to apply missing stop suggestion." };
  }
}
