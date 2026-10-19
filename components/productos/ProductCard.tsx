import Image from "next/image";
import { formatARS, precioMP, type Producto } from "@/content/productos";
import { WHATSAPP_NUMBER } from "@/content/site";

/**
 * Card de producto — vitrina + compra simple (sin carrito), como pidió Flor:
 * precio de catálogo, precio con Mercado Pago (+recargo calculado), botón de
 * pago directo si hay link, y consulta por WhatsApp con el producto ya escrito.
 */
export function ProductCard({ p }: { p: Producto }) {
  const msg = `¡Hola! Quiero consultar por: ${p.nombre}${p.medidas ? ` (${p.medidas})` : ""}.`;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-sand">
        {p.img ? (
          <Image
            src={p.img}
            alt={p.nombre}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[800ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-[0.7rem] uppercase tracking-[0.16em] text-ink/40">
            Foto en camino
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-tight text-ink">
          {p.nombre}
        </h3>
        {p.medidas && (
          <p className="mt-1 text-[length:var(--text-step--1)] text-ink/60">{p.medidas}</p>
        )}
        {p.variantes?.length ? (
          <p className="mt-1 text-[length:var(--text-step--1)] text-ink/60">{p.variantes.join(" · ")}</p>
        ) : null}

        <div className="mt-3">
          {p.precio != null ? (
            <>
              <p className="font-sans text-[length:var(--text-step-1)] font-medium text-ink">
                {formatARS(p.precio)}
                <span className="ml-2 text-[0.7rem] uppercase tracking-[0.12em] text-ink/50">
                  transferencia
                </span>
              </p>
              <p className="text-[length:var(--text-step--1)] text-ink/55">
                {formatARS(precioMP(p.precio))} con Mercado Pago
              </p>
            </>
          ) : (
            <p className="font-sans text-[length:var(--text-step-0)] text-ink/70">Precio a consultar</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:mt-auto sm:pt-4">
          {p.mpLink && (
            <a
              href={p.mpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:bg-bordeaux"
            >
              Comprar con Mercado Pago
            </a>
          )}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center rounded-full border border-ink/25 px-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
