/**
 * HeroMedia — la caja del media del hero (video del evento + overlay).
 *
 * NO tiene lógica de animación propia: su entrada cinematográfica (nace chico en
 * la franja central del loader → crece a full-screen) la controla la TIMELINE
 * ÚNICA del Loader (components/intro/Loader.tsx) y el estado inicial vive en CSS
 * (body[data-loader="true"] .c-hero__media). Método Villurcann.
 *
 * Es Server Component (sin "use client"): solo markup. TODO(contenido): video real.
 */

export function HeroMedia() {
  return (
    <div className="c-hero__media" aria-hidden="true">
      {/* TODO(contenido): reemplazar el placeholder por el <video> real del
          evento (webm + mp4 + poster, muted autoPlay loop playsInline). Mientras
          tanto, un placeholder de gradiente cálido que hace la misma animación. */}
      <div className="c-hero__media-placeholder" />
      <div className="c-hero__media-overlay" />
    </div>
  );
}
