import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CATEGORIAS } from "@/content/catalogo";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de piezas de decoración de eventos: estructuras de hierro, catering, pies de lámpara, fundas y telas. Piezas en stock o a medida, hechas por encargo.",
  alternates: { canonical: "/productos" },
};

export default function ProductosPage() {
  return (
    <main id="main">
        {/* ── INTRO DEL CATÁLOGO ─────────────────────────────────────────── */}
        <section
          data-theme="light"
          className="bg-bone px-6 pb-16 pt-32 text-ink md:px-10 md:pb-24 md:pt-44"
        >
          <div className="mx-auto max-w-[1400px]">
            <Eyebrow className="mb-6">El catálogo</Eyebrow>
            <RevealText
              as="h1"
              className="max-w-[18ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-ink [overflow-wrap:anywhere]"
            >
              {/* TODO(contenido): titular real del catálogo */}
              La materia de cada fiesta
            </RevealText>

            <FadeUp
              y={40}
              delay={0.15}
              className="mt-8 flex flex-col gap-8 border-t border-line pt-8 md:mt-12 md:flex-row md:items-end md:justify-between"
            >
              <p className="max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
                {/* TODO(contenido): bajada real */}
                Ordenamos el catálogo por materialidad, no por moda. Cada pieza
                está pensada para armarse, transportarse y volver a brillar en el
                próximo evento.
              </p>
              {/* Dato honesto de operación (docs/CONTENIDO_FLOR.md §1). */}
              <dl className="flex shrink-0 flex-wrap gap-x-10 gap-y-6">
                <div>
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-champagne">
                    Categorías
                  </dt>
                  <dd className="mt-1 font-display text-[length:var(--text-step-3)] font-bold text-ink">
                    0{CATEGORIAS.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-champagne">
                    Producción
                  </dt>
                  {/* TODO(contenido): confirmar demora final con Flor (≈20 días). */}
                  <dd className="mt-1 font-display text-[length:var(--text-step-3)] font-bold text-ink">
                    Por encargo
                  </dd>
                </div>
              </dl>
            </FadeUp>
          </div>
        </section>

        {/* ── CATEGORÍAS · filas editoriales alternadas ──────────────────── */}
        <section
          data-theme="light"
          aria-label="Categorías del catálogo"
          className="bg-bone px-6 pb-24 text-ink md:px-10 md:pb-32"
        >
          <div className="mx-auto flex max-w-[1400px] flex-col gap-20 md:gap-28">
            {CATEGORIAS.map((cat, i) => {
              const flip = i % 2 === 1; // alternamos el lado de la imagen
              return (
                <FadeUp
                  key={cat.slug}
                  y={60}
                  as="article"
                  className="group grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12"
                >
                  {/* Imagen */}
                  <Link
                    href={`/productos/${cat.slug}`}
                    aria-label={`Ver categoría ${cat.nombre}`}
                    className={`relative block overflow-hidden rounded-[var(--radius-lg)] bg-sand md:col-span-7 ${
                      flip ? "md:order-2 md:col-start-6" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full md:aspect-[16/11]">
                      {/* TODO(contenido): foto real representativa de la categoría */}
                      <Image
                        src={cat.img}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                      />
                    </div>
                    {/* Índice sobre la foto */}
                    <span className="absolute left-5 top-4 font-display text-[length:var(--text-step-2)] font-bold text-bone mix-blend-difference">
                      {cat.index}
                    </span>
                  </Link>

                  {/* Texto */}
                  <div
                    className={`md:col-span-5 ${
                      flip ? "md:order-1 md:col-start-1" : "md:col-start-8"
                    }`}
                  >
                    <h2 className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink">
                      {cat.nombre}
                    </h2>
                    <p className="mt-5 max-w-[42ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
                      {cat.desc}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
                      {cat.incluye.map((item) => (
                        <li
                          key={item}
                          className="rounded-[var(--radius-pill)] border border-line px-4 py-1.5 text-[length:var(--text-step--1)] text-ink/70"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/productos/${cat.slug}`}
                      className="group/cta mt-6 inline-flex min-h-11 items-center gap-2 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.1em] text-ink"
                    >
                      <span className="border-b border-ink pb-1">
                        Ver {cat.nombre}
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── A MEDIDA · momento oscuro (corte limpio) ───────────────────── */}
        <section
          data-theme="dark"
          className="bg-bordeaux px-6 py-24 text-bone md:px-10 md:py-32"
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <Eyebrow className="mb-6">A medida</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="max-w-[20ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone"
              >
                {/* TODO(contenido): titular real de "a medida" */}
                ¿No lo ves? Lo hacemos para vos
              </RevealText>
              <p className="mt-6 max-w-[52ch] font-sans text-[length:var(--text-step-1)] leading-snug text-bone/75">
                {/* Copy real: se cotiza; la demora depende de la complejidad
                    (docs/CONTENIDO_FLOR.md §6). No prometemos plazos exactos. */}
                Trabajamos mayormente por encargo. Contanos qué pieza tenés en la
                cabeza y la cotizamos: la demora depende de la complejidad, y
                cada estructura se piensa para tu evento.
              </p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Button href="/contacto" variant="inverse">
                Pedir presupuesto
              </Button>
            </div>
          </div>
        </section>
      </main>
  );
}
