"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-session";
import { getEditableCatalogueFilters } from "@/lib/catalogue-filters";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({ id: z.string().cuid().optional(), nameFr: z.string().trim().min(1).max(80), nameAr: z.string().trim().min(1).max(80), slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100), icon: z.string().trim().min(1).max(8), displayOrder: z.number().int().min(0).max(100000), active: z.boolean() });
const idSchema = z.object({ id: z.string().cuid() });
type Result = { ok: boolean; message: string; fieldErrors?: Record<string, string[]> };

function refresh() {
  ["/admin", "/admin/categories", "/admin/vehicles", "/fr", "/ar", "/fr/voitures", "/ar/cars"].forEach((path) => revalidatePath(path));
}

async function economyFilterEnabled() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "site-settings" }, select: { catalogueFilters: true } });
  return getEditableCatalogueFilters(settings?.catalogueFilters).some((filter) => filter.id === "economique" && filter.enabled);
}

export async function saveCategory(input: z.infer<typeof inputSchema>): Promise<Result> {
  await requireAdmin();
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Vérifiez les champs indiqués.", fieldErrors: parsed.error.flatten().fieldErrors };
  const duplicate = await prisma.vehicleCategory.findFirst({ where: { slug: parsed.data.slug, ...(parsed.data.id ? { NOT: { id: parsed.data.id } } : {}) }, select: { id: true } });
  if (duplicate) return { ok: false, message: "Ce slug est déjà utilisé.", fieldErrors: { slug: ["Choisissez un slug unique."] } };
  const existing = parsed.data.id ? await prisma.vehicleCategory.findUnique({ where: { id: parsed.data.id }, select: { slug: true } }) : null;
  if (existing?.slug === "economique" && parsed.data.slug !== "economique" && await economyFilterEnabled()) return { ok: false, message: "Désactivez d’abord le filtre Économique dans Paramètres > Filtres du catalogue avant de modifier le slug /economique." };
  if (parsed.data.id) await prisma.vehicleCategory.update({ where: { id: parsed.data.id }, data: parsed.data }); else await prisma.vehicleCategory.create({ data: parsed.data });
  refresh();
  return { ok: true, message: parsed.data.id ? "Catégorie mise à jour" : "Catégorie créée" };
}

export async function toggleCategory(id: string): Promise<Result> {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, message: "Demande invalide." };
  const category = await prisma.vehicleCategory.findUnique({ where: { id }, select: { active: true } });
  if (!category) return { ok: false, message: "Catégorie introuvable." };
  await prisma.vehicleCategory.update({ where: { id }, data: { active: !category.active } });
  refresh();
  return { ok: true, message: category.active ? "Catégorie masquée" : "Catégorie activée" };
}

export async function deleteCategory(id: string): Promise<Result> {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, message: "Demande invalide." };
  const category = await prisma.vehicleCategory.findUnique({ where: { id }, select: { slug: true, _count: { select: { vehicles: true } } } });
  if (!category) return { ok: false, message: "Catégorie introuvable." };
  if (category._count.vehicles) return { ok: false, message: "Cette catégorie est utilisée par des véhicules et ne peut pas être supprimée." };
  if (category.slug === "economique" && await economyFilterEnabled()) return { ok: false, message: "La catégorie /economique est utilisée par le filtre public Économique. Désactivez ce filtre dans Paramètres avant de supprimer la catégorie." };
  await prisma.vehicleCategory.delete({ where: { id } });
  const categories = await prisma.vehicleCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], select: { id: true } });
  await prisma.$transaction(categories.map((item, index) => prisma.vehicleCategory.update({ where: { id: item.id }, data: { displayOrder: index + 1 } })));
  refresh();
  return { ok: true, message: "Catégorie supprimée" };
}

export async function moveCategory(id: string, direction: -1 | 1): Promise<Result> {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id });
  if (!parsed.success || ![-1, 1].includes(direction)) return { ok: false, message: "Demande invalide." };
  const list = await prisma.vehicleCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const index = list.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= list.length) return { ok: false, message: "Déplacement impossible." };
  [list[index], list[target]] = [list[target], list[index]];
  await prisma.$transaction(list.map((item, itemIndex) => prisma.vehicleCategory.update({ where: { id: item.id }, data: { displayOrder: itemIndex + 1 } })));
  refresh();
  return { ok: true, message: "Ordre mis à jour" };
}
