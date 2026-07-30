import type { Metadata } from "next";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { HeroUmbral } from "@/components/membresia/HeroUmbral";
import { ArcoPortal } from "@/components/membresia/ArcoPortal";
import { BeneficiosVentana } from "@/components/membresia/BeneficiosVentana";
import {
  MANIFIESTO,
  PARA_QUIEN,
  NO_ES_PARA,
  MEMBRESIA_CTA_HREF,
} from "@/content/membresia";

export const metadata: Metadata = {
  title: "Membresía",
  description:
    "El Círculo Sweet Flowers: la membresía para quienes viven de decorar. Se entra por el arco: comunidad, prioridad y el oficio compartido, todo el año.",
  alternates: { canonical: "/membresia" },
};

/**
 * /membresia — identidad EL ARCO (docs/20_MOTION_REFERENCIAS_ANALISIS.md).
 * Narrativa en 5 escenas: el umbral (arcos que se levantan) → el cruce (portal
 * que atravesás scrolleando) → adentro (beneficios con ventana de arco, bordó)
 * → la sinceridad (sage) → la decisión (tinta).
 */
export default function MembresiaPage() {
  return (
    <main id="main">
      {/* ESCENA 1 · EL UMBRAL (bone) */}
      <HeroUmbral />

      {/* ESCENA 2 · EL CRUCE — portal pineado (bone → bordó) */}
      <ArcoPortal />

      {/* ESCENA 3 · ADENTRO — beneficios con ventana de arco (bordó) */}
      <BeneficiosVentana />

      {/* ESCENA 4 · LA SINCERIDAD (sage) */}
      <section
        data-theme="light"
        className="bg-sage px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 md:mb-20">
            <Eyebrow className="mb-5">Sin vueltas</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]"
            >
              {/* TODO(contenido): titular real */}
              No es para todas. Y está bien
            </RevealText>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <FadeUp y={50}>
              <h3 className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">
                Es para vos si…
              </h3>
              <ul className="mt-6">
                {PARA_QUIEN.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-ink/15 py-5 font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[1.05] text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-champagne"
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>

            <FadeUp y={50} delay={0.15}>
              <h3 className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-ink/50">
                No es para vos si…
              </h3>
              <ul className="mt-6">
                {NO_ES_PARA.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-ink/15 py-5 font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[1.05] text-ink/45"
                  >
                    <span aria-hidden="true" className="mt-1 shrink-0">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ESCENA 5 · LA DECISIÓN (tinta) */}
      <section
        data-theme="dark"
        className="bg-ink px-6 py-28 text-bone md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <Eyebrow className="mb-6">La decisión</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="max-w-[13ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-bone [overflow-wrap:anywhere]"
              >
                {/* TODO(contenido): titular real */}
                Adentro se está mejor
              </RevealText>
              <p className="mt-8 max-w-[52ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/65">
                {/* TODO(contenido): manifiesto real de Flor */}
                {MANIFIESTO}
              </p>
            </div>

            <div className="lg:col-span-4 lg:justify-self-end">
              <dl className="border-t border-bone/20 pt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/55">
                    Valor mensual
                  </dt>
                  {/* TODO(contenido): precio y plan reales (ADR-014 — NO inventar). */}
                  <dd className="font-display text-[length:var(--text-step-3)] font-extrabold text-bone">
                    $ —
                  </dd>
                </div>
                <p className="mt-2 text-right text-[length:var(--text-step--1)] text-bone/45">
                  A confirmar con la apertura de inscripción
                </p>
              </dl>
              <Button
                href={MEMBRESIA_CTA_HREF}
                variant="inverse"
                className="mt-8 w-full justify-center"
              >
                Quiero entrar
              </Button>
              <p className="mt-4 text-center text-[length:var(--text-step--1)] text-bone/50">
                Te contamos todo y reservás tu lugar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
