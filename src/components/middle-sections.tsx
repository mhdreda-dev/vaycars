"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Fuel,
  IdCard,
  Info,
  Phone,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { useRef } from "react";
import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "./whatsapp-link";

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };
const frenchConditions = [
  [
    BadgeCheck,
    "Permis de conduire valide",
    "Le conducteur doit présenter un permis de conduire valide.",
  ],
  [
    IdCard,
    "Pièce d’identité",
    "Une carte nationale d’identité ou un passeport valide peut être demandé.",
  ],
  [
    CalendarCheck,
    "Disponibilité confirmée",
    "La réservation est confirmée uniquement après vérification du véhicule et des dates.",
  ],
  [
    ShieldCheck,
    "Conditions de caution",
    "Les modalités de caution sont communiquées avant la confirmation.",
  ],
  [
    Fuel,
    "Carburant et restitution",
    "Les conditions de carburant et de retour du véhicule sont expliquées lors de la réservation.",
  ],
  [
    UserRoundCheck,
    "Âge minimum",
    "L’âge minimum requis doit être confirmé directement auprès de l’agence.",
  ],
] as const;
const arabicConditions = [
  [
    BadgeCheck,
    "رخصة قيادة سارية",
    "يجب على السائق تقديم رخصة قيادة سارية المفعول.",
  ],
  [
    IdCard,
    "وثيقة الهوية",
    "قد يُطلب تقديم البطاقة الوطنية أو جواز سفر ساري المفعول.",
  ],
  [
    CalendarCheck,
    "تأكيد التوفر",
    "لا يتم تأكيد الحجز إلا بعد التحقق من السيارة والتواريخ.",
  ],
  [ShieldCheck, "شروط الضمان", "يتم توضيح ترتيبات الضمان قبل تأكيد الحجز."],
  [
    Fuel,
    "الوقود وإرجاع السيارة",
    "يتم شرح شروط الوقود وإرجاع السيارة عند الحجز.",
  ],
  [
    UserRoundCheck,
    "السن الأدنى",
    "يجب تأكيد السن الأدنى المطلوب مباشرة مع الوكالة.",
  ],
] as const;

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RoadCtaSection({ rtl = false }: { rtl?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-2%", "2%"],
  );
  const copy = rtl
    ? {
        eyebrow: "راحتك في التنقل أولويتنا",
        title: "انطلق بسيارة مناسبة لرحلتك",
        description:
          "تنقل مهني، سفر عائلي أو حاجة مؤقتة: ترافقك Vay Cars بحل بسيط وعملي.",
        primary: "اطلب سيارة",
        secondary: "اكتشف سياراتنا",
        route: "/ar/cars",
      }
    : {
        eyebrow: "VOTRE MOBILITÉ, NOTRE PRIORITÉ",
        title: "Prenez la route avec une voiture adaptée à votre trajet",
        description:
          "Déplacement professionnel, voyage en famille ou besoin ponctuel : Vay Cars vous accompagne avec une solution simple et pratique.",
        primary: "Demander une voiture",
        secondary: "Voir notre flotte",
        route: "/fr/voitures",
      };
  return (
    <section
      ref={ref}
      className="relative isolate min-h-[460px] overflow-hidden sm:min-h-[520px] lg:min-h-[580px]"
      dir={rtl ? "rtl" : "ltr"}
    >
      <motion.div
        className="absolute -inset-y-5 inset-x-0"
        style={{ y: imageY, scale: reduceMotion ? 1 : 1.04 }}
        initial={{ opacity: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: "easeOut" }}
      >
        <Image
          src="/images/vay-cars-morocco-road.jpg"
          alt={
            rtl
              ? "سيارة اقتصادية على طريق مغربي"
              : "Voiture économique sur une route marocaine"
          }
          fill
          sizes="100vw"
          priority={false}
          className="object-cover object-[68%_center]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0.15 : 0.65 }}
        className="absolute inset-0 bg-gradient-to-r from-[#07182d]/88 via-[#07182d]/65 to-[#07182d]/20 rtl:bg-gradient-to-l"
      />
      <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-4 py-16 sm:min-h-[520px] sm:px-6 lg:min-h-[580px] lg:px-8">
        <SectionReveal className="max-w-xl text-white">
          <motion.p
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="text-xs font-bold uppercase tracking-[.18em] text-blue-200 sm:text-sm"
          >
            {copy.eyebrow}
          </motion.p>
          <motion.h2
            variants={reveal}
            transition={{ duration: 0.55 }}
            className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            {copy.title}
          </motion.h2>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.48 }}
            className="mt-5 max-w-lg leading-7 text-slate-200"
          >
            {copy.description}
          </motion.p>
          <motion.div
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <WhatsAppLink
              message={generalWhatsAppMessage}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#15803d]"
            >
              {copy.primary}
            </WhatsAppLink>
            <Link
              href={copy.route}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {copy.secondary}
              {rtl ? (
                <ArrowLeft className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Link>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}

export function AboutVayCarsSection({ rtl = false }: { rtl?: boolean }) {
  const reduceMotion = useReducedMotion();
  const copy = rtl
    ? {
        label: "عن Vay Cars",
        title: "وكالتك لكراء السيارات في سيدي قاسم",
        first:
          "Vay Cars Location هي وكالة لكراء السيارات مقرها سيدي قاسم. نوفر سيارات نظيفة وعملية ومريحة للتنقلات اليومية والمهنية والعائلية والسياحية.",
        second:
          "أولويتنا هي جعل الكراء بسيطاً وسريعاً وشفافاً عبر حجز مباشر على واتساب ومرافقة شخصية.",
        checklist: [
          "خدمة محلية في سيدي قاسم",
          "سيارات نظيفة وعملية",
          "تواصل سريع",
          "حجز مباشر",
          "مرافقة شخصية",
        ],
        help: "هل تحتاج إلى سيارة؟",
        contact: "تواصل معنا مباشرة للتحقق من التوفر حسب تواريخك.",
        whatsapp: "واتساب",
        call: "اتصل بنا",
      }
    : {
        label: "À PROPOS DE VAY CARS",
        title: "Votre agence de location de voitures à Sidi Kacem",
        first:
          "Vay Cars Location est une agence de location de voitures basée à Sidi Kacem. Nous proposons des véhicules propres, pratiques et confortables pour les déplacements quotidiens, professionnels, familiaux et touristiques.",
        second:
          "Notre priorité est de rendre la location simple, rapide et transparente grâce à une réservation directe sur WhatsApp et un accompagnement personnalisé.",
        checklist: [
          "Service local à Sidi Kacem",
          "Véhicules propres et pratiques",
          "Communication rapide",
          "Réservation directe",
          "Accompagnement personnalisé",
        ],
        help: "Besoin d’une voiture ?",
        contact:
          "Contactez-nous directement pour vérifier la disponibilité selon vos dates.",
        whatsapp: "WhatsApp",
        call: "Appeler",
      };
  return (
    <section
      id="apropos"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
      dir={rtl ? "rtl" : "ltr"}
    >
      <div
        aria-hidden="true"
        className="absolute -left-24 top-20 size-72 rounded-full bg-blue-100/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.7 }}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10 lg:order-2 rtl:lg:order-1"
        >
          <Image
            src="/images/vay-cars-key-handover.jpg"
            alt={
              rtl
                ? "تسليم مفاتيح سيارة في سيدي قاسم"
                : "Remise de clés d’une voiture à Sidi Kacem"
            }
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        <SectionReveal className="lg:order-1 rtl:lg:order-2">
          <motion.p
            variants={reveal}
            transition={{ duration: 0.42 }}
            className="text-sm font-bold uppercase tracking-[.16em] text-[#0b5aa7]"
          >
            {copy.label}
          </motion.p>
          <motion.h2
            variants={reveal}
            transition={{ duration: 0.55 }}
            className="mt-3 max-w-xl text-3xl font-black tracking-tight text-[#10233c] sm:text-4xl"
          >
            {copy.title}
          </motion.h2>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-5 max-w-xl leading-7 text-slate-600"
          >
            {copy.first}
          </motion.p>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-3 max-w-xl leading-7 text-slate-600"
          >
            {copy.second}
          </motion.p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {copy.checklist.map((item) => (
              <motion.div
                variants={reveal}
                transition={{ duration: 0.35 }}
                key={item}
                className="flex items-center gap-2 text-sm font-semibold text-[#10233c]"
              >
                <CheckCircle2 className="size-5 shrink-0 text-[#0b5aa7]" />
                {item}
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5"
          >
            <h3 className="font-bold text-[#10233c]">{copy.help}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {copy.contact}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink
                message={generalWhatsAppMessage}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#16a34a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#15803d]"
              >
                {copy.whatsapp}
              </WhatsAppLink>
              <a
                href="tel:+212684040155"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#10233c] transition hover:border-blue-200 hover:bg-blue-50"
              >
                <Phone className="size-4" />
                {copy.call}
              </a>
            </div>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}

export function RentalConditionsSection({ rtl = false }: { rtl?: boolean }) {
  const reduceMotion = useReducedMotion();
  const conditions = rtl ? arabicConditions : frenchConditions;
  const copy = rtl
    ? {
        label: "شروط الكراء",
        title: "معلومات واضحة قبل تأكيد الحجز",
        description:
          "يتم تأكيد الشروط الدقيقة وفق السيارة والمدة وفترة الكراء.",
        note: "قد تختلف الشروط حسب السيارة والمدة وفترة الكراء. تواصل مع Vay Cars Location قبل تأكيد حجزك.",
        cta: "اطلب الشروط عبر واتساب",
        message: "مرحباً Vay Cars Location، أود الحصول على شروط الكراء والتحقق من توفر سيارة.",
      }
    : {
        label: "CONDITIONS DE LOCATION",
        title: "Des informations claires avant votre réservation",
        description:
          "Les conditions exactes sont confirmées selon le véhicule, la durée et la période de location.",
        note: "Les conditions peuvent varier selon le véhicule, la durée et la période de location. Contactez Vay Cars Location avant de confirmer votre réservation.",
        cta: "Demander les conditions sur WhatsApp",
        message:
          "Bonjour Vay Cars Location, je souhaite recevoir les conditions de location et vérifier la disponibilité d’un véhicule.",
      };
  return (
    <section className="bg-[#f5f8fb] py-20 sm:py-24" dir={rtl ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.42 }}
            className="text-sm font-bold uppercase tracking-[.16em] text-[#0b5aa7]"
          >
            {copy.label}
          </motion.p>
          <motion.h2
            variants={reveal}
            transition={{ duration: 0.55 }}
            className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-[#10233c] sm:text-4xl"
          >
            {copy.title}
          </motion.h2>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-4 max-w-2xl leading-7 text-slate-600"
          >
            {copy.description}
          </motion.p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conditions.map(([Icon, title, description], index) => (
              <motion.article
                variants={reveal}
                transition={{ duration: 0.4 }}
                whileHover={reduceMotion ? {} : { y: -4 }}
                key={title}
                className="group min-h-[196px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-[#0b5aa7] transition group-hover:bg-blue-100">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-slate-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#10233c]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
          <motion.div
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-[#10233c]"
          >
            <Info className="mb-2 size-5 text-[#0b5aa7]" />
            <p className="font-semibold">{copy.note}</p>
          </motion.div>
          <motion.div
            variants={reveal}
            transition={{ duration: 0.45 }}
            className="mt-7"
          >
            <WhatsAppLink
              message={copy.message}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#15803d]"
            >
              {copy.cta}
            </WhatsAppLink>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
