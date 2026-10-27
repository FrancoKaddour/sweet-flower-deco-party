/** P-08: esqueleto mientras carga una sección (cold start de la base incluido). */
export default function CargandoPanel() {
  const barra = "rounded-[var(--radius-sm)] bg-line/70 motion-safe:animate-pulse";
  return (
    <div className="flex flex-col gap-10" aria-busy="true">
      <span role="status" className="sr-only">
        Cargando…
      </span>
      <div className="flex flex-col gap-4 border-b border-line pb-8">
        <div className={`${barra} h-3 w-28`} />
        <div className={`${barra} h-12 w-2/3 max-w-md`} />
        <div className={`${barra} h-4 w-full max-w-xl`} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-[var(--radius-md)] border border-line bg-cloud p-6">
            <div className={`${barra} h-8 w-14`} />
            <div className={`${barra} mt-4 h-3 w-32`} />
          </div>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-cloud">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className={`${barra} h-10 w-10 shrink-0`} />
            <div className={`${barra} h-4 flex-1`} />
            <div className={`${barra} h-4 w-20`} />
          </div>
        ))}
      </div>
    </div>
  );
}
