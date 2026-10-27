"use client";

import { useRef, useState } from "react";
import { getImageProps } from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { FadeUp } from "@/components/motion/FadeUp";
import { italica } from "@/components/ui/fuentes";

// Slides del grupo: imágenes superpuestas dentro de un track de ancho fijo.
// Fotos reales del workshop en Río Cuarto (public/img/rio-cuarto, optimizadas a webp).
type Slide = {
  seed: number; // número de foto: /img/rio-cuarto/rc-NN.webp
  w: number;
  h: number;
  className: string; // posición (left/top/bottom) + z-index dentro del grupo
};

const SLIDES: Slide[] = [
  { seed: 4, w: 340, h: 480, className: "left-0 bottom-0 z-[1]" },
  { seed: 7, w: 260, h: 340, className: "left-[15.625rem] top-[1.25rem] z-[3]" },
  { seed: 9, w: 320, h: 450, className: "left-[29.375rem] bottom-[0.625rem] z-[2]" },
  { seed: 1, w: 240, h: 320, className: "left-[46.25rem] top-0 z-[4]" },
  { seed: 6, w: 340, h: 470, className: "left-[58.75rem] bottom-0 z-[1]" },
  { seed: 8, w: 260, h: 350, className: "left-[75.625rem] top-[1.875rem] z-[3]" },
  { seed: 3, w: 300, h: 420, className: "left-[86.25rem] bottom-[0.625rem] z-[2]" },
];

// Tira mobile simple (block md:hidden) para que el celular no quede vacío.
const MOBILE_SEEDS = [9, 4, 7, 1, 6, 2];

const foto = (n: number) => `/img/rio-cuarto/rc-${String(n).padStart(2, "0")}.webp`;

// Las fotos originales miden 1500px y se muestran a 240–340px: pasan por el
// optimizador de next/image (AVIF/WebP al tamaño justo, 1x/2x) pero siguen
// siendo <img> nativos (GSAP mueve el track, no necesita el wrapper de Image).
const fotoProps = (n: number, w: number, h: number, sizes?: string) =>
  getImageProps({ src: foto(n), alt: "", width: w, height: h, sizes, loading: "lazy" }).props;

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
  // Pausa de la galería (T-08): la tira se mueve con el scroll; el botón la
  // deja quieta (y la reanuda) sin tocar el resto de la página.
  const marqueeRef = useRef<gsap.core.Tween | null>(null);
  const [quieta, setQuieta] = useState(false);
  const alternarGaleria = () => {
    const st = marqueeRef.current?.scrollTrigger;
    const q = !quieta;
    setQuieta(q);
    if (!st) return;
    if (q) st.disable(false);
    else st.enable();
  };

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const figureEl = figureRef.current;
      const trackEl = trackRef.current;
      if (!sectionEl || !figureEl || !trackEl) return;

      const mm = gsap.matchMedia();

      // Solo animamos con movimiento permitido: sin autoplay ni parallax si reduce.
      // Solo cuando la galería en movimiento está visible (md+ y no celular
      // horizontal: ahí se muestra la tira táctil) y con movimiento permitido.
      mm.add(
        "(min-width: 768px) and (min-height: 501px) and (prefers-reduced-motion: no-preference), (min-width: 768px) and (orientation: portrait) and (prefers-reduced-motion: no-preference)",
        () => {
          // (a) Slider horizontal SEGÚN EL SCROLL (scrub): al bajar la galería
          // corre hacia la IZQUIERDA, al subir hacia la DERECHA. Loop infinito
          // SIN salto: el modifier "envuelve" x en [-GROUP_WIDTH, 0], y como hay
          // 2 copias idénticas del grupo el reciclado es perfectamente continuo.
          // El grupo mide GROUP_WIDTH px a 16px de root → en pantallas grandes
          // (root fluido) escala con el rem.
          // El período del loop se recalcula en cada refresh (resize): en ≥1920
          // el rem es fluido y un valor fijo dejaba la costura del loop corrida.
          const rootPx = () =>
            parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
          let group = GROUP_WIDTH * rootPx();
          let wrapX = gsap.utils.wrap(-group, 0);
          const onRefresh = () => {
            group = GROUP_WIDTH * rootPx();
            wrapX = gsap.utils.wrap(-group, 0);
          };
          ScrollTrigger.addEventListener("refreshInit", onRefresh);
          const marquee = gsap.to(trackEl, {
            x: () => -group * 1.2, // recorrido suave; el wrap lo recicla infinitamente
            ease: "none",
            force3D: true, // capa GPU fija: la tira no se re-pinta en cada frame
            scrollTrigger: {
              trigger: sectionEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 2.5, // mucho más suave: sigue al scroll con inercia (nada agresivo)
              invalidateOnRefresh: true,
            },
            modifiers: {
              x: (x: string) => `${wrapX(parseFloat(x))}px`,
            },
          });

          marqueeRef.current = marquee;

          // (b) Parallax vertical muy sutil ligado al scroll (profundidad).
          const parallax = gsap.fromTo(
            figureEl,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: sectionEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", onRefresh);
            marqueeRef.current = null;
            marquee.scrollTrigger?.kill();
            marquee.kill();
            parallax.scrollTrigger?.kill();
            parallax.kill();
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
      {/* 1) Bloque superior — a la izquierda (D-04): voz display light */}
      <div className="mx-auto max-w-[87.5rem] px-6 md:px-10">
        <FadeUp y={60} className="max-w-[66rem]">
          <h2 className="t-voz-display text-[length:min(var(--text-step-6),calc((100vw-3rem)/6.2))] text-ink">
            Lo fabricamos en Tortuguitas. Lo armás donde quieras.
          </h2>
          <p className={`${italica.className} t-voz-cita mt-6 max-w-[34ch] text-[length:var(--text-step-2)] leading-[1.15] text-ink/80 md:text-[length:var(--text-step-3)]`}>
            Arcos, estanterías y alzadas de hierro, hechos por encargo y
            enviados a todo el país.
          </p>
        </FadeUp>
      </div>

      {/* 2) Galería en movimiento (desktop) */}
      <figure
        ref={figureRef}
        aria-hidden="true"
        className="relative my-12 block h-[28rem] overflow-hidden max-md:hidden lg:h-[35rem] [@media(max-height:500px)_and_(orientation:landscape)]:hidden"
      >
        {/* Tablet (md→lg): la composición de 1500px se ve al 80% → fotos en
            escala con la pantalla (el wrapper mide 125% para seguir cubriendo
            todo el ancho una vez escalado). */}
        <div className="h-[35rem] origin-top-left max-lg:w-[125%] max-lg:scale-80">
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
                    {...fotoProps(slide.seed, slide.w, slide.h)}
                    alt=""
                    className="rounded-[var(--radius-sm)] object-cover"
                    style={{ width: `${slide.w / 16}rem`, height: `${slide.h / 16}rem` }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
      </figure>

      {/* Tira táctil: celular (vertical y horizontal) */}
      <div className="my-8 hidden max-md:block [@media(max-height:500px)_and_(orientation:landscape)]:block">
        <div className="flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto overscroll-x-contain px-6 [scrollbar-width:none] md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden">
          {MOBILE_SEEDS.map((seed) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={seed}
              {...fotoProps(seed, 600, 800, "(max-width: 548px) 70vw, 384px")}
              alt=""
              aria-hidden="true"
              className="aspect-[3/4] w-[min(70vw,24rem)] shrink-0 snap-start rounded-[var(--radius-sm)] object-cover [@media(max-height:500px)_and_(orientation:landscape)]:w-[min(40vw,48svh)]"
            />
          ))}
        </div>
      </div>

      {/* Pausa de la galería (fuera del <figure> aria-hidden) */}
      <div className="mx-auto -mt-8 flex max-w-[87.5rem] justify-end px-6 max-md:hidden md:px-10 [@media(max-height:500px)_and_(orientation:landscape)]:hidden">
        <button
          type="button"
          onClick={alternarGaleria}
          aria-pressed={quieta}
          aria-label={quieta ? "Mover la galería con el scroll" : "Dejar quieta la galería"}
          className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:border-ink"
        >
          {quieta ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="1.5" width="3" height="11" rx="0.5" fill="currentColor" /><rect x="8.5" y="1.5" width="3" height="11" rx="0.5" fill="currentColor" /></svg>
          )}
        </button>
      </div>

      {/* 3) Bloque inferior — corrido a la derecha: dato concreto de la galería */}
      <div className="mx-auto mt-12 max-w-[87.5rem] px-6 md:mt-[4.5rem] md:px-10">
        <FadeUp y={60} className="max-w-[44rem] md:ml-auto">
          <h2 className="t-voz-display text-[length:min(var(--text-step-5),calc((100vw-3rem)/6.2))] text-ink md:text-[length:var(--text-step-6)]">
            En Río Cuarto armamos el salón en vivo.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/75">
            Fue el cuarto workshop: cuarenta decoradoras mirando cómo se arma
            un salón de punta a punta. Estas fotos son de ese día.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
