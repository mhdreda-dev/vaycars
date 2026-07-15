import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getAuthenticatedAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  return prisma.adminUser.findFirst({ where: { email, active: true }, select: { id: true, email: true } });
}

export async function requireAdmin() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
