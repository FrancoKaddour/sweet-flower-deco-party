"use client";

/**
 * Carrito de pedido — NO se compra en el sitio: el carrito arma un mensaje con
 * el listado y lo manda por WhatsApp a la línea de ventas (pedido de Flor).
 * Estado en memoria + localStorage (best-effort: si el navegador lo bloquea,
 * el carrito funciona igual mientras dure la visita).
 *
 * Cada línea es producto + variante (E-01): "Mickey sin pintar" y "Mickey
 * pintado" son dos líneas distintas, cada una con su precio.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";

export type CartItem = {
  slug: string;
  nombre: string;
  /** Etiqueta de la variante elegida ("2,40 × 1,80 m", "Pintado"…), si hay. */
  variante?: string | null;
  /** Precio por transferencia de ESA variante. null = a cotizar. */
  precio: number | null;
  img: string | null;
  /** Ruta de la ficha (/productos/<cat>/<slug>) para el link del mensaje. */
  href?: string;
  /** El producto es de hierro (habilita el selector de color en el carrito). */
  hierro?: boolean;
  qty: number;
};

/** Clave de una línea del carrito: slug + variante. */
export const claveItem = (i: Pick<CartItem, "slug" | "variante">) => (i.variante ? `${i.slug}::${i.variante}` : i.slug);

/** "1 producto" / "3 productos". */
export const productosTexto = (n: number) => `${n} ${n === 1 ? "producto" : "productos"}`;

type Cart = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, "qty">, origen?: string) => void;
  setQty: (clave: string, qty: number) => void;
  remove: (clave: string) => void;
  clear: () => void;
  /** Carga varias líneas de una vez (ej. "Repetir pedido" desde Mi cuenta): suma cantidades. */
  cargarVarios: (items: CartItem[]) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** clave recién agregada (para el feedback del botón). */
  lastAdded: string | null;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "sf-pedido-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Anuncio para lectores de pantalla (T-18).
  const [aviso, setAviso] = useState("");
  const itemsRef = useRef<CartItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Hidrata desde localStorage después del primer render (evita mismatch SSR).
  useEffect(() => {
    let guardado: CartItem[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) guardado = JSON.parse(raw);
    } catch {
      /* sin storage: carrito solo en memoria */
    }
    const id = requestAnimationFrame(() => {
      if (Array.isArray(guardado) && guardado.length) setItems(guardado);
      setLoaded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">, origen?: string) => {
    const clave = claveItem(item);
    const prev = itemsRef.current;
    const found = prev.find((i) => claveItem(i) === clave);
    const next = found
      ? prev.map((i) => (claveItem(i) === clave ? { ...i, qty: i.qty + 1 } : i))
      : [...prev, { ...item, qty: 1 }];
    itemsRef.current = next;
    setItems(next);
    const total = next.reduce((n, i) => n + i.qty, 0);
    const nombre = item.variante ? `${item.nombre} (${item.variante})` : item.nombre;
    setAviso(`Agregaste ${nombre}. Tenés ${productosTexto(total)} en el pedido.`);
    track("add_to_cart", { slug: item.slug, variante: item.variante ?? undefined, precio: item.precio ?? undefined, origen });
    setLastAdded(clave);
    window.setTimeout(() => setLastAdded((s) => (s === clave ? null : s)), 1600);
  }, []);

  const setQty = useCallback((clave: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => claveItem(i) !== clave) : prev.map((i) => (claveItem(i) === clave ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((clave: string) => setItems((prev) => prev.filter((i) => claveItem(i) !== clave)), []);
  const clear = useCallback(() => setItems([]), []);

  const cargarVarios = useCallback((nuevos: CartItem[]) => {
    const next = [...itemsRef.current];
    for (const n of nuevos) {
      const k = claveItem(n);
      const i = next.findIndex((x) => claveItem(x) === k);
      if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + n.qty };
      else next.push(n);
    }
    itemsRef.current = next;
    setItems(next);
    setAviso(`Cargamos ${productosTexto(nuevos.reduce((t, i) => t + i.qty, 0))} en tu pedido.`);
  }, []);

  const value = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      cargarVarios,
      open,
      setOpen,
      lastAdded,
    }),
    [items, add, setQty, remove, clear, cargarVarios, open, lastAdded],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {aviso}
      </p>
    </CartContext.Provider>
  );
}

export function useCart(): Cart {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuera de <CartProvider>");
  return ctx;
}
