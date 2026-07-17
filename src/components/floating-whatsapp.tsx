"use client";

import { generalWhatsAppMessage } from "@/lib/whatsapp";
import { useAgencySettings } from "./agency-settings-provider";
import { WhatsAppLink } from "./whatsapp-link";

export function FloatingWhatsApp({ rtl = false }: { rtl?: boolean }) {
  const { floatingWhatsappActive, whatsappNumber } = useAgencySettings();
  if (!floatingWhatsappActive || !whatsappNumber) return null;
  return <WhatsAppLink message={generalWhatsAppMessage} className="fixed bottom-5 end-5 z-40 hidden size-14 place-items-center rounded-full bg-[#16a34a] text-white shadow-xl ring-4 ring-white/80 transition hover:-translate-y-0.5 hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5aa7] motion-reduce:transform-none md:grid [&>svg]:size-6" aria-label={rtl ? "تاصل مع Vay Cars فالواتساب" : "Contacter Vay Cars sur WhatsApp"}><span className="sr-only">WhatsApp</span></WhatsAppLink>;
}
