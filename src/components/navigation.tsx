"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { replaceLocaleInPath, saveLocalePreference } from "@/lib/locale-preference";
import { WhatsAppLink } from "./whatsapp-link";
import { useAgencySettings } from "./agency-settings-provider";

export function Navigation({ rtl = false, hero = false }: { rtl?: boolean; hero?: boolean }) {
  const settings = useAgencySettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const home = rtl ? "/ar" : "/fr";
  const targetLocale = rtl ? "fr" : "ar";
  const languageHref = replaceLocaleInPath(pathname, targetLocale);
  const visibleNavItems = rtl ? [["الرئيسية", home], ["الطوموبيلات", "/ar/cars"], ["كيفاش كاتخدم", `${home}#fonctionnement`], ["علاش Vay Cars", `${home}#avantages`], ["علينا", "/ar/about"], ["الأسئلة", "/ar/faq"], ["تاصل بينا", "/ar/contact"]] : [["Accueil", home], ["Nos voitures", "/fr/voitures"], ["Comment ça marche", `${home}#fonctionnement`], ["Pourquoi nous choisir", `${home}#avantages`], ["À propos", "/fr/a-propos"], ["FAQ", "/fr/faq"], ["Contact", "/fr/contact"]];
  useEffect(() => { const update = () => setScrolled(window.scrollY > 40); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  const compact = scrolled || !hero;
  return <motion.header initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${compact ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md" : "border-b border-transparent bg-white/55 backdrop-blur-sm"}`}>
    <nav className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${compact ? "h-16" : "h-[4.5rem]"}`} aria-label={rtl ? "القائمة الرئيسية" : "Navigation principale"}>
      <Link href={home} aria-label={`${settings.agencyName} — ${rtl ? "الرئيسية" : "Accueil"}`} className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{settings.logoUrl ? <Image src={settings.logoUrl} alt="" width={40} height={40} unoptimized className="size-10 shrink-0 rounded-xl object-contain" /> : <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#0b5aa7] text-base font-black text-white">V</span>}<span className="min-w-0 leading-tight"><b className="block max-w-48 truncate text-base tracking-tight text-[#10233c]">{settings.agencyName}</b><small className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">Location</small></span></Link>
      <div className="hidden items-center gap-3 xl:flex 2xl:gap-5">{visibleNavItems.map(([label, href]) => { const route = href.split("#")[0]; const active = !href.includes("#") && pathname === route; return <Link aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-md px-1 py-2 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] 2xl:text-sm ${active ? "text-[#0b5aa7]" : "text-slate-600 hover:text-[#0b5aa7]"}`} href={href} key={label}>{label}</Link>; })}<Link href={languageHref} onClick={() => saveLocalePreference(targetLocale)} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{rtl ? "FR" : "العربية"}</Link>{settings.whatsappNumber && <WhatsAppLink message={generalWhatsAppMessage} className="flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#16a34a] px-3 text-[13px] font-bold text-white shadow-sm hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] 2xl:px-4 2xl:text-sm">{rtl ? "حجز فالواتساب" : "Réserver"}</WhatsAppLink>}</div>
      <button type="button" aria-label={open ? (rtl ? "سد القائمة" : "Fermer le menu") : (rtl ? "حل القائمة" : "Ouvrir le menu")} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-300 text-[#10233c] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] xl:hidden">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </nav>
    {open && <div id="mobile-navigation" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-white px-4 py-4 shadow-xl xl:hidden"><div className="flex flex-col gap-1">{visibleNavItems.map(([label, href]) => <Link onClick={() => setOpen(false)} className="min-h-11 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b5aa7]" href={href} key={label}>{label}</Link>)}<Link href={languageHref} onClick={() => { saveLocalePreference(targetLocale); setOpen(false); }} className="min-h-11 rounded-xl px-4 py-3 font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b5aa7]">{rtl ? "Français" : "العربية"}</Link>{settings.whatsappNumber && <WhatsAppLink message={generalWhatsAppMessage} className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7]">{rtl ? "حجز فالواتساب" : "Réserver sur WhatsApp"}</WhatsAppLink>}</div></div>}
  </motion.header>;
}
