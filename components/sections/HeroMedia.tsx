/**
 * HeroMedia — la caja del media del hero (video del evento + overlay).
 *
 * NO tiene lógica de animación propia: su entrada cinematográfica (nace chico en
 * la franja central del loader → crece a full-screen) la controla la TIMELINE
 * ÚNICA del Loader (components/intro/Loader.tsx) y el estado inicial vive en CSS
 * (body[data-loader="true"] .c-hero__media). Método Villurcann.
 *
 * Es Server Component (sin "use client"): solo markup.
 */

export function HeroMedia() {
  return (
    <div className="c-hero__media" aria-hidden="true">
      {/* Video real (30s del resumen del Summit, sin audio). Sin autoplay: lo
          arranca HeroStory cuando el loader agranda el video (texto en sync). */}
      <video
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-poster.jpg"
        tabIndex={-1}
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="c-hero__media-overlay" />
    </div>
  );
}
