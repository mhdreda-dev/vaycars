import "server-only";

import { cache } from "react";
import { getAgencySettingsRecord } from "@/lib/getAgencySettings";
import { prisma } from "@/lib/prisma";

export const getPickupLocations = cache(async () => {
  return prisma.pickupLocation.findMany({ where: { active: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
});

export const getSiteSettings = cache(async () => {
  return getAgencySettingsRecord();
});
