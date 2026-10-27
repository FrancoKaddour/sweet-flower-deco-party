import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import Image from "next/image";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { EVENT_WHEN } from "@/content/evento";

export const metadata: Metadata = pageMetadata({
  title: "Historia",
  description:
    "Sweet Flowers Deco Party: emprendimiento familiar de Tortuguitas que fabrica estructuras de hierro, catering, fundas y telas para decoradoras, y organiza el Event Summit.",
  path: "/historia",
});

// Datos REALES confirmados (docs/CONTENIDO_FLOR.md §1, §7, §8):
// marca casera/familiar · por encargo (~20 días) · responden Flor y Tobías ·
// equipo de 4-5 personas. El relato largo lo escribe Flor (⬜ pendiente).
// Mientras tanto (auditoría E-27, decisión 4): tercera persona, sin firma,
// solo hechos confirmados. TODO(contenido): historia de Flor en primera persona.
const COMO_TRABAJAMOS = [
  {
    titulo: "Familiar de verdad",
    desc: "Somos un equipo chico. Cuando escribís, te responden Flor o Tobías — no un call center.",
  },
  {
    titulo: "Por encargo",
    desc: "Cerramos producción por semana y fabricamos tu pedido: contá alrededor de 20 días.",
  },
  {
    titulo: "Oficio, no fórmula",
    desc: "Cada estructura se piensa para su evento. Si no existe, la cotizamos y la hacemos.",
  },
] as const;

export default function HistoriaPage() {
  return (
    <main id="main">
      <BreadcrumbJsonLd items={[{ name: "Historia", path: "/historia" }]} />
      {/* 1 · HERO — retrato en arco + titular editorial (bone) */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-20 pt-32 text-ink md:px-10 md:pb-28 md:pt-44"
      >
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">Nuestra historia</Eyebrow>
            <RevealText
              as="h1"
              className="max-w-[14ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink [overflow-wrap:break-word] [text-wrap:balance]"
            >
              {/* TODO(contenido): titular real */}
              Un taller familiar en Tortuguitas
            </RevealText>
            <FadeUp y={40} delay={0.15} className="mt-8 border-t border-line pt-8">
              <p className="max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
                Estructuras, catering, fundas y telas para decoradoras de todo el
                país. Y, desde 2024, encuentros para formarse en el rubro.
              </p>
            </FadeUp>
          </div>

          {/* Retrato en arco (identidad El Arco) */}
          <FadeUp y={60} className="lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-[min(100%,420px)] overflow-hidden rounded-t-full bg-sand">
              {/* Foto real del equipo en la 1ª edición del Summit (D-14: nada de
                  stock). TODO(contenido): retrato de Flor en su taller. */}
              <Image
                src="/img/summit/lg/sum-01.webp"
                alt="Remera del equipo Sweet Flowers en la 1ª edición del Event Summit"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-[64%_40%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-bordeaux/20 mix-blend-multiply" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2 · EL RELATO (bone → prosa editorial) */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-24 text-ink md:px-10 md:pb-32"
      >
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-10 lg:grid-cols-12">
          <FadeUp
            y={60}
            className="w-full max-w-[40rem] space-y-6 justify-self-center font-sans text-[length:var(--text-step-1)] leading-relaxed text-ink/80 lg:col-span-7 lg:col-start-4 lg:max-w-none lg:justify-self-stretch"
          >
            <p>
              Sweet Flowers Deco Party es un emprendimiento familiar de
              Tortuguitas, Buenos Aires. Fabrica estructuras de hierro, piezas
              para catering, fundas y telas sublimadas para decoradoras y
              organizadores de eventos de todo el país.
            </p>
            <p>
              Trabaja por encargo: cada pedido se produce cuando se confirma, y
              del otro lado del WhatsApp responden Flor y Tobías, en persona.
            </p>
            <p>
              Desde 2024 organiza workshops para el rubro —siete, en CABA,
              Puerto Madero, La Rioja y Río Cuarto— y en septiembre de 2026 hizo
              la primera edición del Sweet Flowers Event Summit, en La Rural. La
              segunda es el {EVENT_WHEN}.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 3 · CÓMO TRABAJAMOS — momento oscuro (botanical) con datos reales */}
      <section
        data-theme="dark"
        className="bg-botanical px-6 py-24 text-bone md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[87.5rem] text-center">
          <Eyebrow className="mb-6">Cómo trabajamos</Eyebrow>
          <RevealText
            as="h2"
            onScroll
            className="mx-auto max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-5)]"
          >
            {/* TODO(contenido): titular real */}
            Chico por elección, serio por oficio
          </RevealText>

          <FadeUp
            as="div"
            y={50}
            stagger={0.1}
            className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:mt-20 md:grid-cols-3"
          >
            {COMO_TRABAJAMOS.map((item, i) => (
              <div key={item.titulo} className="border-t border-bone/15 pt-6 text-center">
                <span className="font-display text-[length:var(--text-step--1)] tracking-[0.2em] text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.95] text-bone">
                  {item.titulo}
                </h3>
                <p className="mt-3 font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/70">
                  {item.desc}
                </p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* 4 · PUENTE AL SUMMIT + CIERRE (bone) — a dos columnas desde lg (D-15):
          título ancho a la izquierda; foto en arco, texto y CTAs a la derecha. */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">El siguiente capítulo</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink [text-wrap:balance] lg:max-w-[19ch] lg:text-[length:var(--text-step-6)]"
            >
              Siete workshops y un Summit después, seguimos empezando
            </RevealText>
          </div>
          <FadeUp y={40} className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[999px] bg-sand lg:aspect-[5/4]">
              <Image
                src="/img/summit/lg/sum-26.webp"
                alt="Asistentes escuchando una charla en la 1ª edición del Event Summit"
                fill
                sizes="(max-width: 1024px) 90vw, 36vw"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <p className="mt-8 max-w-[44ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
              Siete workshops, una primera edición en La Rural y una segunda que
              ya tiene fecha: el {EVENT_WHEN}.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <Button href="/event-summit">Conocer el Summit</Button>
              <Button href="/contacto" variant="outline">
                Escribinos
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
