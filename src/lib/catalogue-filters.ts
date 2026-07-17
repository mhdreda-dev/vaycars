export const catalogueFilterIds = ["economique", "AUTOMATIC", "MANUAL"] as const;

export type CatalogueFilterId = "all" | (typeof catalogueFilterIds)[number];
export type CatalogueFilterConfig = {
  id: CatalogueFilterId;
  enabled: boolean;
  displayOrder: number;
  labelFr: string;
  labelAr: string;
  icon: string;
};

const defaults: Record<CatalogueFilterId, CatalogueFilterConfig> = {
  all: { id: "all", enabled: true, displayOrder: 0, labelFr: "Toutes", labelAr: "كولشي", icon: "" },
  economique: { id: "economique", enabled: true, displayOrder: 1, labelFr: "Économique", labelAr: "اقتصادية", icon: "💶" },
  AUTOMATIC: { id: "AUTOMATIC", enabled: true, displayOrder: 2, labelFr: "Automatique", labelAr: "أوتوماتيك", icon: "⚙️" },
  MANUAL: { id: "MANUAL", enabled: true, displayOrder: 3, labelFr: "Manuelle", labelAr: "يدوية", icon: "🕹️" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function order(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : fallback;
}

export function getCatalogueFilters(value: unknown): CatalogueFilterConfig[] {
  const saved = Array.isArray(value) ? value.filter(isRecord) : [];
  const configurable = catalogueFilterIds.map((id) => {
    const fallback = defaults[id];
    const savedFilter = saved.find((filter) => filter.id === id);
    return {
      id,
      enabled: typeof savedFilter?.enabled === "boolean" ? savedFilter.enabled : fallback.enabled,
      displayOrder: order(savedFilter?.displayOrder, fallback.displayOrder),
      labelFr: text(savedFilter?.labelFr, fallback.labelFr),
      labelAr: text(savedFilter?.labelAr, fallback.labelAr),
      icon: text(savedFilter?.icon, fallback.icon),
    };
  });

  return [defaults.all, ...configurable.sort((left, right) => left.displayOrder - right.displayOrder || left.id.localeCompare(right.id))];
}

export function getEditableCatalogueFilters(value: unknown) {
  return getCatalogueFilters(value).filter((filter) => filter.id !== "all");
}

export function getCatalogueFilterLabel(filter: CatalogueFilterConfig, rtl: boolean) {
  return rtl ? filter.labelAr : filter.labelFr;
}

export function getCatalogueFilterSource(filterId: CatalogueFilterId) {
  if (filterId === "economique") return "Catégorie: /economique";
  if (filterId === "AUTOMATIC") return "Transmission: AUTOMATIC";
  if (filterId === "MANUAL") return "Transmission: MANUAL";
  return "Tous les véhicules publics";
}

export function matchesCatalogueFilter(vehicle: { categorySlug: string; transmissionCode: "MANUAL" | "AUTOMATIC" }, filterId: CatalogueFilterId) {
  if (filterId === "all") return true;
  if (filterId === "economique") return vehicle.categorySlug === "economique";
  return vehicle.transmissionCode === filterId;
}
