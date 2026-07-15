"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#10233c] transition hover:border-blue-200 hover:bg-blue-50">Se déconnecter</button>;
}
