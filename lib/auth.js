import crypto from "crypto";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const SESSION_COOKIE_NAME = "citybus_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return (
    process.env.SESSION_SECRET ||
    "default-fallback-insecure-key-coastal-routes-bus-finder"
  );
}

/**
 * Sign a payload with HMAC-SHA256
 */
export function signSession(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${hmac}`;
}

/**
 * Verify a signed session string
 */
export function verifySession(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, hmac] = parts;
  const expectedHmac = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");

  // Constant-time comparison
  const hmacBuf = Buffer.from(hmac);
  const expectedBuf = Buffer.from(expectedHmac);
  if (
    hmacBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(hmacBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get the currently authenticated admin session from cookies
 */
export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySession(token);
    if (!payload?.adminId) return null;

    // Verify admin still exists in DB
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: { id: true, username: true },
    });

    return admin || null;
  } catch {
    return null;
  }
}

/**
 * Enforce admin authentication. Throws or returns session.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Admin authentication required.");
  }
  return session;
}

/**
 * Set session cookie after login
 */
export async function setAdminSessionCookie(admin) {
  const cookieStore = await cookies();
  const exp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = signSession({
    adminId: admin.id,
    username: admin.username,
    exp,
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clear session cookie on logout
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
