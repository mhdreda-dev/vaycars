import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailPage } from "@/components/vehicle-detail-page";
import { getVehicleBySlug } from "@/lib/data/vehicles";
import { mapDatabaseVehicleToPublic } from "@/lib/data/vehicle-mapper";
import { getSiteSettings } from "@/lib/data/settings";
import { mapSiteSettings } from "@/lib/data/vehicle-mapper";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const record = await getVehicleBySlug(slug); if (!record) return {}; const vehicle = mapDatabaseVehicleToPublic(record, "fr"); const name = `${vehicle.brand} ${vehicle.model}`; return { title: `${name} | Vay Cars Location`, description: vehicle.shortDescription, alternates: { canonical: `/fr/voitures/${vehicle.slug}` }, openGraph: { locale: "fr_FR", images: [vehicle.mainImage] } }; }
export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const [record, settings] = await Promise.all([getVehicleBySlug(slug), getSiteSettings()]); if (!record) notFound(); return <VehicleDetailPage vehicle={mapDatabaseVehicleToPublic(record, "fr")} settings={mapSiteSettings(settings)} />; }
