"use client";

import { Check, Languages } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getRecommendedLocale,
  getSavedLocale,
  isPublicPath,
  replaceLocaleInPath,
  saveLocalePreference,
  type PublicLocale,
} from "@/lib/locale-preference";

const choices: Record<PublicLocale, { title: string; description: string; direction: "rtl" | "ltr" }> = {
  ar: { title: "الدارجة", description: "تصفح الموقع بالدارجة المغربية", direction: "rtl" },
  fr: { title: "Français", description: "Consulter le site en français", direction: "ltr" },
};

export function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const recommendedOptionRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [recommendedLocale, setRecommendedLocale] = useState<PublicLocale>("fr");
  const [selectingLocale, setSelectingLocale] = useState<PublicLocale | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!isPublicPath(pathname)) {
        setOpen(false);
        return;
      }

      setRecommendedLocale(getRecommendedLocale());
      setOpen(!getSavedLocale());
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const focusTimer = window.setTimeout(() => recommendedOptionRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  function chooseLocale(locale: PublicLocale) {
    if (selectingLocale) return;

    setSelectingLocale(locale);
    saveLocalePreference(locale);
    setOpen(false);
    router.push(replaceLocaleInPath(pathname, locale));
  }

  return <AnimatePresence>
    {open && <motion.div
      className="fixed inset-0 z-[100] flex items-end bg-[#07172c]/65 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-selector-title"
        aria-describedby="language-selector-description language-selector-guidance"
        className="w-full max-w-[35rem] rounded-[1.75rem] bg-white p-5 shadow-2xl sm:p-8"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#0b5aa7]/10 text-[#0b5aa7]"><Languages className="size-5" aria-hidden="true" /></span>
          <div>
            <h1 id="language-selector-title" className="text-xl font-black tracking-tight text-[#10233c] sm:text-2xl" lang="ar" dir="rtl">مرحبا بيك 👋</h1>
            <p id="language-selector-description" className="mt-1 text-sm leading-6 text-slate-600" lang="ar" dir="rtl">اختار اللغة اللي بغيتي تصفح بها موقع Vay Cars.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(Object.keys(choices) as PublicLocale[]).map((locale) => {
            const choice = choices[locale];
            const recommended = locale === recommendedLocale;
            const selecting = selectingLocale === locale;
            return <button
              key={locale}
              ref={recommended ? recommendedOptionRef : undefined}
              type="button"
              disabled={Boolean(selectingLocale)}
              onClick={() => chooseLocale(locale)}
              dir={choice.direction}
              aria-label={`${choice.title}. ${choice.description}${recommended ? locale === "ar" ? ". مقترحة" : ". Recommandé" : ""}`}
              className="group relative min-h-32 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-start transition hover:-translate-y-0.5 hover:border-[#0b5aa7]/40 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0b5aa7]/25 disabled:cursor-wait disabled:opacity-70"
            >
              {recommended && <span className="absolute end-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#0b5aa7]/10 px-2 py-1 text-[11px] font-bold text-[#0b5aa7]"><Check className="size-3" aria-hidden="true" />{locale === "ar" ? "مقترحة" : "Recommandé"}</span>}
              <span className="block text-lg font-black text-[#10233c]">{selecting ? "…" : choice.title}</span>
              <span className="mt-2 block max-w-48 text-sm leading-6 text-slate-600">{choice.description}</span>
            </button>;
          })}
        </div>

        <p id="language-selector-guidance" className="mt-5 text-center text-xs leading-5 text-slate-500" lang="ar" dir="rtl">تقدر تبدل اللغة فأي وقت من القائمة.</p>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}
