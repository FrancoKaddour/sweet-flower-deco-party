import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { SummitInscripcion } from "@/components/evento/SummitInscripcion";
import { Pases } from "@/components/evento/Pases";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventoHero } from "@/components/evento/EventoHero";
import { SummitIntro } from "@/components/evento/SummitIntro";
import { SummitEscenas } from "@/components/evento/SummitEscenas";
import { EventoStats } from "@/components/evento/EventoStats";
import { EdicionesScroll } from "@/components/evento/EdicionesScroll";
import { Duotone } from "@/components/evento/Duotone";
import {
  EVENT_NAME,
  EVENT_WHEN,
  EDICION_NUMERO,
  EVENT_CUPO,
  DISERTANTES,
  EVENT_YEAR,
  EDICION_LABEL,
  EVENT_SEDE,
  EVENT_HORARIO,
  EVENT_PRECIO,
} from "@/content/evento";

export const metadata: Metadata = pageMetadata({
  title: `${EVENT_NAME} ${EVENT_YEAR}`,
  description: `${EVENT_NAME}: la cumbre argentina de la decoración y la organización de eventos. ${EDICION_NUMERO}ª edición: ${EVENT_WHEN}. Charlas, certificado y comunidad. Cupo de ${EVENT_CUPO} lugares. Pre-preventa abierta.`,
  path: "/event-summit",
  ogTitle: `${EVENT_NAME} · ${EVENT_WHEN}`,
});

export default function EventoPage() {
  return (
    <main id="main">
      <BreadcrumbJsonLd items={[{ name: "Event Summit", path: "/event-summit" }]} />
      {/* 1 · HERO cinematográfico (dark) */}
      <EventoHero />

      {/* 1b · INTRO editorial (dark) — estructura/motion de depuydthaarden.be */}
      <SummitIntro />

      {/* 1c · ESCENAS pineadas (dark) — estructura/motion de depuydthaarden.be */}
      <SummitEscenas />

      {/* 2 · LA EXPERIENCIA — spread editorial (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Texto */}
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">La experiencia</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink"
            >
              {/* TODO(contenido): titular real */}
              Entrás por la decoración. Te quedás por la gente.
            </RevealText>
            <FadeUp
              y={40}
              className="mt-8 flex flex-col gap-5 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70"
            >
              <p>
                No es una clase suelta. Es la jornada en la que el rubro entero
                se mira a la cara: aprende, se inspira y se reconoce.
              </p>
              <p>
                Te vas con ideas que no estaban en ningún feed, contactos que
                valen oro y la certeza de que jugás en otra liga.
              </p>
            </FadeUp>
          </div>

          {/* Imagen editorial con caption */}
          <FadeUp y={60} className="lg:col-span-7">
            <div className="relative">
              <Duotone
                src="/img/summit/lg/sum-08.webp"
                sizes="(max-width: 1024px) 100vw, 58vw"
                scrim="bottom"
                className="aspect-[4/3] w-full rounded-[var(--radius-lg)] md:aspect-[5/4]"
              />
              <p className="absolute bottom-6 left-6 max-w-[24ch] font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[0.95] text-bone">
                {/* TODO(contenido): caption real */}
                Una sala. Toda la industria.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 3 · TRAYECTORIA con count-up (dark) */}
      <EventoStats />

      {/* 4 · PASES (VIP / General) con precios de preventa → WhatsApp */}
      <Pases />

      {/* 5 · EDICIONES · scroll horizontal pineado (dark) */}
      <EdicionesScroll />

      {/* 6 · DISERTANTES — intriga (dark), sin caras grises */}
      <section
        data-theme="dark"
        className="bg-ink px-6 py-24 text-bone md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[87.5rem]">
          <div className="text-center">
            <Eyebrow className="mb-6">Quiénes enseñan</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="mx-auto max-w-[18ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone"
            >
              {/* TODO(contenido): titular real */}
              Más de 20 referentes ya pasaron por acá
            </RevealText>
          </div>

          {/* Slots de intriga (no fotos placeholder) */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-20">
            {DISERTANTES.map((_, i) => (
              <div
                key={i}
                className="relative flex h-[18.75rem] flex-col justify-between overflow-hidden rounded-[var(--radius-md)] border border-bone/15 bg-gradient-to-b from-bordeaux/25 to-ink p-7 md:h-[23.75rem]"
              >
                <div className="evt-grain pointer-events-none absolute inset-0" />
                <span className="relative font-display text-[length:var(--text-step-4)] font-extrabold leading-none text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.95] text-bone/85">
                    Por anunciar
                  </p>
                  <p className="mt-2 text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/45">
                    Confirmado · se revela pronto
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · INSCRIPCIÓN — cierre cinematográfico full-bleed (dark) */}
      <section
        id="inscripcion"
        data-theme="dark"
        className="relative scroll-mt-24 overflow-hidden px-6 py-28 text-bone md:px-10 md:py-40"
      >
        {/* Fondo full-bleed con duotono */}
        <Duotone
          src="/img/summit/lg/sum-16.webp"
          sizes="100vw"
          scrim="full"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />

        <div className="relative mx-auto max-w-[87.5rem]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">Reservá tu lugar</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="max-w-[14ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-bone [overflow-wrap:anywhere]"
              >
                {/* TODO(contenido): titular real */}
                {`Son ${EVENT_CUPO} lugares. Nada más.`}
              </RevealText>
              <p className="mt-8 max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-bone/80">
                {EDICION_LABEL} · {EVENT_WHEN} · {EVENT_HORARIO}
                {EVENT_SEDE ? ` · ${EVENT_SEDE}` : ""}. Dejanos tus datos y
                coordinamos tu pase y el pago de la preventa por WhatsApp.
              </p>
            </div>

            <div className="lg:col-span-5 lg:justify-self-end">
              <dl className="flex flex-col gap-6 border-t border-bone/20 pt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/55">
                    Cupos
                  </dt>
                  <dd className="font-display text-[length:var(--text-step-4)] font-extrabold text-bone">
                    {EVENT_CUPO}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-t border-bone/20 pt-6">
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/55">
                    Valor
                  </dt>
                  <dd className="font-display text-[length:var(--text-step-3)] font-extrabold text-bone">
                    {EVENT_PRECIO ?? "Preventa"}
                  </dd>
                </div>
              </dl>

              <div className="mt-10">
                <SummitInscripcion />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
