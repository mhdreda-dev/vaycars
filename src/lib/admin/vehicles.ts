import "server-only";

import { Prisma, type VehicleAvailability, type TransmissionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-session";

export const adminAvailabilityLabels: Record<VehicleAvailability, string> = { AVAILABLE: "Disponible", UNAVAILABLE: "Indisponible", MAINTENANCE: "En entretien", RESERVED: "Réservée" };
const pageSize = 10;
const sortOptions = { order: { displayOrder: "asc" }, updated: { updatedAt: "desc" }, created: { createdAt: "desc" }, brandAsc: { brand: "asc" }, brandDesc: { brand: "desc" }, modelAsc: { model: "asc" } } as const;
export type AdminVehicleFilters = { search?: string; category?: string; availability?: VehicleAvailability; active?: "true" | "false"; featured?: "true" | "false"; transmission?: TransmissionType; sort?: keyof typeof sortOptions; page?: number };

export async function getAdminVehicleFilterOptions() { await requireAdmin(); return prisma.vehicleCategory.findMany({ select: { id: true, slug: true, nameFr: true }, orderBy: { displayOrder: "asc" } }); }
export async function getAdminVehicleById(id: string) { await requireAdmin(); return prisma.vehicle.findUnique({ where: { id }, include: { images: { orderBy: [{ isMain: "desc" }, { displayOrder: "asc" }] } } }); }
export async function getNextAdminDisplayOrder() { await requireAdmin(); const last = await prisma.vehicle.findFirst({ orderBy: { displayOrder: "desc" }, select: { displayOrder: true } }); return (last?.displayOrder ?? 0) + 1; }

export async function getAdminVehicles(input: AdminVehicleFilters) {
  await requireAdmin(); const search = input.search?.trim(); const where: Prisma.VehicleWhereInput = { ...(search ? { OR: [{ brand: { contains: search, mode: "insensitive" } }, { model: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }] } : {}), ...(input.category ? { category: { slug: input.category } } : {}), ...(input.availability ? { availability: input.availability } : {}), ...(input.active ? { active: input.active === "true" } : {}), ...(input.featured ? { featured: input.featured === "true" } : {}), ...(input.transmission ? { transmission: input.transmission } : {}) };
  const total = await prisma.vehicle.count({ where }); const totalPages = Math.max(1, Math.ceil(total / pageSize)); const page = Math.min(Math.max(input.page ?? 1, 1), totalPages); const sort = input.sort && input.sort in sortOptions ? input.sort : "order";
  const vehicles = await prisma.vehicle.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: [sortOptions[sort], { id: "asc" }], select: { id: true, slug: true, brand: true, model: true, active: true, featured: true, availability: true, transmission: true, fuel: true, displayOrder: true, updatedAt: true, category: { select: { nameFr: true } }, images: { take: 1, orderBy: [{ isMain: "desc" }, { displayOrder: "asc" }], select: { url: true, altFr: true } } } });
  return { total, page, totalPages, pageSize, vehicles: vehicles.map((vehicle) => ({ ...vehicle, updatedAt: vehicle.updatedAt.toISOString(), image: vehicle.images[0]?.url ?? null, alt: vehicle.images[0]?.altFr ?? `${vehicle.brand} ${vehicle.model}` })) };
}
