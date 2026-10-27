import Image from "next/image";
import Link from "next/link";
import { esHierro, etiquetaPrecio, type Producto } from "@/modules/catalog/types";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

/**
 * Tarjeta de producto (D-01, D-13, T-24): foto, nombre, precio ("Desde $X" si
 * hay opciones) y UNA sola acción, el "+" redondo:
 *  - sin variantes → suma al pedido ahí mismo;
 *  - con variantes → lleva a la ficha para elegir la opción (no adivinamos).
 * La descripción vive en la ficha. La foto es un link "espejo" del título
 * (tabIndex -1 + aria-hidden): un solo destino por tarjeta para el teclado.
 *
 * Tratamiento unificado de las fotos de taller (D-01): recorte 4:5 con el
 * centro un poco más abajo (la pieza suele estar en la mitad inferior), fondo
 * arena, tinte cálido muy leve y viñeta suave → la grilla lee como serie.
 */
export function ProductCard({ p, origen = "card" }: { p: Producto; origen?: string }) {
  const href = `/productos/${p.categoria}/${p.slug}`;
  const precio = etiquetaPrecio(p);
  const conOpciones = (p.variantes?.length ?? 0) > 0;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-sand"
      >
        {p.img ? (
          <>
            <Image
              src={p.img}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-[50%_58%] [filter:sepia(0.14)_saturate(0.82)_contrast(1.04)_brightness(1.03)] transition-transform duration-[800ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            {/* Tinte arena + viñeta: unifica fondos dispares (pared, pino, cemento). */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-sand opacity-25 mix-blend-multiply" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_42%,transparent_58%,rgb(20_17_15/0.2)_100%)]"
            />
          </>
        ) : (
          <span className="grid h-full place-items-center text-[0.75rem] tracking-[0.08em] text-ink/50">Foto en camino</span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 items-start justify-between gap-3 sm:mt-4">
        <div className="min-w-0">
          <h3 className="font-display text-[length:var(--text-step-0)] font-bold uppercase leading-tight text-ink [overflow-wrap:break-word] sm:text-[length:var(--text-step-1)]">
            <Link href={href} className="outline-offset-4 hover:text-bordeaux">
              {p.nombre}
            </Link>
          </h3>
          <p className="mt-1.5 font-sans text-[length:var(--text-step-0)] tabular-nums text-ink/80">
            {precio ?? "A cotizar"}
          </p>
        </div>
        {conOpciones ? (
          <Link
            href={href}
            aria-label={`Elegir opción de ${p.nombre}`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/25 bg-bone text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bone"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
              <path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        ) : (
          <AddToCartButton
            forma="icono"
            origen={origen}
            item={{ slug: p.slug, nombre: p.nombre, precio: p.precio, img: p.img, href, hierro: esHierro(p) }}
          />
        )}
      </div>
    </article>
  );
}
