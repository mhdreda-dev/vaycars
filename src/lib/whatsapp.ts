const WHATSAPP_NUMBER = "212684040155";

export function getWhatsAppUrl(message: string, whatsappNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const generalWhatsAppMessage =
  "Bonjour Vay Cars Location, je souhaite obtenir plus d’informations concernant la location d’une voiture.";

export function getVehicleWhatsAppMessage(vehicleName: string, locale: "fr" | "ar" = "fr", unavailable = false) {
  if (unavailable) return locale === "ar" ? `سلام Vay Cars، بغيت نسول على ${vehicleName}. باينة دابا ما متوفراش، واش كاين شي طوموبيل أخرى للتواريخ ديالي؟` : `Bonjour Vay Cars Location, je souhaite des informations concernant la ${vehicleName}. Elle est actuellement indiquée comme indisponible. Pouvez-vous me proposer une alternative pour mes dates ?`;
  return locale === "ar" ? `سلام Vay Cars، بغيت نعرف الثمن والتوفر ديال ${vehicleName}.` : `Bonjour Vay Cars Location, je souhaite connaître le tarif et la disponibilité de la ${vehicleName}.`;
}
