import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Mercado Pago — Checkout Pro por API REST (sin SDK).
 * Variables (Vercel → Environment Variables):
 *   MP_ACCESS_TOKEN    → Access Token de la cuenta que cobra (APP_USR-… en
 *                         producción; el de prueba en Preview/local).
 *   MP_WEBHOOK_SECRET  → "Clave secreta" de Webhooks (para validar los avisos).
 * Ver docs/MERCADOPAGO.md.
 */

const API = "https://api.mercadopago.com";
const token = () => process.env.MP_ACCESS_TOKEN;

export const pagosHabilitados = () => Boolean(token());

export type Preferencia = {
  id: string;
  /** URL de pago (producción). */
  init_point: string;
  /** URL de pago con credenciales de prueba. */
  sandbox_init_point?: string;
};

export async function crearPreferencia(p: {
  referencia: string;
  titulo: string;
  descripcion: string;
  monto: number;
  comprador: { nombre: string; email: string; dni?: string | null };
  urlVuelta: string;
  urlAviso: string;
}): Promise<Preferencia> {
  const [nombre, ...resto] = p.comprador.nombre.trim().split(/\s+/);
  const r = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": p.referencia,
    },
    body: JSON.stringify({
      items: [
        {
          id: p.referencia,
          title: p.titulo,
          description: p.descripcion,
          category_id: "tickets",
          quantity: 1,
          currency_id: "ARS",
          unit_price: p.monto,
        },
      ],
      payer: {
        name: nombre,
        surname: resto.join(" ") || undefined,
        email: p.comprador.email,
        ...(p.comprador.dni ? { identification: { type: "DNI", number: p.comprador.dni } } : {}),
      },
      external_reference: p.referencia,
      back_urls: { success: p.urlVuelta, pending: p.urlVuelta, failure: p.urlVuelta },
      auto_return: "approved",
      notification_url: p.urlAviso,
      statement_descriptor: "SWEETFLOWERS",
    }),
  });
  if (!r.ok) throw new Error(`Mercado Pago respondió ${r.status}: ${await r.text()}`);
  return (await r.json()) as Preferencia;
}

export type Pago = {
  id: number;
  status: "approved" | "pending" | "in_process" | "authorized" | "rejected" | "cancelled" | "refunded" | "charged_back";
  status_detail?: string;
  external_reference: string | null;
  transaction_amount: number;
  date_approved?: string | null;
};

export async function obtenerPago(id: string | number): Promise<Pago | null> {
  if (!token() || !/^\d{1,20}$/.test(String(id))) return null;
  const r = await fetch(`${API}/v1/payments/${id}`, { headers: { Authorization: `Bearer ${token()}` }, cache: "no-store" });
  if (!r.ok) return null;
  return (await r.json()) as Pago;
}

/**
 * Valida la firma del aviso (header x-signature) según la documentación de
 * Mercado Pago: HMAC-SHA256 de "id:<data.id>;request-id:<x-request-id>;ts:<ts>;".
 * Sin MP_WEBHOOK_SECRET no se puede validar: igual el pago se vuelve a consultar
 * a la API (la fuente de verdad), así que un aviso falso no aprueba nada.
 */
export function firmaValida(firma: string | null, requestId: string | null, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!firma) return false;
  const partes = Object.fromEntries(firma.split(",").map((p) => p.trim().split("=") as [string, string]));
  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;
  let manifest = `id:${dataId.toLowerCase()};`;
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${ts};`;
  const esperado = createHmac("sha256", secret).update(manifest).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(esperado), Buffer.from(v1));
  } catch {
    return false;
  }
}
