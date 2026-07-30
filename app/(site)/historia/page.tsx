import type { Metadata } from "next";
import Image from "next/image";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Historia",
  description:
    "La historia de Sweet Flowers Deco Party: un emprendimiento familiar argentino que convirtió el oficio de decorar eventos en piezas, formación y comunidad.",
  alternates: { canonical: "/historia" },
};

// Datos REALES confirmados (docs/CONTENIDO_FLOR.md §1, §7, §8):
// marca casera/familiar · por encargo (~20 días) · responden Flor y Tobías ·
// equipo de 4-5 personas. El relato largo lo escribe Flor (⬜ pendiente).
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
      {/* 1 · HERO — retrato en arco + titular editorial (bone) */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-20 pt-32 text-ink md:px-10 md:pb-28 md:pt-44"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">Nuestra historia</Eyebrow>
            <RevealText
              as="h1"
              className="max-w-[14ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink [overflow-wrap:anywhere]"
            >
              {/* TODO(contenido): titular real */}
              Detrás de cada evento, Flor
            </RevealText>
            <FadeUp y={40} delay={0.15} className="mt-8 border-t border-line pt-8">
              <p className="max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
                {/* TODO(contenido): bajada real */}
                Un emprendimiento familiar argentino que convirtió el oficio de
                decorar en piezas, formación y comunidad.
              </p>
            </FadeUp>
          </div>

          {/* Retrato en arco (identidad El Arco) */}
          <FadeUp y={60} className="lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-[min(100%,420px)] overflow-hidden rounded-t-full bg-sand">
              {/* TODO(contenido): retrato real de Flor en su taller. */}
              <Image
                src="https://picsum.photos/seed/sfdp-historia-flor/700/1000"
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
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
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12">
          <FadeUp
            y={60}
            className="space-y-6 font-sans text-[length:var(--text-step-1)] leading-relaxed text-ink/80 lg:col-span-7 lg:col-start-4"
          >
            {/* TODO(contenido): la historia REAL la escribe Flor (⬜ pendiente —
                docs/CONTENIDO_FLOR.md §9). Este relato es placeholder. */}
            <p>
              Sweet Flowers empezó como un sueño chiquito: una mesa, unas flores
              y las ganas de que cada celebración se sintiera única. Flor cosía,
              probaba y desarmaba hasta que cada pieza quedaba impecable, porque
              lo hecho a mano tiene una calidez que no se improvisa.
            </p>
            <p>
              Con los años, ese oficio artesanal se volvió un lenguaje propio:
              estructuras, telas y terminaciones pensadas al detalle, para que
              la escena hable sin gritar.
            </p>
            <p>
              Hoy ese camino creció hasta el Summit y una comunidad de mujeres
              que se animan a crear en grande. Más que decorar eventos, Sweet
              Flowers forma, acompaña y deja algo que queda mucho después de que
              se apagan las luces.
            </p>
            <p className="pt-4 font-display text-[length:var(--text-step-2)] font-bold text-ink">
              {/* TODO(contenido): firma real */}— Flor, fundadora
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 3 · CÓMO TRABAJAMOS — momento oscuro (botanical) con datos reales */}
      <section
        data-theme="dark"
        className="bg-botanical px-6 py-24 text-bone md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <Eyebrow className="mb-6">Cómo trabajamos</Eyebrow>
          <RevealText
            as="h2"
            onScroll
            className="max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-5)]"
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
              <div key={item.titulo} className="border-t border-bone/15 pt-6">
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

      {/* 4 · PUENTE AL SUMMIT + CIERRE (bone) */}
      <section
        data-theme="light"
        className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow className="mb-6">El siguiente capítulo</Eyebrow>
            <RevealText
              as="h2"
              onScroll
              className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink"
            >
              {/* 7 ediciones reales del Summit (docs/CONTENIDO_FLOR.md §11) */}
              Siete ediciones después, seguimos empezando
            </RevealText>
            <p className="mt-6 max-w-[48ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
              Lo que arrancó en un taller hoy junta a la industria entera una
              vez al año. La próxima edición del Summit ya tiene fecha.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-self-end">
            <Button href="/evento">Conocer el Summit</Button>
            <Button href="/contacto" variant="outline">
              Escribinos
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
