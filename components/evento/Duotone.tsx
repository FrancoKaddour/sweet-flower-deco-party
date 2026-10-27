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
    // Si el contenedor ya trae posición (p. ej. `absolute inset-0` como fondo
    // de sección) no se le suma `relative`: las dos clases chocaban y ganaba
    // `relative`, dejando el fondo con alto 0 (la foto no se veía).
    <div className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} overflow-hidden bg-ink ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover [transform:translateZ(0)]"
      />
      {/* Foto a color natural: se sacó el duotono (gris + tinte bordó/champagne,
          que se veía violeta) a pedido de Fran. Solo quedan grano y scrims. */}
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
