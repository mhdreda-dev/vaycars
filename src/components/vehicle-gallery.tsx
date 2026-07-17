"use client";

import Image from "next/image";
import { CarFront, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { isVercelBlobPublicUrl } from "@/lib/image-url";

type GalleryImage = { src: string; alt: string };

export function VehicleGallery({ images, vehicleName, rtl = false }: { images: GalleryImage[]; vehicleName: string; rtl?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hasImages = images.length > 0;
  const activeImage = images[activeIndex];
  const multiple = images.length > 1;
  const copy = rtl
    ? { previous: "الصورة اللي قبل", next: "الصورة اللي من بعد", open: "كبر الصورة", close: "سد الصورة", empty: `ما كايناش صورة ديال ${vehicleName}`, gallery: `صور ${vehicleName}`, image: "صورة" }
    : { previous: "Image précédente", next: "Image suivante", open: "Afficher en plein écran", close: "Fermer l’image", empty: `Aucune image disponible pour ${vehicleName}`, gallery: `Galerie de ${vehicleName}`, image: "Image" };

  const previous = useCallback(() => setActiveIndex((index) => (index - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActiveIndex((index) => (index + 1) % images.length), [images.length]);
  const markFailed = (src: string) => setFailedImages((current) => new Set(current).add(src));
  const imageUnavailable = !activeImage || failedImages.has(activeImage.src);

  function handleKeyboard(event: React.KeyboardEvent<HTMLElement>) {
    if (!multiple) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); if (rtl) next(); else previous(); }
    if (event.key === "ArrowRight") { event.preventDefault(); if (rtl) previous(); else next(); }
    if (event.key === "Home") { event.preventDefault(); setActiveIndex(0); }
    if (event.key === "End") { event.preventDefault(); setActiveIndex(images.length - 1); }
  }

  const visual = (fullscreen = false) => (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#edf5fb] via-white to-[#dce9f4] ${fullscreen ? "h-[min(78dvh,800px)] w-[min(92vw,1200px)]" : "aspect-[4/3] rounded-3xl sm:aspect-[16/10]"}`}>
      {hasImages && !imageUnavailable ? (
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          unoptimized={isVercelBlobPublicUrl(activeImage.src)}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          sizes={fullscreen ? "92vw" : "(max-width: 1024px) calc(100vw - 2rem), 58vw"}
          onError={() => markFailed(activeImage.src)}
          className="object-contain p-2 sm:p-4"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-slate-500"><div><CarFront aria-hidden="true" className="mx-auto size-12 text-slate-400" /><p className="mt-3 text-sm font-semibold">{copy.empty}</p></div></div>
      )}
    </div>
  );

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      <div role="group" aria-label={copy.gallery} tabIndex={multiple ? 0 : -1} onKeyDown={handleKeyboard} className="relative rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5aa7]">
        {visual()}
        {hasImages && <button type="button" onClick={() => dialogRef.current?.showModal()} aria-label={copy.open} className="absolute end-3 top-3 grid size-11 place-items-center rounded-xl border border-white/80 bg-white/90 text-[#10233c] shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]"><Expand aria-hidden="true" className="size-5" /></button>}
        {multiple && <>
          <button type="button" onClick={previous} aria-label={copy.previous} className="absolute start-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-[#10233c] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{rtl ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}</button>
          <button type="button" onClick={next} aria-label={copy.next} className="absolute end-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-[#10233c] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{rtl ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}</button>
        </>}
        {hasImages && <p aria-live="polite" className="absolute bottom-3 start-3 rounded-full bg-[#10233c]/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">{activeIndex + 1} / {images.length}</p>}
      </div>

      {multiple && <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" aria-label={copy.gallery}>{images.map((image, index) => <button key={`${image.src}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`${copy.image} ${index + 1} / ${images.length}`} aria-pressed={activeIndex === index} className={`relative aspect-[4/3] w-20 shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-slate-100 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] sm:w-24 ${activeIndex === index ? "border-[#0b5aa7] shadow-sm" : "border-transparent opacity-75 hover:opacity-100"}`}>{failedImages.has(image.src) ? <CarFront aria-hidden="true" className="absolute inset-0 m-auto size-6 text-slate-400" /> : <Image src={image.src} alt="" fill unoptimized={isVercelBlobPublicUrl(image.src)} loading="lazy" sizes="96px" onError={() => markFailed(image.src)} className="object-cover" />}</button>)}</div>}

      <dialog ref={dialogRef} aria-label={copy.gallery} className="m-auto max-h-none max-w-none overflow-visible rounded-2xl bg-transparent p-0 backdrop:bg-[#07172c]/90 backdrop:backdrop-blur-sm" onKeyDown={handleKeyboard}>
        <div className="relative rounded-2xl bg-white p-2 shadow-2xl sm:p-3">
          {visual(true)}
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label={copy.close} className="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-[#10233c] text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><X aria-hidden="true" /></button>
          {multiple && <><button type="button" onClick={previous} aria-label={copy.previous} className="absolute start-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#10233c] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{rtl ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}</button><button type="button" onClick={next} aria-label={copy.next} className="absolute end-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#10233c] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{rtl ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}</button></>}
        </div>
      </dialog>
    </div>
  );
}
