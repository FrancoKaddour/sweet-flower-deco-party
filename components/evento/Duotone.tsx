import Image from "next/image";

type Props = {
  src: string;
  sizes: string;
  priority?: boolean;
  /** Clases del contenedor (dá el tamaño: aspect/h + rounded). */
  className?: string;
  /** Scrim para legibilidad del texto encima. */
  scrim?: "bottom" | "top" | "full" | "none";
};

/**
 * Media con duotono cálido cinematográfico + grano de película.
 * La foto va en escala de grises y se tiñe: sombras a bordó/tinta (multiply) y
 * luces a champagne (screen). Esto da mood editorial y disimula el gris de los
 * placeholders (picsum) hasta que lleguen las fotos reales de Flor.
 * Server Component (sólo markup). TODO(contenido): fotos reales.
 */
export function Duotone({
  src,
  sizes,
  priority,
  className = "",
  scrim = "none",
}: Props) {
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover grayscale [transform:translateZ(0)]"
      />
      {/* Duotono: sombras cálidas */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-bordeaux/70 to-bordeaux/40 mix-blend-multiply" />
      {/* Duotono: luces champagne */}
      <div className="pointer-events-none absolute inset-0 bg-champagne/15 mix-blend-screen" />
      {/* Grano */}
      <div className="evt-grain pointer-events-none absolute inset-0" />
      {/* Scrim de legibilidad */}
      {scrim === "bottom" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
      )}
      {scrim === "top" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/85 to-transparent" />
      )}
      {scrim === "full" && (
        <div className="pointer-events-none absolute inset-0 bg-ink/55" />
      )}
    </div>
  );
}
