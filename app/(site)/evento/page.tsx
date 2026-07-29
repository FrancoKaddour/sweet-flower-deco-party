import type { Metadata } from "next";
import Image from "next/image";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { EventoHero } from "@/components/evento/EventoHero";
import { EventoStats } from "@/components/evento/EventoStats";
import { EdicionesScroll } from "@/components/evento/EdicionesScroll";
import {
  EVENT_NAME,
  EVENT_DATE_LABEL,
  EVENT_YEAR,
  EVENT_CUPO,
  EVENT_CTA_HREF,
  INCLUYE,
  DISERTANTES,
} from "@/content/evento";

export const metadata: Metadata = {
  title: "Event Summit",
  description: `${EVENT_NAME}: la ${8}ª edición, el ${EVENT_DATE_LABEL} de ${EVENT_YEAR}. Formación, comunidad y decoración de eventos de nivel. Cupos limitados (${EVENT_CUPO}).`,
  alternates: { canonical: "/evento" },
  openGraph: {
    title: `${EVENT_NAME} · ${EVENT_DATE_LABEL} ${EVENT_YEAR}`,
    description:
      "Un día para las que hacen de la decoración de eventos un oficio. Formación, comunidad y la escena que soñás.",
  },
};

export default function EventoPage() {
  return (
    <main id="main">
      {/* 1 · HERO cinematográfico (dark) */}
      <EventoHero />

      {/* 2 · QUÉ VAS A VIVIR (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">Qué vas a vivir</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]"
            >
              {/* TODO(contenido): titular real */}
              Un día pensado para las que crean en grande
            </RevealText>
          </div>
          <FadeUp
            y={60}
            className="flex flex-col gap-5 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70 lg:col-span-5"
          >
            {/* TODO(contenido): copy real de la experiencia */}
            <p>
              El {EVENT_NAME} no es una clase suelta: es una jornada completa
              para aprender, inspirarte y conocer a la gente que mueve el rubro.
            </p>
            <p>
              Charlas, oficio y comunidad en un mismo lugar. Te vas con ideas
              nuevas, contactos reales y ganas de llevar tus eventos al próximo
              nivel.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 3 · TRAYECTORIA con count-up (dark) */}
      <EventoStats />

      {/* 4 · QUÉ INCLUYE (light) */}
      <section
        id="incluye"
        data-theme="light"
        className="scroll-mt-24 bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow className="mb-5">Tu entrada incluye</Eyebrow>
              <h2 className="max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]">
                {/* TODO(contenido): titular real */}
                Todo lo que te llevás
              </h2>
            </div>
            <p className="max-w-[32ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/60">
              Una sola entrada, todo incluido. Sin letra chica.
            </p>
          </div>

          <FadeUp
            as="ul"
            y={50}
            stagger={0.08}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          >
            {INCLUYE.map((item, i) => (
              <li
                key={item.titulo}
                className="flex flex-col gap-3 bg-bone p-8 md:p-10"
              >
                <span className="font-display text-[length:var(--text-step--1)] tracking-[0.16em] text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.95] text-ink [overflow-wrap:anywhere]">
                  {item.titulo}
                </h3>
                <p className="font-sans text-[length:var(--text-step-0)] leading-snug text-ink/65">
                  {item.desc}
                </p>
              </li>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* 5 · EDICIONES · scroll horizontal pineado (dark) */}
      <EdicionesScroll />

      {/* 6 · DISERTANTES (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 md:mb-20">
            <Eyebrow className="mb-5">Quiénes enseñan</Eyebrow>
            <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]">
              {/* TODO(contenido): titular real */}
              Referentes del rubro, en vivo
            </h2>
          </div>

          <FadeUp
            as="div"
            y={60}
            stagger={0.1}
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {DISERTANTES.map((d, i) => (
              <article key={i} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-sand">
                  {/* TODO(contenido): foto real del disertante */}
                  <Image
                    src={`https://picsum.photos/seed/sfdp-diser-${i}/700/880`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover grayscale transition-all duration-[800ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                </div>
                <h3 className="mt-5 font-display text-[length:var(--text-step-2)] font-bold uppercase leading-tight text-ink">
                  {d.nombre}
                </h3>
                <p className="mt-1 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne">
                  {d.tema}
                </p>
              </article>
            ))}

            {/* Tile "más por confirmar" (honesto: hay 3 confirmados, faltan más) */}
            <article className="flex aspect-[4/5] flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-line p-8 text-center">
              <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.95] text-ink/40">
                Más
                <br /> por confirmar
              </p>
              <p className="mt-3 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-ink/40">
                {/* TODO(contenido): sumar disertantes al confirmarse */}
                Muy pronto
              </p>
            </article>
          </FadeUp>
        </div>
      </section>

      {/* 7 · INSCRIPCIÓN / cierre (dark, bordó — corte limpio) */}
      <section
        id="inscripcion"
        data-theme="dark"
        className="scroll-mt-24 bg-bordeaux px-6 py-24 text-bone md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">Reservá tu lugar</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-bone md:text-[length:var(--text-step-6)]"
              >
                {/* TODO(contenido): titular real */}
                Son 80 lugares. Nada más
              </RevealText>
              <p className="mt-8 max-w-[48ch] font-sans text-[length:var(--text-step-1)] leading-snug text-bone/75">
                {/* Copy real: pago por transferencia; MP suma recargo (§10). */}
                El {EVENT_DATE_LABEL} de {EVENT_YEAR}, presencial. Reservás por
                transferencia; si preferís Mercado Pago, se suma el recargo
                habitual (~18%).
              </p>
            </div>

            {/* Panel de datos + CTA */}
            <div className="lg:col-span-5 lg:justify-self-end">
              <dl className="flex flex-col gap-6 border-t border-bone/15 pt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/55">
                    Cupos
                  </dt>
                  <dd className="font-display text-[length:var(--text-step-3)] font-bold text-bone">
                    {EVENT_CUPO}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-t border-bone/15 pt-6">
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/55">
                    Valor
                  </dt>
                  {/* TODO(contenido): precio real (los números del audio son ambiguos). */}
                  <dd className="font-display text-[length:var(--text-step-3)] font-bold text-bone">
                    Consultar
                  </dd>
                </div>
              </dl>

              <Button
                href={EVENT_CTA_HREF}
                variant="inverse"
                className="mt-8 w-full justify-center"
              >
                Reservar mi lugar
              </Button>
              <p className="mt-4 text-center text-[length:var(--text-step--1)] text-bone/50">
                {/* TODO(contenido): apertura de inscripción online */}
                Te respondemos y coordinamos la seña.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
