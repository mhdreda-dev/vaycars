"use client";

import { MessageCircle } from "lucide-react";
import { generalWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { useAgencySettings } from "./agency-settings-provider";

export function WhatsAppLink({ message, children, className = "", includeCurrentUrl = false, currentUrlLabel = "Page", onClick, ...props }: { message: string; children: React.ReactNode; className?: string; includeCurrentUrl?: boolean; currentUrlLabel?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { defaultWhatsappMessage, whatsappNumber } = useAgencySettings();
  if (!whatsappNumber) return null;
  const resolvedMessage = message === generalWhatsAppMessage ? defaultWhatsappMessage : message;
  return <a href={getWhatsAppUrl(resolvedMessage, whatsappNumber)} target="_blank" rel="noreferrer" className={className} onClick={(event) => { onClick?.(event); if (event.defaultPrevented || !includeCurrentUrl) return; event.preventDefault(); const messageWithUrl = `${resolvedMessage}\n${currentUrlLabel} : ${window.location.href}`; window.open(getWhatsAppUrl(messageWithUrl, whatsappNumber), "_blank", "noopener,noreferrer"); }} {...props}><MessageCircle aria-hidden="true" className="size-4 shrink-0" />{children}</a>;
}
