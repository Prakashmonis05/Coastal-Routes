import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Ensure project-specific .env takes precedence over any ambient system/shell variables
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  override: true,
});

const databaseUrl = process.env.DATABASE_URL;

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
