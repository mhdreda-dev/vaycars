import "server-only";

import { cache } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const vehicleInclude = {
  category: true,
  images: { orderBy: [{ isMain: "desc" }, { displayOrder: "asc" }] },
} satisfies Prisma.VehicleInclude;

export type DatabaseVehicle = Prisma.VehicleGetPayload<{ include: typeof vehicleInclude }>;

export const getActiveVehicles = cache(async (): Promise<DatabaseVehicle[]> => {
  return prisma.vehicle.findMany({ where: { active: true }, include: vehicleInclude, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
});

export const getFeaturedVehicles = cache(async (): Promise<DatabaseVehicle[]> => {
  return prisma.vehicle.findMany({ where: { active: true, featured: true }, include: vehicleInclude, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
});

export const getVehicleBySlug = cache(async (slug: string): Promise<DatabaseVehicle | null> => {
  return prisma.vehicle.findFirst({ where: { slug, active: true }, include: vehicleInclude });
});

export const getVehicleCategories = cache(async () => {
  return prisma.vehicleCategory.findMany({ where: { active: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
});
