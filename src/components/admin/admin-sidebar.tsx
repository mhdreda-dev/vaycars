"use client";

import Link from "next/link";
import { CarFront, LayoutDashboard, ListTree, Settings, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [["/admin", "Tableau de bord", LayoutDashboard], ["/admin/vehicles", "Véhicules", CarFront], ["/admin/categories", "Catégories", ListTree], ["/admin/settings", "Paramètres", Settings]] as const;
export function AdminSidebar() { const pathname = usePathname(); return <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block"><Link href="/admin" className="flex items-center gap-3 px-3 py-3"><span className="grid size-9 place-items-center rounded-xl bg-[#0b5aa7] font-black text-white">V</span><span className="font-bold text-[#10233c]">Vay Cars Admin</span></Link><nav className="mt-7 space-y-1">{items.map(([href, label, Icon]) => <Link href={href} key={href} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition ${pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "bg-blue-50 text-[#0b5aa7]" : "text-slate-600 hover:bg-slate-50"}`}><Icon className="size-4" />{label}</Link>)}<a href="/fr" target="_blank" rel="noreferrer" className="mt-4 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-slate-600 hover:bg-slate-50"><ExternalLink className="size-4" />Voir le site public</a></nav></aside>; }
