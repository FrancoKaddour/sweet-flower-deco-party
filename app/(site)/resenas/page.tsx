import type { Metadata } from "next";
import Image from "next/image";

import { pageMetadata, BUSINESS, SITE_NAME } from "@/lib/site";
import { RESENA_GOOGLE_URL } from "@/content/seo/negocio";
import { WebPageJsonLd } from "@/components/site/JsonLd";
import { Migas } from "@/components/seo/Migas";
import { Relacionadas } from "@/components/seo/Relacionadas";
import { RevealText } from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonInner, buttonClasses } from "@/components/ui/Button";

const DESC =
  "¿Compraste en Sweet Flowers o fuiste a un workshop o al Event Summit? Dejanos tu reseña en Google: ayuda a otras decoradoras a encontrarnos.";

export const metadata: Metadata = pageMetadata({
  title: "Dejanos tu reseña",
  description: DESC,
  path: "/resenas",
});

// Sin Place ID todavía (content/seo/negocio.ts): se busca la ficha en Google.
// TODO(Fran): completar googlePlaceId para que el botón abra directo el formulario de reseña.
const LINK_RESENA =
  RESENA_GOOGLE_URL ??
  `https://www.google.com/search?q=${encodeURIComponent(`${SITE_NAME} ${BUSINESS.locality}`)}`;

const PASOS = [
  { t: "Tocá el botón", d: "Se abre nuestra ficha de Google (necesitás estar con tu cuenta de Google)." },
  { t: "Elegí las estrellas", d: "Contá qué compraste o a qué encuentro fuiste, y cómo te fue." },
  { t: "Si podés, sumá una foto", d: "Tu mesa, tu evento o la pieza armada: es lo que más ayuda a quien está decidiendo." },
] as const;

export default function ResenasPage() {
  return (
    <main id="main" className="bg-bone text-ink">
      <WebPageJsonLd path="/resenas" name="Dejanos tu reseña" description={DESC} />

      <section data-theme="light" className="px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-40">
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
          <Migas items={[{ name: "Dejanos tu reseña", path: "/resenas" }]} className="mb-6 md:mb-10" />
          <Eyebrow className="mb-6">Tu opinión</Eyebrow>
          <RevealText
            as="h1"
            className="max-w-[13ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] [overflow-wrap:break-word]"
          >
            Dejanos tu reseña
          </RevealText>
          <FadeUp y={40} delay={0.15} className="mt-8 max-w-[56ch] border-t border-line pt-8">
            <p className="font-sans text-[length:var(--text-step-1)] leading-snug text-ink/75">
              Somos un emprendimiento familiar y la mayoría de las decoradoras nos encuentran por recomendación. Si
              compraste una pieza, fuiste a un workshop o al Event Summit, contalo en Google: le sirve a quien está
              buscando proveedor y nos ayuda a seguir creciendo.
            </p>
            <div className="mt-9">
              <a href={LINK_RESENA} target="_blank" rel="noopener noreferrer" className={buttonClasses("dark")}>
                <ButtonInner primary tone="dark">
                  Escribir mi reseña en Google
                </ButtonInner>
              </a>
            </div>
          </FadeUp>
          </div>
          <FadeUp y={50} className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-[min(100%,26rem)] overflow-hidden rounded-t-full bg-sand lg:w-full lg:max-w-[30rem]">
              <Image
                src="/img/summit/lg/sum-14.webp"
                alt="Charla en el escenario del Sweet Flowers Event Summit"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 30rem"
                className="object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <section data-theme="light" className="bg-sand px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[87.5rem]">
          <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92]">
            Te lleva un minuto
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-x-10 border-t border-ink/15 md:mt-14 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.t} className="flex gap-5 border-b border-ink/15 py-8 md:border-b-0">
                <span className="font-display text-[length:var(--text-step-3)] font-extrabold leading-none text-champagne">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[1.05]">{p.t}</h3>
                  <p className="mt-3 max-w-[36ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-theme="light" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92] lg:col-span-5">
            ¿Por qué en Google?
          </h2>
          <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
            <p className="max-w-[62ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/75 md:text-[length:var(--text-step-1)] md:leading-snug">
              Cuando alguien busca “estructuras para eventos” o “arcos para globos”, Google muestra primero a los
              proveedores con opiniones reales. Cada reseña hace que más decoradoras de todo el país puedan
              encontrarnos.
            </p>
            <p className="max-w-[62ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/75 md:text-[length:var(--text-step-1)] md:leading-snug">
              ¿Algo no salió como esperabas? Antes de reseñar, escribinos por WhatsApp al 11 5106-4010 y lo resolvemos.
            </p>
          </div>
        </div>
      </section>

      <Relacionadas
        titulo="Seguí recorriendo"
        slugs={["proveedor-para-decoradores", "workshops-de-decoracion-de-eventos"]}
        extra={[{ href: "/preguntas-frecuentes", label: "Preguntas frecuentes", bajada: "Pagos, envíos y demoras" }]}
      />
    </main>
  );
}
