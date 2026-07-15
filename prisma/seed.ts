import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type FuelType, type TransmissionType, type VehicleAvailability } from "../src/generated/prisma/client";
import { vehicles } from "./seed-data/legacy-vehicles";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is required to seed the Neon database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const categories = [
  { slug: "citadine", nameFr: "Citadine", nameAr: "سيارة المدينة", displayOrder: 1 },
  { slug: "economique", nameFr: "Économique", nameAr: "اقتصادية", displayOrder: 2 },
  { slug: "berline", nameFr: "Berline", nameAr: "سيدان", displayOrder: 3 },
  { slug: "suv", nameFr: "SUV", nameAr: "سيارة SUV", displayOrder: 4 },
  { slug: "utilitaire", nameFr: "Utilitaire", nameAr: "سيارة نفعية", displayOrder: 5 },
] as const;

const arabicContent: Record<string, { badgeAr?: string; shortDescriptionAr: string; fullDescriptionAr: string }> = {
  "dacia-logan": { badgeAr: "الأكثر طلباً", shortDescriptionAr: "خيار موثوق وواسع لجميع تنقلاتك.", fullDescriptionAr: "تجمع داسيا لوغان بين الراحة والمساحة والبساطة لتنقلاتك في المغرب." },
  "dacia-sandero": { badgeAr: "اقتصادية", shortDescriptionAr: "سيارة مدمجة وسهلة، مثالية للمدينة.", fullDescriptionAr: "سيارة مدينة عملية ونظيفة ومريحة للتنقل اليومي." },
  "dacia-duster": { badgeAr: "SUV", shortDescriptionAr: "مساحة إضافية لاستكشاف الطريق براحة.", fullDescriptionAr: "تناسب داسيا داستر العائلات والرحلات على الطرق المغربية." },
  "renault-clio": { shortDescriptionAr: "سيارة متعددة الاستخدامات وممتعة في القيادة.", fullDescriptionAr: "رينو كليو خيار موثوق للتنقل بسهولة وراحة." },
  "renault-megane": { shortDescriptionAr: "راحة وأناقة لرحلاتك الطويلة.", fullDescriptionAr: "سيارة سيدان متوازنة توفر قيادة سلسة ومساحة جيدة." },
  "peugeot-208": { badgeAr: "أوتوماتيك", shortDescriptionAr: "عصرية وسهلة القيادة ومجهزة بشكل جيد.", fullDescriptionAr: "بيجو 208 تسهّل تنقلاتك بتصميم حضري أنيق." },
  "peugeot-301": { shortDescriptionAr: "سيارة سيدان عملية للسفر براحة.", fullDescriptionAr: "توفر بيجو 301 صندوقاً واسعاً والراحة الأساسية للطريق." },
  "opel-corsa": { shortDescriptionAr: "حل بسيط لتنقلاتك اليومية.", fullDescriptionAr: "سيارة مدينة سهلة القيادة، مناسبة لسيدي قاسم ونواحيها." },
  "opel-astra": { shortDescriptionAr: "توازن بين المساحة والراحة.", fullDescriptionAr: "تناسب أوبل أسترا من يبحث عن راحة أكبر على الطريق." },
  "citroen-c3": { shortDescriptionAr: "مدمجة ومريحة وسهلة الاستخدام.", fullDescriptionAr: "خيار مرن وودود للتنقلات الشخصية أو المهنية." },
  "fiat-tipo": { shortDescriptionAr: "سيارة سيدان عملية لكل المسارات.", fullDescriptionAr: "توفر فيات تيبو المساحة والراحة اللازمتين للإقامة والرحلات العائلية." },
};

const categoryByCurrentName: Record<string, string> = { Citadine: "citadine", Berline: "berline", SUV: "suv" };
const fuelByCurrentName: Record<string, FuelType> = { Diesel: "DIESEL", Essence: "GASOLINE" };
const transmissionByCurrentName: Record<string, TransmissionType> = { Manuelle: "MANUAL", Automatique: "AUTOMATIC" };
const availabilityByCurrentName: Record<string, VehicleAvailability> = { Disponible: "AVAILABLE", "Sur demande": "UNAVAILABLE" };

async function main() {
  const categoryRecords = await Promise.all(categories.map((category) => prisma.vehicleCategory.upsert({
    where: { slug: category.slug },
    update: category,
    create: category,
  })));
  const categoryIds = new Map(categoryRecords.map((category) => [category.slug, category.id]));

  const sidiKacem = await prisma.pickupLocation.upsert({
    where: { slug: "sidi-kacem" },
    update: { nameFr: "Sidi Kacem", nameAr: "سيدي قاسم", city: "Sidi Kacem", active: true, displayOrder: 1 },
    create: { slug: "sidi-kacem", nameFr: "Sidi Kacem", nameAr: "سيدي قاسم", city: "Sidi Kacem", active: true, displayOrder: 1 },
  });

  await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: { agencyName: "Vay Cars Location", phone: "06 84 04 01 55", whatsappNumber: "212684040155", city: "Sidi Kacem", country: "Morocco", defaultLocale: "fr", defaultPickupLocationId: sidiKacem.id },
    create: { id: "site-settings", agencyName: "Vay Cars Location", phone: "06 84 04 01 55", whatsappNumber: "212684040155", city: "Sidi Kacem", country: "Morocco", defaultLocale: "fr", defaultPickupLocationId: sidiKacem.id },
  });

  for (const vehicle of vehicles) {
    const categorySlug = categoryByCurrentName[vehicle.category];
    const categoryId = categoryIds.get(categorySlug);
    const translation = arabicContent[vehicle.slug];
    const fuel = fuelByCurrentName[vehicle.fuel];
    const transmission = transmissionByCurrentName[vehicle.transmission];
    const availability = availabilityByCurrentName[vehicle.availability];

    if (!categoryId || !translation || !fuel || !transmission || !availability) {
      throw new Error(`Unable to map static data for vehicle ${vehicle.slug}.`);
    }

    const record = await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: {
        brand: vehicle.brand, model: vehicle.model, categoryId, fuel, transmission, seats: vehicle.seats, doors: vehicle.doors,
        luggage: vehicle.luggage, airConditioning: vehicle.airConditioning, availability, featured: vehicle.featured, active: vehicle.active,
        badgeFr: vehicle.badge ?? null, badgeAr: translation.badgeAr ?? null, shortDescriptionFr: vehicle.shortDescription,
        shortDescriptionAr: translation.shortDescriptionAr, fullDescriptionFr: vehicle.fullDescription, fullDescriptionAr: translation.fullDescriptionAr,
        displayOrder: vehicle.displayOrder,
      },
      create: {
        slug: vehicle.slug, brand: vehicle.brand, model: vehicle.model, categoryId, fuel, transmission, seats: vehicle.seats, doors: vehicle.doors,
        luggage: vehicle.luggage, airConditioning: vehicle.airConditioning, availability, featured: vehicle.featured, active: vehicle.active,
        badgeFr: vehicle.badge ?? null, badgeAr: translation.badgeAr ?? null, shortDescriptionFr: vehicle.shortDescription,
        shortDescriptionAr: translation.shortDescriptionAr, fullDescriptionFr: vehicle.fullDescription, fullDescriptionAr: translation.fullDescriptionAr,
        displayOrder: vehicle.displayOrder,
      },
    });

    await prisma.vehicleImage.updateMany({ where: { vehicleId: record.id }, data: { isMain: false } });
    for (const [displayOrder, url] of vehicle.images.entries()) {
      await prisma.vehicleImage.upsert({
        where: { vehicleId_url: { vehicleId: record.id, url } },
        update: { altFr: `${vehicle.brand} ${vehicle.model} - Vay Cars Location`, altAr: `${vehicle.brand} ${vehicle.model} - فاي كارز`, isMain: displayOrder === 0, displayOrder },
        create: { vehicleId: record.id, url, altFr: `${vehicle.brand} ${vehicle.model} - Vay Cars Location`, altAr: `${vehicle.brand} ${vehicle.model} - فاي كارز`, isMain: displayOrder === 0, displayOrder },
      });
    }
  }

  console.log(`Seeded ${categories.length} categories, ${vehicles.length} vehicles, and ${vehicles.reduce((total, vehicle) => total + vehicle.images.length, 0)} images.`);
}

main().finally(async () => prisma.$disconnect());
