"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Amplitud del desplazamiento en % del alto del elemento. Default 18. */
  amount?: number;
};

/**
 * Parallax scrubbed ligado al scroll — patrón de befesti (ease "none", scrub 2.8).
 * Desactivado si prefers-reduced-motion. Ver docs/07_MOTION_SYSTEM.md §parallax.
 */
export function Parallax({ children, className, amount = 18 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.8,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
