import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/site";
import { WHATSAPP_HREF } from "@/content/site";
import { FaqJsonLd, WebPageJsonLd } from "@/components/site/JsonLd";
import { FAQ_GRUPOS, FAQS_TODAS } from "@/content/seo/faqs";
import { Migas } from "@/components/seo/Migas";
import { FaqLista } from "@/components/seo/FaqLista";
import { Relacionadas } from "@/components/seo/Relacionadas";
import { RevealText } from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonInner, buttonClasses } from "@/components/ui/Button";

const DESC =
  "Preguntas frecuentes de Sweet Flowers Deco Party: formas de pago, envíos a todo el país, tiempos de entrega, piezas a medida, colores y el Event Summit.";

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes",
  description: DESC,
  path: "/preguntas-frecuentes",
});

export default function PreguntasFrecuentesPage() {
  return (
    <main id="main" className="bg-bone text-ink">
      <WebPageJsonLd path="/preguntas-frecuentes" name="Preguntas frecuentes" description={DESC} />
      {/* Un solo FAQPage con TODAS las preguntas visibles */}
      <FaqJsonLd faqs={FAQS_TODAS} />

      <section data-theme="light" className="px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-40">
        <div className="mx-auto max-w-[87.5rem]">
          <Migas items={[{ name: "Preguntas frecuentes", path: "/preguntas-frecuentes" }]} className="mb-6 md:mb-10" />
          <Eyebrow className="mb-6">Respuestas cortas</Eyebrow>
          <RevealText
            as="h1"
            className="max-w-[14ch] font-display text-[length:clamp(2.25rem,11vw,var(--text-step-6))] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] [overflow-wrap:break-word]"
          >
            Preguntas frecuentes
          </RevealText>
          <FadeUp y={40} delay={0.15} className="mt-8 max-w-[56ch] border-t border-line pt-8">
            <p className="font-sans text-[length:var(--text-step-1)] leading-snug text-ink/75">
              Lo que más nos preguntan antes de comprar: cómo se paga, si enviamos a tu ciudad y cuánto tarda un
              pedido. Si tu duda no está, escribinos y te responden Flor o Tobías.
            </p>
          </FadeUp>
          {/* Índice de temas (anclas) */}
          <nav aria-label="Temas" className="mt-10">
            <ul className="flex flex-wrap gap-x-3 gap-y-2">
              {FAQ_GRUPOS.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-line px-5 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                  >
                    {g.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {FAQ_GRUPOS.map((g, i) => (
        <section
          key={g.id}
          id={g.id}
          data-theme="light"
          className={`scroll-mt-24 px-6 py-16 md:px-10 md:py-24 ${i % 2 === 0 ? "bg-sand" : "bg-bone"}`}
        >
          <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
            <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92] lg:col-span-4">
              {g.titulo}
            </h2>
            <div className="lg:col-span-7 lg:col-start-6">
              <FaqLista faqs={g.faqs} nombre={`faq-${g.id}`} conSchema={false} />
            </div>
          </div>
        </section>
      ))}

      <section data-theme="dark" className="relative overflow-hidden bg-ink px-6 py-20 text-bone md:px-10 md:py-28">
        <div aria-hidden="true" className="evt-grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-[87.5rem] flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9]">
            ¿Te quedó una duda?
          </h2>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={buttonClasses("light")}>
              <ButtonInner primary tone="light">
                Preguntanos por WhatsApp
              </ButtonInner>
            </a>
            <Link href="/contacto" className="inline-flex min-h-11 items-center text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone/70 underline-offset-4 hover:text-bone hover:underline">
              Ir al formulario
            </Link>
          </div>
        </div>
      </section>

      <Relacionadas
        slugs={["envios-a-todo-el-pais", "proveedor-para-decoradores", "capacitacion-para-decoradores-de-eventos"]}
      />
    </main>
  );
}
