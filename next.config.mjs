import dotenv from "dotenv";
import path from "path";

// Ensure project-specific .env takes precedence over ambient system/shell variables
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  override: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
