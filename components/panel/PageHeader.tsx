import { Eyebrow } from "@/components/ui/Eyebrow";

// Encabezado de página del panel — patrón EDITORIAL del storefront (ver
// components/sections/Destacados.tsx): eyebrow champagne en versalitas + título
// display EXTRABOLD en MAYÚSCULAS (contenido, no tan bestial como el hero) +
// descripción en muted. Semántico: el título es el <h1> de cada vista.
//
// El eyebrow se arma con el nombre de la sección ("✧ CATÁLOGO"): champagne como
// TEXTO va bien porque el eyebrow es chico y de acento (docs/06 §7 lo permite
// para el rótulo; en cuerpo/tabla el champagne sigue siendo solo hairline).

type PageHeaderProps = {
  /** Rótulo de sección para el eyebrow (ej. "CATÁLOGO"). Si se omite, usa el título. */
  seccion?: string;
  titulo: string;
  descripcion: string;
  /** Acción primaria (botón). Se acomoda a la derecha en desktop. */
  accion?: React.ReactNode;
};

export function PageHeader({
  seccion,
  titulo,
  descripcion,
  accion,
}: PageHeaderProps) {
  const rotulo = (seccion ?? titulo).toUpperCase();

  return (
    <header className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-2xl">
        <Eyebrow className="mb-4">✧ {rotulo}</Eyebrow>
        {/* D-21: el H1 del panel usa Cormorant, la voz del sitio (el resto del panel
            conserva la grotesca). Sin mayúsculas: la serif se lee mejor en caja baja. */}
        <h1 className="text-[length:var(--text-step-4)] font-semibold leading-[0.95] tracking-[-0.005em] text-ink [font-family:var(--font-logo)] [font-variant-numeric:lining-nums] [overflow-wrap:anywhere] [text-wrap:balance] md:text-[length:var(--text-step-5)]">
          {titulo}
        </h1>
        <p className="mt-4 text-[length:var(--text-step-0)] leading-relaxed text-muted">
          {descripcion}
        </p>
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </header>
  );
}
