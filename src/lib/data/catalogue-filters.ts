import "server-only";

import { cache } from "react";
import { getCatalogueFilters } from "@/lib/catalogue-filters";
import { prisma } from "@/lib/prisma";

export const getPublicCatalogueFilters = cache(async () => {
  const [settings, economyCategory] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site-settings" }, select: { catalogueFilters: true } }),
    prisma.vehicleCategory.findUnique({ where: { slug: "economique" }, select: { id: true } }),
  ]);
  const filters = getCatalogueFilters(settings?.catalogueFilters).filter((filter) => filter.enabled && (filter.id !== "economique" || Boolean(economyCategory)));

  return { filters, economyCategoryExists: Boolean(economyCategory) };
});
