import Image from "next/image";
import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
import { Button } from "@/components/ui/Button";
import { TRAYECTORIA, ASISTENTES_WORKSHOPS } from "@/content/evento";

// Prueba social VERIFICABLE (D-09 / E-24): los 7 workshops con sede, fecha y
// asistentes, de content/evento.ts (única fuente). Acá la numeración SÍ es una
// secuencia (D-10). Reemplaza a los testimonios inventados.
const WORKSHOPS = TRAYECTORIA.filter((t) => t.etapa.startsWith("Workshop"));

/**
 * Sección TRAYECTORIA en el inicio → /event-summit#trayectoria.
 * Foto en máscara de ARCO + registro de los workshops, alineado a la izquierda.
 */
export function Workshops() {
  return (
    <section
      id="workshops"
      data-theme="light"
      className="scroll-mt-24 bg-bone px-6 py-24 text-ink md:px-10 md:py-36"
    >
      <div className="mx-auto grid max-w-[87.5rem] items-start gap-14 lg:grid-cols-12 lg:gap-10">
        <FadeUp y={50} className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative aspect-[3/4] w-full max-w-[27.5rem] overflow-hidden rounded-t-full bg-sand">
            <Image
              src="/img/rio-cuarto/rc-12.webp"
              alt="Charla del workshop de Río Cuarto, con el salón lleno"
              fill
              sizes="(max-width: 768px) 90vw, 440px"
              className="object-cover"
            />
          </div>
        </FadeUp>

        <div className="w-full lg:col-span-7">
          <RevealText
            as="h2"
            onScroll
            className="t-voz-display max-w-[16ch] text-[length:var(--text-step-5)] text-ink md:text-[length:var(--text-step-6)]"
          >
            Siete workshops antes del primer Summit
          </RevealText>
          <p className="mt-6 max-w-[44ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/75">
            Más de {ASISTENTES_WORKSHOPS} decoradoras y organizadoras pasaron por
            estos encuentros. Así se armó la comunidad que hoy se junta en La
            Rural.
          </p>

          <ol className="mt-10 border-b border-ink/15">
            {WORKSHOPS.map((w) => (
              <li key={w.etapa} className="border-t border-ink/15">
                <Link
                  href={w.slug ? `/event-summit/trayectoria/${w.slug}` : "/event-summit#trayectoria"}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-4 transition-colors hover:bg-sand/60 sm:grid-cols-[3.5rem_1fr_11rem_7rem] md:py-5"
                >
                  <span className="font-display text-[length:var(--text-step-2)] font-light leading-none text-ink/65">
                    {w.numero}
                  </span>
                  <span className="t-voz-display text-[length:var(--text-step-2)] leading-tight">
                    {w.titulo}
                    <span className="ml-2 font-sans text-[length:var(--text-step--1)] text-ink/65">{w.lugar}</span>
                  </span>
                  <span className="col-start-2 text-[length:var(--text-step--1)] text-ink/70 sm:col-start-auto">
                    {w.fecha}
                  </span>
                  <span className="col-start-3 row-start-1 text-right text-[length:var(--text-step--1)] tabular-nums text-ink/70 sm:col-start-auto sm:row-start-auto">
                    {w.participantes ? `${w.participantes} asistentes` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Button href="/event-summit#trayectoria" className="mt-10">
            Ver la trayectoria
          </Button>
        </div>
      </div>
    </section>
  );
}
