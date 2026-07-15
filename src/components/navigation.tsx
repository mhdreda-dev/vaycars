"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "./whatsapp-link";

const navItems = [["Accueil", "#accueil"], ["Nos voitures", "#voitures"], ["Comment ça marche", "#fonctionnement"], ["Pourquoi nous choisir", "#avantages"], ["À propos", "#apropos"], ["FAQ", "#faq"], ["Contact", "#contact"]];

export function Navigation({ rtl = false, hero = false }: { rtl?: boolean; hero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const home = rtl ? "/ar" : "/fr";
  useEffect(() => { const update = () => setScrolled(window.scrollY > 40); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  const compact = scrolled || !hero;
  return <motion.header initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${compact ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md" : "border-b border-transparent bg-white/55 backdrop-blur-sm"}`}>
    <nav className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${compact ? "h-16" : "h-[4.5rem]"}`} aria-label="Navigation principale">
      <Link href={home} className="flex items-center gap-2.5"><span className="grid size-10 place-items-center rounded-xl bg-[#0b5aa7] text-base font-black text-white">V</span><span className="leading-tight"><b className="block text-base tracking-tight text-[#10233c]">Vay Cars</b><small className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">Location</small></span></Link>
      <div className="hidden items-center gap-5 xl:flex">{navItems.map(([label, href]) => <a className="text-sm font-medium text-slate-600 transition hover:text-[#0b5aa7]" href={href} key={label}>{rtl ? "الرئيسية" : label}</a>)}<Link href={rtl ? "/fr" : "/ar"} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-600">{rtl ? "FR" : "العربية"}</Link><WhatsAppLink message={generalWhatsAppMessage} className="flex items-center gap-2 rounded-xl bg-[#16a34a] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#15803d]">{rtl ? "احجز الآن" : "Réserver maintenant"}</WhatsAppLink></div>
      <button aria-label="Ouvrir le menu" onClick={() => setOpen(!open)} className="grid size-11 place-items-center rounded-xl border border-slate-200 text-[#10233c] xl:hidden">{open ? <X /> : <Menu />}</button>
    </nav>
    {open && <div className="border-t bg-white px-5 py-5 shadow-xl xl:hidden"><div className="flex flex-col gap-1">{navItems.map(([label, href]) => <a onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50" href={href} key={label}>{rtl ? "الرئيسية" : label}</a>)}<Link href={rtl ? "/fr" : "/ar"} className="rounded-xl px-4 py-3 font-semibold text-slate-700">{rtl ? "Français" : "العربية"}</Link><WhatsAppLink message={generalWhatsAppMessage} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3.5 font-bold text-white"><Phone className="size-4" />{rtl ? "احجز عبر واتساب" : "Réserver sur WhatsApp"}</WhatsAppLink></div></div>}
  </motion.header>;
}
