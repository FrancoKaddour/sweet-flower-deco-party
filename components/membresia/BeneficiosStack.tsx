"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BENEFICIOS } from "@/content/membresia";

// Rótulo corto del header de cada carta.
const CIRCULO_SHORT = "El Círculo";

// Superficie de cada carta (rotación de la paleta — tokens de @theme).
const SURFACES = [
  { bg: "bg-bordeaux", fg: "text-bone", muted: "text-bone/65", line: "border-bone/20" },
  { bg: "bg-botanical", fg: "text-bone", muted: "text-bone/65", line: "border-bone/20" },
  { bg: "bg-blush", fg: "text-ink", muted: "text-ink/60", line: "border-ink/15" },
  { bg: "bg-sand", fg: "text-ink", muted: "text-ink/60", line: "border-ink/15" },
  { bg: "bg-ink", fg: "text-bone", muted: "text-bone/65", line: "border-bone/20" },
] as const;

/**
 * Beneficios como CARTAS APILADAS (sticky stack): cada carta se fija cerca del
 * tope y la siguiente la cubre al scrollear; GSAP encoge sutilmente la carta
 * cubierta (scale scrubbed) para dar profundidad de mazo.
 * El apilado es CSS sticky (nativo, funciona sin JS); GSAP solo pule.
 * Reduced-motion: quedan apiladas sin el scale (scroll nativo, sin animación).
 */
export function BeneficiosStack() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(".mb-card", el);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        // La carta se hunde al mazo cuando la siguiente la va cubriendo.
        gsap.to(card, {
          scale: 0.94,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top 18%",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-col gap-6 md:gap-8">
      {BENEFICIOS.map((b, i) => {
        const s = SURFACES[i % SURFACES.length];
        return (
          <article
            key={b.titulo}
            className={`mb-card sticky flex min-h-[62vh] flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-8 md:min-h-[58vh] md:p-14 ${s.bg} ${s.fg}`}
            // Cascada: cada carta se fija un pelín más abajo que la anterior,
            // así el mazo asoma en el borde superior (offsets chicos, en px).
            style={{ top: `calc(5.5rem + ${i * 14}px)` }}
          >
            <header className={`flex items-baseline justify-between border-b pb-6 ${s.line}`}>
              <span className="font-display text-[length:var(--text-step-4)] font-extrabold leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-[length:var(--text-step--1)] uppercase tracking-[0.2em] ${s.muted}`}>
                Beneficio · {CIRCULO_SHORT}
              </span>
            </header>

            <div>
              {/* TODO(contenido): beneficios reales de Flor (ADR-014). */}
              <h3 className="max-w-[14ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] [overflow-wrap:anywhere]">
                {b.titulo}
              </h3>
              <p className={`mt-6 max-w-[40ch] font-sans text-[length:var(--text-step-1)] leading-snug ${s.muted}`}>
                {b.desc}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
