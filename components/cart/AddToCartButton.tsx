"use client";

import { useCart, type CartItem } from "./CartProvider";

/** "Agregar al pedido" — suma el producto al carrito de WhatsApp. */
export function AddToCartButton({ item }: { item: Omit<CartItem, "qty"> }) {
  const { add, items, lastAdded } = useCart();
  const enCarrito = items.find((i) => i.slug === item.slug)?.qty ?? 0;
  const justAdded = lastAdded === item.slug;

  return (
    <button
      type="button"
      onClick={() => add(item)}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
        justAdded ? "bg-bordeaux text-bone" : "bg-ink text-bone hover:bg-bordeaux"
      }`}
    >
      {justAdded ? "¡Agregado!" : enCarrito ? `Agregar otro (${enCarrito})` : "Agregar al pedido"}
    </button>
  );
}
