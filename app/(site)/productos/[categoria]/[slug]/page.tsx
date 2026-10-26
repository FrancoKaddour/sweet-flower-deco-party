import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_URL, SITE_NAME, BUSINESS } from "@/lib/site";
import { BreadcrumbJsonLd, JsonLdScript } from "@/components/site/JsonLd";
import { Galeria } from "@/components/productos/Galeria";
import { ProductCard } from "@/components/productos/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WHATSAPP_NUMBER } from "@/content/site";
import {
  getCategoria,
  getProducto,
  getRelacionados,
  getTodosLosProductos,
} from "@/modules/catalog/repository";
import { formatARS } from "@/modules/catalog/types";

/**
 * FICHA DE PRODUCTO — una URL por pieza: aparece en Google (con precio, vía
 * JSON-LD Product), tiene su propia vista previa al compartir y se suma al
 * pedido de WhatsApp. Se regenera al editar desde el panel.
 */
type Props = { params: Promise<{ categoria: string; slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTodosLosProductos()).map((p) => ({ categoria: p.categoria, slug: p.slug }));
}

const resumen = (t?: string) => (t ? (t.length > 155 ? `${t.slice(0, 152).trimEnd()}…` : t) : "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, slug } = await params;
  const p = await getProducto(categoria, slug);
  if (!p) return {};
  const cat = await getCategoria(categoria);
  const precio = p.precio != null ? ` · ${formatARS(p.precio)}` : "";
  const meta = pageMetadata({
    title: `${p.nombre}${cat ? ` · ${cat.nombre}` : ""}`,
    description:
      resumen(p.descripcion) ||
      `${p.nombre}${precio}. Fabricación propia, por encargo y con envíos a todo el país.`,
    path: `/productos/${categoria}/${slug}`,
    ogTitle: `${p.nombre}${precio} · ${SITE_NAME}`,
  });
  if (p.img) {
    meta.openGraph = { ...meta.openGraph, images: [{ url: p.img, alt: p.nombre }] };
    meta.twitter = { ...meta.twitter, images: [p.img] };
  }
  return meta;
}

export default async function ProductoPage({ params }: Props) {
  const { categoria, slug } = await params;
  const [p, cat] = await Promise.all([getProducto(categoria, slug), getCategoria(categoria)]);
  if (!p || !cat) notFound();
  const relacionados = await getRelacionados(p);

  const msg = `¡Hola! Quiero consultar por: ${p.nombre} (${SITE_URL}/productos/${categoria}/${slug}).`;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <main id="main" className="bg-bone text-ink">
      <BreadcrumbJsonLd
        items={[
          { name: "Productos", path: "/productos" },
          { name: cat.nombre, path: `/productos/${cat.slug}` },
          { name: p.nombre, path: `/productos/${cat.slug}/${p.slug}` },
        ]}
      />
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.nombre,
          description: p.descripcion ?? "",
          image: p.imagenes.map((i) => (i.url.startsWith("http") ? i.url : `${SITE_URL}${i.url}`)),
          category: cat.nombre,
          brand: { "@type": "Brand", name: SITE_NAME },
          url: `${SITE_URL}/productos/${cat.slug}/${p.slug}`,
          ...(p.precio != null
            ? {
                offers: {
                  "@type": "Offer",
                  price: p.precio,
                  priceCurrency: "ARS",
                  availability: "https://schema.org/MadeToOrder",
                  url: `${SITE_URL}/productos/${cat.slug}/${p.slug}`,
                  seller: { "@type": "Organization", name: SITE_NAME },
                },
              }
            : {}),
        }}
      />

      <section data-theme="light" className="px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-40 [@media(max-height:540px)_and_(orientation:landscape)]:pt-24">
        <div className="mx-auto max-w-[87.5rem]">
          <nav aria-label="Migas de pan" className="mb-5 flex flex-wrap items-center gap-x-1 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-ink/50 md:mb-8">
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/productos" className="inline-flex min-h-11 items-center hover:text-ink">Productos</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/productos/${cat.slug}`} className="inline-flex min-h-11 items-center hover:text-ink">{cat.nombre}</Link>
          </nav>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10 lg:gap-16">
            <div className="md:sticky md:top-28 md:col-span-6 md:self-start [@media(max-height:540px)_and_(orientation:landscape)]:md:top-20">
              <Galeria imagenes={p.imagenes} nombre={p.nombre} />
            </div>

            <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 lg:pt-6">
              <Eyebrow className="mb-4">{cat.nombre}</Eyebrow>
              <h1 className="text-balance font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] [overflow-wrap:break-word]">
                {p.nombre}
              </h1>

              <p className="mt-4 font-display text-[length:var(--text-step-3)] font-bold md:mt-6">
                {p.precio != null ? formatARS(p.precio) : "Precio a consultar"}
                {p.precio != null && (
                  <span className="ml-3 inline-block align-middle font-sans text-[0.72rem] font-normal uppercase tracking-[0.14em] text-ink/55">
                    por transferencia
                  </span>
                )}
              </p>

              {p.variantes && p.variantes.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.variantes.map((v) => (
                    <li key={v} className="rounded-full border border-line px-4 py-1.5 text-[length:var(--text-step--1)] text-ink/70">
                      {v}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:max-w-sm md:mt-8">
                <AddToCartButton item={{ slug: p.slug, nombre: p.nombre, precio: p.precio, img: p.img }} />
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center rounded-full border border-ink/25 px-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                >
                  Consultar por WhatsApp
                </a>
              </div>

              {p.descripcion && (
                <p className="mt-8 max-w-[62ch] whitespace-pre-line text-[length:var(--text-step-0)] leading-relaxed text-ink/75">
                  {p.descripcion}
                </p>
              )}
              {p.medidas && (
                <p className="mt-4 text-[length:var(--text-step-0)] text-ink/75">
                  <span className="text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">Medidas · </span>
                  {p.medidas}
                </p>
              )}
              <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-8 text-[length:var(--text-step--1)]">
                <div>
                  <dt className="uppercase tracking-[0.14em] text-ink/50">Producción</dt>
                  <dd className="mt-1 text-ink/80">{BUSINESS.leadTime}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.14em] text-ink/50">Envíos</dt>
                  <dd className="mt-1 text-ink/80">A todo el país</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section data-theme="light" className="border-t border-line px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[87.5rem]">
            <h2 className="mb-10 font-display text-[length:var(--text-step-3)] font-bold uppercase">
              Más de {cat.nombre.toLowerCase()}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
              {relacionados.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
