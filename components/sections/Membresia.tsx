import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

// TODO(contenido): copy, precio y foto reales de la membresía (ver docs/16_DECISIONS.md).
// Beneficios del "círculo Sweet Flowers": comunidad + prioridad + descuentos todo el año.
const BENEFICIOS = [
  "Descuentos en toda la tienda",
  "Acceso anticipado a nuevas piezas",
  "Clases y contenido exclusivo",
  "Prioridad en fechas de eventos",
  "Comunidad privada de decoradoras",
] as const;

/**
 * Sección MEMBRESÍA — momento oscuro premium/exclusivo (bordeaux + bone + champagne).
 * Layout editorial de 2 columnas: texto (izq) + retrato vertical (der).
 * data-theme="dark" lo usa el header para invertir su color al pasar por aquí.
 */
export function Membresia() {
  return (
    <section
      id="membresia"
      data-theme="dark"
      className="bg-bordeaux px-6 py-24 text-bone md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* IZQUIERDA — bloque editorial de texto */}
        <FadeUp y={100}>
          {/* TODO(contenido) */}
          <Eyebrow>Membresía</Eyebrow>

          <h2 className="mt-5 max-w-[16ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-5)]">
            {/* TODO(contenido): titular real */}
            Sumate al círculo Sweet Flowers
          </h2>

          <p className="mt-6 max-w-[46ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/75">
            {/* TODO(contenido) */}
            Un espacio para quienes viven de decorar. Beneficios, comunidad y
            prioridad todo el año.
          </p>

          {/* Lista de beneficios — bullet champagne + texto bone */}
          <ul className="mt-9 flex flex-col gap-3.5">
            {BENEFICIOS.map((beneficio) => (
              <li
                key={beneficio}
                className="flex items-start font-sans text-[length:var(--text-step-0)] leading-snug text-bone"
              >
                <span
                  aria-hidden="true"
                  className="mr-3 select-none text-champagne"
                >
                  ✓
                </span>
                {/* TODO(contenido) */}
                {beneficio}
              </li>
            ))}
          </ul>

          {/* CTA + precio de referencia */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* TODO(contenido) */}
            <Button href="/membresia" variant="inverse">
              Quiero ser parte ↗
            </Button>
            <p className="font-sans text-[length:var(--text-step--1)] text-bone/60">
              {/* TODO(contenido): precio real */}
              Desde $ — por mes
            </p>
          </div>
        </FadeUp>

        {/* DERECHA — retrato vertical */}
        <FadeUp y={50}>
          <Image
            src="https://picsum.photos/seed/sfdp-memb-1/800/1000"
            alt=""
            width={800}
            height={1000}
            sizes="(max-width: 768px) 100vw, 45vw"
            className="aspect-[4/5] h-auto w-full rounded-[var(--radius-md)] object-cover"
          />
        </FadeUp>
      </div>
    </section>
  );
}
