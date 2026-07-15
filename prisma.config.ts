import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Prisma CLI commands use Neon's direct endpoint; the app uses DATABASE_URL.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
