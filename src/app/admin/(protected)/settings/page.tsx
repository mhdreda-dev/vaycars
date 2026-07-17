import { SettingsForm } from "@/components/admin/settings-form";
import { getCatalogueFilters } from "@/lib/catalogue-filters";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  await requireAdmin();
  const [settings, economyCategory] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site-settings" } }),
    prisma.vehicleCategory.findUnique({ where: { slug: "economique" }, select: { id: true } }),
  ]);
  const initial = {
    agencyName: settings?.agencyName ?? "Vay Cars", phone: settings?.phone ?? "", whatsappNumber: settings?.whatsappNumber ?? "", city: settings?.city ?? "Sidi Kacem", country: settings?.country ?? "Morocco", shortDescriptionFr: settings?.shortDescriptionFr ?? "", shortDescriptionAr: settings?.shortDescriptionAr ?? "", email: settings?.email ?? "", cityAr: settings?.cityAr ?? "سيدي قاسم", addressFr: settings?.addressFr ?? "", addressAr: settings?.addressAr ?? "", googleMapsUrl: settings?.googleMapsUrl ?? "", instagramUrl: settings?.instagramUrl ?? "", facebookUrl: settings?.facebookUrl ?? "", logoUrl: settings?.logoUrl ?? "", heroImageUrl: settings?.heroImageUrl ?? "", seoTitleFr: settings?.seoTitleFr ?? "", seoTitleAr: settings?.seoTitleAr ?? "", seoDescriptionFr: settings?.seoDescriptionFr ?? "", seoDescriptionAr: settings?.seoDescriptionAr ?? "", businessHoursFr: settings?.businessHoursFr ?? "", businessHoursAr: settings?.businessHoursAr ?? "", defaultWhatsappFr: settings?.defaultWhatsappFr ?? "", defaultWhatsappAr: settings?.defaultWhatsappAr ?? "", floatingWhatsappActive: settings?.floatingWhatsappActive ?? true, catalogueFilters: getCatalogueFilters(settings?.catalogueFilters),
  };
  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><h1 className="text-3xl font-black text-[#10233c]">Paramètres de l’agence</h1><p className="mt-2 text-sm text-slate-600">Mettez à jour les informations publiques de Vay Cars.</p><div className="mt-7"><SettingsForm initial={initial} economyCategoryExists={Boolean(economyCategory)} /></div></main>;
}
