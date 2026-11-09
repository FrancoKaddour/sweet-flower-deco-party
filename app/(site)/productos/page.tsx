import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { getCategorias } from "@/modules/catalog/repository";

export const metadata: Metadata = pageMetadata({
  title: "Productos",
  description:
    "Catálogo de piezas para decoración de eventos: estructuras y arcos de hierro, catering, pies de lámpara, fundas y telas sublimadas. Por encargo, con envíos a todo el país.",
  path: "/productos",
});

export const revalidate = 300;

export default async function ProductosPage() {
  const CATEGORIAS = await getCategorias();
  return (
    <main id="main">
      <BreadcrumbJsonLd items={[{ name: "Productos", path: "/productos" }]} />
        {/* ── INTRO DEL CATÁLOGO ─────────────────────────────────────────── */}
        <section
          data-theme="light"
          className="bg-bone px-6 pb-16 pt-32 text-ink md:px-10 md:pb-24 md:pt-44"
        >
          <div className="mx-auto max-w-[87.5rem]">
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

        {/* ── CATEGORÍAS · tres columnas (una por fila en celular) ─────────── */}
        <section
          data-theme="light"
          aria-label="Categorías del catálogo"
          className="bg-bone px-6 pb-24 text-ink md:px-10 md:pb-32"
        >
          <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-x-6 gap-y-16 sm:max-w-xl md:max-w-[87.5rem] md:grid-cols-3 md:gap-y-0 lg:gap-x-10">
            {CATEGORIAS.map((cat, i) => (
              <FadeUp
                key={cat.slug}
                y={50}
                delay={i * 0.08}
                as="article"
                className="group flex flex-col"
              >
                {/* Imagen */}
                <Link
                  href={`/productos/${cat.slug}`}
                  aria-label={`Ver categoría ${cat.nombre}`}
                  className="relative block overflow-hidden rounded-[var(--radius-lg)] bg-sand"
                >
                  <div className="relative aspect-[4/3] w-full md:aspect-[4/5]">
                    {/* TODO(contenido): foto real representativa de la categoría */}
                    <Image
                      src={cat.img}
                      alt={cat.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 36rem, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  </div>
                  {/* Índice sobre la foto */}
                  <span className="absolute left-4 top-3 font-display text-[length:var(--text-step-1)] font-bold text-bone mix-blend-difference">
                    {cat.index}
                  </span>
                </Link>

                {/* Texto */}
                <div className="flex flex-1 flex-col pt-6">
                  <h2 className="font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">
                    {cat.nombre}
                  </h2>
                  <p className="mt-3 max-w-[42ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
                    {cat.desc}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
                    {cat.incluye.map((item) => (
                      <li
                        key={item}
                        className="rounded-[var(--radius-pill)] border border-line px-3 py-1 text-[length:var(--text-step--1)] text-ink/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* mt-auto: los tres links quedan alineados al pie */}
                  <Link
                    href={`/productos/${cat.slug}`}
                    className="group/cta mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.1em] text-ink"
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
            ))}
          </div>
        </section>

        {/* ── A MEDIDA · momento oscuro (corte limpio) ───────────────────── */}
        <section
          data-theme="dark"
          className="bg-bordeaux px-6 py-24 text-bone md:px-10 md:py-32"
        >
          <div className="mx-auto flex max-w-[87.5rem] flex-col items-center gap-10 text-center">
            <div className="flex flex-col items-center">
              <Eyebrow className="mb-6">A medida</Eyebrow>
              <RevealText
                as="h2"
                onScroll
                className="mx-auto max-w-[20ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone"
              >
                {/* TODO(contenido): titular real de "a medida" */}
                ¿No lo ves? Lo hacemos para vos
              </RevealText>
              <p className="mx-auto mt-6 max-w-[52ch] font-sans text-[length:var(--text-step-1)] leading-snug text-bone/75">
                {/* Copy real: se cotiza; la demora depende de la complejidad
                    (docs/CONTENIDO_FLOR.md §6). No prometemos plazos exactos. */}
                Trabajamos mayormente por encargo. Contanos qué pieza tenés en la
                cabeza y la cotizamos: la demora depende de la complejidad, y
                cada estructura se piensa para tu evento.
              </p>
            </div>
            <div>
              <Button href="/contacto" variant="inverse">
                Pedir presupuesto
              </Button>
            </div>
          </div>
        </section>
      </main>
  );
}
