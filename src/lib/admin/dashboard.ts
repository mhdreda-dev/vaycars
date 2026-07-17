import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-session";
import { getEditableCatalogueFilters } from "@/lib/catalogue-filters";

export async function getAdminDashboardStats() {
  await requireAdmin();
  const [totalVehicles, activeVehicles, featuredVehicles, totalCategories, availability] = await Promise.all([
    prisma.vehicle.count(), prisma.vehicle.count({ where: { active: true } }), prisma.vehicle.count({ where: { featured: true } }), prisma.vehicleCategory.count(), prisma.vehicle.groupBy({ by: ["availability"], _count: { _all: true } }),
  ]);
  const counts = Object.fromEntries(availability.map((item) => [item.availability, item._count._all]));
  return { totalVehicles, activeVehicles, featuredVehicles, totalCategories, availableVehicles: counts.AVAILABLE ?? 0, unavailableVehicles: counts.UNAVAILABLE ?? 0, maintenanceVehicles: counts.MAINTENANCE ?? 0, reservedVehicles: counts.RESERVED ?? 0 };
}

export async function getRecentAdminVehicles() {
  await requireAdmin();
  const vehicles = await prisma.vehicle.findMany({ take: 5, orderBy: { updatedAt: "desc" }, select: { id: true, slug: true, brand: true, model: true, active: true, availability: true, updatedAt: true, images: { take: 1, orderBy: [{ isMain: "desc" }, { displayOrder: "asc" }], select: { url: true, altFr: true } } } });
  return vehicles.map((vehicle) => ({ ...vehicle, updatedAt: vehicle.updatedAt.toISOString(), image: vehicle.images[0]?.url ?? null, alt: vehicle.images[0]?.altFr ?? `${vehicle.brand} ${vehicle.model}` }));
}

export async function getAdminCatalogueFilterSummary() {
  await requireAdmin();
  const [settings, economyCategory] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site-settings" }, select: { catalogueFilters: true } }),
    prisma.vehicleCategory.findUnique({ where: { slug: "economique" }, select: { id: true } }),
  ]);
  const filters = getEditableCatalogueFilters(settings?.catalogueFilters);
  return { enabledFilters: filters.filter((filter) => filter.enabled), economyCategoryExists: Boolean(economyCategory) };
}
