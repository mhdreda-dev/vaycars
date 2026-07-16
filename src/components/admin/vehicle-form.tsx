"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle } from "lucide-react";
import { createVehicle, updateVehicle } from "@/app/admin/(protected)/vehicles/form-actions";
import { vehicleInputSchema } from "@/lib/admin/vehicle-schema";
import { AdminToast, adminVehicleToastStorageKey, type AdminToastData } from "./admin-toast";
import { AdminFormSection } from "./admin-form-section";
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
  seats: "", doors: "", luggage: "", airConditioning: false, shortDescriptionFr: "", fullDescriptionFr: "",
  badgeFr: "", priceNoteFr: "", shortDescriptionAr: "", fullDescriptionAr: "",
  badgeAr: "", priceNoteAr: "", colorFr: "", colorAr: "", availability: "AVAILABLE",
  active: true, featured: false, displayOrder: "0", images: [],
};

const fieldClass = "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0b5aa7] focus:ring-2 focus:ring-blue-100";
const requiredFields = ["brand", "model", "slug", "categoryId", "seats", "doors"];

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function FieldTag({ required = false }: { required?: boolean }) {
  return <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${required ? "bg-blue-50 text-[#0b5aa7]" : "bg-slate-100 text-slate-500"}`}>{required ? "Requis" : "Optionnel"}</span>;
}

function ProgressItem({ label, complete }: { label: string; complete: boolean }) {
  return <div className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${complete ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"}`}><span className={`grid size-5 shrink-0 place-items-center rounded-full ${complete ? "bg-emerald-600 text-white" : "border border-slate-300"}`}>{complete && <Check className="size-3.5" />}</span><span className="truncate">{label}</span></div>;
}

export function VehicleForm({ categories, initial, vehicleId, blobConfigured = false }: {
  categories: { id: string; nameFr: string }[]; initial?: Partial<VehicleFormValue>; vehicleId?: string; blobConfigured?: boolean;
}) {
  const [value, setValue] = useState<VehicleFormValue>(() => ({ ...emptyVehicle, ...initial, images: initial?.images ?? [] }));
  const [manualSlug, setManualSlug] = useState(Boolean(vehicleId));
  const [pending, startTransition] = useTransition();
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify({ ...emptyVehicle, ...initial, images: initial?.images ?? [] }));
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [toast, setToast] = useState<AdminToastData | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(adminVehicleToastStorageKey);
    if (!stored) return null;
    sessionStorage.removeItem(adminVehicleToastStorageKey);
    try { return JSON.parse(stored) as AdminToastData; } catch { return null; }
  });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const dirty = JSON.stringify(value) !== initialSnapshot;
  const mainComplete = Boolean(value.brand.trim() && value.model.trim() && value.slug && value.categoryId && Number(value.seats) > 0 && Number(value.doors) > 0);
  const imagesComplete = value.images.some((image) => /^\/(?!\/)/.test(image.url.trim()) || /^https:\/\//i.test(image.url.trim()));
  const technicalHasValues = Boolean(value.year || value.luggage || value.airConditioning || value.colorFr || value.colorAr || value.badgeFr || value.badgeAr || (vehicleId && (value.fuel || value.transmission)));
  const frenchHasValues = Boolean(value.shortDescriptionFr || value.fullDescriptionFr || value.priceNoteFr);
  const darijaHasValues = Boolean(value.shortDescriptionAr || value.fullDescriptionAr || value.priceNoteAr);
  const hasError = (...fields: string[]) => fields.some((field) => Boolean(errors[field]?.length));

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!pending && JSON.stringify(value) !== initialSnapshot) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [initialSnapshot, pending, value]);

  const update = <K extends keyof VehicleFormValue>(key: K, next: VehicleFormValue[K]) => setValue((current) => ({ ...current, [key]: next }));
  const fieldError = (field: string) => errors[field]?.[0] && <p data-error-field={field} className="mt-1 text-xs font-medium text-red-600">{errors[field][0]}</p>;
  const onBrandModel = (key: "brand" | "model", next: string) => {
    const changed = { ...value, [key]: next };
    setValue({ ...changed, slug: manualSlug ? value.slug : slugify(`${changed.brand}-${changed.model}`) });
  };
  const closeToast = () => { setToast(null); sessionStorage.removeItem(adminVehicleToastStorageKey); };
  function showToast(next: Omit<AdminToastData, "id">, persist = false) {
    const data = { ...next, id: crypto.randomUUID() };
    setToast(data);
    if (persist) sessionStorage.setItem(adminVehicleToastStorageKey, JSON.stringify(data));
  }
  function focusFirstError(fieldErrors: Record<string, string[]>) {
    const field = Object.keys(fieldErrors)[0];
    if (!field) return;
    requestAnimationFrame(() => {
      const error = formRef.current?.querySelector(`[data-error-field="${field}"]`);
      const section = error?.closest("section");
      const target = section?.querySelector<HTMLElement>("input, select, textarea, button") ?? formRef.current?.querySelector<HTMLElement>("input, select, textarea");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.focus();
    });
  }
  function confirmCancel(event: React.MouseEvent<HTMLAnchorElement>) {
    if (dirty && !window.confirm("Les modifications non enregistrées seront perdues. Continuer ?")) event.preventDefault();
  }
  function submit() {
    setMessage("");
    setErrors({});
    const payload = {
      ...value,
      year: value.year ? Number(value.year) : null,
      seats: Number(value.seats),
      doors: Number(value.doors),
      luggage: value.luggage === "" ? null : Number(value.luggage),
      displayOrder: value.displayOrder === "" ? 0 : Number(value.displayOrder),
      images: value.images.map((image, index) => ({ ...image, displayOrder: index })),
    };
    const clientValidation = vehicleInputSchema.safeParse(payload);
    if (!clientValidation.success) {
      const fieldErrors = clientValidation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      showToast({ variant: "error", title: "Formulaire incomplet", description: "Corrigez les champs signalés avant d’enregistrer." });
      return;
    }
    startTransition(async () => {
      const result = vehicleId ? await updateVehicle(vehicleId, payload) : await createVehicle(payload);
      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        setMessage(result.message);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length) {
          focusFirstError(fieldErrors);
          showToast({ variant: "error", title: "Formulaire incomplet", description: "Corrigez les champs signalés avant d’enregistrer." });
        } else showToast({ variant: "error", title: "Échec de l’enregistrement", description: "Une erreur est survenue. Vérifiez les informations puis réessayez." });
        return;
      }
      const notification = result.partial
        ? { variant: "warning" as const, title: "Enregistrement partiel", description: "Les informations ont été enregistrées, mais certaines images n’ont pas pu être mises à jour." }
        : vehicleId
          ? { variant: "success" as const, title: "Modifications enregistrées", description: "Les informations du véhicule ont été mises à jour avec succès." }
          : { variant: "success" as const, title: "Véhicule créé", description: "Le véhicule a été ajouté avec succès." };
      setInitialSnapshot(JSON.stringify(value));
      showToast(notification, true);
      router.push(`/admin/vehicles/${result.id}/edit`);
      router.refresh();
    });
  }

  return <>
    <AdminToast toast={toast} onClose={closeToast} />
    <form ref={formRef} action={submit} className="space-y-5 pb-28 sm:pb-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-black text-[#10233c]">État du formulaire</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ProgressItem label="Informations principales" complete={mainComplete} />
          <ProgressItem label="Images" complete={imagesComplete} />
          <ProgressItem label="Prêt à enregistrer" complete={mainComplete && imagesComplete} />
        </div>
      </div>

      <AdminFormSection title="Informations principales" summary="Les informations nécessaires pour créer le véhicule." forceOpen={hasError(...requiredFields)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>Marque <FieldTag required /><input value={value.brand} onChange={(event) => onBrandModel("brand", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.brand)} />{fieldError("brand")}</label>
          <label>Modèle <FieldTag required /><input value={value.model} onChange={(event) => onBrandModel("model", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.model)} />{fieldError("model")}</label>
          <label className="sm:col-span-2">Slug <FieldTag required /><input value={value.slug} onChange={(event) => { setManualSlug(true); update("slug", slugify(event.target.value)); }} className={fieldClass} aria-invalid={Boolean(errors.slug)} />{fieldError("slug")}<p className="mt-1 break-all text-xs text-slate-500">/fr/voitures/{value.slug || "slug"} · /ar/cars/{value.slug || "slug"}</p></label>
          <label>Catégorie <FieldTag required /><select value={value.categoryId} onChange={(event) => update("categoryId", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.categoryId)} disabled={!categories.length}><option value="">Choisir une catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameFr}</option>)}</select>{fieldError("categoryId")}{!categories.length && <p role="status" className="mt-2 text-sm text-amber-700">Aucune catégorie disponible. <Link href="/admin/categories" className="font-bold underline">Créez une catégorie avant d’ajouter un véhicule.</Link></p>}</label>
          <label>Nombre de places <FieldTag required /><input type="number" min="1" value={value.seats} onChange={(event) => update("seats", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.seats)} />{fieldError("seats")}</label>
          <label>Nombre de portes <FieldTag required /><input type="number" min="1" value={value.doors} onChange={(event) => update("doors", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.doors)} />{fieldError("doors")}</label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Images" summary={`${value.images.length} photo${value.images.length > 1 ? "s" : ""} ajoutée${value.images.length > 1 ? "s" : ""} · au moins une requise.`} forceOpen={hasError("images")}>
        <VehicleImageManager images={value.images} onChange={(images) => update("images", images)} blobConfigured={blobConfigured} brand={value.brand} model={value.model} error={errors.images?.[0]} />
      </AdminFormSection>

      <AdminFormSection title="Caractéristiques techniques" summary="Détails complémentaires du véhicule." defaultOpen={Boolean(vehicleId && technicalHasValues)} forceOpen={hasError("year", "luggage", "fuel", "transmission", "airConditioning", "colorFr", "colorAr", "badgeFr", "badgeAr")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label>Année <FieldTag /><input type="number" min="1900" value={value.year} onChange={(event) => update("year", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.year)} />{fieldError("year")}</label>
          <label>Capacité des bagages <FieldTag /><input type="number" min="0" value={value.luggage} onChange={(event) => update("luggage", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.luggage)} />{fieldError("luggage")}<p className="mt-1 text-xs text-slate-500">Nombre approximatif de valises pouvant être placées dans le coffre.</p></label>
          <label>Carburant <FieldTag /><select value={value.fuel} onChange={(event) => update("fuel", event.target.value as VehicleFormValue["fuel"])} className={fieldClass}><option value="DIESEL">Diesel</option><option value="GASOLINE">Essence</option><option value="HYBRID">Hybride</option><option value="ELECTRIC">Électrique</option></select></label>
          <label>Transmission <FieldTag /><select value={value.transmission} onChange={(event) => update("transmission", event.target.value as VehicleFormValue["transmission"])} className={fieldClass}><option value="MANUAL">Manuelle</option><option value="AUTOMATIC">Automatique</option></select></label>
          <label>Couleur — Français <FieldTag /><input value={value.colorFr} onChange={(event) => update("colorFr", event.target.value)} className={fieldClass} /></label>
          <label dir="rtl" className="text-right">اللون — بالدارجة <FieldTag /><input value={value.colorAr} onChange={(event) => update("colorAr", event.target.value)} className={`${fieldClass} text-right`} /></label>
          <label>Badge — Français <FieldTag /><input value={value.badgeFr} onChange={(event) => update("badgeFr", event.target.value)} className={fieldClass} /></label>
          <label dir="rtl" className="text-right">شارة — بالدارجة <FieldTag /><input value={value.badgeAr} onChange={(event) => update("badgeAr", event.target.value)} className={`${fieldClass} text-right`} /></label>
          <label className="flex min-h-11 items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.airConditioning} onChange={(event) => update("airConditioning", event.target.checked)} />Climatisation <FieldTag /></label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Contenu français" summary="Descriptions facultatives pour les pages françaises." defaultOpen={Boolean(vehicleId && frenchHasValues)} forceOpen={hasError("shortDescriptionFr", "fullDescriptionFr", "priceNoteFr")}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Un texte par défaut sera utilisé sur le site si ce champ reste vide.</p>
          <label className="block">Description courte — Français <FieldTag /><textarea value={value.shortDescriptionFr} onChange={(event) => update("shortDescriptionFr", event.target.value)} maxLength={300} rows={3} className={`${fieldClass} h-auto py-3`} aria-invalid={Boolean(errors.shortDescriptionFr)} />{fieldError("shortDescriptionFr")}<span className="text-xs text-slate-500">{value.shortDescriptionFr.length}/300</span></label>
          <label className="block">Description complète — Français <FieldTag /><textarea value={value.fullDescriptionFr} onChange={(event) => update("fullDescriptionFr", event.target.value)} rows={6} className={`${fieldClass} h-auto py-3`} aria-invalid={Boolean(errors.fullDescriptionFr)} />{fieldError("fullDescriptionFr")}</label>
          <label>Note tarifaire — Français <FieldTag /><input value={value.priceNoteFr} onChange={(event) => update("priceNoteFr", event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.priceNoteFr)} />{fieldError("priceNoteFr")}</label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Contenu Darija" summary="Descriptions facultatives pour les pages en darija." defaultOpen={Boolean(vehicleId && darijaHasValues)} forceOpen={hasError("shortDescriptionAr", "fullDescriptionAr", "priceNoteAr")}>
        <div dir="rtl" className="space-y-4 text-right">
          <p className="text-sm text-slate-500">إلا خليتي هاد الخانة خاوية، غادي يستعمل الموقع نص افتراضي.</p>
          <label className="block">وصف قصير — بالدارجة <FieldTag /><textarea value={value.shortDescriptionAr} onChange={(event) => update("shortDescriptionAr", event.target.value)} maxLength={300} rows={3} className={`${fieldClass} h-auto py-3 text-right`} aria-invalid={Boolean(errors.shortDescriptionAr)} />{fieldError("shortDescriptionAr")}<span className="text-xs text-slate-500">{value.shortDescriptionAr.length}/300</span></label>
          <label className="block">الوصف الكامل — بالدارجة <FieldTag /><textarea value={value.fullDescriptionAr} onChange={(event) => update("fullDescriptionAr", event.target.value)} rows={6} className={`${fieldClass} h-auto py-3 text-right`} aria-invalid={Boolean(errors.fullDescriptionAr)} />{fieldError("fullDescriptionAr")}</label>
          <label>ملاحظة الثمن — بالدارجة <FieldTag /><input value={value.priceNoteAr} onChange={(event) => update("priceNoteAr", event.target.value)} className={`${fieldClass} text-right`} aria-invalid={Boolean(errors.priceNoteAr)} />{fieldError("priceNoteAr")}</label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Publication" summary="Contrôlez l’affichage et la disponibilité du véhicule.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label>Disponibilité <FieldTag /><select value={value.availability} onChange={(event) => update("availability", event.target.value as VehicleFormValue["availability"])} className={fieldClass}><option value="AVAILABLE">Disponible</option><option value="UNAVAILABLE">Indisponible</option><option value="MAINTENANCE">En entretien</option><option value="RESERVED">Réservée</option></select></label>
          <label>Ordre d’affichage <FieldTag /><input type="number" min="0" value={value.displayOrder} onChange={(event) => update("displayOrder", event.target.value)} className={fieldClass} /></label>
          <label className="flex min-h-11 items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.active} onChange={(event) => update("active", event.target.checked)} />Visible sur le site <FieldTag /></label>
          <label className="flex min-h-11 items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.featured} onChange={(event) => update("featured", event.target.checked)} />Mettre en avant <FieldTag /></label>
        </div>
        <p className="mt-3 text-sm text-slate-500">Une voiture masquée reste dans l’administration, mais disparaît du site public.</p>
      </AdminFormSection>

      {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</p>}
      <div className="sticky bottom-0 z-20 -mx-4 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur sm:mx-0 sm:flex-row sm:justify-end sm:rounded-xl sm:border sm:p-3">
        <Link href="/admin/vehicles" onClick={confirmCancel} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-[#10233c]">Annuler</Link>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b5aa7] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{pending && <LoaderCircle className="size-4 animate-spin" />}{pending ? "Enregistrement…" : vehicleId ? "Enregistrer les modifications" : "Ajouter la voiture"}</button>
      </div>
    </form>
  </>;
}
