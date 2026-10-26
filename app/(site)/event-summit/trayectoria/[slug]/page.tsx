import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { WorkshopHero } from "@/components/trayectoria/WorkshopHero";
import { Galeria } from "@/components/trayectoria/Galeria";
import { EDICION_LABEL, ETAPAS_CON_PAGINA, EVENT_NAME, EVENT_WHEN, TRAYECTORIA, type Etapa } from "@/content/evento";
import { galeriaDe, portadaDe } from "@/content/galerias";

export function generateStaticParams() {
  return ETAPAS_CON_PAGINA.map((e) => ({ slug: e.slug }));
}
export const dynamicParams = false;

const etapaDe = (slug: string) => ETAPAS_CON_PAGINA.find((e) => e.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = etapaDe(slug);
  if (!e) return {};
  return pageMetadata({
    title: `${e.etapa} · ${e.titulo}`,
    description:
      e.resumen ??
      `Así fue el ${e.etapa} de Sweet Flowers en ${e.titulo}${e.lugar ? ` (${e.lugar})` : ""}: fotos y detalles del encuentro.`,
    path: `/event-summit/trayectoria/${slug}`,
  });
}

/** Bajada: la propia o una armada con los datos del encuentro. */
function resumenDe(e: Etapa) {
  if (e.resumen) return e.resumen;
  const quien = e.participantes ? `${e.participantes} decoradoras, organizadoras y emprendedoras` : "decoradoras y organizadoras de todo el país";
  const inicio = e.fecha ? `El ${e.fecha}, ${quien}` : quien.charAt(0).toUpperCase() + quien.slice(1);
  const temas = e.temas?.length ? `${e.temas.length} temas` : "charlas";
  return `${inicio} se juntaron en ${e.titulo} para un día de taller intensivo con el equipo de Sweet Flowers: ${temas}, práctica en vivo y comunidad.`;
}

const INSTAGRAM = "https://www.instagram.com/sweetflowersdecoparty/";

export default async function EtapaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = etapaDe(slug);
  if (!e) notFound();

  const fotos = galeriaDe(slug);
  const portada = portadaDe(slug, e.foto);
  const i = TRAYECTORIA.indexOf(e);
  const sig = TRAYECTORIA[i + 1];
  const ant = i > 0 ? TRAYECTORIA[i - 1] : undefined;
  const sigHref = sig?.slug ? `/event-summit/trayectoria/${sig.slug}` : "/event-summit#inscripcion";
  const sigFoto = sig?.slug ? portadaDe(sig.slug, sig.foto) : portadaDe("primera-edicion");
  const esReal = !fotos[0]?.placeholder;
  const cinta = `${e.etapa} — ${e.titulo} — `;

  return (
    <main id="main" className="bg-ink text-bone">
      <BreadcrumbJsonLd
        items={[
          { name: "Event Summit", path: "/event-summit" },
          { name: `${e.etapa} · ${e.titulo}`, path: `/event-summit/trayectoria/${slug}` },
        ]}
      />
      <WorkshopHero
        etapa={e.etapa}
        titulo={e.titulo}
        lugar={[e.lugar, e.fecha].filter(Boolean).join(" · ") || undefined}
        numero={e.numero}
        portada={portada.src}
        placeholder={portada.placeholder}
      />

      {/* INTRO — declaración + ficha */}
      <section data-theme="dark" className="px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[87.5rem] gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6 lg:col-span-7">
            <p className="mb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">✧ El encuentro</p>
            <RevealText
              as="h2"
              onScroll
              className="max-w-[18ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [text-wrap:balance]"
            >
              {slug === "primera-edicion" ? "El día que el rubro se juntó" : "Aprender haciendo, juntas"}
            </RevealText>
          </div>
          <FadeUp y={50} className="flex flex-col justify-end gap-10 md:col-span-6 lg:col-span-4 lg:col-start-9">
            <p className="text-[length:var(--text-step-1)] leading-snug text-bone/80">{resumenDe(e)}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-bone/15 pt-8">
              {(e.fecha
                ? [
                    ["Fecha", e.fecha],
                    ["Participantes", e.participantes ? String(e.participantes) : "—"],
                    ["Sede", e.lugar ? `${e.titulo} · ${e.lugar}` : e.titulo],
                    ["Temas", e.temas ? String(e.temas.length).padStart(2, "0") : "—"],
                  ]
                : [
                    ["Etapa", e.etapa],
                    ["Sede", e.titulo],
                    ["Fecha", e.lugar ?? "—"],
                    ["Fotos", String(fotos.length).padStart(2, "0")],
                  ]
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-bone/45">{k}</dt>
                  <dd className="mt-2 font-display text-[length:var(--text-step-1)] font-bold leading-tight [overflow-wrap:anywhere]">{v}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </div>
      </section>

      {/* LO QUE VIMOS — temas del encuentro */}
      {e.temas?.length ? (
        <section data-theme="dark" aria-labelledby="temas-h" className="px-6 pb-24 md:px-10 md:pb-36">
          <div className="mx-auto grid max-w-[87.5rem] gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <p className="mb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">✧ Programa</p>
              <h2 id="temas-h" className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] text-bone">
                Lo que vimos
              </h2>
              {e.participantes && (
                <p className="mt-6 max-w-[30ch] text-bone/65">
                  {e.participantes} participantes, {e.temas.length} temas y un día entero de taller.
                </p>
              )}
            </div>
            <FadeUp as="ol" y={40} stagger={0.06} className="lg:col-span-7 lg:col-start-6">
              {e.temas.map((t, n) => (
                <li
                  key={t}
                  className="group flex items-baseline gap-6 border-b border-bone/10 py-5 first:border-t md:gap-10 md:py-6"
                >
                  <span className="w-10 shrink-0 font-display text-[length:var(--text-step-0)] tabular-nums text-champagne">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-tight text-bone transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:text-[length:var(--text-step-3)]">
                    {t}
                  </span>
                </li>
              ))}
            </FadeUp>
          </div>
        </section>
      ) : null}

      {/* REEL — así se vivió (Instagram) */}
      {e.reel && (
        <section data-theme="dark" aria-labelledby="reel-h" className="relative overflow-hidden bg-bordeaux px-6 py-24 md:px-10 md:py-32">
          <div className="evt-grain pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-[87.5rem] items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="mb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">✧ En Instagram</p>
              <h2 id="reel-h" className="max-w-[12ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] text-bone">
                Así se vivió
              </h2>
              <p className="mt-6 max-w-[40ch] text-[length:var(--text-step-1)] leading-snug text-bone/80">
                El resumen del {e.etapa.toLowerCase()} en {e.titulo}, contado por las que estuvieron ahí.
              </p>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                <a
                  href={`https://www.instagram.com/reel/${e.reel}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center gap-3 rounded-full bg-bone px-8 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-champagne"
                >
                  Ver el reel <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-b border-bone pb-1 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone"
                >
                  @sweetflowersdecoparty
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:col-span-5 lg:col-start-8 lg:justify-end">
              {/* El embed de Instagram mide: cabecera ~54px + video 4:5 + pie ~150px.
                  El alto se calcula del ancho real (cqw) → sin scroll interno
                  ni franjas vacías en ningún ancho. */}
              <div className="w-full max-w-[25rem] overflow-hidden rounded-[var(--radius-lg)] border border-bone/15 bg-ink shadow-[0_40px_80px_-40px_rgb(20_17_15/0.8)] [container-type:inline-size]">
                <iframe
                  src={`https://www.instagram.com/reel/${e.reel}/embed/`}
                  title={`Reel de Instagram: ${e.etapa} en ${e.titulo}`}
                  loading="lazy"
                  allow="encrypted-media; picture-in-picture; clipboard-write"
                  className="block h-[calc(125cqw+208px)] w-full border-0 bg-cloud"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CINTA — marquesina gigante */}
      <div aria-hidden="true" data-theme="dark" className="overflow-hidden border-y border-bone/10 py-6 md:py-8">
        <div className="flex w-max animate-[sfCinta_38s_linear_infinite] motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="shrink-0 whitespace-nowrap pr-8 font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgb(247_243_236/0.35)]"
            >
              {cinta.repeat(3)}
            </span>
          ))}
        </div>
        <style>{`@keyframes sfCinta{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* GALERÍA */}
      <section data-theme="dark" aria-labelledby="galeria-h" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[87.5rem]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
            <h2
              id="galeria-h"
              className="max-w-[14ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] text-bone [text-wrap:balance]"
            >
              El encuentro en imágenes
            </h2>
            <p className="max-w-[34ch] text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/50">
              {esReal ? `${fotos.length} fotos · tocá una para verla en grande` : "Fotos de muestra · pronto las reales"}
            </p>
          </div>
          <Galeria fotos={fotos} titulo={`${e.etapa} · ${e.titulo}`} />
        </div>
      </section>

      {/* SIGUIENTE PARADA */}
      <section data-theme="dark" aria-label="Siguiente etapa" className="border-t border-bone/10">
        <Link href={sigHref} className="group relative block overflow-hidden px-6 py-24 md:px-10 md:py-36">
          {/* Mouse: la foto aparece al pasar. Táctil (sin hover): visible siempre,
              más tenue, para que la tarjeta no quede vacía. */}
          <div className="absolute inset-0 -z-0 scale-110 opacity-0 transition-all duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-60">
            <Image
              src={sigFoto.src}
              alt=""
              fill
              sizes="100vw"
              className={`object-cover ${sigFoto.placeholder ? "grayscale" : ""}`}
            />
            <div className="absolute inset-0 bg-ink/65" />
            <div className="evt-grain absolute inset-0" />
          </div>
          <div className="relative mx-auto flex max-w-[87.5rem] flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">
                {sig?.slug ? "Siguiente parada" : "Lo que viene"}
              </p>
              <p className="mt-2 text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/55">{sig?.etapa}</p>
              <p className="mt-6 max-w-[14ch] font-display text-[length:min(var(--text-step-6),calc((100vw-3rem)/5.9))] font-extrabold uppercase leading-[0.85] tracking-[-0.02em] text-bone [overflow-wrap:anywhere] [text-wrap:balance] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                {sig?.slug ? sig.titulo : EVENT_WHEN}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-bone/30 text-2xl transition-all duration-500 group-hover:rotate-45 group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink md:h-28 md:w-28"
            >
              ↗
            </span>
          </div>
        </Link>
        {ant?.slug && (
          <div className="mx-auto max-w-[87.5rem] px-6 pb-12 md:px-10">
            <Link
              href={`/event-summit/trayectoria/${ant.slug}`}
              className="inline-flex min-h-11 items-center text-[0.75rem] uppercase tracking-[0.16em] text-bone/60 hover:text-bone"
            >
              ← {ant.etapa} · {ant.titulo}
            </Link>
          </div>
        )}
      </section>

      {/* CTA — 2ª edición */}
      <section data-theme="dark" className="relative overflow-hidden bg-bordeaux px-6 py-24 md:px-10 md:py-32">
        <div className="evt-grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-[87.5rem] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">
              ✧ {EVENT_NAME} · {EDICION_LABEL}
            </p>
            <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] text-bone [text-wrap:balance]">
              La próxima la vivís vos
            </h2>
            <p className="mt-5 text-[length:var(--text-step-1)] text-bone/80">{EVENT_WHEN} · Preventa abierta</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-x-10 gap-y-4">
            <Button href="/event-summit#inscripcion" variant="inverse">
              Quiero mi lugar
            </Button>
            <Button href="/event-summit#trayectoria" variant="outline" tone="light">
              Toda la trayectoria
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
