"use client";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { createVehicle, updateVehicle } from "@/app/admin/(protected)/vehicles/form-actions";
import { vehicleInputSchema } from "@/lib/admin/vehicle-schema";
import { AdminToast, adminVehicleToastStorageKey, type AdminToastData } from "./admin-toast";
import { VehicleImageManager } from "./vehicle-image-manager";

export type VehicleImageValue = { url: string; altFr: string; altAr: string; isMain: boolean; fileName?: string };
export type VehicleFormValue = {
  brand: string; model: string; slug: string; year: string; categoryId: string;
  fuel: "DIESEL" | "GASOLINE" | "HYBRID" | "ELECTRIC";
  transmission: "MANUAL" | "AUTOMATIC"; seats: string; doors: string; luggage: string;
  airConditioning: boolean; shortDescriptionFr: string; fullDescriptionFr: string;
  badgeFr: string; priceNoteFr: string; shortDescriptionAr: string; fullDescriptionAr: string;
  badgeAr: string; priceNoteAr: string; colorFr: string; colorAr: string;
  availability: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE" | "RESERVED";
  active: boolean; featured: boolean; displayOrder: string; images: VehicleImageValue[];
};

export const emptyVehicle: VehicleFormValue = {
  brand: "", model: "", slug: "", year: "", categoryId: "", fuel: "DIESEL", transmission: "MANUAL",
  seats: "", doors: "", luggage: "", airConditioning: true, shortDescriptionFr: "", fullDescriptionFr: "",
  badgeFr: "", priceNoteFr: "Tarif selon la période", shortDescriptionAr: "", fullDescriptionAr: "",
  badgeAr: "", priceNoteAr: "الثمن حسب المدة والتاريخ", colorFr: "", colorAr: "", availability: "AVAILABLE",
  active: true, featured: false, displayOrder: "0", images: [],
};

const imageInput = "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0b5aa7] focus:ring-2 focus:ring-blue-100";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function VehicleForm({ categories, initial, vehicleId, blobConfigured = false }: {
  categories: { id: string; nameFr: string }[]; initial?: Partial<VehicleFormValue>; vehicleId?: string; blobConfigured?: boolean;
}) {
  const [value, setValue] = useState<VehicleFormValue>(() => ({ ...emptyVehicle, ...initial, images: initial?.images ?? [] }));
  const [manualSlug, setManualSlug] = useState(Boolean(vehicleId));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [toast, setToast] = useState<AdminToastData | null>(() => { if (typeof window === "undefined") return null; const stored = sessionStorage.getItem(adminVehicleToastStorageKey); if (!stored) return null; sessionStorage.removeItem(adminVehicleToastStorageKey); try { return JSON.parse(stored) as AdminToastData; } catch { return null; } });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const update = <K extends keyof VehicleFormValue>(key: K, next: VehicleFormValue[K]) => setValue((current) => ({ ...current, [key]: next }));
  const fieldError = (field: string) => errors[field]?.[0] && <p data-error-field={field} className="mt-1 text-xs font-medium text-red-600">{errors[field][0]}</p>;
  const onBrandModel = (key: "brand" | "model", next: string) => {
    const changed = { ...value, [key]: next };
    setValue({ ...changed, slug: manualSlug ? value.slug : slugify(`${changed.brand}-${changed.model}`) });
  };


  const closeToast = () => { setToast(null); sessionStorage.removeItem(adminVehicleToastStorageKey); };
  function showToast(next: Omit<AdminToastData, "id">, persist = false) { const data = { ...next, id: crypto.randomUUID() }; setToast(data); if (persist) sessionStorage.setItem(adminVehicleToastStorageKey, JSON.stringify(data)); }
  function focusFirstError(fieldErrors: Record<string, string[]>) { const field = Object.keys(fieldErrors)[0]; if (!field) return; requestAnimationFrame(() => { const error = formRef.current?.querySelector(`[data-error-field="${field}"]`); const target = error?.parentElement?.querySelector<HTMLElement>("input, select, textarea") ?? formRef.current?.querySelector<HTMLElement>("input, select, textarea"); target?.scrollIntoView({ behavior: "smooth", block: "center" }); target?.focus(); }); }

  function submit() {
    setMessage(""); setErrors({});
    const payload = {
      ...value, year: value.year ? Number(value.year) : null, seats: Number(value.seats), doors: Number(value.doors),
      luggage: value.luggage === "" ? null : Number(value.luggage), displayOrder: value.displayOrder === "" ? 0 : Number(value.displayOrder),
      images: value.images.map((image, index) => ({ ...image, displayOrder: index })),
    };
    const clientValidation = vehicleInputSchema.safeParse(payload);
    if (!clientValidation.success) { const fieldErrors = clientValidation.error.flatten().fieldErrors; setErrors(fieldErrors); focusFirstError(fieldErrors); showToast({ variant: "error", title: "Formulaire incomplet", description: "Corrigez les champs signalés avant d’enregistrer." }); return; }
    startTransition(async () => {
      const result = vehicleId ? await updateVehicle(vehicleId, payload) : await createVehicle(payload);
      if (!result.ok) { const fieldErrors = result.fieldErrors ?? {}; setMessage(result.message); setErrors(fieldErrors); if (Object.keys(fieldErrors).length) { focusFirstError(fieldErrors); showToast({ variant: "error", title: "Formulaire incomplet", description: "Corrigez les champs signalés avant d’enregistrer." }); } else { showToast({ variant: "error", title: "Échec de l’enregistrement", description: "Une erreur est survenue. Vérifiez les informations puis réessayez." }); } return; }
      const notification = result.partial ? { variant: "warning" as const, title: "Enregistrement partiel", description: "Les informations ont été enregistrées, mais certaines images n’ont pas pu être mises à jour." } : vehicleId ? { variant: "success" as const, title: "Modifications enregistrées", description: "Les informations du véhicule ont été mises à jour avec succès." } : { variant: "success" as const, title: "Véhicule créé", description: "Le véhicule a été ajouté avec succès." };
      showToast(notification, true); router.push(`/admin/vehicles/${result.id}/edit`); router.refresh();
    });
  }

  return <><AdminToast toast={toast} onClose={closeToast} /><form ref={formRef} action={submit} className="space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Informations principales</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label>Marque *<input value={value.brand} onChange={(e) => onBrandModel("brand", e.target.value)} className={imageInput} />{fieldError("brand")}</label><label>Modèle *<input value={value.model} onChange={(e) => onBrandModel("model", e.target.value)} className={imageInput} />{fieldError("model")}</label>
      <label className="sm:col-span-2">Slug *<input value={value.slug} onChange={(e) => { setManualSlug(true); update("slug", slugify(e.target.value)); }} className={imageInput} />{fieldError("slug")}<p className="mt-1 text-xs text-slate-500">/fr/voitures/{value.slug || "slug"} · /ar/cars/{value.slug || "slug"}</p></label>
      <label>Année<input type="number" value={value.year} onChange={(e) => update("year", e.target.value)} className={imageInput} /></label><label>Catégorie *<select value={value.categoryId} onChange={(e) => update("categoryId", e.target.value)} className={imageInput} disabled={!categories.length}><option value="">Choisir une catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameFr}</option>)}</select>{fieldError("categoryId")}{!categories.length && <p role="status" className="mt-2 text-sm text-amber-700">Aucune catégorie disponible. <Link href="/admin/categories" className="font-bold underline">Créez une catégorie avant d’ajouter un véhicule.</Link></p>}</label>
      <label>Couleur — Français<input value={value.colorFr} onChange={(e) => update("colorFr", e.target.value)} className={imageInput} /></label><label dir="rtl">اللون — العربية<input value={value.colorAr} onChange={(e) => update("colorAr", e.target.value)} className={imageInput} /></label>
    </div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Caractéristiques techniques</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label>Carburant<select value={value.fuel} onChange={(e) => update("fuel", e.target.value as VehicleFormValue["fuel"])} className={imageInput}><option value="DIESEL">Diesel</option><option value="GASOLINE">Essence</option><option value="HYBRID">Hybride</option><option value="ELECTRIC">Électrique</option></select></label><label>Transmission<select value={value.transmission} onChange={(e) => update("transmission", e.target.value as VehicleFormValue["transmission"])} className={imageInput}><option value="MANUAL">Manuelle</option><option value="AUTOMATIC">Automatique</option></select></label>
      <label>Nombre de places *<input type="number" value={value.seats} onChange={(e) => update("seats", e.target.value)} className={imageInput} />{fieldError("seats")}</label><label>Nombre de portes *<input type="number" value={value.doors} onChange={(e) => update("doors", e.target.value)} className={imageInput} />{fieldError("doors")}</label><label>Capacité des bagages *<input type="number" value={value.luggage} onChange={(e) => update("luggage", e.target.value)} className={imageInput} />{fieldError("luggage")}</label><label className="flex items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.airConditioning} onChange={(e) => update("airConditioning", e.target.checked)} />Climatisation</label>
    </div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Contenu français</h2><div className="mt-5 space-y-4"><label className="block">Description courte — Français *<textarea value={value.shortDescriptionFr} onChange={(e) => update("shortDescriptionFr", e.target.value)} maxLength={300} rows={3} className={`${imageInput} h-auto py-3`} />{fieldError("shortDescriptionFr")}<span className="text-xs text-slate-500">{value.shortDescriptionFr.length}/300</span></label><label className="block">Description complète — Français *<textarea value={value.fullDescriptionFr} onChange={(e) => update("fullDescriptionFr", e.target.value)} rows={6} className={`${imageInput} h-auto py-3`} />{fieldError("fullDescriptionFr")}</label><div className="grid gap-4 sm:grid-cols-2"><label>Badge — Français<input value={value.badgeFr} onChange={(e) => update("badgeFr", e.target.value)} className={imageInput} /></label><label>Texte du tarif — Français *<input value={value.priceNoteFr} onChange={(e) => update("priceNoteFr", e.target.value)} className={imageInput} />{fieldError("priceNoteFr")}</label></div></div></section>
    <section dir="rtl" className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm"><h2 className="text-lg font-black text-[#10233c]">المحتوى العربي</h2><div className="mt-5 space-y-4"><label className="block">وصف قصير — العربية *<textarea value={value.shortDescriptionAr} onChange={(e) => update("shortDescriptionAr", e.target.value)} maxLength={300} rows={3} className={`${imageInput} h-auto py-3 text-right`} />{fieldError("shortDescriptionAr")}</label><label className="block">الوصف الكامل — العربية *<textarea value={value.fullDescriptionAr} onChange={(e) => update("fullDescriptionAr", e.target.value)} rows={6} className={`${imageInput} h-auto py-3 text-right`} />{fieldError("fullDescriptionAr")}</label><div className="grid gap-4 sm:grid-cols-2"><label>الشارة — العربية<input value={value.badgeAr} onChange={(e) => update("badgeAr", e.target.value)} className={`${imageInput} text-right`} /></label><label>نص الثمن — العربية *<input value={value.priceNoteAr} onChange={(e) => update("priceNoteAr", e.target.value)} className={`${imageInput} text-right`} />{fieldError("priceNoteAr")}</label></div></div></section>
    <VehicleImageManager images={value.images} onChange={(images) => update("images", images)} blobConfigured={blobConfigured} brand={value.brand} model={value.model} error={errors.images?.[0]} />
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Publication et disponibilité</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label>Disponibilité<select value={value.availability} onChange={(e) => update("availability", e.target.value as VehicleFormValue["availability"])} className={imageInput}><option value="AVAILABLE">Disponible</option><option value="UNAVAILABLE">Indisponible</option><option value="MAINTENANCE">En entretien</option><option value="RESERVED">Réservée</option></select></label><label>Ordre d’affichage<input type="number" value={value.displayOrder} onChange={(e) => update("displayOrder", e.target.value)} className={imageInput} /></label><label className="flex items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.active} onChange={(e) => update("active", e.target.checked)} />Visible sur le site</label><label className="flex items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.featured} onChange={(e) => update("featured", e.target.checked)} />Mettre en avant</label></div><p className="mt-3 text-sm text-slate-500">Une voiture masquée reste dans l’administration, mais disparaît du site public.</p></section>
    {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</p>}<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href="/admin/vehicles" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-[#10233c]">Annuler</Link><button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b5aa7] px-5 text-sm font-bold text-white disabled:opacity-60">{pending && <LoaderCircle className="size-4 animate-spin" />}{pending ? "Enregistrement..." : vehicleId ? "Enregistrer les modifications" : "Ajouter la voiture"}</button></div>
  </form></>;
}
