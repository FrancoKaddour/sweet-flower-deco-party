import type { Metadata } from "next";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CirculoBadge } from "@/components/membresia/CirculoBadge";
import { ManifiestoScrub } from "@/components/membresia/ManifiestoScrub";
import { BeneficiosStack } from "@/components/membresia/BeneficiosStack";
import {
  CIRCULO_NOMBRE,
  MANIFIESTO,
  PARA_QUIEN,
  NO_ES_PARA,
  MEMBRESIA_CTA_HREF,
} from "@/content/membresia";

export const metadata: Metadata = {
  title: "Membresía",
  description:
    "El Círculo Sweet Flowers: la membresía para quienes viven de decorar. Comunidad, prioridad, descuentos y formación, todo el año.",
  alternates: { canonical: "/membresia" },
};

export default function MembresiaPage() {
  return (
    <main id="main">
      {/* 1 · HERO — momento bordó, pertenencia (dark) */}
      <section
        data-theme="dark"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-bordeaux px-6 py-32 text-bone md:px-10"
      >
        {/* Glow champagne sutil (decorativo) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-champagne/10 blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow className="mb-6">Membresía</Eyebrow>
            <RevealText
              as="h1"
              className="max-w-[12ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-bone [overflow-wrap:anywhere] md:text-[length:var(--text-step-7)]"
            >
              {/* TODO(contenido): validar el nombre "El Círculo" con Flor */}
              {CIRCULO_NOMBRE}
            </RevealText>
            <FadeUp y={30} delay={0.5}>
              <p className="mt-8 max-w-[42ch] font-sans text-[length:var(--text-step-1)] leading-snug text-bone/75">
                {/* TODO(contenido): bajada real */}
                Un lugar adentro, todo el año. Para las que hacen de la
                decoración un oficio, no un hobby.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button href={MEMBRESIA_CTA_HREF} variant="inverse">
                  Quiero ser parte
                </Button>
                <Button
                  href="#beneficios"
                  variant="outline"
                  className="border-bone/30 text-bone"
                >
                  Ver beneficios
                </Button>
              </div>
            </FadeUp>
          </div>

          {/* Sello giratorio */}
          <FadeUp y={40} delay={0.7} className="hidden lg:col-span-4 lg:block">
            <CirculoBadge className="ml-auto h-56 w-56 xl:h-64 xl:w-64" />
          </FadeUp>
        </div>
      </section>

      {/* 2 · MANIFIESTO — texto que se llena con el scroll (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-28 text-ink md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-[1100px]">
          <Eyebrow className="mb-10">Por qué existe</Eyebrow>
          {/* TODO(contenido): manifiesto real de Flor */}
          <ManifiestoScrub
            as="p"
            className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-4)]"
          >
            {MANIFIESTO}
          </ManifiestoScrub>
        </div>
      </section>

      {/* 3 · BENEFICIOS — cartas apiladas (light, el showpiece) */}
      <section
        id="beneficios"
        data-theme="light"
        className="scroll-mt-24 bg-bone px-6 pb-28 text-ink md:px-10 md:pb-40"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 md:mb-16">
            <Eyebrow className="mb-5">Qué incluye</Eyebrow>
            <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink">
              {/* TODO(contenido): titular real */}
              Cinco cartas. Todas a tu favor
            </h2>
          </div>
          <BeneficiosStack />
        </div>
      </section>

      {/* 4 · PARA QUIÉN ES / PARA QUIÉN NO — sinceridad (light, sage) */}
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
                    <span aria-hidden="true" className="mt-1 shrink-0 text-champagne">
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

      {/* 5 · CIERRE / ALTA — impacto final (dark) */}
      <section
        data-theme="dark"
        className="bg-ink px-6 py-28 text-bone md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <Eyebrow className="mb-6">Sumate</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="max-w-[13ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-bone [overflow-wrap:anywhere]"
              >
                {/* TODO(contenido): titular real */}
                Adentro se está mejor
              </RevealText>
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
                Quiero ser parte
              </Button>
              <p className="mt-4 text-center text-[length:var(--text-step--1)] text-bone/50">
                Te contamos todo y reservás tu lugar en el Círculo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
