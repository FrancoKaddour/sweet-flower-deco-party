import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { getCategoria, getCategorias, getProductosDeCategoria } from "@/modules/catalog/repository";
import { GrillaPaginada } from "@/components/productos/GrillaPaginada";

// Listado de categoría: productos desde la base (con respaldo estático),
// paginados de a 24, destacados primero.

type Props = { params: Promise<{ categoria: string }> };

// Se regenera sola cada 5 min y al instante cuando se edita desde el panel.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getCategorias()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const cat = await getCategoria(categoria);
  if (!cat) return {};
  return pageMetadata({
    title: `${cat.nombre} para eventos · Productos`,
    description: `${cat.desc} Fabricación propia, por encargo y con envíos a todo el país.`,
    path: `/productos/${cat.slug}`,
  });
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const cat = await getCategoria(categoria);
  if (!cat) notFound();
  const productos = await getProductosDeCategoria(cat.slug);

  return (
    <main id="main">
      <BreadcrumbJsonLd
        items={[
          { name: "Productos", path: "/productos" },
          { name: cat.nombre, path: `/productos/${cat.slug}` },
        ]}
      />
      {/* Intro de la categoría */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-16 pt-32 text-ink md:px-10 md:pb-20 md:pt-44"
      >
        <div className="mx-auto max-w-[87.5rem]">
          {/* Breadcrumb editorial (solo e-commerce — docs/04 §6) */}
          <nav
            aria-label="Migas de pan"
            className="mb-8 text-center text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-ink/50"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Inicio
            </Link>
            <span aria-hidden="true"> › </span>
            <Link href="/productos" className="transition-colors hover:text-ink">
              Productos
            </Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page" className="text-ink">
              {cat.nombre}
            </span>
          </nav>

          <Eyebrow className="mb-6 text-center">Categoría {cat.index}</Eyebrow>
          <RevealText
            as="h1"
            className="mx-auto max-w-[16ch] text-center font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-ink [overflow-wrap:anywhere]"
          >
            {cat.nombre}
          </RevealText>
          <FadeUp
            y={40}
            delay={0.15}
            className="mx-auto mt-8 max-w-[52ch] border-t border-line pt-8 text-center"
          >
            <p className="font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
              {cat.desc}
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2">
              {cat.incluye.map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-pill)] border border-line px-4 py-1.5 text-[length:var(--text-step--1)] text-ink/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {productos.length > 0 ? (
        /* Grilla de productos (modules/catalog) */
        <section data-theme="light" className="bg-bone px-6 pb-24 text-ink md:px-10 md:pb-32">
          <div className="mx-auto max-w-[87.5rem]">
            <GrillaPaginada productos={productos} />
          </div>
        </section>
      ) : (
        <>
      {/* Estado "próximamente" cálido + salida clara */}
        <section
          data-theme="light"
          className="bg-bone px-6 pb-24 text-ink md:px-10 md:pb-32"
        >
          <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Foto en arco (identidad El Arco) */}
            <FadeUp y={50} className="lg:col-span-5">
              <div className="relative mx-auto aspect-[3/4] w-[min(100%,420px)] overflow-hidden rounded-t-full bg-sand">
                {/* TODO(contenido): foto real de la categoría */}
                <Image
                  src={cat.img}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-bordeaux/20 mix-blend-multiply" />
              </div>
            </FadeUp>
  
            <FadeUp y={60} className="lg:col-span-6 lg:col-start-7">
              <h2 className="max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink">
                {/* Estado vacío honesto: el catálogo online se está cargando. */}
                Estamos preparando estas piezas para la web
              </h2>
              <p className="mt-6 max-w-[46ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
                El catálogo online de {cat.nombre.toLowerCase()} está en camino:
                cada pieza se sube con sus fotos, medidas y precio reales.
                Mientras tanto, pedilo directo — te pasamos el catálogo completo y
                cotizamos tu pedido.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
                <Button href="/contacto">Pedir el catálogo</Button>
                <Button href="/productos" variant="outline">
                  Ver otras categorías
                </Button>
              </div>
            </FadeUp>
          </div>
        </section>
        </>
      )}
    </main>
  );
}
