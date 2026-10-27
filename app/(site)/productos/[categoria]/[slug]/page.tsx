import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_URL, SITE_NAME, RECARGO_MP_TEXTO, COLORES_HIERRO, DIAS_PRODUCCION } from "@/lib/site";
import { BreadcrumbJsonLd, JsonLdScript } from "@/components/site/JsonLd";
import { Galeria } from "@/components/productos/Galeria";
import { ProductCard } from "@/components/productos/ProductCard";
import { FichaCompra } from "@/components/productos/FichaCompra";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WHATSAPP_NUMBER } from "@/content/site";
import {
  getCategoria,
  getProducto,
  getRelacionados,
  getSeArmaCon,
  getTodosLosProductos,
} from "@/modules/catalog/repository";
import { esHierro, etiquetaPrecio, rangoDePrecio } from "@/modules/catalog/types";

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

const resumen = (t?: string) => {
  const linea = (t ?? "").split("\n")[0].trim();
  return linea.length > 155 ? `${linea.slice(0, 152).trimEnd()}…` : linea;
};

/** Separa la descripción en párrafos y filas "Etiqueta: valor" (Colores, Incluye…). */
function partesDescripcion(t: string, hierro: boolean) {
  const parrafos: string[] = [];
  const filas: { k: string; v: string }[] = [];
  for (const linea of t.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const m = /^(Colores|Incluye|Adicionales|Medidas)\s*:\s*(.+)$/i.exec(linea);
    // Los colores de hierro ya están en el bloque fijo de arriba.
    if (m && hierro && /^colores$/i.test(m[1]) && /rosa gold/i.test(m[2])) continue;
    if (m) filas.push({ k: m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(), v: m[2] });
    else parrafos.push(linea);
  }
  return { parrafos, filas };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, slug } = await params;
  const p = await getProducto(categoria, slug);
  if (!p) return {};
  const cat = await getCategoria(categoria);
  const precio = etiquetaPrecio(p);
  const conPrecio = precio ? ` · ${precio}` : "";
  const meta = pageMetadata({
    title: `${p.nombre}${cat ? ` · ${cat.nombre}` : ""}`,
    description: resumen(
      `${resumen(p.descripcion) || p.nombre}${conPrecio}. Fabricación propia, por encargo y con envíos a todo el país.`,
    ),
    path: `/productos/${categoria}/${slug}`,
    ogTitle: `${p.nombre}${conPrecio} · ${SITE_NAME}`,
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
  const [seArmaCon, relacionadosTodos] = await Promise.all([getSeArmaCon(p), getRelacionados(p, 8)]);
  const enCombo = new Set(seArmaCon.map((x) => x.slug));
  const relacionados = relacionadosTodos.filter((x) => !enCombo.has(x.slug)).slice(0, 4);

  const path = `/productos/${cat.slug}/${p.slug}`;
  const url = `${SITE_URL}${path}`;
  const hierro = esHierro(p);
  const variantes = p.variantes ?? [];
  const { parrafos, filas } = partesDescripcion(p.descripcion ?? "", hierro);
  if (p.medidas) filas.unshift({ k: "Medidas", v: p.medidas });

  // JSON-LD (T-09): siempre con offers. Rango → AggregateOffer; un precio →
  // Offer; a cotizar → Offer por encargo sin precio (nunca Product "pelado").
  const rango = rangoDePrecio(p);
  const vendedor = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME };
  const base = {
    priceCurrency: "ARS",
    availability: "https://schema.org/MadeToOrder",
    itemCondition: "https://schema.org/NewCondition",
    url,
    seller: vendedor,
  };
  const offers = !rango
    ? { "@type": "Offer", ...base, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "ARS" } }
    : rango.min === rango.max
      ? { "@type": "Offer", price: rango.min, ...base }
      : {
          "@type": "AggregateOffer",
          lowPrice: rango.min,
          highPrice: rango.max,
          offerCount: Math.max(variantes.filter((v) => v.precio != null).length, 1),
          ...base,
        };

  const info: { k: string; v: React.ReactNode }[] = [
    {
      k: "Pago",
      v: `El precio publicado es por transferencia. Con link de Mercado Pago se suma un ${RECARGO_MP_TEXTO}.`,
    },
    {
      k: "Envío",
      v: (
        <>
          A todo el país por Vía Cargo, con 50 % de descuento en el valor del envío. Donde no llega, Buspack, MD o
          FlechaBus; el seguro se abona a la transportista.{" "}
          <Link href="/envios-a-todo-el-pais" className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            Cómo son los envíos
          </Link>
        </>
      ),
    },
    {
      k: "Producción",
      v: `Por encargo: contá unos ${DIAS_PRODUCCION} días desde que confirmás. Cerramos la producción por semana.`,
    },
    ...(hierro ? [{ k: "Colores", v: `${COLORES_HIERRO.slice(0, -1).join(", ")} o ${COLORES_HIERRO.at(-1)}.`.toLowerCase().replace(/^./, (c) => c.toUpperCase()) }] : []),
    { k: "¿Dudas?", v: "Te responden Flor o Tobías por WhatsApp, en persona." },
  ];

  return (
    <main id="main" className="bg-bone text-ink">
      <BreadcrumbJsonLd
        items={[
          { name: "Productos", path: "/productos" },
          { name: cat.nombre, path: `/productos/${cat.slug}` },
          { name: p.nombre, path },
        ]}
      />
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.nombre,
          description: (p.descripcion ?? "").replace(/\n+/g, " ") || p.nombre,
          image: p.imagenes.map((i) => (i.url.startsWith("http") ? i.url : `${SITE_URL}${i.url}`)),
          category: cat.nombre,
          brand: { "@type": "Brand", name: SITE_NAME },
          manufacturer: { "@id": `${SITE_URL}/#organization` },
          sku: p.slug,
          url,
          offers,
        }}
      />

      <section data-theme="light" className="px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-40 [@media(max-height:540px)_and_(orientation:landscape)]:pt-24">
        <div className="mx-auto max-w-[87.5rem]">
          <nav aria-label="Migas de pan" className="mb-5 flex flex-wrap items-center gap-x-1 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-ink/60 md:mb-8">
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

              <FichaCompra
                slug={p.slug}
                nombre={p.nombre}
                categoria={cat.slug}
                precio={p.precio}
                variantes={variantes}
                img={p.img}
                href={path}
                url={url}
                hierro={hierro}
                whatsapp={WHATSAPP_NUMBER}
              />

              {/* Pago · Envío · Producción · Colores · Dudas (E-07): fijo en todas las fichas */}
              <dl className="mt-10 divide-y divide-line border-y border-line text-[length:var(--text-step--1)]">
                {info.map((i) => (
                  <div key={i.k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4 sm:grid-cols-[8rem_1fr]">
                    <dt className="font-medium text-ink">{i.k}</dt>
                    <dd className="leading-relaxed text-ink/75">{i.v}</dd>
                  </div>
                ))}
              </dl>

              {(parrafos.length > 0 || filas.length > 0) && (
                <div className="mt-10">
                  <h2 className="font-display text-[length:var(--text-step-1)] font-bold uppercase">Sobre esta pieza</h2>
                  {parrafos.map((t) => (
                    <p key={t} className="mt-3 max-w-[62ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/75">
                      {t}
                    </p>
                  ))}
                  {filas.length > 0 && (
                    <dl className="mt-5 grid gap-3 text-[length:var(--text-step-0)]">
                      {filas.map((f) => (
                        <div key={f.k + f.v} className="grid grid-cols-[6.5rem_1fr] gap-4 sm:grid-cols-[8rem_1fr]">
                          <dt className="text-ink/60">{f.k}</dt>
                          <dd className="text-ink/80">{f.v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {seArmaCon.length > 0 && (
        <section data-theme="light" aria-labelledby="se-arma-con" className="border-t border-line px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[87.5rem]">
            <h2 id="se-arma-con" className="mb-3 font-display text-[length:var(--text-step-3)] font-bold uppercase">
              Se arma con
            </h2>
            <p className="mb-10 max-w-[52ch] text-[length:var(--text-step-0)] text-ink/70">
              Las piezas que suelen ir junto a esta. Sumalas al mismo pedido.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
              {seArmaCon.slice(0, 4).map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}

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
