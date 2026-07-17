import Link from "next/link";
import { AirVent, BadgeCheck, CalendarDays, CarFront, DoorOpen, Fuel, Headphones, IdCard, Luggage, MapPin, Settings2, Users } from "lucide-react";
import type { PublicVehicle } from "@/lib/data/vehicle-mapper";
import type { PublicAgencySettings } from "@/lib/getAgencySettings";
import { getSiteBaseUrl } from "@/lib/site-url";
import { getVehicleWhatsAppMessage } from "@/lib/whatsapp";
import { Navigation } from "./navigation";
import { SiteFooter } from "./site-footer";
import { VehicleCard } from "./vehicle-card";
import { VehicleGallery } from "./vehicle-gallery";
import { WhatsAppLink } from "./whatsapp-link";

export function VehicleDetailPage({
  vehicle,
  similarVehicles,
  agencySettings,
  rtl = false,
}: {
  vehicle: PublicVehicle;
  similarVehicles: PublicVehicle[];
  agencySettings: PublicAgencySettings;
  rtl?: boolean;
}) {
  const name = `${vehicle.brand} ${vehicle.model}`;
  const locale = rtl ? "ar" : "fr";
  const catalogueRoute = rtl ? "/ar/cars" : "/fr/voitures";
  const homeRoute = rtl ? "/ar" : "/fr";
  const faqRoute = rtl ? "/ar/faq" : "/fr/faq";
  const vehicleRoute = rtl ? `/ar/cars/${vehicle.slug}` : `/fr/voitures/${vehicle.slug}`;
  const siteBaseUrl = getSiteBaseUrl();
  const absoluteUrl = (path: string) => siteBaseUrl ? new URL(path, siteBaseUrl).toString() : path;
  const images = vehicle.images.filter(Boolean).map((src, index) => ({ src, alt: vehicle.imageAlts[index] || `${name} — ${index + 1}` }));
  const description = vehicle.fullDescription.trim() !== vehicle.shortDescription.trim() ? vehicle.fullDescription.trim() : "";
  const copy = rtl ? {
    home: "الرئيسية", catalogue: "الطوموبيلات", featured: "مميزة", year: "السنة", specs: "معلومات الطوموبيل", seats: "البلايص", doors: "البيبان", transmission: "الفيتاس", fuel: "الوقود", air: "الكليم", airYes: "كاين", airNo: "ما كاينش", luggage: "الفاليزات", description: "على هاد الطوموبيل", rental: "معلومات الكراء", rentalIntro: "معلومات مختصرة قبل ما تصيفط طلب الحجز ديالك.", documents: "الوثائق", documentsText: "بيرمي صالح وبطاقة التعريف ولا الباسبور.", confirmation: "التأكيد", confirmationText: "الحجز كيتأكد من بعد التوفر والثمن والشروط.", pickup: "الخروج والرجوع", pickupText: "المكان والوقت كيتحددو مع الوكالة.", support: "المساعدة", supportText: "تواصل مباشر فالواتساب إلا كان عندك شي سؤال.", faq: "شوف التفاصيل فالأسئلة المتكررة", reserve: "سول على الثمن والتوفر", note: "صيفط لينا التواريخ ديالك باش نأكدولك التوفر.", related: "طوموبيلات أخرى تقدر تعجبك", relatedIntro: "اختيارات عملية أخرى متوفرة عندنا.", relatedEmpty: "ما كايناش طوموبيلات مشابهة دابا.", allCars: "شوف كاع الطوموبيلات", pageLabel: "صفحة الطوموبيل",
  } : {
    home: "Accueil", catalogue: "Voitures", featured: "En vedette", year: "Année", specs: "Caractéristiques techniques", seats: "Places", doors: "Portes", transmission: "Transmission", fuel: "Carburant", air: "Climatisation", airYes: "Oui", airNo: "Non", luggage: "Bagages", description: "Description", rental: "Informations de location", rentalIntro: "L’essentiel à connaître avant d’envoyer votre demande.", documents: "Documents", documentsText: "Permis valide et pièce d’identité ou passeport.", confirmation: "Confirmation", confirmationText: "Après validation de la disponibilité, du tarif et des conditions.", pickup: "Départ et retour", pickupText: "Le lieu et l’horaire sont confirmés avec l’agence.", support: "Assistance", supportText: "Un contact direct sur WhatsApp pour vos questions.", faq: "Consulter les détails dans la FAQ", reserve: "Demander le tarif et la disponibilité", note: "Partagez vos dates pour recevoir une confirmation rapide.", related: "D’autres véhicules qui pourraient vous convenir", relatedIntro: "Découvrez jusqu’à trois alternatives actives de notre flotte.", relatedEmpty: "Aucun véhicule similaire n’est disponible pour le moment.", allCars: "Voir toutes les voitures", pageLabel: "Page du véhicule",
  };
  const specs = [
    [Users, copy.seats, String(vehicle.seats)],
    [DoorOpen, copy.doors, String(vehicle.doors)],
    [Settings2, copy.transmission, vehicle.transmission],
    [Fuel, copy.fuel, vehicle.fuel],
    [AirVent, copy.air, vehicle.airConditioning ? copy.airYes : copy.airNo],
    ...(vehicle.luggage !== undefined ? [[Luggage, copy.luggage, String(vehicle.luggage)] as const] : []),
    ...(vehicle.year !== undefined ? [[CalendarDays, copy.year, String(vehicle.year)] as const] : []),
  ] as const;
  const rentalItems = [
    [IdCard, copy.documents, copy.documentsText],
    [BadgeCheck, copy.confirmation, copy.confirmationText],
    [MapPin, copy.pickup, copy.pickupText],
    [Headphones, copy.support, copy.supportText],
  ] as const;
  const message = getVehicleWhatsAppMessage(name, locale, vehicle.availability !== "AVAILABLE", agencySettings.agencyName);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.home, item: absoluteUrl(homeRoute) },
      { "@type": "ListItem", position: 2, name: copy.catalogue, item: absoluteUrl(catalogueRoute) },
      { "@type": "ListItem", position: 3, name, item: absoluteUrl(vehicleRoute) },
    ],
  };
  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name,
    description: vehicle.shortDescription,
    image: vehicle.images.length ? vehicle.images : undefined,
    category: vehicle.category,
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: vehicle.year?.toString(),
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    vehicleSeatingCapacity: vehicle.seats,
    numberOfDoors: vehicle.doors,
  };

  return <div dir={rtl ? "rtl" : "ltr"} className="bg-[#f8fafc]"><Navigation rtl={rtl} /><main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
    <nav aria-label={rtl ? "مسار الصفحة" : "Fil d’Ariane"} className="mb-5 flex min-w-0 items-center gap-2 overflow-hidden text-sm font-medium text-slate-500"><Link href={homeRoute} className="shrink-0 transition hover:text-[#0b5aa7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{copy.home}</Link><span aria-hidden="true">/</span><Link href={catalogueRoute} className="shrink-0 transition hover:text-[#0b5aa7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{copy.catalogue}</Link><span aria-hidden="true">/</span><span aria-current="page" className="truncate text-slate-700">{name}</span></nav>

    <section aria-labelledby="vehicle-title" className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.16fr)_minmax(340px,.84fr)] lg:gap-10">
      <VehicleGallery images={images} vehicleName={name} rtl={rtl} />
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,35,60,.08)] sm:p-7 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0b5aa7]">{vehicle.category}</span><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${vehicle.availability === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{vehicle.availabilityLabel}</span>{vehicle.featured && <span className="rounded-full bg-[#10233c] px-3 py-1.5 text-xs font-bold text-white">{vehicle.badge || copy.featured}</span>}{vehicle.year && <span className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">{vehicle.year}</span>}</div>
        <h1 id="vehicle-title" className="mt-4 text-[2rem] font-black leading-tight tracking-tight text-[#10233c] min-[360px]:text-4xl lg:text-[2.6rem]">{name}</h1>
        {vehicle.shortDescription && <p className="mt-3 leading-7 text-slate-600">{vehicle.shortDescription}</p>}
        <div className="mt-5 border-t border-slate-200 pt-5"><p className="text-lg font-black text-[#10233c]">{vehicle.priceNote}</p><p className="mt-1.5 text-sm leading-6 text-slate-500">{copy.note}</p><WhatsAppLink message={message} includeCurrentUrl currentUrlLabel={copy.pageLabel} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] motion-reduce:transform-none">{copy.reserve}</WhatsAppLink></div>
      </div>
    </section>

    <section aria-labelledby="specifications-title" className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7"><h2 id="specifications-title" className="text-2xl font-black tracking-tight text-[#10233c] sm:text-3xl">{copy.specs}</h2><dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{specs.map(([Icon, label, value]) => <div key={label} className="min-w-0 rounded-2xl bg-slate-50 p-4"><Icon aria-hidden="true" className="size-5 text-[#0b5aa7]" /><dt className="mt-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500">{label}</dt><dd className="mt-1 break-words font-bold text-[#10233c]">{value}</dd></div>)}</dl></section>

    {description && <section aria-labelledby="description-title" className="mt-10 max-w-4xl"><h2 id="description-title" className="text-2xl font-black tracking-tight text-[#10233c] sm:text-3xl">{copy.description}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">{description}</p></section>}

    <section aria-labelledby="rental-title" className="mt-10 rounded-3xl bg-[#10233c] p-5 text-white sm:p-7"><div className="max-w-2xl"><h2 id="rental-title" className="text-2xl font-black tracking-tight sm:text-3xl">{copy.rental}</h2><p className="mt-2 leading-7 text-slate-300">{copy.rentalIntro}</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{rentalItems.map(([Icon, title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><Icon aria-hidden="true" className="size-5 text-blue-200" /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></article>)}</div><Link href={faqRoute} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#10233c] transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{copy.faq}</Link></section>

    <section aria-labelledby="related-title" className="mt-12"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="related-title" className="max-w-3xl text-2xl font-black tracking-tight text-[#10233c] sm:text-3xl">{copy.related}</h2><p className="mt-2 text-slate-600">{copy.relatedIntro}</p></div><Link href={catalogueRoute} className="shrink-0 text-sm font-bold text-[#0b5aa7] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{copy.allCars}</Link></div>{similarVehicles.length ? <div className="mt-6 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">{similarVehicles.map((similar, index) => <VehicleCard key={similar.id} vehicle={similar} rtl={rtl} index={index} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center"><CarFront aria-hidden="true" className="mx-auto size-8 text-slate-400" /><p className="mt-3 text-sm font-semibold text-slate-600">{copy.relatedEmpty}</p></div>}</section>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd).replace(/</g, "\\u003c") }} />
  </main><div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,35,60,.12)] backdrop-blur-md md:hidden"><WhatsAppLink message={message} includeCurrentUrl currentUrlLabel={copy.pageLabel} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 text-center text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{copy.reserve}</WhatsAppLink></div><SiteFooter rtl={rtl} /></div>;
}
