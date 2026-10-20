"use client";

/**
 * Botón flotante "Tu pedido" + panel lateral con el listado. "Enviar por
 * WhatsApp" abre la línea de ventas con el pedido ya escrito (no se paga en
 * el sitio). El total es orientativo (precio de catálogo, por transferencia).
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { formatARS } from "@/content/productos";
import { WHATSAPP_NUMBER } from "@/content/site";

export function CartDrawer() {
  const { items, count, setQty, remove, clear, open, setOpen } = useCart();
  const [nombre, setNombre] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [nota, setNota] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const total = items.reduce((t, i) => t + (i.precio ?? 0) * i.qty, 0);
  const hayConsultar = items.some((i) => i.precio == null);

  const enviar = () => {
    const lineas = items.map(
      (i) => `• ${i.qty} × ${i.nombre} — ${i.precio != null ? `${formatARS(i.precio)} c/u` : "precio a consultar"}`,
    );
    const datos = [
      nombre && `Nombre: ${nombre}`,
      localidad && `Localidad: ${localidad}`,
      nota && `Comentarios: ${nota}`,
    ].filter(Boolean) as string[];
    const msg = [
      "¡Hola! Quiero hacer este pedido desde la web:",
      "",
      ...lineas,
      "",
      `Total (transferencia): ${formatARS(total)}${hayConsultar ? " (+ productos a consultar)" : ""}`,
      ...(datos.length ? ["", ...datos] : []),
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const input =
    "w-full border-b border-ink/20 bg-transparent py-2 text-[length:var(--text-step-0)] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none";

  return (
    <>
      {/* Botón flotante (a la izquierda del de WhatsApp) — solo con productos */}
      {count > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[5.25rem] z-40 flex h-13 items-center gap-2.5 rounded-full bg-bordeaux px-5 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-bone shadow-[0_10px_30px_-10px_rgb(20_17_15/0.55)] transition-transform duration-300 hover:-translate-y-0.5 md:bottom-8 md:right-[6.5rem]"
          aria-label={`Ver tu pedido (${count} productos)`}
        >
          Tu pedido
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-bone px-1.5 text-[0.75rem] text-ink">
            {count}
          </span>
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed inset-0 z-[60] transition-[visibility] ${open ? "visible" : "invisible delay-500"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Tu pedido"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-bone text-ink shadow-2xl transition-transform duration-500 ease-(--ease-out-quart) ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
            <h2 className="font-display text-[length:var(--text-step-2)] font-bold uppercase">Tu pedido</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center text-[1.4rem] leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4" data-lenis-prevent>
            {items.length === 0 ? (
              <p className="py-10 text-center text-ink/60">Todavía no agregaste productos.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {items.map((i) => (
                  <li key={i.slug} className="flex gap-4 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                      {i.img && <Image src={i.img} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="font-display text-[length:var(--text-step-0)] font-bold uppercase leading-tight">
                        {i.nombre}
                      </p>
                      <p className="mt-0.5 text-[length:var(--text-step--1)] text-ink/60">
                        {i.precio != null ? `${formatARS(i.precio)} c/u` : "Precio a consultar"}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-ink/20">
                          <button
                            type="button"
                            onClick={() => setQty(i.slug, i.qty - 1)}
                            className="grid h-8 w-8 place-items-center"
                            aria-label={`Quitar uno de ${i.nombre}`}
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-[0.85rem]">{i.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(i.slug, i.qty + 1)}
                            className="grid h-8 w-8 place-items-center"
                            aria-label={`Sumar uno de ${i.nombre}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(i.slug)}
                          className="text-[0.7rem] uppercase tracking-[0.12em] text-ink/50 underline-offset-4 hover:text-ink hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-5">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink/55">Tus datos (opcional)</p>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className={input} autoComplete="name" />
                <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder="Localidad (para el envío)" className={input} autoComplete="address-level2" />
                <textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Colores, medidas, consultas…" rows={2} className={`${input} resize-none`} />
              </div>
            )}
          </div>

          {items.length > 0 && (
            <footer className="border-t border-ink/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.75rem] uppercase tracking-[0.14em] text-ink/60">Total transferencia</span>
                <span className="font-display text-[length:var(--text-step-2)] font-bold">{formatARS(total)}</span>
              </div>
              <p className="mt-1 text-[length:var(--text-step--1)] text-ink/60">
                Precios por transferencia. Envío y otras formas de pago, por WhatsApp.
              </p>
              {hayConsultar && (
                <p className="mt-2 text-[length:var(--text-step--1)] text-ink/60">
                  Algunos productos tienen precio a consultar.
                </p>
              )}
              <button
                type="button"
                onClick={enviar}
                className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-[0.8rem] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:bg-bordeaux"
              >
                Enviar pedido por WhatsApp
              </button>
              <p className="mt-3 text-center text-[length:var(--text-step--1)] text-ink/55">
                No se cobra nada acá: te respondemos por WhatsApp para confirmar stock, envío y pago.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mx-auto mt-2 block text-[0.7rem] uppercase tracking-[0.12em] text-ink/45 hover:text-ink"
              >
                Vaciar pedido
              </button>
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}
