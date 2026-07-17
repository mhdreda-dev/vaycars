"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CarFront, Check, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "./whatsapp-link";
import { useAgencySettings } from "./agency-settings-provider";
import { AnimatedGridPattern } from "./magicui/animated-grid-pattern";
import { ShimmerButton } from "./magicui/shimmer-button";


const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ rtl = false }: { rtl?: boolean }) {
  const settings = useAgencySettings();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const vehicleY = useTransform(scrollY, [0, 680], [0, reduceMotion ? 0 : -24]);
  const vehicleOpacity = useTransform(scrollY, [0, 680], [1, reduceMotion ? 1 : 0.88]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const copy = rtl ? {
    badge: `كرا الطوموبيلات ف${settings.city}`, title: <>كري الطوموبيل ديالك بسهولة مع <span className="text-[#0b5aa7]">{settings.agencyName}</span></>, description: `طوموبيلات نقية، مزيانة واقتصادية للتنقل ديالك ف${settings.city} وف${settings.country} كامل.`, cars: "شوف واش متوفرة", whatsapp: "حجز فالواتساب", notice: "الثمن كيتحدد على حساب التواريخ ديالك والتوفر.", trust: [[CarFront, "طوموبيلات نقية"], [MessageCircle, "جواب سريع"], [MapPin, "خدمة قريبة"], [Check, "حجز ساهل"]] as const, cards: [[MessageCircle, "حجز سريع", "كنجاوبوك مباشرة فالواتساب", "right-0 top-12"], [MapPin, "خدمة قريبة", `${settings.city}، ${settings.country}`, "left-0 top-1/2"], [ShieldCheck, "طوموبيلات مزيانين", "نقا ومصانين", "bottom-2 right-10"]] as const,
  } : {
    badge: `LOCATION DE VOITURES À ${settings.city.toUpperCase()}`, title: <>Louez votre voiture simplement avec <span className="text-[#0b5aa7]">{settings.agencyName}</span></>, description: `Des véhicules propres, fiables et économiques pour vos déplacements à ${settings.city} et partout au ${settings.country}.`, cars: "Vérifier les disponibilités", whatsapp: "Réserver sur WhatsApp", notice: "Tarif communiqué selon vos dates et la disponibilité du véhicule.", trust: [[CarFront, "Véhicules propres"], [MessageCircle, "Réponse rapide"], [MapPin, "Service local"], [Check, "Réservation simple"]] as const, cards: [[MessageCircle, "Réservation rapide", "Réponse directe sur WhatsApp", "left-0 top-12"], [MapPin, "Service local", `${settings.city}, ${settings.country}`, "right-0 top-1/2"], [ShieldCheck, "Véhicules fiables", "Propres et entretenus", "bottom-2 left-10"]] as const,
  };
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) / 30);
    pointerY.set((event.clientY - rect.top - rect.height / 2) / 36);
  }
  function resetPointer() { pointerX.set(0); pointerY.set(0); }
  return <section id="accueil" className="relative overflow-hidden bg-[#f3f8fc]" dir={rtl ? "rtl" : "ltr"}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute -right-24 -top-44 size-[32rem] rounded-full bg-blue-200/30 blur-3xl"/><div className="absolute -bottom-36 -left-28 size-[24rem] rounded-full bg-[#e8d9bd]/25 blur-3xl"/><AnimatedGridPattern width={46} height={46} numSquares={18} maxOpacity={0.17} duration={4.5} repeatDelay={1.2} className="fill-[#0b5aa7]/30 stroke-[#0b5aa7]/25" /></div>
    <div className="relative mx-auto grid max-w-7xl items-center gap-7 px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:grid-cols-[.9fr_1fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-16">
      <motion.div className="relative z-10 min-w-0 self-center" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 } } }}>
        <motion.p variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.48, ease }} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-bold tracking-wide text-[#0b5aa7] shadow-sm backdrop-blur-sm"><MapPin className="size-3.5"/>{copy.badge}</motion.p>
        <motion.h1 variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.65, ease }} className="mt-4 max-w-none text-[1.9rem] font-black leading-[1.1] tracking-tight text-[#10233c] min-[360px]:text-4xl sm:mt-5 sm:max-w-xl sm:text-5xl lg:text-[3.35rem]">{copy.title}</motion.h1>
        <motion.p variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, ease }} className="mt-4 max-w-xl text-[0.98rem] leading-7 text-slate-600 sm:mt-5 sm:text-[1.05rem] sm:leading-8">{copy.description}</motion.p>
        <motion.div variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.48, ease }} className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3"><ShimmerButton href="#reservation" shimmerColor="#bfe4ff" background="#0b5aa7" borderRadius="0.75rem" className="min-h-12 px-5 text-center font-bold shadow-lg shadow-blue-900/15 hover:-translate-y-0.5 hover:bg-[#084a8a] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] motion-reduce:transform-none">{copy.cars} <ArrowRight aria-hidden="true" className={`size-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${rtl ? "rotate-180" : ""}`}/></ShimmerButton><WhatsAppLink message={generalWhatsAppMessage} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-5 py-3 text-center font-bold text-[#10233c] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] motion-reduce:transform-none">{copy.whatsapp}</WhatsAppLink></motion.div>
        <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: 0.45, ease }} className="mt-4 text-sm font-medium text-slate-500 sm:mt-5">{copy.notice}</motion.p>
        <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 text-sm font-semibold text-slate-600 sm:mt-7 sm:gap-y-3 sm:grid-cols-4">{copy.trust.map(([Icon, label]) => <motion.p variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.38, ease }} className="flex items-center gap-1.5" key={label}><Icon className="size-4 shrink-0 text-[#16a34a]"/>{label}</motion.p>)}</motion.div>
      </motion.div>
      <motion.div className="relative mx-auto w-full max-w-[600px] min-w-0 lg:max-w-none" style={{ y: vehicleY, opacity: vehicleOpacity }} initial={{ opacity: 0, x: reduceMotion ? 0 : 32, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.96 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: 0.62, delay: 0.16, ease }} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div className="relative aspect-[16/9] overflow-visible sm:aspect-[16/10]"><div aria-hidden="true" className="absolute inset-[7%] rounded-[2rem] bg-gradient-to-br from-blue-100 to-white shadow-[0_24px_70px_rgba(16,35,60,.12)] sm:rounded-[2.4rem]"/><motion.div className="absolute inset-0" animate={reduceMotion ? {} : { y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><motion.div className="absolute inset-0" style={{ x: pointerX, y: pointerY }} transition={{ type: "spring", stiffness: 130, damping: 18 }}><Image src={settings.heroImageUrl} alt={rtl ? `طوموبيل متوفرة عند ${settings.agencyName}` : `Véhicule disponible chez ${settings.agencyName}`} fill unoptimized loading="eager" fetchPriority="high" sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 80vw, 52vw" className="rounded-[1.75rem] object-cover shadow-[0_20px_50px_rgba(16,35,60,.18)] sm:rounded-[2.2rem]"/></motion.div></motion.div>
          <div className="pointer-events-none absolute inset-0 hidden lg:block">{copy.cards.map(([Icon, title, text, position], index) => <motion.div key={title} initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.72 + index * 0.12, ease }} className={`absolute ${position} max-w-[180px] rounded-2xl border border-white/80 bg-white/85 px-3.5 py-3 shadow-lg backdrop-blur-sm`}><div className="flex gap-2"><Icon className="mt-0.5 size-4 shrink-0 text-[#0b5aa7]"/><div><p className="text-xs font-bold text-[#10233c]">{title}</p><p className="mt-0.5 text-[11px] leading-4 text-slate-500">{text}</p></div></div></motion.div>)}</div>
        </div>
      </motion.div>
    </div>
  </section>;
}
