// "Eyebrow" — rótulo chico que precede a un título SOLO cuando agrega
// información que el título no dice (no se repite "TESTIMONIOS / Historias…").
// Color según el fondo (T-05): dorado oscuro --color-champagne-ink en secciones
// data-theme="light" (5,4:1 sobre bone) y champagne en las oscuras (.sf-eyebrow
// en app/globals.css). `tono` fuerza uno si el ancestro no declara data-theme.

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  tono?: "claro" | "oscuro";
};

export function Eyebrow({ children, className = "", tono }: EyebrowProps) {
  const color = tono === "claro" ? "text-champagne-ink" : tono === "oscuro" ? "text-champagne" : "sf-eyebrow";
  return (
    <p className={`text-[length:var(--text-step--1)] uppercase tracking-[0.16em] ${color} ${className}`}>
      {children}
    </p>
  );
}
