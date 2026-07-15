import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAuthenticatedAdmin(); if (!admin) redirect("/admin/login");
  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
