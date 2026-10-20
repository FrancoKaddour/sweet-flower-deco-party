"use client";

/**
 * Carrito de pedido — NO se compra en el sitio: el carrito arma un mensaje con
 * el listado y lo manda por WhatsApp a la línea de ventas (pedido de Flor).
 * Estado en memoria + localStorage (best-effort: si el navegador lo bloquea,
 * el carrito funciona igual mientras dure la visita).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  slug: string;
  nombre: string;
  precio: number | null;
  img: string | null;
  qty: number;
};

type Cart = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** slug recién agregado (para el feedback del botón). */
  lastAdded: string | null;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "sf-pedido-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* sin storage: carrito solo en memoria */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === item.slug);
      if (found) return prev.map((i) => (i.slug === item.slug ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
    setLastAdded(item.slug);
    window.setTimeout(() => setLastAdded((s) => (s === item.slug ? null : s)), 1600);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
      lastAdded,
    }),
    [items, add, setQty, remove, clear, open, lastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Cart {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuera de <CartProvider>");
  return ctx;
}
