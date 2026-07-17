import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageSelector } from "@/components/language-selector";
import { AgencySettingsProvider } from "@/components/agency-settings-provider";
import { getAgencySettings } from "@/lib/getAgencySettings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAgencySettings();
  return { title: settings.seoTitle, description: settings.seoDescription, keywords: settings.seoKeywords, openGraph: { title: settings.seoTitle, description: settings.seoDescription, siteName: settings.agencyName, type: "website", locale: "fr_MA", images: [settings.heroImageUrl] }, twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription, images: [settings.heroImageUrl] } };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAgencySettings();
  const sameAs = [settings.googleMapsUrl, settings.instagramUrl, settings.facebookUrl].filter(Boolean);
  const jsonLd = { "@context": "https://schema.org", "@type": "AutoRental", name: settings.agencyName, telephone: settings.phone || undefined, email: settings.email || undefined, image: settings.heroImageUrl, logo: settings.logoUrl || undefined, address: { "@type": "PostalAddress", streetAddress: settings.address, addressLocality: settings.city, addressCountry: settings.country }, openingHours: settings.businessHours, sameAs: sameAs.length ? sameAs : undefined };
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><AgencySettingsProvider settings={settings}>{children}<LanguageSelector /></AgencySettingsProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></body>
    </html>
  );
}
