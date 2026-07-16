"use client";
/* eslint-disable @next/next/no-img-element -- the admin supports existing local/remote URLs and Vercel Blob URLs. */

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { ChevronDown, ChevronUp, LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
import { createVehicle, discardStagedVehicleImage, updateVehicle } from "@/app/admin/(protected)/vehicles/form-actions";

type VehicleImageValue = { url: string; altFr: string; altAr: string; isMain: boolean };
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
  active: true, featured: false, displayOrder: "0", images: [{ url: "", altFr: "", altAr: "", isMain: true }],
};

const imageExtensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const acceptedImageTypes = new Set(Object.keys(imageExtensions));
const maxImageSize = 8 * 1024 * 1024;
const imageInput = "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0b5aa7] focus:ring-2 focus:ring-blue-100";
const blankImage = (isMain = false): VehicleImageValue => ({ url: "", altFr: "", altAr: "", isMain });

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function blobPath(file: File) {
  return `vehicles/draft/${Date.now()}-${crypto.randomUUID()}.${imageExtensions[file.type]}`;
}

export function VehicleForm({ categories, initial = emptyVehicle, vehicleId }: {
  categories: { id: string; nameFr: string }[]; initial?: VehicleFormValue; vehicleId?: string;
}) {
  const [value, setValue] = useState(initial);
  const [manualSlug, setManualSlug] = useState(Boolean(vehicleId));
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stagedBlobUrls = useRef(new Set<string>());
  const router = useRouter();

  const update = <K extends keyof VehicleFormValue>(key: K, next: VehicleFormValue[K]) => setValue((current) => ({ ...current, [key]: next }));
  const replaceImage = (index: number, next: VehicleImageValue) => update("images", value.images.map((item, itemIndex) => itemIndex === index ? next : item));
  const fieldError = (field: string) => errors[field]?.[0] && <p className="mt-1 text-xs font-medium text-red-600">{errors[field][0]}</p>;
  const onBrandModel = (key: "brand" | "model", next: string) => {
    const changed = { ...value, [key]: next };
    setValue({ ...changed, slug: manualSlug ? value.slug : slugify(`${changed.brand}-${changed.model}`) });
  };

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadMessage("");
    const selected = Array.from(files);
    const invalid = selected.find((file) => !acceptedImageTypes.has(file.type) || file.size <= 0 || file.size > maxImageSize);
    if (invalid) {
      setUploadMessage(invalid.size > maxImageSize ? "Chaque image doit faire moins de 8 Mo." : "Format non pris en charge. Utilisez JPEG, PNG ou WebP.");
      return;
    }
    const populatedImages = value.images.filter((image) => image.url).length;
    if (populatedImages + selected.length > 12) {
      setUploadMessage("Une voiture peut contenir au maximum 12 images.");
      return;
    }
    const temporaryPreviews = selected.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    setPreviews(temporaryPreviews);
    setUploading(true);
    try {
      const results = await Promise.all(selected.map((file) => upload(blobPath(file), file, {
        access: "public", handleUploadUrl: "/api/admin/blob/upload", contentType: file.type,
      })));
      results.forEach((blob) => stagedBlobUrls.current.add(blob.url));
      setValue((current) => {
        const added = results.map((blob, index) => blankImage(current.images.filter((image) => image.url).length === 0 && index === 0 ? true : false)).map((image, index) => ({ ...image, url: results[index].url }));
        const currentImages = current.images.length === 1 && !current.images[0].url ? [] : current.images;
        return { ...current, images: [...currentImages, ...added] };
      });
      setUploadMessage(`${results.length} image${results.length > 1 ? "s" : ""} ajoutée${results.length > 1 ? "s" : ""}. Complétez les textes alternatifs puis enregistrez.`);
    } catch {
      setUploadMessage("L’envoi a échoué. Vérifiez la configuration Vercel Blob et réessayez.");
    } finally {
      temporaryPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setPreviews([]);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= value.images.length) return;
    const images = [...value.images];
    [images[index], images[destination]] = [images[destination], images[index]];
    update("images", images);
  }

  function removeImage(index: number) {
    const removedUrl = value.images[index]?.url;
    if (removedUrl && stagedBlobUrls.current.delete(removedUrl)) void discardStagedVehicleImage(removedUrl);
    const remaining = value.images.filter((_, imageIndex) => imageIndex !== index);
    if (!remaining.length) { update("images", [blankImage(true)]); return; }
    update("images", remaining.some((image) => image.isMain) ? remaining : remaining.map((image, imageIndex) => ({ ...image, isMain: imageIndex === 0 })));
  }

  function submit() {
    setMessage(""); setErrors({});
    const payload = {
      ...value, year: value.year ? Number(value.year) : null, seats: Number(value.seats), doors: Number(value.doors),
      luggage: Number(value.luggage), displayOrder: Number(value.displayOrder),
      images: value.images.map((image, index) => ({ ...image, displayOrder: index })),
    };
    startTransition(async () => {
      const result = vehicleId ? await updateVehicle(vehicleId, payload) : await createVehicle(payload);
      if (!result.ok) { setMessage(result.message); setErrors(result.fieldErrors ?? {}); return; }
      stagedBlobUrls.current.clear();
      router.push(`/admin/vehicles/${result.id}/edit`); router.refresh();
    });
  }

  return <form action={submit} className="space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Informations principales</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label>Marque *<input value={value.brand} onChange={(e) => onBrandModel("brand", e.target.value)} className={imageInput} />{fieldError("brand")}</label><label>Modèle *<input value={value.model} onChange={(e) => onBrandModel("model", e.target.value)} className={imageInput} />{fieldError("model")}</label>
      <label className="sm:col-span-2">Slug *<input value={value.slug} onChange={(e) => { setManualSlug(true); update("slug", slugify(e.target.value)); }} className={imageInput} />{fieldError("slug")}<p className="mt-1 text-xs text-slate-500">/fr/voitures/{value.slug || "slug"} · /ar/cars/{value.slug || "slug"}</p></label>
      <label>Année<input type="number" value={value.year} onChange={(e) => update("year", e.target.value)} className={imageInput} /></label><label>Catégorie *<select value={value.categoryId} onChange={(e) => update("categoryId", e.target.value)} className={imageInput}><option value="">Choisir une catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameFr}</option>)}</select>{fieldError("categoryId")}</label>
      <label>Couleur — Français<input value={value.colorFr} onChange={(e) => update("colorFr", e.target.value)} className={imageInput} /></label><label dir="rtl">اللون — العربية<input value={value.colorAr} onChange={(e) => update("colorAr", e.target.value)} className={imageInput} /></label>
    </div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Caractéristiques techniques</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label>Carburant<select value={value.fuel} onChange={(e) => update("fuel", e.target.value as VehicleFormValue["fuel"])} className={imageInput}><option value="DIESEL">Diesel</option><option value="GASOLINE">Essence</option><option value="HYBRID">Hybride</option><option value="ELECTRIC">Électrique</option></select></label><label>Transmission<select value={value.transmission} onChange={(e) => update("transmission", e.target.value as VehicleFormValue["transmission"])} className={imageInput}><option value="MANUAL">Manuelle</option><option value="AUTOMATIC">Automatique</option></select></label>
      <label>Nombre de places *<input type="number" value={value.seats} onChange={(e) => update("seats", e.target.value)} className={imageInput} />{fieldError("seats")}</label><label>Nombre de portes *<input type="number" value={value.doors} onChange={(e) => update("doors", e.target.value)} className={imageInput} />{fieldError("doors")}</label><label>Capacité des bagages *<input type="number" value={value.luggage} onChange={(e) => update("luggage", e.target.value)} className={imageInput} />{fieldError("luggage")}</label><label className="flex items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.airConditioning} onChange={(e) => update("airConditioning", e.target.checked)} />Climatisation</label>
    </div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Contenu français</h2><div className="mt-5 space-y-4"><label className="block">Description courte — Français *<textarea value={value.shortDescriptionFr} onChange={(e) => update("shortDescriptionFr", e.target.value)} maxLength={300} rows={3} className={`${imageInput} h-auto py-3`} />{fieldError("shortDescriptionFr")}<span className="text-xs text-slate-500">{value.shortDescriptionFr.length}/300</span></label><label className="block">Description complète — Français *<textarea value={value.fullDescriptionFr} onChange={(e) => update("fullDescriptionFr", e.target.value)} rows={6} className={`${imageInput} h-auto py-3`} />{fieldError("fullDescriptionFr")}</label><div className="grid gap-4 sm:grid-cols-2"><label>Badge — Français<input value={value.badgeFr} onChange={(e) => update("badgeFr", e.target.value)} className={imageInput} /></label><label>Texte du tarif — Français *<input value={value.priceNoteFr} onChange={(e) => update("priceNoteFr", e.target.value)} className={imageInput} />{fieldError("priceNoteFr")}</label></div></div></section>
    <section dir="rtl" className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm"><h2 className="text-lg font-black text-[#10233c]">المحتوى العربي</h2><div className="mt-5 space-y-4"><label className="block">وصف قصير — العربية *<textarea value={value.shortDescriptionAr} onChange={(e) => update("shortDescriptionAr", e.target.value)} maxLength={300} rows={3} className={`${imageInput} h-auto py-3 text-right`} />{fieldError("shortDescriptionAr")}</label><label className="block">الوصف الكامل — العربية *<textarea value={value.fullDescriptionAr} onChange={(e) => update("fullDescriptionAr", e.target.value)} rows={6} className={`${imageInput} h-auto py-3 text-right`} />{fieldError("fullDescriptionAr")}</label><div className="grid gap-4 sm:grid-cols-2"><label>الشارة — العربية<input value={value.badgeAr} onChange={(e) => update("badgeAr", e.target.value)} className={`${imageInput} text-right`} /></label><label>نص الثمن — العربية *<input value={value.priceNoteAr} onChange={(e) => update("priceNoteAr", e.target.value)} className={`${imageInput} text-right`} />{fieldError("priceNoteAr")}</label></div></div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black text-[#10233c]">Images</h2><p className="mt-1 text-sm text-slate-500">Ajoutez des fichiers depuis votre appareil ou conservez une URL locale / HTTPS existante.</p></div><div className="flex flex-wrap gap-2"><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => uploadFiles(e.target.files)} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0b5aa7] px-3 text-sm font-bold text-white disabled:opacity-60">{uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}{uploading ? "Envoi…" : "Importer des images"}</button><button type="button" onClick={() => update("images", [...value.images, blankImage()])} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-[#10233c]"><Plus className="size-4" />Ajouter une URL</button></div></div>
      {previews.length > 0 && <div className="mt-4 flex flex-wrap gap-3" aria-live="polite">{previews.map((preview) => <div key={preview.url} className="w-24"><img src={preview.url} alt={`Aperçu de ${preview.name}`} className="aspect-square w-full rounded-lg object-cover" /><p className="mt-1 truncate text-xs text-slate-500">{preview.name}</p></div>)}</div>}
      {uploadMessage && <p role="status" className="mt-3 text-sm font-medium text-[#0b5aa7]">{uploadMessage}</p>}
      <div className="mt-5 space-y-4">{value.images.map((image, index) => <div key={image.url || `draft-${index}`} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[96px_1fr_auto]"><div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">{image.url ? <img src={image.url} alt={image.altFr || "Aperçu du véhicule"} className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-xs text-slate-500">Aperçu</span>}</div><div className="grid gap-3"><label>URL *<input value={image.url} onChange={(e) => replaceImage(index, { ...image, url: e.target.value })} className={imageInput} /></label><div className="grid gap-3 sm:grid-cols-2"><label>Alt français<input value={image.altFr} onChange={(e) => replaceImage(index, { ...image, altFr: e.target.value })} className={imageInput} /></label><label dir="rtl">Alt العربية<input value={image.altAr} onChange={(e) => replaceImage(index, { ...image, altAr: e.target.value })} className={imageInput} /></label></div></div><div className="flex items-start gap-1"><div className="flex flex-col"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="grid size-8 place-items-center rounded-md hover:bg-slate-100 disabled:opacity-30" aria-label="Déplacer l’image vers le haut"><ChevronUp className="size-4" /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === value.images.length - 1} className="grid size-8 place-items-center rounded-md hover:bg-slate-100 disabled:opacity-30" aria-label="Déplacer l’image vers le bas"><ChevronDown className="size-4" /></button></div><label className="flex min-h-10 items-center gap-2 text-sm font-bold"><input type="radio" name="main-image" checked={image.isMain} onChange={() => update("images", value.images.map((item, itemIndex) => ({ ...item, isMain: itemIndex === index })))} />Principale</label><button type="button" onClick={() => removeImage(index)} className="grid size-10 place-items-center rounded-lg text-red-600 hover:bg-red-50" aria-label="Supprimer cette image"><Trash2 className="size-4" /></button></div></div>)}</div>{fieldError("images")}</section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#10233c]">Publication et disponibilité</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label>Disponibilité<select value={value.availability} onChange={(e) => update("availability", e.target.value as VehicleFormValue["availability"])} className={imageInput}><option value="AVAILABLE">Disponible</option><option value="UNAVAILABLE">Indisponible</option><option value="MAINTENANCE">En entretien</option><option value="RESERVED">Réservée</option></select></label><label>Ordre d’affichage<input type="number" value={value.displayOrder} onChange={(e) => update("displayOrder", e.target.value)} className={imageInput} /></label><label className="flex items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.active} onChange={(e) => update("active", e.target.checked)} />Visible sur le site</label><label className="flex items-center gap-3 pt-6 font-bold"><input type="checkbox" checked={value.featured} onChange={(e) => update("featured", e.target.checked)} />Mettre en avant</label></div><p className="mt-3 text-sm text-slate-500">Une voiture masquée reste dans l’administration, mais disparaît du site public.</p></section>
    {message && <p role="alert" className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-[#0b5aa7]">{message}</p>}<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href="/admin/vehicles" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-[#10233c]">Annuler</Link><button type="submit" disabled={pending || uploading} className="min-h-12 rounded-xl bg-[#0b5aa7] px-5 text-sm font-bold text-white disabled:opacity-60">{pending ? "Enregistrement…" : vehicleId ? "Enregistrer les modifications" : "Ajouter la voiture"}</button></div>
  </form>;
}
