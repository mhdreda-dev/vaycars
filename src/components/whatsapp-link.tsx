import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppLink({ message, children, className = "", ...props }: { message: string; children: React.ReactNode; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={getWhatsAppUrl(message)} target="_blank" rel="noreferrer" className={className} {...props}><MessageCircle className="size-4" />{children}</a>;
}
