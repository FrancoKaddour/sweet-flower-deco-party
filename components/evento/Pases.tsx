import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatARS } from "@/content/productos";
import {
  EVENT_NAME,
  EDICION_LABEL,
  EVENT_WHEN,
  EVENT_WHATSAPP,
  EXTRAS_NOTA,
  PASES,
  PREVENTAS,
} from "@/content/evento";

/**
 * PASES del Summit (VIP / General) con las dos preventas y sus precios
 * (transferencia y link de Mercado Pago). Cada pase lleva a WhatsApp con el
 * mensaje escrito — no se paga en el sitio.
 */
export function Pases() {
  return (
    <section
      id="pases"
      data-theme="light"
      className="scroll-mt-24 bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[87.5rem]">
        <div className="mb-14 text-center md:mb-16">
          <Eyebrow className="mb-5">Preventa abierta</Eyebrow>
          <h2 className="mx-auto max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-ink">
            Elegí tu pase
          </h2>
        </div>

        <FadeUp y={40} stagger={0.1} className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {PASES.map((pase) => {
            const vip = pase.id === "vip";
            const msg = `¡Hola! Quiero el ${pase.nombre} para el ${EVENT_NAME} (${EDICION_LABEL}, ${EVENT_WHEN}).`;
            const wa = `https://wa.me/${EVENT_WHATSAPP}?text=${encodeURIComponent(msg)}`;
            return (
              <article
                key={pase.id}
                className={`flex flex-col rounded-[var(--radius-lg)] p-7 md:p-10 ${
                  vip ? "bg-ink text-bone" : "border border-ink/15 bg-bone text-ink"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-none">
                    {pase.nombre}
                  </h3>
                  {vip && (
                    <span className="rounded-full border border-champagne/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-champagne">
                      Experiencia completa
                    </span>
                  )}
                </div>

                {/* Precios por preventa */}
                <dl className={`mt-8 divide-y ${vip ? "divide-bone/15 border-y border-bone/15" : "divide-ink/10 border-y border-ink/10"}`}>
                  {PREVENTAS.map((pv) => (
                    <div key={pv.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                      <dt>
                        <span className="block text-[0.72rem] uppercase tracking-[0.14em] opacity-70">{pv.nombre}</span>
                        <span className={`text-[0.72rem] uppercase tracking-[0.14em] ${vip ? "text-champagne" : "text-bordeaux"}`}>
                          {pv.hastaLabel}
                        </span>
                      </dt>
                      <dd className="text-right">
                        <span className="block font-display text-[length:var(--text-step-3)] font-bold leading-none">
                          {formatARS(pv.precios[pase.id].transferencia)}
                        </span>
                        <span className="text-[length:var(--text-step--1)] opacity-65">
                          transferencia · {formatARS(pv.precios[pase.id].mp)} por link de Mercado Pago
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Qué incluye */}
                <ul className="mb-10 mt-8 flex flex-col gap-2.5">
                  {pase.incluye.map((item) => (
                    <li key={item} className="flex gap-3 text-[length:var(--text-step-0)] leading-snug">
                      <span aria-hidden="true" className={vip ? "text-champagne" : "text-bordeaux"}>
                        ✓
                      </span>
                      <span className={vip ? "text-bone/85" : "text-ink/80"}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                    vip ? "bg-bone text-ink hover:bg-champagne" : "bg-ink text-bone hover:bg-bordeaux"
                  }`}
                >
                  Quiero el {pase.nombre}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            );
          })}
        </FadeUp>

        <p className="mt-8 text-center text-[length:var(--text-step--1)] text-ink/60">
          {EXTRAS_NOTA} La reserva y el pago se coordinan por WhatsApp.
        </p>
      </div>
    </section>
  );
}
