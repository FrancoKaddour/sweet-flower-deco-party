// Medición de conversiones, sin dependencias.
// Usa Vercel Web Analytics por su script (/_vercel/insights/script.js, que se
// carga en app/layout.tsx cuando NEXT_PUBLIC_ANALYTICS=1) y además empuja a
// window.dataLayer por si mañana se suma GA4/GTM. Nunca rompe la página: si
// nada está cargado, los eventos quedan en cola y no pasa nada.
//
// Nombres de eventos (mantener esta lista como fuente única):
export type EventoAnalytics =
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "wa_order_click"
  | "wa_contact_click"
  | "summit_select_pass"
  | "summit_begin_checkout"
  | "summit_purchase"
  | "summit_payment_failed"
  | "summit_payment_pending"
  | "newsletter_signup"
  | "search";

type Props = Record<string, string | number | boolean | null | undefined>;

type VaFn = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    va?: VaFn;
    vaq?: unknown[];
    dataLayer?: unknown[];
  }
}

function limpiar(props?: Props): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!props) return out;
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue;
    // Vercel acepta valores planos y cortos.
    out[k] = typeof v === "string" ? v.slice(0, 255) : v;
  }
  return out;
}

/** Registra un evento de negocio. Seguro de llamar en cualquier lado del cliente. */
export function track(nombre: EventoAnalytics, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    const data = limpiar(props);
    if (!window.va) {
      window.va = function (...args: unknown[]) {
        (window.vaq = window.vaq || []).push(args);
      } as VaFn;
    }
    window.va("event", { name: nombre, data });
    (window.dataLayer = window.dataLayer || []).push({ event: nombre, ...data });
  } catch {
    // La medición nunca puede romper una compra.
  }
}

const CLAVE_ORIGEN = "sf_origen";

/** Guarda la PRIMERA fuente de llegada (utm_source o referrer) de la sesión del navegador. */
export function guardarOrigen(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(CLAVE_ORIGEN)) return;
    const p = new URLSearchParams(location.search);
    const utm = p.get("utm_source");
    const campana = p.get("utm_campaign");
    let origen = utm ? utm + (campana ? ` / ${campana}` : "") : "";
    if (!origen && document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== location.hostname) origen = host;
    }
    if (origen) localStorage.setItem(CLAVE_ORIGEN, origen.slice(0, 80));
  } catch {
    /* sin storage: no pasa nada */
  }
}

/** Fuente de llegada guardada (ej. "instagram / bio"), o null. */
export function leerOrigen(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CLAVE_ORIGEN);
  } catch {
    return null;
  }
}
