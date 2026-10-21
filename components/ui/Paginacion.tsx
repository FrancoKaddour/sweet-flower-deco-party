/**
 * Selector de páginas (‹ 1 2 3 … 8 ›). Dos modos:
 * - con `href(n)` → links (server, ideal para el panel: la página queda en la URL);
 * - con `onChange(n)` → botones (client, para grillas que paginan en el navegador).
 */
type Props = {
  pagina: number;
  total: number;
  href?: (n: number) => string;
  onChange?: (n: number) => void;
  tono?: "claro" | "panel";
};

function numeros(pagina: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, pagina - 1, pagina, pagina + 1]);
  const lista = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  lista.forEach((n, i) => {
    if (i > 0 && n - (lista[i - 1] as number) > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function Paginacion({ pagina, total, href, onChange }: Props) {
  if (total <= 1) return null;
  const base =
    "grid h-11 min-w-11 place-items-center rounded-full px-3 text-[length:var(--text-step--1)] font-medium tabular-nums transition-colors";
  const item = (n: number, label: React.ReactNode, aria: string, deshabilitado = false, actual = false) => {
    const cls = `${base} ${actual ? "bg-ink text-bone" : "text-ink hover:bg-ink/5"} ${deshabilitado ? "pointer-events-none opacity-30" : ""}`;
    if (href)
      return (
        <a key={aria} href={href(n)} aria-label={aria} aria-current={actual ? "page" : undefined} className={cls}>
          {label}
        </a>
      );
    return (
      <button key={aria} type="button" onClick={() => onChange?.(n)} disabled={deshabilitado} aria-label={aria} aria-current={actual ? "page" : undefined} className={cls}>
        {label}
      </button>
    );
  };

  return (
    <nav aria-label="Páginas" className="flex flex-wrap items-center justify-center gap-1">
      {item(pagina - 1, "‹", "Página anterior", pagina <= 1)}
      {numeros(pagina, total).map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          item(n, n, `Página ${n}`, false, n === pagina)
        ),
      )}
      {item(pagina + 1, "›", "Página siguiente", pagina >= total)}
    </nav>
  );
}
