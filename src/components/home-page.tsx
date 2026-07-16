import { CalendarCheck, Clock3, MessageCircle } from "lucide-react";
import { getFeaturedVehicles } from "@/lib/data/vehicles";
import { mapDatabaseVehicleToPublic, mapPickupLocations, mapSiteSettings } from "@/lib/data/vehicle-mapper";
import { getPickupLocations, getSiteSettings } from "@/lib/data/settings";
import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { AvailabilityForm } from "./availability-form";
import { AvailabilityReveal } from "./availability-reveal";
import { CommitmentsSection } from "./commitments-section";
import { ContactSection } from "./contact-section";
import { FaqSection } from "./faq-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection, WhyChooseSection } from "./journey-sections";
import { AboutVayCarsSection, RentalConditionsSection, RoadCtaSection } from "./middle-sections";
import { Navigation } from "./navigation";
import { ScrollProgress } from "./scroll-progress";
import { SiteFooter } from "./site-footer";
import { VehicleCatalogue } from "./vehicle-catalogue";
import { WhatsAppLink } from "./whatsapp-link";

export async function HomePage({ rtl = false }: { rtl?: boolean }) {
  const locale = rtl ? "ar" : "fr";
  const [featuredVehicles, pickupLocations, siteSettings] = await Promise.all([getFeaturedVehicles(), getPickupLocations(), getSiteSettings()]);
  const vehicles = featuredVehicles.map((vehicle) => mapDatabaseVehicleToPublic(vehicle, locale));
  const locations = mapPickupLocations(pickupLocations, locale);
  const settings = mapSiteSettings(siteSettings);
  return <div dir={rtl ? "rtl" : "ltr"}><ScrollProgress /><Navigation rtl={rtl} hero /><main>
      <HeroSection rtl={rtl} />
      <section id="reservation" className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:-mt-14 sm:px-6 sm:pb-0 lg:px-8"><AvailabilityReveal><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10"><div className="mb-4 flex items-center gap-2"><CalendarCheck className="size-5 text-[#0b5aa7]" /><h2 className="font-bold text-[#10233c]">{rtl ? "شوف واش الطوموبيل متوفرة" : "Vérifiez la disponibilité de votre voiture"}</h2></div><AvailabilityForm rtl={rtl} locations={locations} /></div></AvailabilityReveal></section>
      <VehicleCatalogue vehicles={vehicles} rtl={rtl} embedded />
      <HowItWorksSection rtl={rtl} /><WhyChooseSection rtl={rtl} /><RoadCtaSection rtl={rtl} /><AboutVayCarsSection rtl={rtl} /><RentalConditionsSection rtl={rtl} /><CommitmentsSection rtl={rtl} /><FaqSection rtl={rtl} />
      <ContactSection rtl={rtl} locations={locations} settings={settings} />
  </main><WhatsAppLink message={generalWhatsAppMessage} className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#16a34a] text-white shadow-xl" aria-label={rtl ? "تاصل مع Vay Cars فالواتساب" : "Contacter Vay Cars sur WhatsApp"}><MessageCircle className="size-6" /></WhatsAppLink><div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white p-3 shadow-lg md:hidden"><a href="#voitures" className="flex items-center justify-center gap-2 rounded-xl bg-[#0b5aa7] py-3 text-sm font-bold text-white"><Clock3 className="size-4" />{rtl ? "شوف الطوموبيلات" : "Voir les disponibilités"}</a></div><SiteFooter rtl={rtl} settings={settings} /></div>;
}
