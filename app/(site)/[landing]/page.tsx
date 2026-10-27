import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { pageMetadata, BUSINESS, RECARGO_MP_TEXTO } from "@/lib/site";
import { LANDINGS, landingDe, type Landing } from "@/content/seo/landings";
import { WHATSAPP_NUMBER } from "@/content/site";
import {
  EVENT_CTA_HREF,
  EVENT_HORARIO,
  EVENT_WHATSAPP,
  EVENT_WHEN,
  ETAPAS_CON_PAGINA,
  PASES,
  tarifaVigente,
} from "@/content/evento";
import { getTodosLosProductos } from "@/modules/catalog/repository";
import { formatARS } from "@/modules/catalog/types";
import { ItemListJsonLd, WebPageJsonLd } from "@/components/site/JsonLd";
import { Migas } from "@/components/seo/Migas";
import { FaqLista } from "@/components/seo/FaqLista";
import { Relacionadas } from "@/components/seo/Relacionadas";
import { productosDeLanding } from "@/components/seo/productosLanding";
import { ProductCard } from "@/components/productos/ProductCard";
import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button, ButtonInner, buttonClasses } from "@/components/ui/Button";

/**
 * Landings SEO por intención y por zona (/arcos-para-eventos,
 * /estructuras-para-eventos-en-cordoba…). Contenido: content/seo/landings.ts.
 * Solo existen los slugs de ese archivo (dynamicParams = false → el resto, 404).
 */
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ landing: l.slug }));
}
export const dynamicParams = false;
// Los productos pueden venir de la base (panel): se refrescan cada 5 min.
export const revalidate = 300;

type Props = { params: Promise<{ landing: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { landing } = await params;
  const l = landingDe(landing);
  if (!l) return {};
  const meta = pageMetadata({ title: l.title, description: l.description, path: `/${l.slug}` });
  // La imagen la genera ./opengraph-image.tsx (archivo → pisa a la de config).
  if (meta.openGraph) delete meta.openGraph.images;
  if (meta.twitter) delete meta.twitter.images;
  return meta;
}

const wa = (numero: string, msg: string) => `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;

/** Datos citables "en corto" (lo primero que leen Google y las IAs). */
function datosClave(l: Landing, desde: number | null): { k: string; v: string }[] {
  if (l.grupo === "formacion") {
    const t = tarifaVigente();
    const min = Math.min(...PASES.map((p) => t.precios[p.id]));
    return [
      { k: "Próxima fecha", v: EVENT_WHEN },
      { k: "Horario", v: EVENT_HORARIO },
      { k: "Sede", v: "La Rural, Palermo (Buenos Aires)" },
      { k: "Pases", v: `Desde ${formatARS(min)}` },
    ];
  }
  if (l.grupo === "zonas") {
    return [
      { k: "Taller", v: `${BUSINESS.locality}, ${BUSINESS.region}` },
      { k: "Envíos", v: "Vía Cargo, Buspack, MD o FlechaBus" },
      { k: "Entrega", v: "Por encargo, alrededor de 20 días" },
      { k: "Atención", v: "Flor y Tobías, por WhatsApp" },
    ];
  }
  return [
    desde != null ? { k: "Precio", v: `Desde ${formatARS(desde)} (transferencia)` } : { k: "Precio", v: "A cotizar" },
    { k: "Entrega", v: "Por encargo, alrededor de 20 días" },
    { k: "Envíos", v: "A todo el país" },
    { k: "Pago", v: `Transferencia, o Mercado Pago con ${RECARGO_MP_TEXTO} de recargo` },
  ];
}

export default async function LandingPage({ params }: Props) {
  const { landing } = await params;
  const l = landingDe(landing);
  if (!l) notFound();

  const { mostrar, desde } = productosDeLanding(await getTodosLosProductos(), l);
  const claves = datosClave(l, desde);
  const whatsapp = wa(l.linea === "capacitaciones" ? EVENT_WHATSAPP : WHATSAPP_NUMBER, l.mensaje);
  const path = `/${l.slug}`;

  return (
    <main id="main" className="bg-bone text-ink">
      <WebPageJsonLd path={path} name={l.h1} description={l.description} image={l.imagen.src} />
      {mostrar.length > 0 && (
        <ItemListJsonLd
          name={l.productos?.titulo ?? l.h1}
          items={mostrar.map((p) => ({ nombre: p.nombre, path: `/productos/${p.categoria}/${p.slug}`, img: p.img }))}
        />
      )}

      {/* 1 · HERO — titular + respuesta directa + foto en arco */}
      <section
        data-theme="light"
        className="px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40 [@media(max-height:540px)_and_(orientation:landscape)]:pt-24"
      >
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Migas items={[{ name: l.h1, path }]} className="mb-6 md:mb-10" />
            <Eyebrow className="mb-6">{l.eyebrow}</Eyebrow>
            <RevealText
              as="h1"
              className={`max-w-[18ch] font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-ink [overflow-wrap:break-word] ${
                l.h1.length > 26
                  ? "text-[length:clamp(2rem,9.5vw,var(--text-step-5))]"
                  : "text-[length:clamp(2.5rem,12vw,var(--text-step-6))]"
              }`}
            >
              {l.h1}
            </RevealText>
            <FadeUp y={40} delay={0.15} className="mt-8 max-w-[56ch] border-t border-line pt-8">
              <p className="font-sans text-[length:var(--text-step-1)] leading-snug text-ink/75">{l.lead}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClasses("dark")}>
                  <ButtonInner primary tone="dark">
                    Consultar por WhatsApp
                  </ButtonInner>
                </a>
                {l.bloque === "pases" ? (
                  <Button href={EVENT_CTA_HREF} variant="outline">
                    Ver pases e inscribirme
                  </Button>
                ) : l.verMas ? (
                  <Button href={l.verMas.href} variant="outline">
                    {l.verMas.label}
                  </Button>
                ) : null}
              </div>
            </FadeUp>
          </div>

          <FadeUp y={50} className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-[min(100%,26rem)] overflow-hidden rounded-t-full bg-sand lg:w-full lg:max-w-[30rem]">
              <Image
                src={l.imagen.src}
                alt={l.imagen.alt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 30rem"
                className="object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2 · EN CORTO — datos citables */}
      <section data-theme="light" aria-labelledby="en-corto" className="px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-[87.5rem]">
          <h2 id="en-corto" className="sr-only">
            Datos clave
          </h2>
          <dl className="grid grid-cols-1 gap-px border-y border-line bg-line min-[480px]:grid-cols-2 lg:grid-cols-4">
            {claves.map((c) => (
              <div key={c.k} className="flex flex-col gap-2 bg-bone py-6 min-[480px]:px-5 lg:py-8">
                <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-ink/50">{c.k}</dt>
                <dd className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[1.05] text-ink">
                  {c.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3 · CONTENIDO PROPIO — h2 a la izquierda, texto a la derecha */}
      <section data-theme="light" className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto flex max-w-[87.5rem] flex-col gap-16 md:gap-24">
          {l.secciones.map((s) => (
            <FadeUp key={s.h2} y={50} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-16">
              <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] lg:col-span-5 [overflow-wrap:break-word]">
                {s.h2}
              </h2>
              <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
                {s.p.map((p) => (
                  <p key={p.slice(0, 32)} className="max-w-[62ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/75 md:text-[length:var(--text-step-1)] md:leading-snug">
                    {p}
                  </p>
                ))}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 4 · USOS (sand) */}
      {l.usos?.length ? (
        <section data-theme="light" className="bg-sand px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[87.5rem]">
            <h2 className="max-w-[20ch] font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.95] md:text-[length:var(--text-step-4)]">
              {l.grupo === "formacion" ? "Para quién es" : l.grupo === "productos" && l.slug === "proveedor-para-decoradores" ? "Con quién trabajamos" : "Para qué sirve"}
            </h2>
            <ul className={`mt-10 grid grid-cols-1 gap-x-10 border-t border-ink/15 sm:grid-cols-2 md:mt-14 ${l.usos.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {l.usos.map((u) => (
                <li key={u.titulo} className="border-b border-ink/15 py-7 sm:border-b-0">
                  <h3 className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[1.05]">{u.titulo}</h3>
                  <p className="mt-3 max-w-[38ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">{u.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 5a · PRODUCTOS REALES del catálogo */}
      {mostrar.length > 0 && (
        <section data-theme="light" className="px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[87.5rem]">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2 className="font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.95] md:text-[length:var(--text-step-4)]">
                {l.productos?.titulo}
              </h2>
              {l.verMas && (
                <Button href={l.verMas.href} variant="outline">
                  {l.verMas.label}
                </Button>
              )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
              {mostrar.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5b · PASES del Summit (precios reales, tarifa vigente) */}
      {l.bloque === "pases" && <BloquePases />}

      {/* 5c · TRAYECTORIA de workshops (con link a cada uno) */}
      {l.bloque === "trayectoria" && <BloqueTrayectoria />}

      {/* 6 · PREGUNTAS FRECUENTES (+ FAQPage) */}
      <section data-theme="light" className="bg-sand px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em]">
              Preguntas frecuentes
            </h2>
            <p className="mt-5 max-w-[34ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
              ¿No está tu pregunta? Mirá{" "}
              <Link href="/preguntas-frecuentes" className="underline underline-offset-4 hover:text-bordeaux">
                todas las preguntas
              </Link>{" "}
              o escribinos.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqLista faqs={l.faqs} nombre={`faq-${l.slug}`} />
          </div>
        </div>
      </section>

      {/* 7 · ENLAZADO INTERNO */}
      <Relacionadas slugs={l.relacionadas} />

      {/* 8 · CIERRE (dark) */}
      <section data-theme="dark" className="relative overflow-hidden bg-ink px-6 py-24 text-bone md:px-10 md:py-32">
        <div aria-hidden="true" className="evt-grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-[87.5rem] flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] [overflow-wrap:break-word]">
            {l.linea === "capacitaciones" ? "Te esperamos en el Summit" : "Contanos qué estás armando"}
          </h2>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClasses("light")}>
              <ButtonInner primary tone="light">
                Escribinos por WhatsApp
              </ButtonInner>
            </a>
            <Button href={l.linea === "capacitaciones" ? "/event-summit" : "/productos"} variant="outline" tone="light">
              {l.linea === "capacitaciones" ? "Conocer el Event Summit" : "Ver el catálogo"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function BloquePases() {
  const t = tarifaVigente();
  return (
    <section data-theme="dark" className="bg-ink px-6 py-20 text-bone md:px-10 md:py-28">
      <div className="mx-auto max-w-[87.5rem]">
        <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92]">Pases y precios</h2>
        <p className="mt-4 text-[length:var(--text-step-0)] text-bone/60">
          {t.hastaLabel ? `${t.nombre} · ${t.hastaLabel}` : t.nombre}. Pago online con Mercado Pago.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 border-t border-bone/15 pt-10 md:grid-cols-2">
          {PASES.map((p) => (
            <div key={p.id}>
              <h3 className="font-display text-[length:var(--text-step-2)] font-bold uppercase">{p.nombre}</h3>
              <p className="mt-2 font-display text-[length:var(--text-step-3)] font-extrabold text-champagne">
                {formatARS(t.precios[p.id])}
              </p>
              <ul className="mt-6 flex flex-col gap-2 text-[length:var(--text-step-0)] leading-snug text-bone/75">
                {p.incluye.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="text-champagne">
                      ✳
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button href={EVENT_CTA_HREF} variant="inverse">
            Ver pases e inscribirme
          </Button>
        </div>
      </div>
    </section>
  );
}

function BloqueTrayectoria() {
  return (
    <section data-theme="light" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[87.5rem]">
        <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92]">Cada encuentro</h2>
        <ol className="mt-10 border-b border-line md:mt-14">
          {ETAPAS_CON_PAGINA.map((e) => (
            <li key={e.slug} className="border-t border-line">
              <Link
                href={`/event-summit/trayectoria/${e.slug}`}
                className="group grid min-h-11 grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,22rem)_auto] md:gap-x-8"
              >
                <span className="font-display text-[length:var(--text-step-2)] font-extrabold text-champagne">{e.numero}</span>
                <span className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[1.05] transition-colors group-hover:text-bordeaux md:text-[length:var(--text-step-2)]">
                  {e.titulo}
                </span>
                <span className="col-start-2 text-[length:var(--text-step--1)] text-ink/60 md:col-start-3 md:row-start-1">
                  {[e.lugar, e.fecha, e.participantes ? `${e.participantes} participantes` : null].filter(Boolean).join(" · ")}
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-3 row-start-1 text-[length:var(--text-step-2)] text-champagne transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 md:col-start-4"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
