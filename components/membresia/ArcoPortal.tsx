"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * EL PORTAL — la pieza firma de /membresia (identidad El Arco).
 * Un arco chico en el centro de la pantalla; al scrollear, el panel se PINEA y
 * el arco crece (scale scrubbed) hasta que LO ATRAVESÁS: su interior se vuelve
 * bordó sólido y cubre el viewport → la siguiente sección (bordó) continúa sin
 * costura. Narrativa literal: a la membresía se entra cruzando el arco.
 *
 * - Pin + scrub sincronizado con Lenis (mismo patrón probado en EdicionesScroll).
 * - El data-theme del section se conmuta a mitad del cruce para que el Header
 *   adaptativo se invierta en el momento justo.
 * - Reduced-motion / sin JS: sin pin ni zoom; el arco queda como viñeta estática
 *   y el cambio de fondo lo hace la sección siguiente (nada se rompe).
 */
export function ArcoPortal() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const arco = useRef<HTMLDivElement>(null);
  const velo = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const panelEl = panel.current;
      const arcoEl = arco.current;
      const veloEl = velo.current;
      if (!el || !panelEl || !arcoEl || !veloEl) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const labels = el.querySelectorAll<HTMLElement>(".ap-label");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=170%",
          pin: panelEl,
          scrub: 1,
          invalidateOnRefresh: true,
          // El Header lee data-theme: lo invertimos cuando el arco ya domina.
          onUpdate: (self) => {
            el.dataset.theme = self.progress > 0.45 ? "dark" : "light";
          },
        },
      });

      // Scale de COBERTURA calculado: el mínimo que tapa el viewport (+15% de
      // margen). En iPhone (WebKit rasteriza la textura al tamaño original y
      // escala en GPU) un scale fijo de 15 se veía pixelado; con ~4-6 alcanza.
      // Function-based → se recalcula en cada refresh (invalidateOnRefresh).
      const coverScale = () =>
        1.15 *
        Math.max(
          window.innerWidth / arcoEl.offsetWidth,
          window.innerHeight / arcoEl.offsetHeight,
        );

      // El arco crece hasta tragarse el viewport (cruzás el umbral).
      tl.to(arcoEl, { scale: coverScale, duration: 1 }, 0);
      // Los rótulos se van apenas empieza el cruce.
      tl.to(labels, { autoAlpha: 0, duration: 0.12 }, 0.02);
      // El interior se vuelve bordó sólido TEMPRANO (tapa la foto antes de que
      // la rasterización de Safari se note y cierra la costura con la sección
      // siguiente).
      tl.to(veloEl, { autoAlpha: 1, duration: 0.35 }, 0.25);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="light" className="bg-bone text-ink">
      <div
        ref={panel}
        className="flex h-svh flex-col items-center justify-center overflow-hidden"
      >
        <p className="ap-label mb-8 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-ink/45">
          {/* TODO(contenido): copy real del cruce */}
          Del otro lado está la comunidad
        </p>

        {/* El arco-portal */}
        <div
          ref={arco}
          className="relative aspect-[3/4.4] w-[min(52vw,340px)] overflow-hidden rounded-t-full will-change-transform"
        >
          {/* TODO(contenido): foto real (interior de un evento / la comunidad). */}
          <Image
            src="https://picsum.photos/seed/sfdp-mem-portal/700/1000"
            alt=""
            fill
            sizes="340px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-bordeaux/45 mix-blend-multiply" />
          {/* Velo que se vuelve sólido al cruzar */}
          <div ref={velo} className="absolute inset-0 bg-bordeaux opacity-0" />
        </div>

        <p className="ap-label mt-8 font-display text-[length:var(--text-step-2)] font-bold uppercase tracking-[-0.01em] text-ink">
          Cruzá el arco
        </p>
      </div>
    </section>
  );
}
