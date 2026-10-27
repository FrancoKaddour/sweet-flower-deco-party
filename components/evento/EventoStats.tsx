"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CIUDADES_WORKSHOPS, STATS, TRAYECTORIA } from "@/content/evento";

const REELS = TRAYECTORIA.filter((t): t is typeof t & { reel: string } => Boolean(t.reel));

/**
 * Trayectoria del summit (prueba social verificable) — números que cuentan
 * hacia arriba al entrar en viewport + acceso a los reels de cada workshop
 * (links, sin embeds: no cargan nada de Instagram hasta que se tocan).
 * Cifras: content/evento.ts (STATS).
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
        // El HTML trae el valor final (sin JS / buscadores); acá arranca de 0.
        node.textContent = "0";
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
      className="bg-ink px-6 py-24 text-bone md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[87.5rem] text-center">
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
                <span data-count={s.valor}>{s.valor}</span>
                {s.sufijo}
              </dd>
              <dt className="mt-4 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>

        <p className="mx-auto mt-14 max-w-[52ch] text-[length:var(--text-step-0)] leading-relaxed text-bone/70 [text-wrap:balance]">
          Siete workshops en {CIUDADES_WORKSHOPS.join(", ").replace(/, ([^,]*)$/, " y $1")}, y la 1.ª edición del Summit en La Rural,
          en septiembre de 2026.
        </p>

        <div className="mt-12 border-t border-bone/15 pt-10">
          <h3 className="font-display text-[length:var(--text-step-2)] font-semibold italic leading-none text-bone">
            Mirá cómo fueron
          </h3>
          <ul className="mx-auto mt-8 flex max-w-[64rem] flex-wrap justify-center gap-3">
            {REELS.map((t) => (
              <li key={t.reel}>
                <a
                  href={`https://www.instagram.com/reel/${t.reel}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-bone/25 py-2 pl-2 pr-5 text-[length:var(--text-step--1)] text-bone/85 transition-colors duration-300 hover:border-champagne hover:text-bone"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-8 place-items-center rounded-full bg-bone/10 text-champagne transition-colors duration-300 group-hover:bg-champagne group-hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                  <span>
                    <span className="tabular-nums text-bone/50">{t.numero}</span> {t.titulo}
                  </span>
                  <span className="sr-only">(reel en Instagram, se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
