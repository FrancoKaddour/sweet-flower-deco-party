import Link from "next/link";

/** Pestañas de estado (links GET) con contador. */
export function FiltroEstados({
  base,
  activo,
  opciones,
  conteos,
  extra,
}: {
  base: string;
  activo?: string;
  opciones: readonly { v: string; l: string }[];
  conteos: Record<string, number>;
  /** Otros parámetros a conservar (ej. búsqueda). */
  extra?: Record<string, string | undefined>;
}) {
  const total = Object.values(conteos).reduce((a, b) => a + b, 0);
  const href = (v?: string) => {
    const q = new URLSearchParams();
    for (const [k, val] of Object.entries(extra ?? {})) if (val) q.set(k, val);
    if (v) q.set("estado", v);
    const s = q.toString();
    return `${base}${s ? `?${s}` : ""}`;
  };
  const items = [{ v: undefined as string | undefined, l: "Todos", n: total }, ...opciones.map((o) => ({ ...o, n: conteos[o.v] ?? 0 }))];
  return (
    // En celular la fila se desliza con el dedo (sin barra visible) y llega hasta el
    // borde de la pantalla; en md+ se acomoda en varias líneas si no entra.
    <nav
      aria-label="Filtrar por estado"
      className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {items.map((o) => {
        const on = (o.v ?? "") === (activo ?? "");
        return (
          <Link
            key={o.l}
            href={href(o.v)}
            aria-current={on ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] transition-colors ${
              on ? "border-ink bg-ink text-bone" : "border-line bg-cloud text-muted hover:border-ink/40 hover:text-ink"
            }`}
          >
            {o.l}
            <span className={`tabular-nums ${on ? "text-champagne" : "text-ink/45"}`}>{o.n}</span>
          </Link>
        );
      })}
    </nav>
  );
}
