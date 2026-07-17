import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailPage } from "@/components/vehicle-detail-page";
import { getVehicleBySlug, getSimilarVehicles } from "@/lib/data/vehicles";
import { mapDatabaseVehicleToPublic } from "@/lib/data/vehicle-mapper";
import { getAgencySettings } from "@/lib/getAgencySettings";
import { getSiteBaseUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [record, settings] = await Promise.all([getVehicleBySlug(slug), getAgencySettings()]);
  if (!record) return {};
  const vehicle = mapDatabaseVehicleToPublic(record, "fr");
  const name = `${vehicle.brand} ${vehicle.model}`;
  const title = `${name} en location | ${settings.agencyName}`;
  const canonical = `/fr/voitures/${vehicle.slug}`;
  const siteBaseUrl = getSiteBaseUrl();
  return {
    metadataBase: siteBaseUrl ? new URL(siteBaseUrl) : undefined,
    title,
    description: vehicle.shortDescription,
    keywords: [vehicle.brand, vehicle.model, vehicle.category, `location ${name}`, settings.city],
    alternates: { canonical, languages: { "fr-MA": canonical, "ar-MA": `/ar/cars/${vehicle.slug}` } },
    openGraph: { title, description: vehicle.shortDescription, url: canonical, siteName: settings.agencyName, type: "website", locale: "fr_MA", alternateLocale: ["ar_MA"], images: vehicle.mainImage ? [{ url: vehicle.mainImage, alt: vehicle.mainImageAlt }] : undefined },
    twitter: { card: "summary_large_image", title, description: vehicle.shortDescription, images: vehicle.mainImage ? [vehicle.mainImage] : undefined },
  };
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [record, settings] = await Promise.all([getVehicleBySlug(slug), getAgencySettings()]);
  if (!record) notFound();
  const similar = await getSimilarVehicles(record.id, record.categoryId);
  return <VehicleDetailPage vehicle={mapDatabaseVehicleToPublic(record, "fr")} similarVehicles={similar.map((item) => mapDatabaseVehicleToPublic(item, "fr"))} agencySettings={settings} />;
}
