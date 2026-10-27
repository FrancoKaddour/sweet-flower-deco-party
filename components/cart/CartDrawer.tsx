"use client";

/**
 * Botón flotante "Tu pedido" + panel lateral con el listado. "Enviar por
 * WhatsApp" abre la línea de ventas con el pedido ya escrito (no se paga en
 * el sitio). El total es orientativo (precio de catálogo, por transferencia).
 *
 * El mensaje lleva todo lo que el equipo necesita para cotizar sin volver a
 * preguntar (E-02): variante, color, link de cada pieza, para cuándo, envío,
 * forma de pago, código del Club y de dónde llegó la persona.
 */
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { claveItem, productosTexto, useCart } from "./CartProvider";
import { formatARS } from "@/modules/catalog/types";
import { COLORES_HIERRO, DIAS_PRODUCCION, RECARGO_MP_TEXTO, precioMercadoPago } from "@/lib/site";
import { leerOrigen, track } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/content/site";
import { nuevoCodigo } from "@/lib/codigo";
import { registrarPedido } from "@/modules/ventas/registro";
import { misDatosParaPrecargar } from "@/modules/cuenta/actions";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { lockScroll } from "@/lib/scroll-lock";

/**
 * Código del Club (newsletter). Clave acordada con el frente A: el formulario
 * de suscripción debería guardar acá el código que muestra en pantalla. También
 * se toma de `?codigo=CLUB-XXXX` (link de los mails) y se guarda.
 */
export const CLAVE_CODIGO_CLUB = "sf_club_codigo";

/**
 * Pedidos hechos SIN sesión desde este navegador: /cuenta los vincula a la
 * cuenta cuando la persona la crea o entra (modules/cuenta/actions.ts).
 */
export const CLAVE_PEDIDOS_SIN_CUENTA = "sf_pedidos_sin_cuenta";

function recordarPedidoSinCuenta(codigo: string) {
  try {
    const prev = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS_SIN_CUENTA) ?? "[]");
    const lista = (Array.isArray(prev) ? prev : []).filter((x: unknown) => typeof x === "string" && x !== codigo);
    localStorage.setItem(CLAVE_PEDIDOS_SIN_CUENTA, JSON.stringify([codigo, ...lista].slice(0, 10)));
  } catch {
    /* sin storage */
  }
}

const limpiarCodigo = (c: string) => c.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);

function leerCodigoClub(): string {
  try {
    const url = new URLSearchParams(location.search).get("codigo");
    if (url) {
      const c = limpiarCodigo(url);
      if (c) localStorage.setItem(CLAVE_CODIGO_CLUB, c);
      return c;
    }
    return limpiarCodigo(localStorage.getItem(CLAVE_CODIGO_CLUB) ?? "");
  } catch {
    return "";
  }
}

/** "2026-12-15" → "15/12/2026". */
const fechaAR = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join("/") : iso);

type Pago = "transferencia" | "mercadopago";

export function CartDrawer() {
  const { items, count, setQty, remove, clear, open, setOpen } = useCart();
  const [nombre, setNombre] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fecha, setFecha] = useState("");
  const [color, setColor] = useState("");
  const [codigoClub, setCodigoClub] = useState("");
  const [pago, setPago] = useState<Pago>("transferencia");
  const [nota, setNota] = useState("");
  const uid = useId();
  const [hoy, setHoy] = useState("");
  // null = todavía no sabemos; false = sin sesión; true = con sesión.
  const [conCuenta, setConCuenta] = useState<boolean | null>(null);
  const [enviado, setEnviado] = useState(false);

  // Con sesión, precarga nombre, localidad y código del Club (solo campos vacíos).
  // Se pide una vez, al abrir el pedido por primera vez.
  const pidioPrecarga = useRef(false);
  useEffect(() => {
    if (!open || pidioPrecarga.current) return;
    pidioPrecarga.current = true;
    misDatosParaPrecargar()
      .then((d) => {
        setConCuenta(Boolean(d));
        if (!d) return;
        setNombre((v) => v || d.nombreCompleto);
        setLocalidad((v) => v || d.localidadEnvio);
        setCodigoClub((v) => v || d.codigoClub);
      })
      .catch(() => setConCuenta(false));
  }, [open]);

  // Código del Club guardado o en la URL (solo en el cliente).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const c = leerCodigoClub();
      if (c) setCodigoClub((v) => v || c);
      setHoy(new Date().toISOString().slice(0, 10));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Medición: se abrió el pedido con productos.
  useEffect(() => {
    if (open && items.length) track("begin_checkout", { items: items.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir
  }, [open]);

  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Abierto: Escape cierra, Tab queda dentro del panel, scroll de la página
  // bloqueado (Lenis + nativo) y el foco entra al panel; al cerrar vuelve al
  // botón que lo abrió.
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
    stopLenis();
    // iOS: overflow:hidden solo no frena el arrastre táctil de la página.
    const liberarScroll = lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select',
        ),
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      liberarScroll();
      startLenis();
      previousFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, setOpen]);

  const total = items.reduce((t, i) => t + (i.precio ?? 0) * i.qty, 0);
  const aCotizar = items.filter((i) => i.precio == null).reduce((n, i) => n + i.qty, 0);
  const hayConsultar = aCotizar > 0;
  const hayHierro = items.some((i) => i.hierro);
  const totalMp = items.reduce((t, i) => t + (i.precio != null ? precioMercadoPago(i.precio) : 0) * i.qty, 0);

  const enviar = () => {
    // El código viaja en el mensaje y queda registrado en el panel, así el
    // equipo cruza el chat de WhatsApp con el pedido. El registro es en segundo
    // plano: si falla, el pedido por WhatsApp sale igual.
    // Queda registrado como "iniciado" (E-21): el equipo lo pasa a "nuevo"
    // cuando le llega el mensaje.
    const codigo = nuevoCodigo("SF");
    const origen = leerOrigen();
    const colorElegido = hayHierro ? color : "";
    const origin = typeof location !== "undefined" ? location.origin : "";
    const lineas = items.flatMap((i) => {
      const partes = [`${i.qty} × ${i.nombre}`, i.variante, colorElegido && i.hierro ? colorElegido : null].filter(Boolean);
      const precio =
        i.precio != null
          ? `${formatARS(i.precio)}${i.qty > 1 ? " c/u" : ""}`
          : "a cotizar";
      return [`• ${partes.join(" — ")} — ${precio}`, ...(i.href ? [`  ${origin}${i.href}`] : [])];
    });
    const subtotal =
      total > 0
        ? [
            `${hayConsultar ? "Subtotal" : "Total"} por transferencia: ${formatARS(total)}`,
            ...(pago === "mercadopago" ? [`Con Mercado Pago: ${formatARS(totalMp)}`] : []),
            ...(hayConsultar ? [`(${productosTexto(aCotizar)} a cotizar)`] : []),
          ]
        : ["Total: a cotizar"];
    const datos = [
      fecha && `Para cuándo lo necesito: ${fechaAR(fecha)}`,
      localidad && `Envío a: ${localidad}`,
      `Pago: ${pago === "mercadopago" ? "Mercado Pago" : "transferencia"}`,
      codigoClub && `Código Club: ${codigoClub}`,
      nombre && `Nombre: ${nombre}`,
      nota && `Comentarios: ${nota}`,
      origen && `Llegué desde: ${origen}`,
    ].filter(Boolean) as string[];
    const msg = [
      `¡Hola! Quiero hacer este pedido desde la web (pedido ${codigo}):`,
      "",
      ...lineas,
      "",
      ...subtotal,
      "",
      ...datos,
    ].join("\n");

    const extras = [
      ...items.filter((i) => i.variante).map((i) => `${i.nombre}: ${i.variante}${i.precio != null ? ` (${formatARS(i.precio)})` : ""}`),
      colorElegido && `Color: ${colorElegido}`,
      fecha && `Para: ${fechaAR(fecha)}`,
      `Pago: ${pago === "mercadopago" ? "Mercado Pago" : "transferencia"}`,
      codigoClub && `Código Club: ${codigoClub}`,
      origen && `Origen: ${origen}`,
    ].filter(Boolean) as string[];
    // Fecha, pago, código del Club, origen y variante van en campos propios;
    // `nota` los repite para que el equipo los vea igual en pedidos viejos.
    void registrarPedido({
      codigo,
      nombre,
      localidad,
      nota: [nota, ...extras].filter(Boolean).join(" · ").slice(0, 1000),
      fechaEvento: fecha || undefined,
      pago,
      codigoClub: codigoClub || undefined,
      origen: origen ?? undefined,
      items: items.map((i) => ({ slug: i.slug, nombre: i.nombre, variante: i.variante ?? null, qty: i.qty })),
    }).catch(() => {});
    if (conCuenta !== true) recordarPedidoSinCuenta(codigo);
    setEnviado(true);
    track("wa_order_click", {
      codigo,
      items: count,
      total,
      pago,
      tiene_codigo_club: Boolean(codigoClub),
      tiene_fecha: Boolean(fecha),
      origen: origen ?? undefined,
    });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const input =
    "mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-[length:var(--text-step-0)] text-ink focus:border-ink focus:outline-none";
  const label = "block text-[length:var(--text-step--1)] font-medium text-ink";
  const ayuda = "mt-1.5 text-[length:var(--text-step--1)] text-ink/65";
  const chip =
    "inline-flex min-h-10 cursor-pointer select-none items-center rounded-full border border-ink/20 px-3.5 text-[length:var(--text-step--1)] text-ink/80 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink";

  return (
    <>
      {/* Botón flotante (a la izquierda del de WhatsApp) — solo con productos */}
      {count > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="c-cart-fab fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[calc(max(1.25rem,env(safe-area-inset-right))+4rem)] z-40 flex h-13 items-center gap-2.5 rounded-full bg-bordeaux px-4 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-bone shadow-[0_10px_30px_-10px_rgb(20_17_15/0.55)] transition-transform duration-300 hover:-translate-y-0.5 min-[360px]:px-5 md:bottom-[max(2rem,env(safe-area-inset-bottom))] md:right-[calc(max(2rem,env(safe-area-inset-right))+4.25rem)]"
          aria-label={`Ver tu pedido (${productosTexto(count)})`}
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
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Tu pedido"
          data-lenis-prevent
          // En pantallas bajas (celular apaisado) scrollea el panel ENTERO (lista
          // + total + botón); en las altas solo la lista y el pie queda fijo.
          className={`absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col overflow-y-auto overscroll-contain bg-bone pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] text-ink shadow-2xl transition-transform duration-500 ease-(--ease-out-quart) ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-6 sm:py-5">
            <h2 className="font-display text-[length:var(--text-step-2)] font-bold uppercase">Tu pedido</h2>
            <button
              type="button"
              ref={closeRef}
              onClick={() => setOpen(false)}
              className="-mr-2 grid h-11 w-11 place-items-center text-[1.6rem] leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 [@media(max-height:34rem)]:flex-none [@media(max-height:34rem)]:overflow-visible" data-lenis-prevent>
            {items.length === 0 ? (
              <p className="py-10 text-center text-ink/60">Todavía no agregaste productos.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {items.map((i) => {
                  const k = claveItem(i);
                  const nombreLinea = i.variante ? `${i.nombre} (${i.variante})` : i.nombre;
                  return (
                  <li key={k} className="flex gap-4 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                      {i.img && <Image src={i.img} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="font-display text-[length:var(--text-step-0)] font-bold uppercase leading-tight">
                        {i.href ? (
                          <Link href={i.href} onClick={() => setOpen(false)} className="hover:text-bordeaux">
                            {i.nombre}
                          </Link>
                        ) : (
                          i.nombre
                        )}
                      </p>
                      {i.variante && <p className="mt-0.5 text-[length:var(--text-step--1)] text-ink/75">{i.variante}</p>}
                      <p className="mt-0.5 text-[length:var(--text-step--1)] text-ink/65">
                        {i.precio != null ? `${formatARS(i.precio)}${i.qty > 1 ? " c/u" : ""}` : "A cotizar"}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-ink/20">
                          <button
                            type="button"
                            onClick={() => setQty(k, i.qty - 1)}
                            className="grid h-10 w-10 place-items-center text-[1.1rem]"
                            aria-label={`Quitar uno de ${nombreLinea}`}
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-[0.85rem] tabular-nums" aria-label={`Cantidad: ${i.qty}`}>{i.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(k, i.qty + 1)}
                            className="grid h-10 w-10 place-items-center text-[1.1rem]"
                            aria-label={`Sumar uno de ${nombreLinea}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(k)}
                          aria-label={`Quitar ${nombreLinea} del pedido`}
                          className="-mr-1 inline-flex min-h-10 items-center px-1 text-[0.7rem] uppercase tracking-[0.12em] text-ink/50 underline-offset-4 hover:text-ink hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                  );
                })}
              </ul>
            )}

            {items.length > 0 && (
              <div className="mt-4 flex flex-col gap-5 border-t border-ink/10 pt-5">
                <p className="text-[length:var(--text-step--1)] text-ink/70">
                  Con estos datos te cotizamos sin volver a preguntarte. Todos son opcionales.
                </p>
                <div>
                  <label htmlFor={`${uid}-nombre`} className={label}>Nombre</label>
                  <input id={`${uid}-nombre`} value={nombre} onChange={(e) => setNombre(e.target.value)} className={input} autoComplete="name" maxLength={120} />
                </div>
                <div>
                  <label htmlFor={`${uid}-loc`} className={label}>Localidad (para el envío)</label>
                  <input id={`${uid}-loc`} value={localidad} onChange={(e) => setLocalidad(e.target.value)} className={input} autoComplete="address-level2" maxLength={120} />
                </div>
                <div>
                  <label htmlFor={`${uid}-fecha`} className={label}>¿Para cuándo lo necesitás?</label>
                  <input
                    id={`${uid}-fecha`}
                    type="date"
                    value={fecha}
                    min={hoy || undefined}
                    onChange={(e) => setFecha(e.target.value)}
                    aria-describedby={`${uid}-fecha-ayuda`}
                    className={input}
                  />
                  <p id={`${uid}-fecha-ayuda`} className={ayuda}>
                    Trabajamos por encargo, unos {DIAS_PRODUCCION} días.
                  </p>
                </div>
                {hayHierro && (
                  <fieldset>
                    <legend className={label}>Color del hierro</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COLORES_HIERRO.map((c) => (
                        <label key={c} className={chip}>
                          <input
                            type="radio"
                            name={`${uid}-color`}
                            value={c}
                            checked={color === c}
                            onChange={() => setColor(c)}
                            className="sr-only"
                          />
                          {c}
                        </label>
                      ))}
                    </div>
                    <p className={ayuda}>Si cada pieza va de un color distinto, contalo en comentarios.</p>
                  </fieldset>
                )}
                <fieldset>
                  <legend className={label}>¿Cómo vas a pagar?</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <label className={chip}>
                      <input type="radio" name={`${uid}-pago`} value="transferencia" checked={pago === "transferencia"} onChange={() => setPago("transferencia")} className="sr-only" />
                      Transferencia
                    </label>
                    <label className={chip}>
                      <input type="radio" name={`${uid}-pago`} value="mercadopago" checked={pago === "mercadopago"} onChange={() => setPago("mercadopago")} className="sr-only" />
                      Mercado Pago (+{RECARGO_MP_TEXTO})
                    </label>
                  </div>
                </fieldset>
                <div>
                  <label htmlFor={`${uid}-club`} className={label}>Código del Club</label>
                  <input
                    id={`${uid}-club`}
                    value={codigoClub}
                    onChange={(e) => setCodigoClub(limpiarCodigo(e.target.value))}
                    className={`${input} uppercase tracking-[0.08em]`}
                    autoComplete="off"
                    spellCheck={false}
                    aria-describedby={`${uid}-club-ayuda`}
                  />
                  <p id={`${uid}-club-ayuda`} className={ayuda}>
                    Si te sumaste al Club, tu código de descuento se aplica al confirmar.
                  </p>
                </div>
                <div>
                  <label htmlFor={`${uid}-nota`} className={label}>Comentarios</label>
                  <textarea id={`${uid}-nota`} value={nota} onChange={(e) => setNota(e.target.value)} rows={2} maxLength={600} className={`${input} resize-none`} />
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <footer className="shrink-0 border-t border-ink/10 px-5 py-5 sm:px-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[length:var(--text-step--1)] text-ink/70">
                  {total > 0 ? (hayConsultar ? "Subtotal por transferencia" : "Total por transferencia") : "Total"}
                </span>
                <span className="font-display text-[length:var(--text-step-2)] font-bold tabular-nums">
                  {total > 0 ? formatARS(total) : "A cotizar"}
                </span>
              </div>
              {total > 0 && (
                <p className="mt-1 text-right text-[length:var(--text-step--1)] tabular-nums text-ink/65">
                  {formatARS(totalMp)} con Mercado Pago
                </p>
              )}
              {hayConsultar && total > 0 && (
                <p className="mt-1 text-[length:var(--text-step--1)] text-ink/65">
                  Más {productosTexto(aCotizar)} a cotizar. Envío aparte.
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
                No se cobra nada acá: te respondemos por WhatsApp para confirmar colores, envío, pago y fecha de entrega.
              </p>
              <p className="mt-2 text-center text-[length:var(--text-step--1)] text-ink/60">
                Lo que escribas viaja en tu mensaje de WhatsApp y queda en nuestro registro de pedidos.{" "}
                <Link href="/privacidad" onClick={() => setOpen(false)} className="underline underline-offset-4 hover:text-ink">
                  Privacidad
                </Link>
              </p>
              {enviado && conCuenta === false && (
                <div role="status" className="mt-4 rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-[length:var(--text-step--1)] text-ink/80">
                  <p className="font-medium text-ink">Guardá tus datos para la próxima</p>
                  <p className="mt-1">
                    Con una cuenta, tu próximo pedido sale con tus datos cargados y este queda en tu historial.{" "}
                    <Link href="/ingresar?volver=/cuenta" onClick={() => setOpen(false)} className="underline underline-offset-4 hover:text-bordeaux">
                      Crear mi cuenta
                    </Link>
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={clear}
                className="mx-auto mt-1 flex min-h-10 items-center px-2 text-[0.7rem] uppercase tracking-[0.12em] text-ink/45 hover:text-ink"
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
