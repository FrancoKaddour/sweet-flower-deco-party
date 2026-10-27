"use client";

/**
 * Widget de Cloudflare Turnstile (sin paquetes). Va DENTRO del <form>: agrega
 * el campo oculto `cf-turnstile-response` que verifica lib/captcha.ts.
 *
 * - Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no renderiza nada (y el servidor no lo exige).
 * - `appearance: "interaction-only"`: invisible salvo que Cloudflare necesite
 *   que la persona toque la casilla (modo "Managed" del panel de Cloudflare).
 * - Tema según el `data-theme` más cercano; textos en español.
 * - Los tokens son de un solo uso: pasá `reiniciar` (ej. el estado que devuelve
 *   la action) y el widget pide uno nuevo cada vez que cambia.
 */
import { useEffect, useRef } from "react";

type Opciones = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  language?: string;
  appearance?: "always" | "execute" | "interaction-only";
  "response-field-name"?: string;
  "refresh-expired"?: "auto" | "manual" | "never";
};
type TurnstileApi = {
  render: (el: HTMLElement, o: Opciones) => string | undefined;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const SITE_KEY_TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const captchaVisible = Boolean(SITE_KEY_TURNSTILE);

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let cargando: Promise<TurnstileApi> | null = null;

function cargarTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (cargando) return cargando;
  cargando = new Promise<TurnstileApi>((ok, mal) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => (window.turnstile ? ok(window.turnstile) : mal(new Error("turnstile")));
    s.onerror = () => {
      cargando = null;
      mal(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return cargando;
}

export function Turnstile({ accion, reiniciar, className }: { accion?: string; reiniciar?: unknown; className?: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!SITE_KEY_TURNSTILE || !caja.current) return;
    let vivo = true;
    const el = caja.current;
    const tema = el.closest("[data-theme]")?.getAttribute("data-theme");
    cargarTurnstile()
      .then((t) => {
        if (!vivo || widget.current) return;
        widget.current = t.render(el, {
          sitekey: SITE_KEY_TURNSTILE,
          action: accion,
          theme: tema === "dark" ? "dark" : tema === "light" ? "light" : "auto",
          language: "es",
          appearance: "interaction-only",
          "response-field-name": "cf-turnstile-response",
          "refresh-expired": "auto",
        });
      })
      .catch(() => {
        /* sin Turnstile (bloqueador, red): el servidor decide */
      });
    return () => {
      vivo = false;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [accion]);

  // Token nuevo después de cada envío (son de un solo uso).
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [reiniciar]);

  if (!SITE_KEY_TURNSTILE) return null;
  return <div ref={caja} className={className ?? "empty:hidden"} />;
}
