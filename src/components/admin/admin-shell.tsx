import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { AdminMobileNav } from "./admin-mobile-nav";
export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) { return <div className="flex min-h-screen bg-slate-50"><AdminSidebar /><div className="min-w-0 flex-1"><AdminTopbar email={email} /><AdminMobileNav />{children}</div></div>; }
