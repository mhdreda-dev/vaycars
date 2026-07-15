"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const values = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: values.get("email"), password: values.get("password"), redirect: false });
    setPending(false);
    if (result?.error) { setError("Email ou mot de passe incorrect."); return; }
    router.replace("/admin"); router.refresh();
  }
  return <form onSubmit={submit} className="mt-7 space-y-5" noValidate><div><label htmlFor="email" className="text-sm font-bold text-[#10233c]">Email</label><input id="email" name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0b5aa7] focus:ring-2 focus:ring-blue-100" /></div><div><label htmlFor="password" className="text-sm font-bold text-[#10233c]">Mot de passe</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={1} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0b5aa7] focus:ring-2 focus:ring-blue-100" /></div>{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</p>}<button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0b5aa7] px-4 text-sm font-bold text-white transition hover:bg-[#084a8a] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Connexion…" : "Se connecter"}</button></form>;
}
