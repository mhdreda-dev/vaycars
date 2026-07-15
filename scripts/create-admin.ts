import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

const adminSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(12, "ADMIN_PASSWORD must be at least 12 characters.").max(256) });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  const values = adminSchema.parse({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const email = values.email.toLowerCase();
  const passwordHash = await bcrypt.hash(values.password, 12);
  await prisma.adminUser.upsert({ where: { email }, update: { passwordHash, active: true }, create: { email, passwordHash, active: true } });
  await prisma.$disconnect();
  console.log("Administrator account created or updated.");
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Unable to create administrator account."); process.exitCode = 1; });
