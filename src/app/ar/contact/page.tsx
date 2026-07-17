import { ContactSection } from "@/components/contact-section";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { mapPickupLocations } from "@/lib/data/vehicle-mapper";
import { getPickupLocations } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function ArabicContact() {
  const locations = mapPickupLocations(await getPickupLocations(), "ar");
  return <div dir="rtl"><Navigation rtl /><main><ContactSection rtl locations={locations} /></main><SiteFooter rtl /></div>;
}
