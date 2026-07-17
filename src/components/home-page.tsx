import { CalendarCheck, Clock3 } from "lucide-react";
import { getFeaturedVehicles } from "@/lib/data/vehicles";
import { mapDatabaseVehicleToPublic, mapPickupLocations } from "@/lib/data/vehicle-mapper";
import { getPickupLocations } from "@/lib/data/settings";
import { getPublicCatalogueFilters } from "@/lib/data/catalogue-filters";
import { AvailabilityForm } from "./availability-form";
import { AvailabilityReveal } from "./availability-reveal";
import { HeroSection } from "./hero-section";
import { HowItWorksSection, WhyChooseSection } from "./journey-sections";
import { RoadCtaSection } from "./middle-sections";
import { Navigation } from "./navigation";
import { ScrollProgress } from "./scroll-progress";
import { SiteFooter } from "./site-footer";
import { VehicleCatalogue } from "./vehicle-catalogue";
import { FloatingWhatsApp } from "./floating-whatsapp";

export async function HomePage({ rtl = false }: { rtl?: boolean }) {
  const locale = rtl ? "ar" : "fr";
  const [featuredVehicles, pickupLocations, catalogue] = await Promise.all([getFeaturedVehicles(), getPickupLocations(), getPublicCatalogueFilters()]);
  const vehicles = featuredVehicles.map((vehicle) => mapDatabaseVehicleToPublic(vehicle, locale));
  const locations = mapPickupLocations(pickupLocations, locale);
  return <div dir={rtl ? "rtl" : "ltr"}><ScrollProgress /><Navigation rtl={rtl} hero /><main>
      <HeroSection rtl={rtl} />
      <section id="reservation" className="relative z-10 scroll-mt-20 px-4 py-5 sm:-mt-10 sm:px-6 sm:pb-2 lg:px-8"><AvailabilityReveal><div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-5"><div className="mb-4 flex items-center gap-2"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50"><CalendarCheck aria-hidden="true" className="size-5 text-[#0b5aa7]" /></span><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#0b5aa7]">{rtl ? "طلب سريع" : "DEMANDE RAPIDE"}</p><h2 className="mt-0.5 font-bold text-[#10233c]">{rtl ? "شوف واش الطوموبيل متوفرة" : "Vérifiez la disponibilité de votre voiture"}</h2></div></div><AvailabilityForm rtl={rtl} locations={locations} /></div></AvailabilityReveal></section>
      <VehicleCatalogue vehicles={vehicles} filters={catalogue.filters} rtl={rtl} embedded />
      <HowItWorksSection rtl={rtl} /><WhyChooseSection rtl={rtl} /><RoadCtaSection rtl={rtl} />
  </main><FloatingWhatsApp rtl={rtl} /><div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,35,60,.10)] backdrop-blur-md md:hidden"><a href="#reservation" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b5aa7] px-4 text-sm font-bold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]"><Clock3 aria-hidden="true" className="size-4" />{rtl ? "شوف واش متوفرة" : "Vérifier les disponibilités"}</a></div><SiteFooter rtl={rtl} /></div>;
}
