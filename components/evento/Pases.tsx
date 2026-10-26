import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatARS } from "@/content/productos";
import { EXTRAS_NOTA, PASES, PREVENTAS } from "@/content/evento";
import { BotonPase } from "./BotonPase";

/**
 * PASES del Summit (VIP / General) con las dos tarifas (preventa y general).
 * Se paga online con Mercado Pago: cada pase baja al formulario de inscripción
 * con ese pase ya elegido.
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

        <FadeUp y={40} stagger={0.1} className="mx-auto grid max-w-[40rem] grid-cols-1 gap-5 md:max-w-none md:grid-cols-2 lg:gap-6">
          {PASES.map((pase) => {
            const vip = pase.id === "vip";
            return (
              <article
                key={pase.id}
                className={`@container flex flex-col rounded-[var(--radius-lg)] p-6 min-[400px]:p-7 lg:p-10 ${
                  vip ? "bg-ink text-bone" : "border border-ink/15 bg-bone text-ink"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                  <h3 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-none">
                    {pase.nombre}
                  </h3>
                  {vip && (
                    <span className="whitespace-nowrap rounded-full border border-champagne/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-champagne">
                      Experiencia completa
                    </span>
                  )}
                </div>

                {/* Precios por preventa */}
                <dl className={`mt-8 divide-y ${vip ? "divide-bone/15 border-y border-bone/15" : "divide-ink/10 border-y border-ink/10"}`}>
                  {PREVENTAS.map((pv) => (
                    <div key={pv.id} className="flex flex-col gap-2 py-4 @sm:flex-row @sm:items-end @sm:justify-between @sm:gap-6">
                      <dt>
                        <span className="block text-[0.72rem] uppercase tracking-[0.14em] opacity-70">{pv.nombre}</span>
                        <span className={`text-[0.72rem] uppercase tracking-[0.14em] ${vip ? "text-champagne" : "text-bordeaux"}`}>
                          {pv.hastaLabel}
                        </span>
                      </dt>
                      <dd className="shrink-0 font-display text-[length:var(--text-step-3)] font-bold leading-none tabular-nums @sm:text-right">
                        {formatARS(pv.precios[pase.id])}
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

                <BotonPase
                  pase={pase.id}
                  className={`mt-auto flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                    vip ? "bg-bone text-ink hover:bg-champagne" : "bg-ink text-bone hover:bg-bordeaux"
                  }`}
                >
                  Quiero el {pase.nombre}
                  <span aria-hidden="true">→</span>
                </BotonPase>
              </article>
            );
          })}
        </FadeUp>

        <p className="mx-auto mt-8 max-w-[70ch] text-center text-[length:var(--text-step--1)] text-ink/60">
          Pagás online con Mercado Pago: tarjeta de crédito en cuotas, débito, dinero en cuenta o efectivo. {EXTRAS_NOTA}
        </p>
      </div>
    </section>
  );
}
