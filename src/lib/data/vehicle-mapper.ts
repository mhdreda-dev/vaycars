import "server-only";

import type { DatabaseVehicle } from "./vehicles";

export type PublicVehicle = {
  id: string; slug: string; brand: string; model: string; year?: number; category: string; categorySlug: string;
  fuel: string; transmission: string; transmissionCode: "MANUAL" | "AUTOMATIC"; seats: number; doors: number; luggage: number;
  airConditioning: boolean; availability: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE" | "RESERVED"; availabilityLabel: string;
  featured: boolean; active: boolean; badge?: string; color?: string; shortDescription: string; fullDescription: string;
  priceNote: string; displayOrder: number; mainImage: string; images: string[];
  isEconomy: boolean;
};

export type PublicPickupLocation = { id: string; slug: string; name: string };
export type PublicSiteSettings = { agencyName: string; phone: string; whatsappNumber: string; city: string; country: string; defaultLocale: string };

const availabilityLabels = {
  fr: { AVAILABLE: "Disponible", UNAVAILABLE: "Indisponible actuellement", MAINTENANCE: "En entretien", RESERVED: "Réservée" },
  ar: { AVAILABLE: "متوفرة", UNAVAILABLE: "غير متوفرة حالياً", MAINTENANCE: "قيد الصيانة", RESERVED: "محجوزة" },
} as const;

export function mapDatabaseVehicleToPublic(vehicle: DatabaseVehicle, locale: "fr" | "ar"): PublicVehicle {
  const arabic = locale === "ar";
  const images = vehicle.images.map((image) => image.url);
  return {
    id: vehicle.id, slug: vehicle.slug, brand: vehicle.brand, model: vehicle.model, year: vehicle.year ?? undefined,
    category: arabic ? vehicle.category.nameAr : vehicle.category.nameFr, categorySlug: vehicle.category.slug,
    fuel: vehicle.fuel === "DIESEL" ? (arabic ? "ديزل" : "Diesel") : vehicle.fuel === "GASOLINE" ? (arabic ? "بنزين" : "Essence") : vehicle.fuel === "HYBRID" ? (arabic ? "هجين" : "Hybride") : (arabic ? "كهربائية" : "Électrique"),
    transmission: vehicle.transmission === "AUTOMATIC" ? (arabic ? "أوتوماتيك" : "Automatique") : (arabic ? "يدوية" : "Manuelle"), transmissionCode: vehicle.transmission,
    seats: vehicle.seats, doors: vehicle.doors, luggage: vehicle.luggage, airConditioning: vehicle.airConditioning,
    availability: vehicle.availability, availabilityLabel: availabilityLabels[locale][vehicle.availability], featured: vehicle.featured, active: vehicle.active,
    badge: (arabic ? vehicle.badgeAr : vehicle.badgeFr) ?? undefined, color: (arabic ? vehicle.colorAr : vehicle.colorFr) ?? undefined,
    shortDescription: arabic ? vehicle.shortDescriptionAr : vehicle.shortDescriptionFr, fullDescription: arabic ? vehicle.fullDescriptionAr : vehicle.fullDescriptionFr,
    priceNote: arabic ? vehicle.priceNoteAr : vehicle.priceNoteFr, displayOrder: vehicle.displayOrder, mainImage: images[0] ?? "", images,
    isEconomy: vehicle.category.slug === "economique" || vehicle.badgeFr === "Économique",
  };
}

export function mapPickupLocations(locations: { id: string; slug: string; nameFr: string; nameAr: string }[], locale: "fr" | "ar"): PublicPickupLocation[] {
  return locations.map((location) => ({ id: location.id, slug: location.slug, name: locale === "ar" ? location.nameAr : location.nameFr }));
}

export function mapSiteSettings(settings: { agencyName: string; phone: string; whatsappNumber: string; city: string; country: string; defaultLocale: string } | null): PublicSiteSettings | undefined {
  return settings ?? undefined;
}
