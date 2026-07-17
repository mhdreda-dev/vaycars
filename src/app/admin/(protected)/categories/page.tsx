import { CategoryManager } from "@/components/admin/category-manager";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await prisma.vehicleCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], include: { _count: { select: { vehicles: true } } } });
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><CategoryManager categories={categories.map((category) => ({ id: category.id, nameFr: category.nameFr, nameAr: category.nameAr, slug: category.slug, icon: category.icon, displayOrder: category.displayOrder, active: category.active, updatedAt: category.updatedAt.toISOString(), vehicleCount: category._count.vehicles, isEconomy: category.slug === "economique" }))}/></main>;
}
