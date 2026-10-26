"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import {
  EVENT_NAME,
  EVENT_WHEN,
  EVENT_CTA_HREF,
  EDICION_LABEL,
  WORKSHOPS_REALIZADOS,
} from "@/content/evento";

// Fotos reales de la 1ª edición (public/img/summit, 36 webp). 9 columnas × 5:
// se reparten con salto para que la misma foto no quede pegada a sí misma.
// Mobile se recorta (CSS).
const TOTAL_FOTOS = 36;
const COLUMNS: string[][] = Array.from({ length: 9 }, (_, c) =>
  Array.from({ length: 5 }, (_, i) => {
    const n = ((c * 5 + i) * 7) % TOTAL_FOTOS; // 7 es coprimo con 36 → recorre todas
    return `/img/summit/sum-${String(n + 1).padStart(2, "0")}.webp`;
  }),
);


/**
 * Sección EVENT SUMMIT en el inicio — justo debajo del hero (prioridad de la
 * clienta). Momento cinematográfico (patrón befesti.com).
 *
 * 1) TILT 3D scrubbed: la grilla entra inclinada (rotationX/Y 20°, rotation −20°)
 *    y se endereza al scrollear hasta −10°, con perspective:2000px y pivote abajo-centro.
 * 2) PARALLAX de columnas en sentidos opuestos (y: ±40% → doble recorrido).
 * 3) DOS títulos idénticos, cada uno anclado a la esquina inferior-derecha de su
 *    mitad de la sección (flex justify-end + items-end), enmarcando el collage.
 * Sección al doble de alto → se scrollea el doble. Recetas: docs/07_MOTION_SYSTEM.md.
 */
export function SummitHome() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const gridEl = grid.current;
      if (!el || !gridEl) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
      const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean };

      const trigger = {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(bottom top)",
        // Mobile: menos inercia → menos frames de "arrastre" con el dedo.
        scrub: mobile ? 1.2 : 2.8,
        // iOS: la barra de URL cambia el alto al scrollear → recalcular valores.
        invalidateOnRefresh: true,
      } as const;

      // 1) Tilt 3D: de inclinado → casi de frente.
      // ease "none" → progresa lineal con el scroll (acompaña TODO el recorrido).
      // Mobile: solo 2D (rotación + escala, sin rotationX/perspectiva) → la capa
      // se composita sin re-rasterizar y el scroll táctil no se traba.
      gsap.fromTo(
        gridEl,
        mobile
          ? { rotation: -14, scale: 1.3 }
          : { rotationX: 12, rotationY: 0, rotation: -14, scale: 1.4 },
        {
          ...(mobile ? {} : { rotationX: 0, rotationY: 0 }),
          rotation: -10,
          scale: 1.12,
          transformOrigin: "50% 50%",
          ease: "none",
          force3D: true,
          scrollTrigger: trigger,
        },
      );

      // 2) Parallax continuo de columnas (pares y impares en sentidos opuestos).
      // Se anima la COLUMNA entera (11 capas) y no cada foto (126 tweens/capas):
      // mismo recorrido visual (±30% del alto de una foto), mucho más liviano.
      const cols = Array.from(el.querySelectorAll<HTMLElement>(".wk-col"));
      cols.forEach((col, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const base = i % 2 === 0 ? -22 : 22; // offset alterno del CSS
        const travel = () =>
          (col.querySelector("img")?.offsetHeight ?? 0) * (mobile ? 0.2 : 0.3) * dir;
        gsap.fromTo(
          col,
          { y: () => base + travel() },
          {
            y: () => base - travel(),
            ease: "none",
            force3D: true,
            scrollTrigger: { ...trigger, invalidateOnRefresh: true },
          },
        );
      });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="summit"
      ref={root}
      data-theme="dark"
      className="relative min-h-[150svh] overflow-hidden bg-bone text-ink md:min-h-[200svh] [@media(max-height:500px)_and_(orientation:landscape)]:min-h-[170svh]"
    >
      {/* Collage de fondo (decorativo) */}
      <div className="wk-collage" aria-hidden="true">
        <div className="wk-grid" ref={grid}>
          {COLUMNS.map((col, ci) => (
            <div className="wk-col" key={ci}>
              {col.map((src, i) => (
                // <img> nativo a propósito: collage decorativo de 45 imgs que GSAP
                // anima por selector. Pasan por el optimizador de next/image
                // (AVIF al ancho real de la columna: ~1/9 del ancho ×1.4 de escala
                // en desktop, ~1/5 ×1.3 en celular) en vez del webp de 600–900px.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${ci}-${i}`}
                  {...getImageProps({
                    src,
                    alt: "",
                    width: 600,
                    height: 900,
                    sizes: "(max-width: 767px) 34vw, 18vw",
                    loading: "lazy",
                  }).props}
                  alt=""
                  style={undefined}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Velo oscuro parejo: fotos más apagadas para que mande el texto.
            El fundido marfil (wk-fade) va encima → bordes limpios. */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-ink/55 md:bg-ink/45"
        />
        <div className="wk-fade" />
      </div>

      {/* Título + datos de la próxima edición + CTA, anclado a la derecha */}
      <div className="relative z-[3] mx-auto flex min-h-[150svh] max-w-[87.5rem] items-center justify-start px-6 md:min-h-[200svh] md:justify-end md:px-10 [@media(max-height:500px)_and_(orientation:landscape)]:min-h-[170svh]">
        <div className="flex flex-col items-start text-left md:items-end md:text-right [text-shadow:0_2px_28px_rgb(20_17_15/0.5)]">
          <p className="mb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne [@media(max-height:500px)_and_(orientation:landscape)]:mb-3">
            {EDICION_LABEL} · {EVENT_WHEN}
          </p>
          <RevealText
            as="h2"
            onScroll
            className="max-w-[14ch] font-display text-[length:var(--text-step-6)] [@media(max-height:500px)_and_(orientation:landscape)]:max-w-[22ch] [@media(max-height:500px)_and_(orientation:landscape)]:text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone"
          >
            {EVENT_NAME}
          </RevealText>
          <p className="mt-6 max-w-[38ch] text-[length:var(--text-step-0)] leading-snug text-bone/85 [@media(max-height:500px)_and_(orientation:landscape)]:mt-3 [@media(max-height:500px)_and_(orientation:landscape)]:max-w-[52ch]">
            {/* TODO(contenido): bajada real del Summit */}
            El encuentro del año de la decoración de eventos. Después de {WORKSHOPS_REALIZADOS} workshops y una primera edición, vamos por la segunda. Preventa abierta: La Rural, Palermo.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-start gap-x-10 gap-y-3 md:justify-end [@media(max-height:500px)_and_(orientation:landscape)]:mt-4">
            <Button href={EVENT_CTA_HREF} tone="light">
              Quiero mi lugar
            </Button>
            <Button href="/event-summit" variant="outline" tone="light">
              Conocé el Summit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
