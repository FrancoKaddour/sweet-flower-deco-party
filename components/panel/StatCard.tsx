// Tarjeta KPI editorial: label chico en versalitas, valor grande en display, delta
// opcional como chip con tendencia (glifo + color, no solo color — WCAG 1.4.1).
// Vive sobre una superficie CÁLIDA de marca (sage/blush/sand/cloud) con hairline
// champagne al hover, en vez de la clásica card blanca sobre gris.
//
// El glifo direccional grande (↗ ↘ →) da carácter editorial y refuerza la
// tendencia sin depender del color.

type Superficie = "cloud" | "sage" | "blush" | "sand";

type StatCardProps = {
  label: string;
  valor: string;
  delta?: string;
  tendencia?: "sube" | "baja" | "neutral";
  ayuda: string;
  /** Superficie cálida de fondo. Por defecto cloud. */
  superficie?: Superficie;
};

const SUPERFICIE_CLASE: Record<Superficie, string> = {
  cloud: "bg-cloud",
  sage: "bg-sage",
  blush: "bg-blush",
  sand: "bg-sand",
};

const TENDENCIA_CLASE: Record<NonNullable<StatCardProps["tendencia"]>, string> =
  {
    sube: "text-botanical",
    baja: "text-bordeaux",
    neutral: "text-muted",
  };

// Glifo direccional además del color (no depender solo del color — WCAG 1.4.1).
const TENDENCIA_GLIFO: Record<NonNullable<StatCardProps["tendencia"]>, string> = {
  sube: "↗",
  baja: "↘",
  neutral: "→",
};

export function StatCard({
  label,
  valor,
  delta,
  tendencia = "neutral",
  ayuda,
  superficie = "cloud",
}: StatCardProps) {
  return (
    <article
      className={`group flex flex-col gap-3 rounded-[var(--radius-md)] border border-line p-6 transition-colors duration-200 hover:border-champagne/60 ${SUPERFICIE_CLASE[superficie]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.14em] text-muted">
          {label}
        </h3>
        {/* Glifo direccional editorial — grande, en el acento de la tendencia. */}
        <span
          aria-hidden="true"
          className={`text-[length:var(--text-step-2)] leading-none ${TENDENCIA_CLASE[tendencia]}`}
        >
          {TENDENCIA_GLIFO[tendencia]}
        </span>
      </div>
      <p className="font-display text-[length:var(--text-step-4)] font-extrabold leading-none tracking-[-0.01em] text-ink">
        {valor}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {delta ? (
          <span
            className={`text-[length:var(--text-step--1)] font-semibold ${TENDENCIA_CLASE[tendencia]}`}
          >
            {delta}
          </span>
        ) : null}
        <p className="text-[length:var(--text-step--1)] leading-relaxed text-muted">
          {ayuda}
        </p>
      </div>
    </article>
  );
}
