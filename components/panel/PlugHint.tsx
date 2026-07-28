import { IconPlug } from "@/components/panel/icons";

// Callout de "punto de enganche" para Gonzalo. Visualmente distinto (borde
// champagne punteado + ícono de enchufe) para que sea OBVIO que es andamiaje
// temporal: acá se reemplaza el mock por la query real a Payload.
//
// Aparece arriba de cada vista del panel. No es un adorno: es la señal de dónde
// se conecta cada dato. Cuando el backend esté listo, estos callouts se borran.

type PlugHintProps = {
  /** Nombre de la colección de Payload a la que enchufa (ej. "Products"). */
  coleccion: string;
  /** Explicación de qué dato se conecta y cómo. */
  children: React.ReactNode;
};

export function PlugHint({ coleccion, children }: PlugHintProps) {
  return (
    <aside
      className="flex items-start gap-3 rounded-[var(--radius-md)] border border-dashed border-champagne/70 bg-champagne/5 px-4 py-3 text-[length:var(--text-step--1)] text-ink"
      aria-label={`Punto de enganche para el backend — colección ${coleccion}`}
    >
      <span className="mt-0.5 shrink-0 text-champagne" aria-hidden="true">
        <IconPlug />
      </span>
      <p className="leading-relaxed">
        <span className="font-semibold uppercase tracking-[0.08em] text-ink">
          🔌 Gonzalo
        </span>{" "}
        <span className="text-muted">
          <span className="font-medium text-ink">
            Colección{" "}
            <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[length:var(--text-step--1)] [overflow-wrap:anywhere]">
              {coleccion}
            </code>
            .
          </span>{" "}
          {children}
        </span>
      </p>
    </aside>
  );
}
