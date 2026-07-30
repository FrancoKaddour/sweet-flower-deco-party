"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  /** Distancia de entrada en px (momoamo: 100 primario, 50 secundario). */
  y?: number;
  delay?: number;
  /** Si >0, anima los HIJOS directos con este stagger en vez del bloque entero. */
  stagger?: number;
  /** start de ScrollTrigger. Default "top 85%". */
  start?: string;
};

/**
 * Animación de entrada on-scroll (réplica del patrón de momoamo.com):
 * y (desde abajo) + fade, ease "power2.out", duration 1s, dispara una vez
 * cuando el bloque entra al viewport (start "top 85%").
 * Respeta prefers-reduced-motion. Ver docs/07_MOTION_SYSTEM.md.
 */
export function FadeUp({
  children,
  className,
  as = "div",
  y = 60,
  delay = 0,
  stagger,
  start = "top 85%",
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets: gsap.TweenTarget =
        stagger && stagger > 0 ? el.children : el;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, dependencies: [y, delay, stagger, start] },
  );

  // Tag dinámico vía JSX (no createElement): así ESLint reconoce el ref como
  // forwarding legítimo y no lo marca como "acceso a ref durante el render".
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
