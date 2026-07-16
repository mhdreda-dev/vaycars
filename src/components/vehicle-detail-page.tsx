import Image from "next/image";
import { isVercelBlobPublicUrl } from "@/lib/image-url";
import { AirVent, Fuel, Settings2, Users } from "lucide-react";
import type { PublicVehicle } from "@/lib/data/vehicle-mapper";
import type { PublicSiteSettings } from "@/lib/data/vehicle-mapper";
import { getVehicleWhatsAppMessage } from "@/lib/whatsapp";
import { Navigation } from "./navigation";
import { SiteFooter } from "./site-footer";
import { WhatsAppLink } from "./whatsapp-link";

export function VehicleDetailPage({ vehicle, rtl = false, settings }: { vehicle: PublicVehicle; rtl?: boolean; settings?: PublicSiteSettings }) {
  const name = `${vehicle.brand} ${vehicle.model}`;
  const copy = rtl ? { places: "مقاعد", air: "مكيف", availability: "حالة التوفر", note: "شاركنا تواريخك لمعرفة التوفر.", request: "اطلب الثمن" } : { places: "places", air: "Climatisation", availability: "Disponibilité", note: "Partagez vos dates pour connaître la disponibilité.", request: "Demander le tarif" };
  const specs = [[Fuel, vehicle.fuel], [Settings2, vehicle.transmission], [Users, `${vehicle.seats} ${copy.places}`], [AirVent, copy.air]] as const;
  return <div dir={rtl ? "rtl" : "ltr"}><Navigation rtl={rtl} /><main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><div className="grid gap-9 lg:grid-cols-[1.15fr_.85fr]"><div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100"><Image src={vehicle.mainImage} alt={name} fill unoptimized={isVercelBlobPublicUrl(vehicle.mainImage)} loading="eager" fetchPriority="high" sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /></div><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#0b5aa7]">{vehicle.category}</p><h1 className="mt-2 text-4xl font-black text-[#10233c]">{name}</h1><p className="mt-4 leading-7 text-slate-600">{vehicle.fullDescription}</p><div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">{specs.map(([Icon, label]) => <p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3" key={label}><Icon className="size-4 text-[#0b5aa7]" />{label}</p>)}</div><p className="mt-6 text-sm font-bold text-slate-500">{copy.availability} : <span className={vehicle.availability === "AVAILABLE" ? "text-emerald-700" : "text-amber-700"}>{vehicle.availabilityLabel}</span></p><p className="mt-3 text-lg font-bold text-[#10233c]">{vehicle.priceNote}</p><p className="mt-1 text-sm text-slate-500">{copy.note}</p><WhatsAppLink message={getVehicleWhatsAppMessage(name, rtl ? "ar" : "fr", vehicle.availability !== "AVAILABLE")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3.5 font-bold text-white">{copy.request}</WhatsAppLink></div></div></main><SiteFooter rtl={rtl} settings={settings} /></div>;
}
