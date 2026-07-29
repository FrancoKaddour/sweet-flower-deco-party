import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowLink } from "@/components/panel/ArrowLink";

// Encabezado de SUB-sección dentro de una página del panel — patrón editorial del
// storefront (Destacados): eyebrow champagne + título display extrabold mayúsculas
// (más chico que el H1 de la página) + arrow-link opcional a la derecha.
//
// El título es un <h2> (jerarquía correcta bajo el <h1> del PageHeader). El id se
// puede pasar para asociar aria-labelledby desde la <section> contenedora.

type SectionHeadingProps = {
  eyebrow: string;
  titulo: string;
  id?: string;
  /** Texto del arrow-link a la derecha (ej. "Ver órdenes"). Opcional. */
  verTodoLabel?: string;
  verTodoHref?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  titulo,
  id,
  verTodoLabel,
  verTodoHref,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div>
        <Eyebrow className="mb-3">✧ {eyebrow.toUpperCase()}</Eyebrow>
        <h2
          id={id}
          className="font-display text-[length:var(--text-step-2)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-3)]"
        >
          {titulo}
        </h2>
      </div>
      {verTodoLabel && verTodoHref ? (
        <ArrowLink href={verTodoHref}>{verTodoLabel}</ArrowLink>
      ) : null}
    </div>
  );
}
