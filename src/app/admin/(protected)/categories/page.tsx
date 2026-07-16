import { CategoryManager } from "@/components/admin/category-manager";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-session";
export default async function CategoriesPage() { await requireAdmin(); const categories = await prisma.vehicleCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], include: { _count: { select: { vehicles: true } } } }); return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><CategoryManager categories={categories.map(c=>({ id:c.id,nameFr:c.nameFr,nameAr:c.nameAr,slug:c.slug,icon:c.icon,displayOrder:c.displayOrder,active:c.active,updatedAt:c.updatedAt.toISOString(),vehicleCount:c._count.vehicles }))}/></main>; }
