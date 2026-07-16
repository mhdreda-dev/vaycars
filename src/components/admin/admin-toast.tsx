"use client";

import { CheckCircle2, TriangleAlert, X, XCircle } from "lucide-react";
import { useEffect } from "react";

export type AdminToastData = { id: string; variant: "success" | "error" | "warning"; title: string; description: string };
export const adminVehicleToastStorageKey = "vaycars:admin-vehicle-toast";

const styles = {
  success: { container: "border-emerald-200 bg-emerald-50 text-emerald-950", icon: "text-emerald-600", Icon: CheckCircle2 },
  error: { container: "border-red-200 bg-red-50 text-red-950", icon: "text-red-600", Icon: XCircle },
  warning: { container: "border-amber-200 bg-amber-50 text-amber-950", icon: "text-amber-600", Icon: TriangleAlert },
};

export function AdminToast({ toast, onClose }: { toast: AdminToastData | null; onClose: () => void }) {
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(onClose, 4000); return () => window.clearTimeout(timeout); }, [toast, onClose]);
  if (!toast) return null;
  const { Icon, container, icon } = styles[toast.variant];
  return <div role={toast.variant === "error" ? "alert" : "status"} aria-live={toast.variant === "error" ? "assertive" : "polite"} className={`fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 gap-3 rounded-2xl border p-4 shadow-xl sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:translate-x-0 ${container}`}><Icon className={`mt-0.5 size-5 shrink-0 ${icon}`} aria-hidden="true" /><div className="min-w-0 flex-1"><p className="font-bold">{toast.title}</p><p className="mt-1 text-sm leading-5 opacity-85">{toast.description}</p></div><button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-lg hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current" aria-label="Fermer la notification"><X className="size-4" /></button></div>;
}
