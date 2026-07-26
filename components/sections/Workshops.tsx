"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/motion/RevealText";

// TODO(contenido): reemplazar por fotos reales de los workshops.
// Ver docs/16_DECISIONS.md → checklist 03_EVENTOS (fotos/video de ediciones).
const COLUMNS: number[][] = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 32, 33, 34],
  [35, 36, 37, 38, 39, 40, 41, 42],
];

// TODO(contenido): titular real de los workshops.
const TITULO = "No es solo decoración, es un oficio";

/**
 * Sección WORKSHOPS — momento oscuro cinematográfico (patrón befesti.com).
 *
 * 1) TILT 3D scrubbed: la grilla entra inclinada (rotationX/Y 20°, rotation −20°)
 *    y se endereza al scrollear hasta −10°, con perspective:2000px y pivote abajo-centro.
 * 2) PARALLAX de columnas en sentidos opuestos (y: ±40% → doble recorrido).
 * 3) DOS títulos idénticos, cada uno anclado a la esquina inferior-derecha de su
 *    mitad de la sección (flex justify-end + items-end), enmarcando el collage.
 * Sección al doble de alto → se scrollea el doble. Recetas: docs/07_MOTION_SYSTEM.md.
 */
export function Workshops() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const gridEl = grid.current;
      if (!el || !gridEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      const trigger = {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(bottom top)",
        scrub: 2.8,
      } as const;

      // 1) Tilt 3D: de inclinado → casi de frente.
      // ease "none" → progresa lineal con el scroll (acompaña TODO el recorrido).
      gsap.fromTo(
        gridEl,
        { rotationX: 12, rotationY: 0, rotation: -14, scale: 1.7 },
        {
          rotationX: 0,
          rotationY: 0,
          rotation: -10,
          scale: 1.35,
          transformOrigin: "50% 50%",
          ease: "none",
          force3D: true,
          scrollTrigger: trigger,
        },
      );

      // 2) Parallax continuo de columnas (pares y impares en sentidos opuestos).
      // fromTo (+X → −X) → las columnas se mueven durante todo el scroll.
      const cols = Array.from(el.querySelectorAll<HTMLElement>(".wk-col"));
      cols.forEach((col, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          col.querySelectorAll("img"),
          { yPercent: 30 * dir },
          { yPercent: -30 * dir, ease: "none", scrollTrigger: trigger },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      id="workshops"
      ref={root}
      className="relative min-h-[150vh] md:min-h-[256vh] overflow-hidden bg-bone text-ink"
    >
      {/* Collage de fondo (decorativo) */}
      <div className="wk-collage" aria-hidden="true">
        <div className="wk-grid" ref={grid}>
          {COLUMNS.map((col, ci) => (
            <div className="wk-col" key={ci}>
              {col.map((n) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={n}
                  src={`https://picsum.photos/seed/sfdp-wk-${ci}-${n}/500/750`}
                  alt=""
                  loading="lazy"
                />
              ))}
            </div>
          ))}
        </div>
        <div className="wk-fade" />
      </div>

      {/* Título único anclado abajo-derecha + CTA */}
      <div className="relative z-[3] mx-auto flex min-h-[150vh] md:min-h-[256vh] max-w-[1400px] items-center justify-end px-6 md:px-10">
        <div className="flex flex-col items-end text-right">
          <RevealText
            as="h2"
            onScroll
            className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] text-ink [text-shadow:0_2px_22px_rgba(247,243,236,0.85)]"
          >
            {TITULO}
          </RevealText>

          <Link
            href="/evento"
            className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink px-7 py-3.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone transition-transform duration-[400ms] ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
          >
            Conocé el workshop
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
