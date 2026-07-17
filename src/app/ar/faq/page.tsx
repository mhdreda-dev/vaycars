import { FaqSection } from "@/components/faq-section";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";

export default function ArabicFaqPage() {
  return <div dir="rtl"><Navigation rtl /><main><FaqSection rtl /></main><SiteFooter rtl /></div>;
}
