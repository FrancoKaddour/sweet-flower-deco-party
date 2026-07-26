"use client";

import { useRef, createElement } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type RevealTextProps = {
  children: string;
  /** Etiqueta a renderizar (h1, h2, p...). Default: h2 */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Retraso inicial en segundos */
  delay?: number;
  /**
   * Si es true, el reveal dispara al entrar en viewport (scroll).
   * Si es false, dispara al montar (ideal para el hero, ya visible).
   */
  onScroll?: boolean;
};

/**
 * Mask reveal palabra por palabra — réplica del patrón de befesti.com.
 * Cada palabra sube desde debajo de una máscara (overflow: clip).
 * yPercent 100 → 0, ease power3.out, stagger ~0.07, duration 0.8.
 * La opacidad NO cambia: el ocultamiento lo da la máscara, no un fade.
 * Ver docs/07_MOTION_SYSTEM.md §mask-reveal.
 */
export function RevealText({
  children,
  as = "h2",
  className,
  delay = 0,
  onScroll = false,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Accesibilidad: sin movimiento, mostramos el texto directo.
      if (prefersReduced) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      const run = () => {
        const split = SplitText.create(el, {
          type: "words",
          mask: "words", // genera el wrapper con overflow: clip
          wordsClass: "reveal-word",
        });

        gsap.set(el, { autoAlpha: 1 });
        gsap.from(split.words, {
          yPercent: 100,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          delay,
          scrollTrigger: onScroll
            ? { trigger: el, start: "clamp(top 82%)" }
            : undefined,
        });
      };

      // Esperar a que carguen las fuentes para evitar reflow del split.
      if (document.fonts?.status === "loaded") {
        run();
      } else {
        document.fonts?.ready.then(run);
      }
    },
    { scope: ref, dependencies: [children] },
  );

  // Sin visibility:hidden inline → el título es visible por defecto (LCP, SEO,
  // no-JS). GSAP hace el mask-reveal como enhancement cuando corre.
  return createElement(as, { ref, className }, children);
}
