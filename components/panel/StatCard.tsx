// Tarjeta KPI: label chico en mayúsculas, valor grande en display, delta opcional
// como chip con tendencia. Superficie cloud + borde line + radio md, como el
// resto de los paneles. El texto de ayuda queda visible en muted (no oculto tras
// hover) para que Flor entienda cada número sin adivinar.

type StatCardProps = {
  label: string;
  valor: string;
  delta?: string;
  tendencia?: "sube" | "baja" | "neutral";
  ayuda: string;
};

const TENDENCIA_CLASE: Record<NonNullable<StatCardProps["tendencia"]>, string> =
  {
    sube: "text-botanical",
    baja: "text-bordeaux",
    neutral: "text-muted",
  };

// Glifo direccional además del color (no depender solo del color — WCAG 1.4.1).
const TENDENCIA_GLIFO: Record<NonNullable<StatCardProps["tendencia"]>, string> = {
  sube: "▲",
  baja: "▼",
  neutral: "",
};

export function StatCard({
  label,
  valor,
  delta,
  tendencia = "neutral",
  ayuda,
}: StatCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-cloud p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.12em] text-muted">
          {label}
        </h3>
        {delta ? (
          <span
            className={`inline-flex items-center gap-1 text-[length:var(--text-step--1)] font-semibold ${TENDENCIA_CLASE[tendencia]}`}
          >
            {TENDENCIA_GLIFO[tendencia] ? (
              <span aria-hidden="true">{TENDENCIA_GLIFO[tendencia]}</span>
            ) : null}
            {delta}
          </span>
        ) : null}
      </div>
      <p className="font-display text-[length:var(--text-step-4)] font-bold leading-none tracking-tight text-ink">
        {valor}
      </p>
      <p className="text-[length:var(--text-step--1)] leading-relaxed text-muted">
        {ayuda}
      </p>
    </article>
  );
}
