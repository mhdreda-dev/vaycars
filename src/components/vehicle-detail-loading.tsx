export function VehicleDetailLoading({ rtl = false }: { rtl?: boolean }) {
  return <main dir={rtl ? "rtl" : "ltr"} aria-busy="true" aria-label={rtl ? "كنحملو معلومات الطوموبيل" : "Chargement du véhicule"} className="mx-auto w-full max-w-7xl animate-pulse px-4 pb-16 pt-8 sm:px-6 lg:px-8 motion-reduce:animate-none">
    <div className="h-5 w-52 rounded bg-slate-200" />
    <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1.16fr)_minmax(340px,.84fr)] lg:gap-10"><div className="aspect-[4/3] rounded-3xl bg-slate-200 sm:aspect-[16/10]" /><div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="h-7 w-32 rounded-full bg-slate-200" /><div className="mt-5 h-12 w-4/5 rounded bg-slate-200" /><div className="mt-5 h-4 w-full rounded bg-slate-100" /><div className="mt-2 h-4 w-3/4 rounded bg-slate-100" /><div className="mt-8 h-12 w-full rounded-xl bg-slate-200" /></div></div>
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6"><div className="h-8 w-64 rounded bg-slate-200" /><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 rounded-2xl bg-slate-100" />)}</div></div>
  </main>;
}
