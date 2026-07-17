export function getWhatsAppUrl(message: string, whatsappNumber: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const generalWhatsAppMessage =
  "Bonjour Vay Cars Location, je souhaite obtenir plus d’informations concernant la location d’une voiture.";

export function getVehicleWhatsAppMessage(vehicleName: string, locale: "fr" | "ar" = "fr", unavailable = false, agencyName = "Vay Cars Location") {
  if (unavailable) return locale === "ar" ? `سلام ${agencyName}، بغيت نسول على ${vehicleName}. باينة دابا ما متوفراش، واش كاين شي طوموبيل أخرى للتواريخ ديالي؟` : `Bonjour ${agencyName}, je souhaite des informations concernant la ${vehicleName}. Elle est actuellement indiquée comme indisponible. Pouvez-vous me proposer une alternative pour mes dates ?`;
  return locale === "ar" ? `سلام ${agencyName}، بغيت نعرف الثمن والتوفر ديال ${vehicleName}.` : `Bonjour ${agencyName}, je souhaite connaître le tarif et la disponibilité de la ${vehicleName}.`;
}
