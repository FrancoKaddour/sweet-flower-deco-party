"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { STATS } from "@/content/evento";

/**
 * Trayectoria del summit — números que cuentan hacia arriba al entrar en viewport.
 * Cifras aproximadas confirmadas por Flor (docs/CONTENIDO_FLOR.md §11).
 * Respeta prefers-reduced-motion: muestra el valor final directo, sin conteo.
 */
export function EventoStats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const nums = gsap.utils.toArray<HTMLElement>("[data-count]", el);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      nums.forEach((node) => {
        const end = Number(node.dataset.count ?? "0");
        if (reduce) {
          node.textContent = String(end);
          return;
        }
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = String(Math.round(obj.val));
          },
          scrollTrigger: { trigger: node, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="dark"
      className="bg-botanical px-6 py-24 text-bone md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] text-center">
        <Eyebrow className="mb-6">Trayectoria</Eyebrow>
        <h2 className="mx-auto max-w-[20ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-5)]">
          {/* TODO(contenido): titular real */}
          No es la primera vez. Es una comunidad
        </h2>

        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:mt-20 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-bone/15 pt-6 text-center">
              <dd className="font-display text-[length:var(--text-step-6)] font-extrabold leading-none tabular-nums text-bone">
                {s.prefijo}
                <span data-count={s.valor}>0</span>
                {s.sufijo}
              </dd>
              <dt className="mt-4 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
