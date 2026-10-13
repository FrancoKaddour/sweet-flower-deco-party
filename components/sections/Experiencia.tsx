"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { FadeUp } from "@/components/motion/FadeUp";

// Slides del grupo: 5 imágenes verticales superpuestas dentro de un track de ancho fijo.
// TODO(contenido): reemplazar por fotos reales de escenografías/eventos.
type Slide = {
  seed: number; // sufijo del seed picsum (sfdp-exp-N)
  w: number;
  h: number;
  className: string; // posición (left/top/bottom) + z-index dentro del grupo
};

const SLIDES: Slide[] = [
  { seed: 1, w: 340, h: 480, className: "left-0 bottom-0 z-[1]" },
  { seed: 2, w: 260, h: 340, className: "left-[15.625rem] top-[1.25rem] z-[3]" },
  { seed: 3, w: 320, h: 450, className: "left-[29.375rem] bottom-[0.625rem] z-[2]" },
  { seed: 4, w: 240, h: 320, className: "left-[46.25rem] top-0 z-[4]" },
  { seed: 5, w: 340, h: 470, className: "left-[58.75rem] bottom-0 z-[1]" },
  { seed: 6, w: 260, h: 350, className: "left-[75.625rem] top-[1.875rem] z-[3]" },
  { seed: 7, w: 300, h: 420, className: "left-[86.25rem] bottom-[0.625rem] z-[2]" },
];

// Tira mobile simple (block md:hidden) para que el celular no quede vacío.
const MOBILE_SEEDS = [1, 2, 3, 4];

// Ancho fijo del grupo (px) = período del loop (coincide con w-[93.75rem] del grupo).
const GROUP_WIDTH = 1500;

/**
 * Sección EXPERIENCIA — galería horizontal en movimiento (patrón L'Expérience de momoamo.com).
 *
 * 1) Bloque editorial superior-izquierda (título gigante + bajada).
 * 2) Galería: track flex con DOS copias idénticas del grupo de slides →
 *    autoplay lineal continuo por RAF/GSAP (xPercent −50, loop sin costura, ~80 px/s)
 *    + parallax vertical MUY sutil ligado al scroll (y: 40 → −40, scrub).
 * 3) Bloque editorial inferior-derecha.
 * Recetas: docs/07_MOTION_SYSTEM.md.
 */
export function Experiencia() {
  const sectionRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const figureEl = figureRef.current;
      const trackEl = trackRef.current;
      if (!sectionEl || !figureEl || !trackEl) return;

      const mm = gsap.matchMedia();

      // Solo animamos con movimiento permitido: sin autoplay ni parallax si reduce.
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // (a) Slider horizontal SEGÚN EL SCROLL (scrub): al bajar la galería
          // corre hacia la IZQUIERDA, al subir hacia la DERECHA. Loop infinito
          // SIN salto: el modifier "envuelve" x en [-GROUP_WIDTH, 0], y como hay
          // 2 copias idénticas del grupo el reciclado es perfectamente continuo.
          // El grupo mide GROUP_WIDTH px a 16px de root → en pantallas grandes
          // (root fluido) escala con el rem.
          const unit = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
          const group = GROUP_WIDTH * unit;
          const marquee = gsap.to(trackEl, {
            x: -group * 1.2, // recorrido suave; el wrap lo recicla infinitamente
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 2.5, // mucho más suave: sigue al scroll con inercia (nada agresivo)
            },
            modifiers: {
              x: gsap.utils.unitize(gsap.utils.wrap(-group, 0)),
            },
          });

          // (b) Parallax vertical muy sutil ligado al scroll (profundidad).
          const parallax = gsap.fromTo(
            figureEl,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: sectionEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          return () => {
            marquee.scrollTrigger?.kill();
            marquee.kill();
            parallax.scrollTrigger?.kill();
            parallax.kill();
            ScrollTrigger.refresh();
          };
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      data-theme="light"
      className="relative bg-bone pb-[4rem] pt-[4rem] text-ink md:pb-[7.5rem] md:pt-[6.125rem]"
    >
      {/* 1) Bloque superior — centrado */}
      <div className="mx-auto max-w-[87.5rem] px-6 md:px-10">
        <FadeUp y={100} className="mx-auto max-w-[48.125rem] text-center">
          {/* TODO(contenido): titular real de la sección. */}
          <h2 className="mb-6 font-display text-[length:var(--text-step-5)] font-bold uppercase leading-[0.9] text-ink md:text-[length:var(--text-step-6)]">
            Más que decoración,
            <br /> una experiencia
          </h2>
          {/* TODO(contenido): bajada real. */}
          <p className="font-display text-[length:var(--text-step-2)] font-normal leading-[1.05] text-ink md:text-[length:var(--text-step-3)]">
            Creamos escenografías que transforman cualquier evento en un
            recuerdo.
          </p>
        </FadeUp>
      </div>

      {/* 2) Galería en movimiento (desktop) */}
      <figure
        ref={figureRef}
        aria-hidden="true"
        className="my-8 hidden overflow-hidden md:my-12 md:block md:h-[35rem]"
      >
        {/* Track: 2 copias idénticas del grupo → loop sin costura */}
        <div ref={trackRef} className="flex h-full">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="relative h-full w-[93.75rem] shrink-0"
            >
              {SLIDES.map((slide) => (
                <div
                  key={slide.seed}
                  className={`absolute ${slide.className}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/sfdp-exp-${slide.seed}/${slide.w}/${slide.h}`}
                    alt=""
                    width={slide.w}
                    height={slide.h}
                    className="rounded-[var(--radius-sm)] object-cover"
                    style={{ width: `${slide.w / 16}rem`, height: `${slide.h / 16}rem` }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </figure>

      {/* Tira simple visible solo en mobile */}
      <div className="my-8 block md:hidden">
        <div className="flex snap-x gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MOBILE_SEEDS.map((seed) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={seed}
              src={`https://picsum.photos/seed/sfdp-exp-${seed}/600/800`}
              alt=""
              aria-hidden="true"
              width={600}
              height={800}
              className="aspect-[3/4] w-[70vw] shrink-0 snap-start rounded-[var(--radius-sm)] object-cover"
            />
          ))}
        </div>
      </div>

      {/* 3) Bloque inferior — centrado */}
      <div className="mx-auto mt-12 max-w-[87.5rem] px-6 md:mt-[4.5rem] md:px-10">
        <FadeUp y={100} className="mx-auto max-w-[53.75rem] text-center">
          {/* TODO(contenido): titular real. */}
          <h2 className="mb-4 font-display text-[length:var(--text-step-5)] font-bold uppercase leading-[0.9] text-ink md:text-[length:var(--text-step-6)]">
            El arte de crear
            <br /> momentos inolvidables
          </h2>
          {/* TODO(contenido): bajada real. */}
          <p className="mb-4 font-display text-[length:var(--text-step-2)] font-normal leading-[1.05] text-ink md:text-[length:var(--text-step-3)]">
            Cada pieza está pensada para sorprender.
          </p>
          {/* TODO(contenido): copy secundario real. */}
          <p className="font-sans text-[length:var(--text-step-0)] font-light leading-relaxed text-ink/70">
            Del primer boceto al último detalle, cuidamos cada textura, color y
            proporción para que la escenografía cuente tu historia y deje una
            marca que perdura mucho después de que la fiesta termina.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
