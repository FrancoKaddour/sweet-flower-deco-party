import Image from "next/image";
import { formatARS, type Producto } from "@/content/productos";
import { WHATSAPP_NUMBER } from "@/content/site";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

/**
 * Card de producto — vitrina + "Agregar al pedido" (carrito que se envía por
 * WhatsApp, sin compra en el sitio), como pidió Flor:
 * precio de catálogo y consulta por WhatsApp con el producto ya escrito.
 * Sin pago en el sitio: todo se cierra por WhatsApp.
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
        {p.descripcion && (
          <p className="mt-1.5 line-clamp-3 text-[length:var(--text-step--1)] leading-snug text-ink/60">
            {p.descripcion}
          </p>
        )}
        {p.medidas && (
          <p className="mt-1 text-[length:var(--text-step--1)] text-ink/60">{p.medidas}</p>
        )}
        {p.variantes?.length ? (
          <p className="mt-1 text-[length:var(--text-step--1)] text-ink/60">{p.variantes.join(" · ")}</p>
        ) : null}

        <div className="mt-3">
          {p.precio != null ? (
            <p className="font-sans text-[length:var(--text-step-1)] font-medium text-ink">
                {formatARS(p.precio)}
                <span className="ml-2 text-[0.7rem] uppercase tracking-[0.12em] text-ink/50">
                  transferencia
                </span>
            </p>
          ) : (
            <p className="font-sans text-[length:var(--text-step-0)] text-ink/70">Precio a consultar</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:mt-auto sm:pt-4">
          <AddToCartButton
            item={{ slug: p.slug, nombre: p.nombre, precio: p.precio, img: p.img }}
          />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-9 items-center justify-center px-4 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Consultar este producto
          </a>
        </div>
      </div>
    </article>
  );
}
