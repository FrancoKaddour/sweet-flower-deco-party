"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Sello circular de la membresía — texto en círculo girando en continuo
 * (rotación linear: permitida, es un marquee circular; misma excepción que las
 * ✳ del footer). El asterisco central queda quieto. Decorativo (aria-hidden).
 * Respeta prefers-reduced-motion: queda estático.
 */
export function CirculoBadge({ className = "" }: { className?: string }) {
  const ring = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const el = ring.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(el, {
      rotation: 360,
      transformOrigin: "50% 50%",
      ease: "none",
      duration: 24,
      repeat: -1,
    });
  });

  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center ${className}`}
    >
      <svg
        ref={ring}
        viewBox="0 0 200 200"
        className="h-full w-full will-change-transform"
      >
        <defs>
          <path
            id="circulo-path"
            d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
            fill="none"
          />
        </defs>
        <text className="fill-champagne text-[13px] uppercase tracking-[0.32em]">
          <textPath href="#circulo-path">
            El Círculo Sweet Flowers · Membresía · Comunidad ·
          </textPath>
        </text>
      </svg>
      {/* Centro fijo */}
      <span className="absolute font-display text-[length:var(--text-step-3)] text-champagne">
        ✳
      </span>
    </div>
  );
}
