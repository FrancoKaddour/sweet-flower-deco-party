import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Reglas PURAS de pagos y seguridad (sin base, sin Next, sin alias "@/"), para
 * poder testearlas con `npm test` (node --test, ver tests/). Las usan
 * lib/mercadopago.ts, modules/summit/core.ts, el login y el export del panel.
 */

/* ───────────── Mercado Pago: firma del aviso (webhook) ───────────── */

/** Tolerancia de antigüedad del `ts` firmado (anti-replay). */
export const FIRMA_TOLERANCIA_MS = 15 * 60 * 1000;

/**
 * Valida el header x-signature ("ts=…,v1=…") según la doc de Mercado Pago:
 * HMAC-SHA256 de "id:<data.id en minúscula>;request-id:<x-request-id>;ts:<ts>;".
 * Rechaza firmas con `ts` fuera de la tolerancia (acepta ts en segundos o ms).
 */
export function verificarFirmaMP(p: {
  firma: string | null;
  requestId: string | null;
  dataId: string;
  secreto: string;
  ahora?: number;
  toleranciaMs?: number;
}): boolean {
  if (!p.firma || !p.secreto || !p.dataId) return false;
  const partes: Record<string, string> = {};
  for (const par of p.firma.split(",")) {
    const i = par.indexOf("=");
    if (i > 0) partes[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  }
  const { ts, v1 } = partes;
  if (!ts || !v1 || !/^\d{1,16}$/.test(ts) || !/^[0-9a-f]{64}$/i.test(v1)) return false;
  const tsMs = ts.length > 11 ? Number(ts) : Number(ts) * 1000;
  const ahora = p.ahora ?? Date.now();
  if (Math.abs(ahora - tsMs) > (p.toleranciaMs ?? FIRMA_TOLERANCIA_MS)) return false;
  let manifest = `id:${p.dataId.toLowerCase()};`;
  if (p.requestId) manifest += `request-id:${p.requestId};`;
  manifest += `ts:${ts};`;
  const esperado = createHmac("sha256", p.secreto).update(manifest).digest("hex");
  return timingSafeEqual(Buffer.from(esperado), Buffer.from(v1.toLowerCase()));
}

/* ───────────── Mercado Pago: qué hacer con un pago aprobado ───────────── */

export type ChequeoPago = { ok: true } | { ok: false; motivo: "moneda" | "monto" | "sin_precio" };

/** El pago aprobado tiene que ser en pesos y por al menos el precio guardado. */
export function chequearMonto(precioReferencia: number | null, pago: { transaction_amount: number; currency_id?: string | null }): ChequeoPago {
  if (pago.currency_id !== "ARS") return { ok: false, motivo: "moneda" };
  if (precioReferencia == null) return { ok: false, motivo: "sin_precio" };
  if (!Number.isFinite(pago.transaction_amount) || Math.round(pago.transaction_amount) < precioReferencia) {
    return { ok: false, motivo: "monto" };
  }
  return { ok: true };
}

/** Modo prueba de MP: MP_MODO explícito; si falta, se deduce del prefijo del token. */
export function esModoPrueba(modo: string | undefined, token: string | undefined): boolean {
  const m = (modo ?? "").trim().toLowerCase();
  if (m === "prueba" || m === "test") return true;
  if (m === "produccion" || m === "producción" || m === "production") return false;
  return Boolean(token?.startsWith("TEST-"));
}

/* ───────────── Redirecciones internas (anti open-redirect) ───────────── */

/**
 * Devuelve `v` solo si es una ruta interna del sitio ("/cuenta?x=1"), si no
 * `fallback`. Rechaza "//evil.com", "/\\evil.com", esquemas y caracteres de control.
 */
export function rutaSegura(v: unknown, fallback = "/"): string {
  if (typeof v !== "string" || v.length > 500) return fallback;
  if (!v.startsWith("/") || v.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(v)) return fallback;
  try {
    const base = "https://sitio.invalid";
    const u = new URL(v, base);
    if (u.origin !== base) return fallback;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return fallback;
  }
}

/* ───────────── Datos personales ───────────── */

/** DNI enmascarado para roles que no necesitan verlo completo: "***.456". */
export function enmascararDni(dni: string | null | undefined): string {
  const d = (dni ?? "").replace(/\D/g, "");
  if (!d) return "";
  return `***.${d.slice(-3)}`;
}

/* ───────────── CSV para Excel (AR) ───────────── */

/** Fecha y hora de Argentina "dd/mm/aaaa hh:mm" (Excel la reconoce en es-AR). */
export function fechaAR(d: Date): string {
  const f = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const x = (t: string) => f.find((p) => p.type === t)?.value ?? "";
  return `${x("day")}/${x("month")}/${x("year")} ${x("hour")}:${x("minute")}`;
}

/**
 * Celda de CSV separada por ";" (Excel en español). Neutraliza fórmulas
 * (= + - @, tab, CR y espacios al inicio) anteponiendo un apóstrofo.
 */
export function celdaCsv(v: unknown): string {
  const s = v == null ? "" : v instanceof Date ? fechaAR(v) : Array.isArray(v) ? v.join(" ") : String(v);
  const seguro = /^[\s=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${seguro.replace(/"/g, '""')}"`;
}

/* ───────────── Rate limit ───────────── */

/** IP del cliente desde x-forwarded-for (Vercel pone la real primero). */
export function ipDeHeaders(h: { get(n: string): string | null }): string {
  const xff = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = xff || h.get("x-real-ip")?.trim() || "desconocida";
  return ip.slice(0, 64);
}
