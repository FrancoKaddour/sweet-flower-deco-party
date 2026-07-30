import type { Metadata } from "next";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/contacto/ContactForm";
import { CONTACTO_LINKS } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contanos tu evento y lo hacemos realidad. Consultas, presupuestos a medida y dudas sobre envíos, pagos y tiempos. Escribinos por WhatsApp, Instagram o email.",
  alternates: { canonical: "/contacto" },
};

// 3 preguntas más frecuentes ANTES de comprar (docs/CONTENIDO_FLOR.md §7),
// con respuestas reales (§1, §4, §5). TODO(contenido): afinar con Flor.
const FAQS = [
  {
    q: "¿Cuáles son las formas de pago?",
    a: "Transferencia bancaria o Mercado Pago. El precio de catálogo es sin recargo; si pagás con Mercado Pago se suma el recargo habitual (~18%).",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. Trabajamos principalmente con Vía Cargo (con descuento en el valor del envío) y, donde no llega, con Buspack, MD o FlechaBus. El seguro se abona a la transportista.",
  },
  {
    q: "¿Cuánto demora un pedido?",
    a: "Trabajamos mayormente por encargo: alrededor de 20 días. Los productos a medida dependen de la complejidad; una pieza muy específica puede llevar más tiempo, y siempre te lo aclaramos al cotizar.",
  },
] as const;

export default function ContactoPage() {
  return (
    <main id="main">
      {/* 1 · INTRO (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-16 pt-32 text-ink md:px-10 md:pb-20 md:pt-44"
      >
        <div className="mx-auto max-w-[1400px]">
          <Eyebrow className="mb-6">Contacto</Eyebrow>
          <RevealText
            as="h1"
            className="max-w-[16ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-ink [overflow-wrap:anywhere]"
          >
            {/* TODO(contenido): titular real */}
            Contanos tu evento
          </RevealText>
          <FadeUp
            y={40}
            delay={0.15}
            className="mt-8 max-w-[52ch] border-t border-line pt-8 font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70"
          >
            <p>
              {/* TODO(contenido) */}
              Escribinos y armamos la escenografía a tu medida. Respondemos entre
              Flor y Tobías, en persona, sin bots.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 2 · FORM + ASIDE (light) */}
      <section
        data-theme="light"
        className="bg-bone px-6 pb-24 text-ink md:px-10 md:pb-32"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Formulario */}
          <FadeUp y={50} className="lg:col-span-7">
            <ContactForm />
          </FadeUp>

          {/* Aside — canales directos + info */}
          <FadeUp y={50} className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-champagne">
                Escribinos directo
              </h2>
              <ul className="mt-5 flex flex-col">
                {CONTACTO_LINKS.map((c) => (
                  <li key={c.label}>
                    {/* TODO(contenido): links reales (WhatsApp, IG, email) */}
                    <a
                      href={c.href}
                      className="group flex min-h-11 items-center justify-between gap-4 border-t border-line py-4 font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink transition-colors hover:text-champagne"
                    >
                      {c.label}
                      <span
                        aria-hidden="true"
                        className="text-[length:var(--text-step-1)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nota "a medida" */}
            <div className="rounded-[var(--radius-lg)] bg-blush p-8">
              <h3 className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.95] text-ink">
                ¿Buscás algo a medida?
              </h3>
              <p className="mt-3 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
                {/* Copy real (§6): se cotiza; la demora depende de la complejidad. */}
                Contanos qué pieza imaginás y la cotizamos. Cada estructura se
                piensa para tu evento; la demora depende de la complejidad.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 3 · FAQ (light, con acento) */}
      <section
        data-theme="light"
        className="bg-sand px-6 py-24 text-ink md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-5">Preguntas frecuentes</Eyebrow>
            <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]">
              {/* TODO(contenido): titular real */}
              Lo que más nos preguntan
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-b border-ink/15">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  name="faq"
                  className="group border-t border-ink/15"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[1.05] text-ink [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[length:var(--text-step-2)] text-champagne transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pb-6 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
