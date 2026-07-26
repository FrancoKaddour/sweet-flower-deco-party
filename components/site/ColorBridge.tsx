/**
 * Puente de color entre dos secciones de distinto tono.
 * Franja con degradado vertical (color de arriba → color de abajo) que suaviza
 * el cambio y suma aire. Interpola en oklab (transición perceptual limpia).
 *
 * Para saltos de mucha luminosidad (p. ej. verde oscuro → marfil) usá `tall`:
 * hace el degradado más largo Y superpone un grano sutil (dithering) que rompe
 * el "banding" de 8 bits — esas líneas/escalones que se notan en los degradados
 * oscuro→claro. Decorativo.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function ColorBridge({
  from,
  to,
  tall = false,
}: {
  from: string;
  to: string;
  tall?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={
        tall
          ? "relative h-[clamp(220px,36vh,480px)] w-full"
          : "relative h-[clamp(72px,11vh,150px)] w-full"
      }
      style={{
        background: `linear-gradient(to bottom in oklab, ${from}, ${to})`,
      }}
    >
      {tall && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
          style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
        />
      )}
    </div>
  );
}
