import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-session";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  if (await getAuthenticatedAdmin()) redirect("/admin");
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(15,35,60,.1)] sm:p-9"><div className="grid size-11 place-items-center rounded-xl bg-[#0b5aa7] text-lg font-black text-white">V</div><p className="mt-6 text-sm font-bold uppercase tracking-[.16em] text-[#0b5aa7]">Vay Cars Location</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#10233c]">Espace administrateur</h1><p className="mt-3 text-sm leading-6 text-slate-600">Connectez-vous avec vos identifiants administrateur.</p><LoginForm /></section></main>;
}
