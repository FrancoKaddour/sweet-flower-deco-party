"use client";

import { useEffect, useId, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { track } from "@/lib/analytics";
import { precioMercadoPago } from "@/lib/site";
import { formatARS, type VarianteProducto } from "@/modules/catalog/types";

type Props = {
  slug: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  variantes: readonly VarianteProducto[];
  img: string | null;
  /** Ruta de la ficha. */
  href: string;
  /** URL absoluta (para el mensaje de consulta). */
  url: string;
  hierro: boolean;
  whatsapp: string;
};

/**
 * Bloque de compra de la ficha (E-01, E-05): selector de variante en chips
 * (radios nativos: teclado y lector de pantalla gratis), precio grande que
 * cambia con la opción, las dos cifras (transferencia / Mercado Pago, con el
 * recargo de lib/site.ts) y los CTA.
 */
export function FichaCompra({ slug, nombre, categoria, precio, variantes, img, href, url, hierro, whatsapp }: Props) {
  const [elegida, setElegida] = useState(0);
  const grupo = useId();
  const v = variantes[elegida];
  const precioActual = v ? v.precio : precio;

  useEffect(() => {
    track("view_item", { slug, categoria, precio: precio ?? undefined });
  }, [slug, categoria, precio]);

  const msg = `¡Hola! Quiero consultar por: ${nombre}${v ? ` — ${v.etiqueta}` : ""} (${url}).`;
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  return (
    <div>
      <div className="mt-4 md:mt-6" aria-live="polite">
        {precioActual != null ? (
          <>
            <p className="font-display text-[length:var(--text-step-3)] font-bold leading-none tabular-nums">
              {formatARS(precioActual)}
              <span className="ml-3 inline-block align-middle font-sans text-[0.75rem] font-normal tracking-[0.04em] text-ink/60">
                por transferencia
              </span>
            </p>
            <p className="mt-2 text-[length:var(--text-step--1)] text-ink/65">
              {formatARS(precioMercadoPago(precioActual))} con Mercado Pago
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-[length:var(--text-step-3)] font-bold leading-none">A cotizar</p>
            <p className="mt-2 text-[length:var(--text-step--1)] text-ink/65">Te pasamos el precio por WhatsApp.</p>
          </>
        )}
      </div>

      {variantes.length > 0 && (
        <fieldset className="mt-6">
          <legend className="mb-3 text-[length:var(--text-step--1)] text-ink/60">Elegí la opción</legend>
          <div className="flex flex-wrap gap-2">
            {variantes.map((op, i) => {
              const id = `${grupo}-${i}`;
              return (
                <label
                  key={op.etiqueta}
                  htmlFor={id}
                  className="relative inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-ink/20 px-4 text-[length:var(--text-step--1)] text-ink/80 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
                >
                  <input
                    id={id}
                    type="radio"
                    name={grupo}
                    value={i}
                    checked={elegida === i}
                    onChange={() => setElegida(i)}
                    className="sr-only"
                  />
                  {op.etiqueta}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-7 flex flex-col gap-2 sm:max-w-sm">
        <AddToCartButton
          origen="ficha"
          item={{ slug, nombre, variante: v?.etiqueta ?? null, precio: precioActual, img, href, hierro }}
        />
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("wa_contact_click", { linea: "ventas", pagina: "ficha", slug })}
          className="flex min-h-11 items-center justify-center rounded-full border border-ink/25 px-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
