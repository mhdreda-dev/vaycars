import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const [categoryCount, vehicleCount, imageCount, mainImageCount, sidiKacem, settings] = await Promise.all([
    prisma.vehicleCategory.count(),
    prisma.vehicle.count(),
    prisma.vehicleImage.count(),
    prisma.vehicleImage.count({ where: { isMain: true } }),
    prisma.pickupLocation.findUnique({ where: { slug: "sidi-kacem" }, select: { id: true } }),
    prisma.siteSettings.findUnique({ where: { id: "site-settings" }, select: { id: true } }),
  ]);

  const vehiclesMissingMainImage = await prisma.vehicle.count({
    where: { images: { none: { isMain: true } } },
  });

  const result = { categoryCount, vehicleCount, imageCount, mainImageCount, vehiclesMissingMainImage, hasSidiKacem: Boolean(sidiKacem), hasSiteSettings: Boolean(settings) };
  const valid = categoryCount === 5 && vehicleCount === 11 && imageCount === 11 && mainImageCount === 11 && vehiclesMissingMainImage === 0 && result.hasSidiKacem && result.hasSiteSettings;
  console.log(JSON.stringify(result));
  if (!valid) process.exitCode = 1;
  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error("Neon verification failed.", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
