"use client";

import { useLayoutEffect, useRef } from "react";
import { preload } from "react-dom";

/**
 * HeroMedia — la caja del media del hero (video del evento + overlay).
 *
 * NO tiene lógica de animación propia: su entrada cinematográfica (nace chico en
 * la franja central del loader → crece a full-screen) la controla la TIMELINE
 * ÚNICA del Loader (components/intro/Loader.tsx) y el estado inicial vive en CSS
 * (body[data-loader="true"] .c-hero__media). Método Villurcann.
 *
 * Rendimiento (celulares medios con 4G):
 * - El HTML NO trae <source>: si las trajera, el navegador bajaría el video de
 *   escritorio (6 MB) antes de que JS pueda elegir. La fuente se elige acá por
 *   matchMedia (Safari ignora `media` en <source> de video en varias versiones):
 *     celular vertical → recorte retrato 640×900 (~1.3 MB);
 *     ≤1280px (celular horizontal, tablet, notebook chica) → 960×540 (~1.8 MB);
 *     escritorio → 1600×900 re-encodeado.
 *   Siempre mp4 (H.264) primero: decodificación por hardware en todos lados
 *   (Safari/iOS incluido); webm VP9 de respaldo.
 * - Póster liviano (AVIF/WebP, retrato o apaisado) como FONDO del <video>: así
 *   sigue la escala/rotación del loader (GSAP anima el <video>), se elige por
 *   media query sin JS y se precarga con prioridad alta (<link rel=preload>).
 * - Modo liviano (ahorro de datos, red 2g/3g o reduced-motion): no se baja el
 *   video, queda el póster; HeroStory anima las frases con su propio reloj.
 * Archivos nuevos con nombre nuevo (caché immutable en next.config.ts).
 */

const MQ_RETRATO = "(max-width: 900px) and (orientation: portrait)";
const MQ_MEDIANO = "(max-width: 1280px)";

type Fuente = { src: string; type: string };
const MP4 = 'video/mp4; codecs="avc1.640028"';
const WEBM = 'video/webm; codecs="vp9"';
const FUENTES: Record<"retrato" | "mediano" | "grande", Fuente[]> = {
  retrato: [
    { src: "/video/hero-m640.mp4", type: MP4 },
    { src: "/video/hero-m640.webm", type: WEBM },
  ],
  mediano: [
    { src: "/video/hero-960.mp4", type: MP4 },
    { src: "/video/hero-960.webm", type: WEBM },
  ],
  grande: [
    { src: "/video/hero-1600.mp4", type: MP4 },
    { src: "/video/hero-1600.webm", type: WEBM },
  ],
};

/**
 * ¿Hero sin video? Ahorro de datos, red lenta (2g/3g) o reduced-motion.
 * La usa también HeroStory para animar las frases sin el video como reloj.
 */
export function heroEnModoLiviano(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return true;
  return /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
}

// Póster: WebP para todos; AVIF donde se entienda image-set con type().
const POSTER_CSS = `
.c-hero__media video{background:var(--color-ink) url(/video/hero-poster-1600.webp) center/cover no-repeat;background-image:image-set(url(/video/hero-poster-1600.avif) type("image/avif"),url(/video/hero-poster-1600.webp) type("image/webp"))}
@media ${MQ_RETRATO}{.c-hero__media video{background-image:url(/video/hero-poster-m640.webp);background-image:image-set(url(/video/hero-poster-m640.avif) type("image/avif"),url(/video/hero-poster-m640.webp) type("image/webp"))}}
`;

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // El póster es lo primero que se ve del hero: se pide con prioridad alta y
  // solo el del tamaño que corresponde (media en el preload).
  preload("/video/hero-poster-m640.avif", {
    as: "image",
    type: "image/avif",
    media: MQ_RETRATO,
    fetchPriority: "high",
  });
  preload("/video/hero-poster-1600.avif", {
    as: "image",
    type: "image/avif",
    media: `not all and ${MQ_RETRATO}`,
    fetchPriority: "high",
  });

  // useLayoutEffect: corre ANTES que el de HeroStory (hermano posterior), así
  // el src ya está puesto cuando HeroStory/Loader llaman a play().
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (heroEnModoLiviano()) {
      video.dataset.lite = "true";
      return;
    }

    const lista = window.matchMedia(MQ_RETRATO).matches
      ? FUENTES.retrato
      : window.matchMedia(MQ_MEDIANO).matches
        ? FUENTES.mediano
        : FUENTES.grande;
    const fuente = lista.find((f) => video.canPlayType(f.type) !== "") ?? lista[lista.length - 1];
    // metadata (pedido iOS): no se precarga entero; play() lo baja al arrancar.
    video.preload = "metadata";
    video.src = fuente.src;

    // Arranque: la intro avisa con sf:hero-start (lo escucha también HeroStory).
    // Si la intro ya terminó o no corre (F5), arrancamos directo.
    const arrancar = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    };
    window.addEventListener("sf:hero-start", arrancar, { once: true });
    if (document.body.getAttribute("data-loader") === "false") arrancar();
    return () => window.removeEventListener("sf:hero-start", arrancar);
  }, []);

  return (
    <div className="c-hero__media" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: POSTER_CSS }} />
      {/* Video real (30s del resumen del Summit, sin audio). Sin autoplay en el
          HTML: lo arranca la intro (texto en sync con HeroStory). */}
      <video ref={videoRef} muted loop playsInline preload="none" tabIndex={-1} />
      <div className="c-hero__media-overlay" />
    </div>
  );
}
