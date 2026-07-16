"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AirVent, BriefcaseBusiness, Fuel, Luggage, Settings2, Users } from "lucide-react";
import type { PublicVehicle } from "@/lib/data/vehicle-mapper";
import { isVercelBlobPublicUrl } from "@/lib/image-url";
import { getVehicleWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "./whatsapp-link";

export function VehicleCard({ vehicle, rtl = false, priority = false, index = 0 }: { vehicle: PublicVehicle; rtl?: boolean; priority?: boolean; index?: number }) {
  const reduceMotion = useReducedMotion();
  const name = `${vehicle.brand} ${vehicle.model}`;
  const copy = rtl ? { details: "التفاصيل", request: "اطلب السعر", places: "مقاعد", air: "مكيف", luggage: "حقائب", doors: "أبواب" } : { details: "Voir les détails", request: "Demander le tarif", places: "places", air: "Climatisation", luggage: "bagages", doors: "portes" };
  const specs = [[Fuel, vehicle.fuel], [Settings2, vehicle.transmission], [Users, `${vehicle.seats} ${copy.places}`], [AirVent, copy.air], [Luggage, `${vehicle.luggage} ${copy.luggage}`], [BriefcaseBusiness, `${vehicle.doors} ${copy.doors}`]] as const;
  return <motion.article layout={!reduceMotion} initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }} transition={{ duration: reduceMotion ? 0.2 : 0.42, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.07, ease: "easeOut" }} whileHover={reduceMotion ? {} : { y: -5 }} className="group flex h-full min-h-[480px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,35,60,.06)] transition-colors duration-200 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,35,60,.12)]">
    <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-[#f2f7fb] via-white to-[#e3edf6]"><Image src={vehicle.mainImage} alt={vehicle.mainImageAlt} fill unoptimized={isVercelBlobPublicUrl(vehicle.mainImage)} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} sizes="(max-width: 640px) 86vw, (max-width: 1024px) 48vw, 32vw" className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.035]"/>
      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${vehicle.availability === "AVAILABLE" ? "bg-emerald-50/95 text-emerald-700" : "bg-amber-50/95 text-amber-700"}`}>{vehicle.availabilityLabel}</span>{vehicle.badge && <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0b5aa7] shadow-sm">{vehicle.badge}</span>}</div>
    </div>
    <div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">{vehicle.category}</p><h3 className="mt-1 text-xl font-black tracking-tight text-[#10233c]">{name}</h3></div></div>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm text-slate-600">{specs.map(([Icon, label]) => <span className="flex min-w-0 items-center gap-2" key={label}><Icon className="size-4 shrink-0 text-[#0b5aa7]"/><span className="truncate">{label}</span></span>)}</div>
      <p className="mt-5 text-sm font-bold text-slate-500">{vehicle.priceNote}</p><div className="mt-auto grid grid-cols-2 gap-2 pt-4"><Link href={rtl ? `/ar/cars/${vehicle.slug}` : `/fr/voitures/${vehicle.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-2 text-center text-sm font-bold text-[#10233c] transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{copy.details}</Link><WhatsAppLink message={getVehicleWhatsAppMessage(name, rtl ? "ar" : "fr", vehicle.availability !== "AVAILABLE")} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-[#16a34a] px-2 text-center text-sm font-bold text-white transition hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{copy.request}</WhatsAppLink></div></div>
  </motion.article>;
}
