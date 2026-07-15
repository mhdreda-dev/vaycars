"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "./whatsapp-link";

const frenchFaqs = [
  ["Comment connaître le tarif d’une voiture ?", "Le tarif est communiqué après vérification de vos dates, de la durée, du véhicule choisi et de sa disponibilité. Contactez-nous sur WhatsApp pour recevoir une proposition adaptée."],
  ["Pourquoi les prix ne sont-ils pas affichés ?", "Les tarifs peuvent varier selon la saison, la durée de location, les dates et la disponibilité du véhicule. Nous préférons vous communiquer un tarif actualisé."],
  ["Comment vérifier la disponibilité d’un véhicule ?", "Indiquez le véhicule souhaité, la date de départ et la date de retour dans le formulaire ou directement sur WhatsApp."],
  ["Quels documents peuvent être demandés ?", "Un permis de conduire valide ainsi qu’une carte nationale d’identité ou un passeport peuvent être demandés. Les documents exacts sont confirmés avant la réservation."],
  ["Puis-je réserver directement sur WhatsApp ?", "Oui. Vous pouvez envoyer vos dates, le modèle souhaité et les lieux de départ et de retour directement à Vay Cars Location sur WhatsApp."],
  ["Puis-je louer une voiture pour plusieurs jours ?", "Oui. La durée souhaitée doit être indiquée lors de votre demande afin de vérifier la disponibilité et de calculer le tarif correspondant."],
  ["Où puis-je récupérer la voiture ?", "Le lieu de récupération est confirmé avec l’agence selon votre demande et la disponibilité du véhicule. Vay Cars Location est basée à Sidi Kacem."],
  ["Puis-je modifier mes dates après ma demande ?", "Oui, sous réserve de disponibilité. Contactez rapidement l’agence pour vérifier les nouvelles dates."],
  ["Comment confirmer la réservation ?", "La réservation est confirmée après validation du véhicule, des dates, du tarif et des conditions avec l’agence."],
] as const;
const arabicFaqs = [
  ["كيف يمكنني معرفة ثمن السيارة؟", "يتم إبلاغك بالثمن بعد التحقق من تواريخك ومدة الكراء والسيارة المختارة وتوفرها. تواصل معنا عبر واتساب للحصول على عرض مناسب."],
  ["لماذا لا يتم عرض الأثمان؟", "قد تختلف الأثمان حسب الموسم ومدة الكراء والتواريخ وتوفر السيارة. لذلك نفضل تزويدك بثمن محدّث."],
  ["كيف أتحقق من توفر سيارة؟", "أرسل السيارة التي ترغب فيها وتاريخ الانطلاق وتاريخ العودة عبر النموذج أو مباشرة على واتساب."],
  ["ما الوثائق التي قد تُطلب؟", "قد يُطلب رخصة سياقة سارية وبطاقة وطنية أو جواز سفر. يتم تأكيد الوثائق المطلوبة قبل الحجز."],
  ["هل يمكنني الحجز مباشرة عبر واتساب؟", "نعم. أرسل تواريخك والطراز المطلوب ومكان الانطلاق والعودة مباشرة إلى Vay Cars Location عبر واتساب."],
  ["هل يمكنني كراء سيارة لعدة أيام؟", "نعم. اذكر المدة المطلوبة عند إرسال طلبك للتحقق من التوفر واحتساب الثمن المناسب."],
  ["أين يمكنني استلام السيارة؟", "يتم تأكيد مكان الاستلام مع الوكالة حسب طلبك وتوفر السيارة. Vay Cars Location متواجدة في سيدي قاسم."],
  ["هل يمكنني تعديل تواريخي بعد الطلب؟", "نعم، حسب التوفر. تواصل بسرعة مع الوكالة للتحقق من التواريخ الجديدة."],
  ["كيف يتم تأكيد الحجز؟", "يتم تأكيد الحجز بعد الاتفاق مع الوكالة على السيارة والتواريخ والثمن والشروط."],
] as const;

export function FaqSection({ rtl = false }: { rtl?: boolean }) {
  const [open, setOpen] = useState(0); const baseId = useId(); const reduceMotion = useReducedMotion();
  const copy = rtl ? { label: "الأسئلة الشائعة", title: "كل ما تحتاج معرفته قبل الحجز", description: "اطّلع على أجوبة الأسئلة الأكثر شيوعاً حول الأثمان والتوفر وشروط الكراء.", cta: "هل لديك سؤال آخر؟ تواصل معنا عبر واتساب" } : { label: "QUESTIONS FRÉQUENTES", title: "Tout ce qu’il faut savoir avant de réserver", description: "Retrouvez les réponses aux questions les plus fréquentes concernant les tarifs, la disponibilité et les conditions de location.", cta: "Vous avez une autre question ? Contactez-nous sur WhatsApp" };
  const faqs = rtl ? arabicFaqs : frenchFaqs;
  return <section id="faq" className="bg-[#f1f5f8] py-20 sm:py-24" dir={rtl ? "rtl" : "ltr"}><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:px-8">
    <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48 }}><p className="text-sm font-bold uppercase tracking-[.16em] text-[#0b5aa7]">{copy.label}</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#10233c] sm:text-4xl">{copy.title}</h2><p className="mt-4 leading-7 text-slate-600">{copy.description}</p><WhatsAppLink message={generalWhatsAppMessage} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#10233c] shadow-sm transition hover:border-blue-200 hover:shadow-md">{copy.cta}</WhatsAppLink></motion.div>
    <div className="space-y-3">{faqs.map(([question, answer], index) => { const isOpen = open === index; const panelId = `${baseId}-panel-${index}`; return <article key={question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,35,60,.04)]"><h3><button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={panelId} className="flex min-h-16 w-full items-center justify-between gap-5 px-5 py-4 text-start font-bold text-[#10233c] outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0b5aa7]"><span>{question}</span><ChevronDown className={`size-5 shrink-0 text-[#0b5aa7] transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" /></button></h3><AnimatePresence initial={false}>{isOpen && <motion.div id={panelId} role="region" aria-label={question} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: "easeOut" }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-6 text-slate-600">{answer}</p></motion.div>}</AnimatePresence></article>; })}</div>
  </div></section>;
}
