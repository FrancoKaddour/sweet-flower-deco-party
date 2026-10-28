import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { SummitInscripcion } from "@/components/evento/SummitInscripcion";
import { Pases } from "@/components/evento/Pases";
import { BreadcrumbJsonLd, SummitJsonLd } from "@/components/site/JsonLd";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventoHero } from "@/components/evento/EventoHero";
import { SummitIntro } from "@/components/evento/SummitIntro";
import { SummitEscenas } from "@/components/evento/SummitEscenas";
import { EventoStats } from "@/components/evento/EventoStats";
import { EdicionesScroll } from "@/components/evento/EdicionesScroll";
import { Duotone } from "@/components/evento/Duotone";
import { TelefonoClub } from "@/components/newsletter/TelefonoClub";
import { BarraCompraMovil } from "@/components/evento/BarraCompraMovil";
import { QuedanLugares, type Cupo } from "@/components/evento/QuedanLugares";
import { FaqLista } from "@/components/seo/FaqLista";
import { FAQ_SUMMIT } from "@/content/seo/faqs";
import { quedanLugares, reservasEnCurso } from "@/modules/summit/core";
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
  preventaVigente,
} from "@/content/evento";

// Precios, preventa y lugares cambian con el tiempo: se regenera cada 5 min.
export const revalidate = 300;

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: `${EVENT_NAME} ${EVENT_YEAR}`,
    description: `${EVENT_NAME}: la cumbre argentina de la decoración y la organización de eventos. ${EDICION_NUMERO}ª edición: ${EVENT_WHEN}. Charlas, certificado y comunidad. Cupo de ${EVENT_CUPO} lugares. ${preventaVigente() ? "Preventa abierta" : "Inscripción abierta"}.`,
    path: "/event-summit",
    ogTitle: `${EVENT_NAME} · ${EVENT_WHEN}`,
  });
}

/** Lugares que quedan y pagos en curso (null si la base no responde: no se muestra nada). */
async function lugares(): Promise<Cupo> {
  try {
    const [quedan, pagando] = await Promise.all([quedanLugares(), reservasEnCurso()]);
    return { quedan, pagando };
  } catch {
    return null;
  }
}

export default async function EventoPage() {
  const cupo = await lugares();
  return (
    <main id="main">
      <BreadcrumbJsonLd items={[{ name: "Event Summit", path: "/event-summit" }]} />
      <SummitJsonLd />
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
              className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink [text-wrap:balance]"
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
              <p className="absolute bottom-5 left-5 right-5 max-w-[24ch] font-display md:bottom-8 md:left-8 text-[length:var(--text-step-1)] font-bold uppercase leading-[0.95] text-bone">
                {/* TODO(contenido): caption real */}
                Una sala. Toda la industria.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 3 · TRAYECTORIA con count-up (dark) */}
      <EventoStats />

      {/* 4 · PASES (VIP / General): precio de hoy → formulario con pago online */}
      <Pases cupo={cupo} />

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
                className="relative flex h-[13rem] flex-col justify-between overflow-hidden rounded-[var(--radius-md)] border border-bone/15 bg-gradient-to-b from-bordeaux/25 to-ink p-6 sm:h-[18.75rem] md:h-[23.75rem] md:p-7"
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

      {/* 6b · PREGUNTAS antes de pagar (light) + FAQPage JSON-LD */}
      <section
        id="preguntas"
        data-theme="light"
        className="scroll-mt-24 bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Desktop/notebook: el título acompaña el scroll mientras se leen las preguntas */}
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <Eyebrow className="mb-6">Antes de inscribirte</Eyebrow>
            <h2 className="max-w-[12ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] lg:text-[length:min(var(--text-step-5),3.3vw)] tracking-[-0.02em] text-ink [text-wrap:balance]">
              Lo que más nos preguntan
            </h2>
          </div>
          <div className="lg:col-span-8">
            <FaqLista faqs={FAQ_SUMMIT} nombre="faq-summit" />
          </div>
        </div>
      </section>

      {/* 7 · INSCRIPCIÓN — cierre cinematográfico full-bleed (dark) */}
      <section
        id="inscripcion"
        data-theme="dark"
        className="relative isolate scroll-mt-24 overflow-hidden bg-ink px-6 py-20 text-bone md:px-10 md:py-24"
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
          {/* Arriba y centrado: el mensaje */}
          <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
            <Eyebrow className="mb-4">Reservá tu lugar</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="font-display text-[length:min(var(--text-step-5),7svh)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone [text-wrap:balance]"
            >
              {/* TODO(contenido): titular real */}
              {`Son ${EVENT_CUPO} lugares. Nada más.`}
            </RevealText>
            <QuedanLugares cupo={cupo} className="mt-3 text-champagne" />
            <p className="mt-4 max-w-[60ch] font-sans text-[length:var(--text-step--1)] leading-relaxed text-bone/80 md:text-[length:var(--text-step-0)]">
              {EDICION_LABEL} · {EVENT_WHEN} · {EVENT_HORARIO}
              {EVENT_SEDE ? ` · ${EVENT_SEDE}` : ""}. Elegí tu pase, pagá
              online con Mercado Pago y tu lugar queda confirmado al instante.
            </p>
          </div>

          {/* Debajo: formulario a la izquierda, el teléfono a la derecha */}
          <div className="mt-10 grid grid-cols-1 items-center gap-12 md:mt-12 lg:grid-cols-12 lg:gap-10">
            <div className="w-full max-w-[34rem] lg:col-span-6 lg:pl-[4%]">
              <SummitInscripcion />
            </div>
            <div className="lg:col-span-6">
              <TelefonoClub variante="inscripcion" />
            </div>
          </div>
        </div>
      </section>

      <BarraCompraMovil />
    </main>
  );
}
