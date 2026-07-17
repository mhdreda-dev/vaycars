import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCatalogue } from "@/components/vehicle-catalogue";
import { getActiveVehicles } from "@/lib/data/vehicles";
import { mapDatabaseVehicleToPublic } from "@/lib/data/vehicle-mapper";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublicCatalogueFilters } from "@/lib/data/catalogue-filters";
import { mapSiteSettings } from "@/lib/data/vehicle-mapper";

export const dynamic = "force-dynamic";

export default async function ArabicCars() {
  const [records, settings, catalogue] = await Promise.all([getActiveVehicles(), getSiteSettings(), getPublicCatalogueFilters()]); const vehicles = records.map((vehicle) => mapDatabaseVehicleToPublic(vehicle, "ar"));
  return <div dir="rtl"><Navigation rtl /><main><VehicleCatalogue vehicles={vehicles} filters={catalogue.filters} rtl /></main><SiteFooter rtl settings={mapSiteSettings(settings)} /></div>;
}
