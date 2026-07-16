"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-session";
const optional = z.string().trim().max(500).transform(v=>v||null);
const schema=z.object({agencyName:z.string().trim().min(1).max(80),phone:z.string().trim().min(1).max(40),whatsappNumber:z.string().trim().regex(/^\d{8,16}$/),city:z.string().trim().min(1).max(80),country:z.string().trim().min(1).max(80),shortDescriptionFr:optional,shortDescriptionAr:optional,email:z.string().trim().email().or(z.literal("")).transform(v=>v||null),cityAr:optional,addressFr:optional,addressAr:optional,googleMapsUrl:optional,instagramUrl:optional,facebookUrl:optional,logoUrl:optional,heroImageUrl:optional,seoTitleFr:optional,seoTitleAr:optional,seoDescriptionFr:optional,seoDescriptionAr:optional,businessHoursFr:optional,businessHoursAr:optional,defaultWhatsappFr:optional,defaultWhatsappAr:optional,floatingWhatsappActive:z.boolean()});
export async function saveSettings(input:z.input<typeof schema>){await requireAdmin();const p=schema.safeParse(input);if(!p.success)return{ok:false,message:"Vérifiez les champs indiqués.",fieldErrors:p.error.flatten().fieldErrors};await prisma.siteSettings.upsert({where:{id:"site-settings"},update:p.data,create:{id:"site-settings",defaultLocale:"fr",...p.data}});["/admin/settings","/fr","/ar","/fr/voitures","/ar/cars"].forEach((path)=>revalidatePath(path));return{ok:true,message:"Paramètres enregistrés"};}
