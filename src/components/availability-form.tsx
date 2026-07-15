"use client";
import { MapPin, Search } from "lucide-react";
import { FormEvent } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { PublicPickupLocation } from "@/lib/data/vehicle-mapper";

export function AvailabilityForm({ compact = false, rtl = false, locations = [] }: { compact?: boolean; rtl?: boolean; locations?: PublicPickupLocation[] }) {
  const defaultLocation = locations[0]?.name ?? (rtl ? "سيدي قاسم" : "Sidi Kacem"); const listId = rtl ? "pickup-locations-ar" : "pickup-locations-fr";
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const fd = new FormData(event.currentTarget); const values = Object.fromEntries(fd.entries()); const message = `Bonjour Vay Cars Location, je souhaite vérifier la disponibilité. Départ : ${values.departure || defaultLocation} (${values.startDate || "à définir"} ${values.startTime || ""}), retour : ${values.returnLocation || defaultLocation} (${values.endDate || "à définir"} ${values.endTime || ""}), véhicule : ${values.vehicleType || "sans préférence"}.`; window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer"); }
  const field = "h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0b5aa7] focus:ring-2 focus:ring-blue-100";
  return <form onSubmit={submit} className={`grid gap-3 ${compact ? "md:grid-cols-[1fr_auto]" : "md:grid-cols-2 lg:grid-cols-4"}`}>
    <label className="relative"><span className="sr-only">Lieu de départ</span><MapPin className="pointer-events-none absolute left-3 top-4 size-4 text-[#0b5aa7]"/><input name="departure" required list={listId} defaultValue={defaultLocation} className={`${field} pl-9`} placeholder={rtl ? "مكان الانطلاق" : "Lieu de départ"} /></label>
    <label><span className="sr-only">Lieu de retour</span><input name="returnLocation" required list={listId} defaultValue={defaultLocation} className={field} placeholder={rtl ? "مكان العودة" : "Lieu de retour"} /></label>
    <label><span className="sr-only">Date de départ</span><input name="startDate" required type="date" className={field} /></label>
    <label><span className="sr-only">Heure de départ</span><input name="startTime" required type="time" className={field} /></label>
    {!compact && <><label><span className="sr-only">Date de retour</span><input name="endDate" required type="date" className={field} /></label><label><span className="sr-only">Heure de retour</span><input name="endTime" required type="time" className={field} /></label><select name="vehicleType" className={field}><option value="">{rtl ? "نوع السيارة" : "Type de voiture"}</option><option>Citadine</option><option>Berline</option><option>SUV</option></select></>}
    <datalist id={listId}>{locations.map((location) => <option key={location.id} value={location.name} />)}</datalist><button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b5aa7] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#084a8a]" type="submit"><Search className="size-4" />{rtl ? "تحقق من التوفر" : "Vérifier la disponibilité"}</button>
  </form>;
}
