"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-session";
import { catalogueFilterIds, getCatalogueFilters } from "@/lib/catalogue-filters";
import { prisma } from "@/lib/prisma";

const optional = z.string().trim().max(500).transform((value) => value || null);
const catalogueFilter = z.object({
  id: z.enum(catalogueFilterIds),
  enabled: z.boolean(),
  displayOrder: z.number().int().min(0).max(99),
  labelFr: z.string().trim().min(1).max(40),
  labelAr: z.string().trim().min(1).max(40),
  icon: z.string().trim().max(8),
});
const schema = z.object({
  agencyName: z.string().trim().min(1).max(80), phone: z.string().trim().min(1).max(40), whatsappNumber: z.string().trim().regex(/^\d{8,16}$/), city: z.string().trim().min(1).max(80), country: z.string().trim().min(1).max(80), shortDescriptionFr: optional, shortDescriptionAr: optional, email: z.string().trim().email().or(z.literal("")).transform((value) => value || null), cityAr: optional, addressFr: optional, addressAr: optional, googleMapsUrl: optional, instagramUrl: optional, facebookUrl: optional, logoUrl: optional, heroImageUrl: optional, seoTitleFr: optional, seoTitleAr: optional, seoDescriptionFr: optional, seoDescriptionAr: optional, businessHoursFr: optional, businessHoursAr: optional, defaultWhatsappFr: optional, defaultWhatsappAr: optional, floatingWhatsappActive: z.boolean(), catalogueFilters: z.array(catalogueFilter).length(catalogueFilterIds.length),
});

export async function saveSettings(input: z.input<typeof schema>) {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Vérifiez les champs indiqués.", fieldErrors: parsed.error.flatten().fieldErrors };
  const catalogueFilters = getCatalogueFilters(parsed.data.catalogueFilters) as unknown as Prisma.InputJsonValue;
  await prisma.siteSettings.upsert({ where: { id: "site-settings" }, update: { ...parsed.data, catalogueFilters }, create: { id: "site-settings", defaultLocale: "fr", ...parsed.data, catalogueFilters } });
  ["/admin", "/admin/settings", "/fr", "/ar", "/fr/voitures", "/ar/cars"].forEach((path) => revalidatePath(path));
  return { ok: true, message: "Paramètres enregistrés" };
}
