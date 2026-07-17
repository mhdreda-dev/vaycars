"use client";

import { MapPin, Search } from "lucide-react";
import { FormEvent } from "react";
import type { PublicPickupLocation } from "@/lib/data/vehicle-mapper";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useAgencySettings } from "./agency-settings-provider";

export function AvailabilityForm({
  compact = false,
  rtl = false,
  locations = [],
}: {
  compact?: boolean;
  rtl?: boolean;
  locations?: PublicPickupLocation[];
}) {
  const settings = useAgencySettings();
  const defaultLocation = locations[0]?.name ?? (rtl ? "سيدي قاسم" : "Sidi Kacem");
  const listId = rtl ? "pickup-locations-ar" : "pickup-locations-fr";
  const labels = rtl
    ? {
        departure: "مكان الانطلاق",
        returnLocation: "مكان الرجوع",
        startDate: "تاريخ الانطلاق",
        startTime: "وقت الانطلاق",
        endDate: "تاريخ الرجوع",
        endTime: "وقت الرجوع",
        vehicleType: "نوع الطوموبيل",
        submit: "شوف واش متوفرة",
      }
    : {
        departure: "Lieu de départ",
        returnLocation: "Lieu de retour",
        startDate: "Date de départ",
        startTime: "Heure de départ",
        endDate: "Date de retour",
        endTime: "Heure de retour",
        vehicleType: "Type de voiture",
        submit: "Vérifier la disponibilité",
      };
  const field =
    "h-12 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0b5aa7] focus:ring-3 focus:ring-blue-100";
  const labelClass = "min-w-0 text-sm font-semibold text-[#10233c]";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings.whatsappNumber) return;
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const message = `${settings.agencyName}, je souhaite vérifier la disponibilité. Départ : ${values.departure || defaultLocation} (${values.startDate || "à définir"} ${values.startTime || ""}), retour : ${values.returnLocation || defaultLocation} (${values.endDate || "à définir"} ${values.endTime || ""}), véhicule : ${values.vehicleType || "sans préférence"}.`;
    window.open(getWhatsAppUrl(message, settings.whatsappNumber), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={submit}
      dir={rtl ? "rtl" : "ltr"}
      className={`grid gap-x-3 gap-y-3 ${compact ? "md:grid-cols-[1fr_auto]" : "min-[360px]:grid-cols-2 lg:grid-cols-4"}`}
    >
      <label className={labelClass}>
        <span className="mb-1.5 block">{labels.departure}</span>
        <span className="relative block">
          <MapPin aria-hidden="true" className="pointer-events-none absolute start-3 top-4 size-4 text-[#0b5aa7]" />
          <input name="departure" required list={listId} defaultValue={defaultLocation} className={`${field} ps-9`} />
        </span>
      </label>
      <label className={labelClass}>
        <span className="mb-1.5 block">{labels.returnLocation}</span>
        <input name="returnLocation" required list={listId} defaultValue={defaultLocation} className={field} />
      </label>
      <label className={labelClass}>
        <span className="mb-1.5 block">{labels.startDate}</span>
        <input name="startDate" required type="date" className={field} />
      </label>
      <label className={labelClass}>
        <span className="mb-1.5 block">{labels.startTime}</span>
        <input name="startTime" required type="time" className={field} />
      </label>
      {!compact && (
        <>
          <label className={labelClass}>
            <span className="mb-1.5 block">{labels.endDate}</span>
            <input name="endDate" required type="date" className={field} />
          </label>
          <label className={labelClass}>
            <span className="mb-1.5 block">{labels.endTime}</span>
            <input name="endTime" required type="time" className={field} />
          </label>
          <label className={labelClass}>
            <span className="mb-1.5 block">{labels.vehicleType}</span>
            <select name="vehicleType" className={field} defaultValue="">
              <option value="">{rtl ? "بلا تفضيل" : "Sans préférence"}</option>
              <option>{rtl ? "صغيرة" : "Citadine"}</option>
              <option>{rtl ? "سيدان" : "Berline"}</option>
              <option>SUV</option>
            </select>
          </label>
        </>
      )}
      <datalist id={listId}>
        {locations.map((location) => <option key={location.id} value={location.name} />)}
      </datalist>
      {settings.whatsappNumber && (
        <button
          className="mt-auto flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-[#0b5aa7] px-4 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-[#084a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] motion-reduce:transform-none"
          type="submit"
        >
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <span>{labels.submit}</span>
        </button>
      )}
    </form>
  );
}
