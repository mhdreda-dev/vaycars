import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getPickupLocations = cache(async () => {
  return prisma.pickupLocation.findMany({ where: { active: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
});

export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findUnique({ where: { id: "site-settings" }, include: { defaultPickupLocation: true } });
});
