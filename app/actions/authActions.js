"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { setAdminSessionCookie, clearAdminSessionCookie } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";

export async function loginAdminAction(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const validation = adminLoginSchema.safeParse({ username, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid input",
    };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { username: validation.data.username },
    });

    if (!admin) {
      return {
        success: false,
        error: "Invalid username or password.",
      };
    }

    const isMatch = await bcrypt.compare(
      validation.data.password,
      admin.passwordHash
    );

    if (!isMatch) {
      return {
        success: false,
        error: "Invalid username or password.",
      };
    }

    await setAdminSessionCookie(admin);
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error: "Authentication failed due to a server error. Please try again.",
    };
  }

  redirect("/admin/dashboard");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
