import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type PublicAgencySettings = {
  agencyName: string;
  phone: string;
  whatsappNumber: string;
  defaultWhatsappMessage: string;
  email: string;
  city: string;
  country: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  businessHours: string;
  logoUrl: string;
  heroImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  floatingWhatsappActive: boolean;
};

const defaults: PublicAgencySettings = {
  agencyName: "Vay Cars Location",
  phone: "",
  whatsappNumber: "",
  defaultWhatsappMessage: "Bonjour Vay Cars Location, je souhaite obtenir plus d’informations concernant la location d’une voiture.",
  email: "",
  city: "Sidi Kacem",
  country: "Maroc",
  address: "Sidi Kacem, Maroc",
  googleMapsUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  businessHours: "Lundi au samedi, sur rendez-vous",
  logoUrl: "",
  heroImageUrl: "/images/vay-cars-dacia-logan.jpg",
  seoTitle: "Vay Cars Location | Location de voitures à Sidi Kacem",
  seoDescription: "Location de voitures simple, fiable et locale à Sidi Kacem.",
  seoKeywords: ["location voiture", "Sidi Kacem", "location de voitures", "Maroc"],
  floatingWhatsappActive: true,
};

const text = (value: string | null | undefined, fallback = "") => value?.trim() || fallback;

export const getAgencySettingsRecord = cache(async () =>
  prisma.siteSettings.findUnique({ where: { id: "site-settings" } }),
);

export const getAgencySettings = cache(async (): Promise<PublicAgencySettings> => {
  const settings = await getAgencySettingsRecord();
  const arabic = settings?.defaultLocale === "ar";
  const agencyName = text(settings?.agencyName, defaults.agencyName);
  const city = text(arabic ? settings?.cityAr : settings?.city, defaults.city);
  const country = text(settings?.country, defaults.country);

  return {
    agencyName,
    phone: text(settings?.phone),
    whatsappNumber: text(settings?.whatsappNumber).replace(/\D/g, ""),
    defaultWhatsappMessage: text(arabic ? settings?.defaultWhatsappAr : settings?.defaultWhatsappFr, defaults.defaultWhatsappMessage).replaceAll("Vay Cars Location", agencyName),
    email: text(settings?.email),
    city,
    country,
    address: text(arabic ? settings?.addressAr : settings?.addressFr, `${city}, ${country}`),
    googleMapsUrl: text(settings?.googleMapsUrl),
    instagramUrl: text(settings?.instagramUrl),
    facebookUrl: text(settings?.facebookUrl),
    businessHours: text(arabic ? settings?.businessHoursAr : settings?.businessHoursFr, defaults.businessHours),
    logoUrl: text(settings?.logoUrl),
    heroImageUrl: text(settings?.heroImageUrl, defaults.heroImageUrl),
    seoTitle: text(arabic ? settings?.seoTitleAr : settings?.seoTitleFr, defaults.seoTitle).replaceAll("Vay Cars Location", agencyName),
    seoDescription: text(arabic ? settings?.seoDescriptionAr : settings?.seoDescriptionFr, defaults.seoDescription),
    seoKeywords: defaults.seoKeywords,
    floatingWhatsappActive: settings?.floatingWhatsappActive ?? defaults.floatingWhatsappActive,
  };
});
