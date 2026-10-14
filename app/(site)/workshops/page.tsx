import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import Image from "next/image";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import {
  APRENDIZAJES,
  PROXIMOS,
  PARA_QUIEN,
  WORKSHOPS_CTA_HREF,
} from "@/content/workshops";
import { EVENT_NAME, EVENT_WHEN } from "@/content/evento";

// ⚠️ Página con estructura final y textos PLACEHOLDER (ver content/workshops.ts).

export const metadata: Metadata = pageMetadata({
  title: "Workshops",
  description:
    "Workshops presenciales de decoración de eventos con Sweet Flowers: armado, diseño, telas y el negocio de decorar.",
  path: "/workshops",
});

export default function WorkshopsPage() {
  return (
    <main id="main">
      <BreadcrumbJsonLd items={[{ name: "Workshops", path: "/workshops" }]} />
      {/* ── 1 · INTRO ───────────────────────────────────────────────────── */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-16 pt-32 text-ink md:px-10 md:pb-24 md:pt-44"
      >
        <div className="mx-auto grid max-w-[87.5rem] gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow className="mb-6">Workshops</Eyebrow>
            <RevealText
              as="h1"
              className="max-w-[16ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-ink [overflow-wrap:anywhere]"
            >
              {/* TODO(contenido): titular real */}
              No es solo decoración, es un oficio
            </RevealText>
            <FadeUp y={40} delay={0.15} className="mt-8 border-t border-line pt-8">
              <p className="max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
                {/* TODO(contenido): bajada real */}
                Workshops presenciales para aprender a montar, diseñar y vender
                decoración de eventos con el método Sweet Flowers.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
                <Button href={WORKSHOPS_CTA_HREF}>Quiero sumarme</Button>
                <Button href="#proximos" variant="outline">
                  Próximos workshops
                </Button>
              </div>
            </FadeUp>
          </div>
          {/* Imagen firma: máscara en ARCO (identidad "EL ARCO") */}
          <FadeUp y={50} className="md:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[28.75rem] overflow-hidden rounded-t-full bg-sand">
              <Image
                src="https://picsum.photos/seed/sfdp-workshops-hero/900/1200"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 90vw, 460px"
                className="object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 2 · QUÉ VAS A APRENDER — índice editorial ──────────────────── */}
      <section data-theme="light" className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32">
        <div className="mx-auto max-w-[87.5rem]">
          <div className="mb-14 text-center md:mb-16">
            <Eyebrow className="mb-5">El programa</Eyebrow>
            <h2 className="mx-auto max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink">
              {/* TODO(contenido): titular real */}
              Lo que te llevás
            </h2>
          </div>
          <FadeUp as="ul" y={40} stagger={0.06} className="border-b border-line">
            {APRENDIZAJES.map((item, i) => (
              <li
                key={item.titulo}
                className="grid grid-cols-1 gap-2 border-t border-line py-7 md:grid-cols-12 md:items-baseline md:gap-8 md:py-9"
              >
                <span className="font-display text-[length:var(--text-step-3)] font-extrabold leading-none text-champagne md:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95] text-ink md:col-span-6">
                  {item.titulo}
                </h3>
                <p className="font-sans text-[length:var(--text-step-0)] leading-snug text-ink/60 md:col-span-4">
                  {item.desc}
                </p>
              </li>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── 3 · PRÓXIMOS WORKSHOPS (dark) ──────────────────────────────── */}
      <section
        id="proximos"
        data-theme="dark"
        className="scroll-mt-24 bg-ink px-6 py-24 text-bone md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[87.5rem]">
          <div className="mb-14 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow className="mb-5">Agenda</Eyebrow>
              <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone">
                Próximos workshops
              </h2>
            </div>
            <p className="max-w-[36ch] text-[length:var(--text-step-0)] text-bone/60">
              {/* TODO(contenido) */}
              Grupos reducidos, presenciales, con práctica real sobre piezas.
            </p>
          </div>
          <FadeUp as="ul" y={30} stagger={0.08} className="border-b border-bone/15">
            {PROXIMOS.map((w) => (
              <li
                key={w.titulo}
                className="grid grid-cols-1 gap-3 border-t border-bone/15 py-8 md:grid-cols-12 md:items-center md:gap-8"
              >
                <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne md:col-span-2">
                  {w.fecha}
                </span>
                <h3 className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95] md:col-span-5">
                  {w.titulo}
                </h3>
                <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60 md:col-span-3">
                  {w.modalidad} · {w.cupos}
                </span>
                <div className="md:col-span-2 md:justify-self-end">
                  <Button href={WORKSHOPS_CTA_HREF} variant="outline" tone="light">
                    Consultar
                  </Button>
                </div>
              </li>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── 4 · PARA QUIÉN ─────────────────────────────────────────────── */}
      <section data-theme="light" className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32">
        <div className="mx-auto max-w-[87.5rem]">
          <Eyebrow className="mb-5">Para quién</Eyebrow>
          <FadeUp y={40} stagger={0.08} className="mt-10 grid gap-12 md:grid-cols-3 md:gap-10">
            {PARA_QUIEN.map((p, i) => (
              <div key={p.titulo} className="border-t border-line pt-6">
                <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95]">
                  {p.titulo}
                </h3>
                <p className="mt-4 max-w-[34ch] text-[length:var(--text-step-0)] leading-snug text-ink/65">
                  {p.desc}
                </p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── 5 · GALERÍA — arcos ────────────────────────────────────────── */}
      <section data-theme="light" aria-label="Galería de workshops" className="bg-bone px-6 pb-24 md:px-10 md:pb-32">
        <FadeUp y={50} stagger={0.08} className="mx-auto grid max-w-[87.5rem] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {[1, 2, 3, 4].map((n, i) => (
            <div
              key={n}
              className={`relative aspect-[3/4] overflow-hidden rounded-t-full bg-sand ${i % 2 ? "md:mt-16" : ""}`}
            >
              {/* TODO(contenido): fotos reales de workshops */}
              <Image
                src={`https://picsum.photos/seed/sfdp-ws-gal-${n}/600/800`}
                alt=""
                fill
                sizes="(max-width: 768px) 45vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </FadeUp>
      </section>

      {/* ── 6 · CIERRE (bordó) + puente al Summit ──────────────────────── */}
      <section data-theme="dark" className="bg-bordeaux px-6 py-24 text-bone md:px-10 md:py-32">
        <div className="mx-auto flex max-w-[87.5rem] flex-col gap-16 md:flex-row md:items-end md:justify-between">
          <div>
            <RevealText
              as="h2"
              onScroll
              className="max-w-[14ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone"
            >
              {/* TODO(contenido): titular real */}
              Aprendé haciendo
            </RevealText>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
              <Button href={WORKSHOPS_CTA_HREF} variant="inverse">
                Quiero sumarme
              </Button>
            </div>
          </div>
          <div className="max-w-[34ch] border-t border-bone/20 pt-6">
            <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">
              {EVENT_WHEN}
            </p>
            <p className="mt-3 text-[length:var(--text-step-0)] leading-snug text-bone/75">
              ¿Buscás el encuentro grande del año? Conocé el {EVENT_NAME}.
            </p>
            <Button href="/event-summit" variant="outline" tone="light" className="mt-4">
              Ver el Summit
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
