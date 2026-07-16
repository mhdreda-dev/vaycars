import "server-only";

import type { DatabaseVehicle } from "./vehicles";

export type PublicVehicle = {
  id: string; slug: string; brand: string; model: string; year?: number; category: string; categorySlug: string;
  fuel: string; transmission: string; transmissionCode: "MANUAL" | "AUTOMATIC"; seats: number; doors: number; luggage?: number;
  airConditioning: boolean; availability: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE" | "RESERVED"; availabilityLabel: string;
  featured: boolean; active: boolean; badge?: string; color?: string; shortDescription: string; fullDescription: string;
  priceNote: string; displayOrder: number; mainImage: string; mainImageAlt: string; images: string[];
  isEconomy: boolean;
};

export type PublicPickupLocation = { id: string; slug: string; name: string };
export type PublicSiteSettings = { agencyName: string; phone: string; whatsappNumber: string; city: string; country: string; defaultLocale: string };

const availabilityLabels = {
  fr: { AVAILABLE: "Disponible", UNAVAILABLE: "Indisponible actuellement", MAINTENANCE: "En entretien", RESERVED: "Réservée" },
  ar: { AVAILABLE: "متوفرة", UNAVAILABLE: "ما متوفراش دابا", MAINTENANCE: "فالصيانة", RESERVED: "محجوزة" },
} as const;

export function mapDatabaseVehicleToPublic(vehicle: DatabaseVehicle, locale: "fr" | "ar"): PublicVehicle {
  const arabic = locale === "ar";
  const images = vehicle.images.map((image) => image.url);
  const mainImage = vehicle.images[0];
  return {
    id: vehicle.id, slug: vehicle.slug, brand: vehicle.brand, model: vehicle.model, year: vehicle.year ?? undefined,
    category: arabic ? vehicle.category.nameAr : vehicle.category.nameFr, categorySlug: vehicle.category.slug,
    fuel: vehicle.fuel === "DIESEL" ? (arabic ? "مازوط" : "Diesel") : vehicle.fuel === "GASOLINE" ? (arabic ? "ليصانص" : "Essence") : vehicle.fuel === "HYBRID" ? (arabic ? "هايبريد" : "Hybride") : (arabic ? "كهربا" : "Électrique"),
    transmission: vehicle.transmission === "AUTOMATIC" ? (arabic ? "أوتوماتيك" : "Automatique") : (arabic ? "يدوية" : "Manuelle"), transmissionCode: vehicle.transmission,
    seats: vehicle.seats, doors: vehicle.doors, luggage: vehicle.luggage ?? undefined, airConditioning: vehicle.airConditioning,
    availability: vehicle.availability, availabilityLabel: availabilityLabels[locale][vehicle.availability], featured: vehicle.featured, active: vehicle.active,
    badge: (arabic ? vehicle.badgeAr : vehicle.badgeFr) ?? undefined, color: (arabic ? vehicle.colorAr : vehicle.colorFr) ?? undefined,
    shortDescription: (arabic ? vehicle.shortDescriptionAr : vehicle.shortDescriptionFr) ?? (arabic ? `شوف ${vehicle.brand} ${vehicle.model} المتوفرة للكراء عند Vay Cars.` : `Découvrez la ${vehicle.brand} ${vehicle.model}, disponible à la location chez Vay Cars.`), fullDescription: (arabic ? vehicle.fullDescriptionAr : vehicle.fullDescriptionFr) ?? (arabic ? vehicle.shortDescriptionAr : vehicle.shortDescriptionFr) ?? (arabic ? `شوف ${vehicle.brand} ${vehicle.model} المتوفرة للكراء عند Vay Cars.` : `Découvrez la ${vehicle.brand} ${vehicle.model}, disponible à la location chez Vay Cars.`),
    priceNote: (arabic ? vehicle.priceNoteAr : vehicle.priceNoteFr) ?? (arabic ? "الثمن على حساب التاريخ والمدة" : "Tarif selon la période"), displayOrder: vehicle.displayOrder, mainImage: mainImage?.url ?? "", mainImageAlt: (arabic ? mainImage?.altAr : mainImage?.altFr) ?? `${vehicle.brand} ${vehicle.model}`, images,
    isEconomy: vehicle.category.slug === "economique" || vehicle.badgeFr === "Économique",
  };
}

export function mapPickupLocations(locations: { id: string; slug: string; nameFr: string; nameAr: string }[], locale: "fr" | "ar"): PublicPickupLocation[] {
  return locations.map((location) => ({ id: location.id, slug: location.slug, name: locale === "ar" ? location.nameAr : location.nameFr }));
}

export function mapSiteSettings(settings: { agencyName: string; phone: string; whatsappNumber: string; city: string; country: string; defaultLocale: string } | null): PublicSiteSettings | undefined {
  return settings ?? undefined;
}
