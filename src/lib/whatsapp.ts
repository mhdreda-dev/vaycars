const WHATSAPP_NUMBER = "212684040155";

export function getWhatsAppUrl(message: string, whatsappNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const generalWhatsAppMessage =
  "Bonjour Vay Cars Location, je souhaite obtenir plus d’informations concernant la location d’une voiture.";

export function getVehicleWhatsAppMessage(vehicleName: string, locale: "fr" | "ar" = "fr", unavailable = false) {
  if (unavailable) return locale === "ar" ? `السلام عليكم Vay Cars Location، أريد معلومات بخصوص ${vehicleName}. تظهر حالياً كغير متوفرة. هل يمكنكم اقتراح سيارة بديلة حسب التواريخ المطلوبة؟` : `Bonjour Vay Cars Location, je souhaite des informations concernant la ${vehicleName}. Elle est actuellement indiquée comme indisponible. Pouvez-vous me proposer une alternative pour mes dates ?`;
  return locale === "ar" ? `السلام عليكم Vay Cars Location، أريد معرفة الثمن والتوفر لسيارة ${vehicleName}.` : `Bonjour Vay Cars Location, je souhaite connaître le tarif et la disponibilité de la ${vehicleName}.`;
}
