export type PublicLocale = "ar" | "fr";

export const localePreferenceKey = "vaycars-locale";
const oneYearInSeconds = 60 * 60 * 24 * 365;

function isPublicLocale(value: string | null | undefined): value is PublicLocale {
  return value === "ar" || value === "fr";
}

function getLocaleFromCookie() {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${localePreferenceKey}=`))
    ?.split("=")[1];

  return isPublicLocale(value) ? value : null;
}

export function getSavedLocale(): PublicLocale | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(localePreferenceKey);
  return isPublicLocale(stored) ? stored : getLocaleFromCookie();
}

export function saveLocalePreference(locale: PublicLocale) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(localePreferenceKey, locale);
  document.cookie = `${localePreferenceKey}=${locale}; Path=/; Max-Age=${oneYearInSeconds}; SameSite=Lax`;
}

export function clearLocalePreference() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(localePreferenceKey);
  document.cookie = `${localePreferenceKey}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function getRecommendedLocale(language = typeof navigator === "undefined" ? "" : navigator.language): PublicLocale {
  const normalizedLanguage = language.toLowerCase();
  if (normalizedLanguage.startsWith("ar")) return "ar";
  return "fr";
}

const frenchToArabicPaths: Record<string, string> = {
  "/fr": "/ar",
  "/fr/voitures": "/ar/cars",
  "/fr/a-propos": "/ar/about",
  "/fr/contact": "/ar/contact",
};

const arabicToFrenchPaths: Record<string, string> = {
  "/ar": "/fr",
  "/ar/cars": "/fr/voitures",
  "/ar/about": "/fr/a-propos",
  "/ar/contact": "/fr/contact",
};

export function replaceLocaleInPath(pathname: string, locale: PublicLocale) {
  if (locale === "ar") {
    if (pathname.startsWith("/fr/voitures/")) return pathname.replace("/fr/voitures/", "/ar/cars/");
    return frenchToArabicPaths[pathname] ?? "/ar";
  }

  if (pathname.startsWith("/ar/cars/")) return pathname.replace("/ar/cars/", "/fr/voitures/");
  return arabicToFrenchPaths[pathname] ?? "/fr";
}

export function isPublicPath(pathname: string) {
  return pathname === "/fr" || pathname.startsWith("/fr/") || pathname === "/ar" || pathname.startsWith("/ar/");
}
