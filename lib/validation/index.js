import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required"),
});

export const stopSchema = z.object({
  name: z.string().trim().min(2, "Stop name must be at least 2 characters").max(100),
  description: z.string().trim().max(500).optional().nullable(),
  aliases: z
    .array(z.string().trim())
    .optional()
    .default([])
    .transform((items) => items.filter((item) => item.length > 0)),
  isActive: z.boolean().optional().default(true),
});

export const routeSchema = z.object({
  busNumber: z.string().trim().min(1, "Bus number is required").max(30),
  routeName: z.string().trim().max(100).optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  stopIds: z
    .array(z.string().min(1))
    .min(2, "A route must contain at least a starting stop and a destination stop"),
});

export const feedbackTypeEnum = z.enum([
  "INCORRECT_ROUTE",
  "MISSING_STOP",
  "INCORRECT_STOP_NAME",
  "INCORRECT_STOP_ORDER",
  "INCORRECT_START_DEST",
  "GENERAL_FEEDBACK",
  "OTHER",
]);

export const feedbackSchema = z.object({
  feedbackType: feedbackTypeEnum,
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(1500, "Description cannot exceed 1500 characters"),
  routeId: z.string().trim().optional().nullable(),
  stopId: z.string().trim().optional().nullable(),
  suggestedStopName: z.string().trim().max(100).optional().nullable(),
  suggestedStartPoint: z.string().trim().max(100).optional().nullable(),
  suggestedDestination: z.string().trim().max(100).optional().nullable(),
});

export const feedbackReviewSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "DUPLICATE"]),
  reviewNote: z.string().trim().max(1000).optional().nullable(),
});
