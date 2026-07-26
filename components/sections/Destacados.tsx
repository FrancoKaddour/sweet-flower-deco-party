import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";

// TODO(contenido): productos, precios y fotos reales (ver docs/16_DECISIONS.md → 02_PRODUCTOS).
// Precios pendientes de la planilla maestra (con/sin recargo MP a definir — ADR-007).
const PRODUCTOS = [
  { slug: "arco-floral", nombre: "Arco floral", material: "Hierro", precio: "$ —" },
  { slug: "mesa-tribal", nombre: "Mesa tribal", material: "Madera", precio: "$ —" },
  { slug: "panel-geometrico", nombre: "Panel geométrico", material: "MDF", precio: "$ —" },
  { slug: "columna-romana", nombre: "Columna romana", material: "MDF", precio: "$ —" },
  { slug: "funda-terciopelo", nombre: "Funda de terciopelo", material: "Telas", precio: "$ —" },
  { slug: "sosten-globos", nombre: "Sostén de globos", material: "Hierro", precio: "$ —" },
];

/**
 * Sección DESTACADOS — vitrina de piezas individuales (foto + material + nombre + precio).
 * Complementa a Productos (que muestra categorías): acá van productos puntuales con precio.
 * Reveal escalonado (FadeUp con stagger) + hover editorial. Enlaza al ecommerce.
 */
export function Destacados() {
  return (
    <section id="destacados" className="bg-bone px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        {/* Encabezado: título a la izquierda + CTA a la derecha */}
        <FadeUp
          y={80}
          className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">
              La tienda
            </p>
            <h2 className="max-w-[16ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]">
              {/* TODO(contenido): titular real */}
              Piezas que se llevan la fiesta
            </h2>
          </div>
          <Link
            href="/productos"
            className="group inline-flex w-max items-center gap-2 border-b border-ink pb-1 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.1em] text-ink"
          >
            Ver toda la tienda
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </FadeUp>

        {/* Grilla de productos (reveal escalonado) */}
        <FadeUp
          as="div"
          y={60}
          stagger={0.08}
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14"
        >
          {PRODUCTOS.map((p) => (
            <Link
              key={p.slug}
              href={`/productos/${p.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-sand">
                <Image
                  src={`https://picsum.photos/seed/sfdp-dest-${p.slug}/700/880`}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[800ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                />
                {/* Badge de acción (aparece en hover) */}
                <span className="absolute right-3 top-3 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-ink text-[length:var(--text-step-0)] text-bone opacity-0 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne">
                    {p.material}
                  </p>
                  <h3 className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-tight text-ink">
                    {p.nombre}
                  </h3>
                </div>
                {/* TODO(contenido): precio real */}
                <p className="shrink-0 font-sans text-[length:var(--text-step-0)] text-ink">
                  {p.precio}
                </p>
              </div>
            </Link>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
