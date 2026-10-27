"use client";

import { useState } from "react";

/**
 * Pausa del video del hero (T-08, WCAG 2.2.2). 44 px, aria-pressed, abajo a la
 * derecha. Marca el <video> con data-pausa: HeroStory deja de reanudarlo al
 * volver a la vista y congela las frases (también en modo "reloj propio").
 */
export function HeroPausa() {
  const [pausado, setPausado] = useState(false);

  const alternar = () => {
    const video = document.querySelector<HTMLVideoElement>(".c-hero__media video");
    const pausar = !pausado;
    setPausado(pausar);
    if (video) {
      if (pausar) {
        video.dataset.pausa = "1";
        video.pause();
      } else {
        delete video.dataset.pausa;
        video.play().catch(() => {});
      }
    }
    window.dispatchEvent(new CustomEvent("sf:hero-pausa", { detail: pausar }));
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={pausado}
      aria-label={pausado ? "Reproducir el video" : "Pausar el video"}
      className="c-hero__content absolute bottom-[max(5.5rem,10svh,calc(env(safe-area-inset-bottom)+5rem))] right-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-bone/40 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone/10 md:bottom-[11svh] md:right-10"
    >
      {pausado ? (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="2.5" y="1.5" width="3" height="11" rx="0.5" fill="currentColor" />
          <rect x="8.5" y="1.5" width="3" height="11" rx="0.5" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
