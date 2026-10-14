"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import {
  EVENT_NAME,
  EVENT_WHEN,
  EVENT_CTA_HREF,
  EDICION_NUMERO,
  EDICIONES_PREVIAS,
} from "@/content/evento";

// TODO(contenido): reemplazar por fotos reales de las ediciones del Summit.
// Ver docs/16_DECISIONS.md → checklist 03_EVENTOS (fotos/video de ediciones).
// 9 columnas × 5 fotos (45): antes eran 126 y trababan el scroll. La grilla
// mantiene su ancho → fotos más grandes, misma cobertura. Mobile se recorta (CSS).
const COLUMNS: number[][] = Array.from({ length: 9 }, (_, c) =>
  Array.from({ length: 5 }, (_, i) => c * 12 + i + 1),
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
        { rotationX: 12, rotationY: 0, rotation: -14, scale: 1.4 },
        {
          rotationX: 0,
          rotationY: 0,
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
          (col.querySelector("img")?.offsetHeight ?? 0) * 0.3 * dir;
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
    { scope: root },
  );

  return (
    <section
      id="summit"
      ref={root}
      className="relative min-h-[150svh] md:min-h-[200svh] overflow-hidden bg-bone text-ink"
    >
      {/* Collage de fondo (decorativo) */}
      <div className="wk-collage" aria-hidden="true">
        <div className="wk-grid" ref={grid}>
          {COLUMNS.map((col, ci) => (
            <div className="wk-col" key={ci}>
              {col.map((n) => (
                // <img> nativo a propósito: el collage es decorativo (42 imgs),
                // GSAP anima estos <img> por selector y next/image dispararía 42
                // pasadas del optimizador sobre placeholders. Migrar a next/image
                // recién con las fotos reales (imports estáticos). Ver AGENTS/audit.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={n}
                  src={`https://picsum.photos/seed/sfdp-sm-${ci}-${n}/360/540`}
                  alt=""
                  loading="lazy"
                />
              ))}
            </div>
          ))}
        </div>
        {/* Velo oscuro parejo: fotos más apagadas para que mande el texto.
            El fundido marfil (wk-fade) va encima → bordes limpios. */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 45%, transparent)" }}
        />
        <div className="wk-fade" />
      </div>

      {/* Título + datos de la próxima edición + CTA, anclado a la derecha */}
      <div className="relative z-[3] mx-auto flex min-h-[150svh] md:min-h-[200svh] max-w-[87.5rem] items-center justify-start px-6 md:justify-end md:px-10">
        <div className="flex flex-col items-start text-left md:items-end md:text-right [text-shadow:0_2px_28px_rgb(20_17_15/0.5)]">
          <p className="mb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">
            Nº {String(EDICION_NUMERO).padStart(2, "0")} · {EVENT_WHEN}
          </p>
          <RevealText
            as="h2"
            onScroll
            className="max-w-[14ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone"
          >
            {EVENT_NAME}
          </RevealText>
          <p className="mt-6 max-w-[38ch] text-[length:var(--text-step-0)] leading-snug text-bone/85">
            {/* TODO(contenido): bajada real del Summit */}
            El encuentro del año de la decoración de eventos. {EDICIONES_PREVIAS} ediciones juntando a todo el rubro.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-start gap-x-10 gap-y-4 md:justify-end">
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
