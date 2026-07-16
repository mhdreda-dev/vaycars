"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Handshake, Info, MessageCircle } from "lucide-react";

const frenchCommitments = [
  [Info, "Informations transparentes", "Les conditions importantes sont communiquées avant la confirmation de votre réservation."],
  [MessageCircle, "Réponse rapide", "Les demandes de disponibilité et de tarif sont traitées directement sur WhatsApp."],
  [BadgeCheck, "Véhicules préparés", "Chaque véhicule est vérifié et préparé avant sa remise au client."],
  [Handshake, "Accompagnement personnalisé", "L’agence reste disponible pour vous guider avant et pendant votre location."],
] as const;

const arabicCommitments = [
  [Info, "معلومات واضحة", "كنوضحو ليك الشروط المهمة قبل ما تأكد الحجز."],
  [MessageCircle, "جواب سريع", "طلبات التوفر والثمن كنردو عليها مباشرة فالواتساب."],
  [BadgeCheck, "طوموبيلات واجدين", "كل طوموبيل كتتراجع وكتوجد قبل ما تسلمها."],
  [Handshake, "مواكبة ديالك", "Vay Cars كيبقا معاك قبل وفمدة الكراء."],
] as const;

export function CommitmentsSection({ rtl = false }: { rtl?: boolean }) {
  const reduceMotion = useReducedMotion();
  const copy = rtl
    ? { label: "التزامات ديالنا", title: "خدمة واضحة من أول حجز", description: "Vay Cars كيلتازم يعطيك معلومات واضحة، تواصل سريع وطوموبيلات واجدين للمشوار ديالك." }
    : { label: "NOS ENGAGEMENTS", title: "Un service clair dès votre première réservation", description: "Vay Cars Location s’engage à vous accompagner avec des informations claires, une communication rapide et des véhicules préparés pour votre trajet." };
  const commitments = rtl ? arabicCommitments : frenchCommitments;

  return <section className="bg-[#f1f5f8] py-10 sm:py-24" dir={rtl ? "rtl" : "ltr"}>
    <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}>
      <motion.p variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }} className="text-sm font-bold uppercase tracking-[.16em] text-[#0b5aa7]">{copy.label}</motion.p>
      <motion.h2 variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }} className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-[#10233c] sm:text-4xl">{copy.title}</motion.h2>
      <motion.p variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.45 }} className="mt-4 max-w-2xl leading-7 text-slate-600">{copy.description}</motion.p>
      <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
        {commitments.map(([Icon, title, description], index) => <motion.article key={title} variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.42, delay: reduceMotion ? 0 : index * 0.03 }} className="flex min-h-[190px] w-[82vw] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,35,60,.06)] sm:min-h-[216px] sm:w-auto sm:max-w-none sm:p-6">
          <motion.div initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.12 + index * 0.08 }} className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#0b5aa7]"><Icon className="size-6" /></motion.div>
          <h3 className="mt-5 text-lg font-bold text-[#10233c]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </motion.article>)}
      </div>
    </motion.div>
  </section>;
}
