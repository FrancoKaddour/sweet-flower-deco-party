"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

/**
 * Texto que se "llena" palabra por palabra ligado al scroll (scrub) — el clásico
 * text-fill de GSAP: las palabras arrancan apenas visibles (14%) y se encienden
 * a medida que el bloque atraviesa el viewport. Leer el manifiesto ES scrollear.
 * Sin JS / reduced-motion: el texto queda visible al 100% (nunca ilegible).
 */
export function ManifiestoScrub({ children, as = "p", className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      const run = () => {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { autoAlpha: 0.14 },
          {
            autoAlpha: 1,
            ease: "none",
            stagger: 0.4,
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "bottom 55%",
              scrub: true,
            },
          },
        );
      };

      // Esperar las fuentes para que el split no reflowee.
      if (document.fonts?.status === "loaded") run();
      else document.fonts?.ready.then(run);
    },
    { scope: ref, dependencies: [children] },
  );

  // Tag dinámico vía JSX: ver FadeUp/RevealText (ref forwarding legítimo).
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
