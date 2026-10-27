"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/components/cart/CartProvider";
import { track } from "@/lib/analytics";

/**
 * "Repetir pedido": vuelve a cargar en el carrito las piezas que siguen en el
 * catálogo, con el precio de HOY (lo arma el servidor en /cuenta), y lo abre.
 */
export function RepetirPedido({ codigo, items, faltan }: { codigo: string; items: CartItem[]; faltan: number }) {
  const { cargarVarios, setOpen } = useCart();
  const [hecho, setHecho] = useState(false);
  if (items.length === 0) {
    return <p className="text-[length:var(--text-step--1)] text-ink/60">Estas piezas ya no están en el catálogo.</p>;
  }
  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={() => {
          cargarVarios(items);
          setHecho(true);
          setOpen(true);
          track("add_to_cart", { slug: items[0]?.slug, origen: `repetir:${codigo}` });
        }}
        className="inline-flex min-h-11 items-center rounded-full border border-ink/25 px-5 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
      >
        {hecho ? "Cargado en tu pedido" : "Repetir pedido"}
      </button>
      {faltan > 0 && (
        <p className="text-[length:var(--text-step--1)] text-ink/60">
          {faltan === 1 ? "1 pieza ya no está en el catálogo." : `${faltan} piezas ya no están en el catálogo.`}
        </p>
      )}
    </div>
  );
}
