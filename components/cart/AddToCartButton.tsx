"use client";

import { claveItem, useCart, type CartItem } from "./CartProvider";

type Props = {
  item: Omit<CartItem, "qty">;
  /** Dónde está el botón (medición): "ficha" | "card" | "landing". */
  origen?: string;
  /** "boton" (ficha) o "icono" (+ redondo de la tarjeta). */
  forma?: "boton" | "icono";
};

/** "Agregar al pedido" — suma el producto (y su variante) al carrito de WhatsApp. */
export function AddToCartButton({ item, origen = "ficha", forma = "boton" }: Props) {
  const { add, items, lastAdded, count, setOpen } = useCart();
  const clave = claveItem(item);
  const enCarrito = items.find((i) => claveItem(i) === clave)?.qty ?? 0;
  const justAdded = lastAdded === clave;
  const nombre = item.variante ? `${item.nombre} (${item.variante})` : item.nombre;

  if (forma === "icono") {
    return (
      <button
        type="button"
        onClick={() => add(item, origen)}
        aria-label={enCarrito ? `Agregar otro ${nombre} al pedido (tenés ${enCarrito})` : `Agregar ${nombre} al pedido`}
        className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-[background-color,color,border-color,transform] duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
          justAdded ? "border-bordeaux bg-bordeaux text-bone" : "border-ink/25 bg-bone text-ink hover:border-ink hover:bg-ink hover:text-bone"
        }`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-300 ${justAdded ? "rotate-90" : ""}`}>
          {justAdded ? (
            <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
        {enCarrito > 0 && !justAdded && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-bordeaux px-1 text-[0.62rem] font-medium tabular-nums text-bone">
            {enCarrito}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => add(item, origen)}
        className={`flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-[0.75rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
          justAdded ? "bg-bordeaux text-bone" : "bg-ink text-bone hover:bg-bordeaux"
        }`}
      >
        {justAdded ? "¡Agregado!" : enCarrito ? `Agregar otro (${enCarrito} en el pedido)` : "Agregar al pedido"}
      </button>
      {count > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-1 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
        >
          Ver pedido ({count})
        </button>
      )}
    </div>
  );
}
