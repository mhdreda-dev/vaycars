"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-session";

const idSchema = z.object({ id: z.string().cuid() }); const availabilitySchema = idSchema.extend({ availability: z.enum(["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "RESERVED"]) });
type Result = { ok: boolean; message: string };
function refreshVehicle(slug: string) { ["/admin", "/admin/vehicles", "/fr", "/ar", "/fr/voitures", "/ar/cars", `/fr/voitures/${slug}`, `/ar/cars/${slug}`].forEach((path) => revalidatePath(path)); }
export async function updateVehicleAvailability(input: z.infer<typeof availabilitySchema>): Promise<Result> { await requireAdmin(); const parsed = availabilitySchema.safeParse(input); if (!parsed.success) return { ok: false, message: "Demande invalide." }; const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.data.id }, select: { slug: true } }); if (!vehicle) return { ok: false, message: "Véhicule introuvable." }; await prisma.vehicle.update({ where: { id: parsed.data.id }, data: { availability: parsed.data.availability } }); refreshVehicle(vehicle.slug); return { ok: true, message: "Disponibilité mise à jour." }; }
export async function toggleVehicleActive(input: z.infer<typeof idSchema>): Promise<Result> { await requireAdmin(); const parsed = idSchema.safeParse(input); if (!parsed.success) return { ok: false, message: "Demande invalide." }; const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.data.id }, select: { slug: true, active: true } }); if (!vehicle) return { ok: false, message: "Véhicule introuvable." }; await prisma.vehicle.update({ where: { id: parsed.data.id }, data: { active: !vehicle.active } }); refreshVehicle(vehicle.slug); return { ok: true, message: vehicle.active ? "Véhicule masqué du site public." : "Véhicule activé." }; }
export async function toggleVehicleFeatured(input: z.infer<typeof idSchema>): Promise<Result> { await requireAdmin(); const parsed = idSchema.safeParse(input); if (!parsed.success) return { ok: false, message: "Demande invalide." }; const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.data.id }, select: { slug: true, featured: true } }); if (!vehicle) return { ok: false, message: "Véhicule introuvable." }; await prisma.vehicle.update({ where: { id: parsed.data.id }, data: { featured: !vehicle.featured } }); refreshVehicle(vehicle.slug); return { ok: true, message: vehicle.featured ? "Véhicule retiré de la sélection." : "Véhicule mis en avant." }; }
