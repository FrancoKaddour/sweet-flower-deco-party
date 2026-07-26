import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";

// TODO(contenido): testimonios REALES con permiso de publicación (nombre, ciudad,
// edición). Ver docs/16_DECISIONS.md → 03_EVENTOS / pregunta 20 al cliente.
const TESTIMONIOS = [
  {
    quote:
      "Fui por las piezas y me llevé una comunidad. El workshop me ordenó la cabeza y el negocio.",
    nombre: "Sofía R.",
    lugar: "Córdoba",
    edicion: "Edición 06",
  },
  {
    quote:
      "Cada estructura se siente distinta: se nota el oficio y la terminación. Mis clientas lo notan.",
    nombre: "Marina L.",
    lugar: "Rosario",
    edicion: "Edición 04",
  },
  {
    quote:
      "Volví con ideas para todo el año. Es formación de verdad, no un evento más.",
    nombre: "Caro P.",
    lugar: "Mendoza",
    edicion: "Edición 07",
  },
  {
    quote:
      "El montaje llegó impecable y a tiempo. Trabajar con Flor es tranquilidad total.",
    nombre: "Valentina G.",
    lugar: "CABA",
    edicion: "Clienta",
  },
  {
    quote:
      "Las telas y las fundas cambiaron por completo la escena. Calidad premium de verdad.",
    nombre: "Luciana M.",
    lugar: "La Plata",
    edicion: "Edición 05",
  },
  {
    quote:
      "Me inspiró a animarme a lo grande. Hoy mis eventos son otra cosa.",
    nombre: "Belén T.",
    lugar: "Santa Fe",
    edicion: "Edición 03",
  },
];

/**
 * Sección TESTIMONIOS — prueba social tras el Workshop.
 * Grilla editorial de citas (comilla champagne + quote + avatar + atribución),
 * fondo arena cálido, reveal escalonado. Ver docs/05_CONTENT_STRATEGY.md.
 */
export function Testimonios() {
  return (
    <section
      id="testimonios"
      className="bg-sand px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Encabezado */}
        <FadeUp y={80} className="mb-14 text-center md:mb-20">
          <p className="mb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">
            Testimonios
          </p>
          <h2 className="mx-auto max-w-[18ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]">
            {/* TODO(contenido): titular real */}
            Historias que quedan
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
            {/* TODO(contenido) */}
            La voz de las alumnas y clientas que ya vivieron un evento Sweet
            Flowers.
          </p>
        </FadeUp>

        {/* Grilla de citas (reveal escalonado) */}
        <FadeUp
          as="div"
          y={50}
          stagger={0.08}
          className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {TESTIMONIOS.map((t, i) => (
            <figure
              key={t.nombre}
              className="flex flex-col rounded-[var(--radius-md)] bg-cloud p-7 shadow-[0_18px_50px_-26px_rgba(20,17,15,0.22)] md:p-8"
            >
              <span
                aria-hidden="true"
                className="font-display text-[length:var(--text-step-4)] font-bold leading-none text-champagne"
              >
                &ldquo;
              </span>
              <blockquote className="mt-2 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <Image
                  src={`https://picsum.photos/seed/sfdp-testi-${i + 1}/120/120`}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-display text-[length:var(--text-step-0)] font-bold uppercase leading-tight text-ink">
                    {t.nombre}
                  </p>
                  <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-champagne">
                    {t.lugar} · {t.edicion}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
