import type { Metadata } from "next";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { EventoHero } from "@/components/evento/EventoHero";
import { EventoStats } from "@/components/evento/EventoStats";
import { EdicionesScroll } from "@/components/evento/EdicionesScroll";
import { Duotone } from "@/components/evento/Duotone";
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
  description: `${EVENT_NAME}: la 8ª edición, el ${EVENT_DATE_LABEL} de ${EVENT_YEAR}. Formación, comunidad y decoración de eventos de nivel. Cupos limitados (${EVENT_CUPO}).`,
  alternates: { canonical: "/evento" },
  openGraph: {
    title: `${EVENT_NAME} · ${EVENT_DATE_LABEL} ${EVENT_YEAR}`,
    description:
      "Un día al año, la decoración de eventos se junta en un mismo lugar. Formación, comunidad y la escena que soñás.",
  },
};

export default function EventoPage() {
  return (
    <main id="main">
      {/* 1 · HERO cinematográfico (dark) */}
      <EventoHero />

      {/* 2 · LA EXPERIENCIA — spread editorial (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
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
                src="https://picsum.photos/seed/sfdp-evento-exp/1200/1400"
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

      {/* 4 · QUÉ INCLUYE — índice editorial (light), sin tarjetas */}
      <section
        id="incluye"
        data-theme="light"
        className="scroll-mt-24 bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 text-center md:mb-16">
            <Eyebrow className="mb-5">Tu entrada incluye</Eyebrow>
            <h2 className="mx-auto max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink">
              {/* TODO(contenido): titular real */}
              Una entrada. Todo adentro.
            </h2>
          </div>

          <FadeUp as="ul" y={40} stagger={0.06} className="border-b border-line">
            {INCLUYE.map((item, i) => (
              <li
                key={item.titulo}
                className="group grid grid-cols-1 gap-2 border-t border-line py-7 md:grid-cols-12 md:items-baseline md:gap-8 md:py-9"
              >
                <span className="font-display text-[length:var(--text-step-3)] font-extrabold leading-none text-champagne md:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95] text-ink [overflow-wrap:anywhere] md:col-span-6">
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

      {/* 5 · EDICIONES · scroll horizontal pineado (dark) */}
      <EdicionesScroll />

      {/* 6 · DISERTANTES — intriga (dark), sin caras grises */}
      <section
        data-theme="dark"
        className="bg-ink px-6 py-24 text-bone md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow className="mb-6">Quiénes enseñan</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="max-w-[18ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone"
              >
                {/* TODO(contenido): titular real */}
                Más de 20 referentes ya pasaron por acá
              </RevealText>
            </div>
            <p className="font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/60 lg:col-span-4">
              Los tres nombres de esta edición están confirmados. Los anunciamos
              muy pronto.
            </p>
          </div>

          {/* Slots de intriga (no fotos placeholder) */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-20">
            {DISERTANTES.map((_, i) => (
              <div
                key={i}
                className="relative flex h-[300px] flex-col justify-between overflow-hidden rounded-[var(--radius-md)] border border-bone/15 bg-gradient-to-b from-bordeaux/25 to-ink p-7 md:h-[380px]"
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
          src="https://picsum.photos/seed/sfdp-evento-cierre/1920/1400"
          sizes="100vw"
          scrim="full"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />

        <div className="relative mx-auto max-w-[1400px]">
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
                {/* Copy real: pago por transferencia; MP suma recargo (§10). */}
                El {EVENT_DATE_LABEL} de {EVENT_YEAR}, presencial. Reservás por
                transferencia; si preferís Mercado Pago, se suma el recargo
                habitual (~18%).
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
                  {/* TODO(contenido): precio real (los números del audio son ambiguos). */}
                  <dd className="font-display text-[length:var(--text-step-4)] font-extrabold text-bone">
                    Consultar
                  </dd>
                </div>
              </dl>

              <Button
                href={EVENT_CTA_HREF}
                variant="inverse"
                className="mt-8 w-full justify-center"
              >
                Quiero mi lugar
              </Button>
              <p className="mt-4 text-center text-[length:var(--text-step--1)] text-bone/55">
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
