import "server-only";
import { esModoPrueba, verificarFirmaMP } from "@/lib/reglas";

/**
 * Mercado Pago — Checkout Pro por API REST (sin SDK).
 * Variables (Vercel → Environment Variables):
 *   MP_ACCESS_TOKEN    → Access Token de la cuenta que cobra (APP_USR-… en
 *                         producción; el de prueba en Preview/local).
 *   MP_WEBHOOK_SECRET  → "Clave secreta" de Webhooks (para validar los avisos).
 *                         Obligatoria en Production: sin ella el webhook responde 500.
 *   MP_MODO            → "prueba" | "produccion" (si falta, se deduce del prefijo TEST-).
 * Ver docs/MERCADOPAGO.md.
 */

const API = "https://api.mercadopago.com";
const token = () => process.env.MP_ACCESS_TOKEN;
/** Corte de cada llamada a la API (si MP no responde, no colgamos la función). */
const TIMEOUT_MS = 8000;

export const pagosHabilitados = () => Boolean(token());

/** true = credenciales/checkout de prueba (el panel muestra "MODO PRUEBA"). */
export const modoPrueba = () => esModoPrueba(process.env.MP_MODO, token());

/** Fecha ISO con offset de Argentina (formato que pide MP: yyyy-MM-ddTHH:mm:ss.SSS-03:00). */
function isoAR(d: Date) {
  const ar = new Date(d.getTime() - 3 * 3600 * 1000);
  return ar.toISOString().replace("Z", "-03:00");
}

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
  /** Vence junto con la reserva del lugar: después no se puede pagar. */
  vence: Date;
  /** Clave de idempotencia (cambia si cambia el contenido: pase, monto, vencimiento). */
  idempotencia: string;
}): Promise<Preferencia> {
  const [nombre, ...resto] = p.comprador.nombre.trim().split(/\s+/);
  const r = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": p.idempotencia,
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
      // Vencimiento (S-02): la preferencia deja de aceptar pagos cuando vence la
      // reserva, así nadie paga una tarifa vieja ni con el cupo cerrado.
      expires: true,
      expiration_date_from: isoAR(new Date(Date.now() - 60_000)),
      expiration_date_to: isoAR(p.vence),
      date_of_expiration: isoAR(p.vence),
      // Sin efectivo (Rapipago/Pago Fácil) ni cajero: se acreditan días después,
      // cuando la reserva de 30 min ya venció y el cupo pudo llenarse.
      payment_methods: { excluded_payment_types: [{ id: "ticket" }, { id: "atm" }] },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // Solo el status: el cuerpo de error puede traer datos del comprador.
  if (!r.ok) throw new Error(`Mercado Pago respondió ${r.status}`);
  return (await r.json()) as Preferencia;
}

export type Pago = {
  id: number;
  status: "approved" | "pending" | "in_process" | "authorized" | "rejected" | "cancelled" | "refunded" | "charged_back";
  status_detail?: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id?: string | null;
  date_approved?: string | null;
};

export async function obtenerPago(id: string | number): Promise<Pago | null> {
  if (!token() || !/^\d{1,20}$/.test(String(id))) return null;
  const r = await fetch(`${API}/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!r.ok) return null;
  return (await r.json()) as Pago;
}

/** El webhook necesita el secreto: en Production su falta es un error de configuración. */
export const faltaSecretoWebhook = () => !process.env.MP_WEBHOOK_SECRET && process.env.VERCEL_ENV === "production";

/**
 * Valida la firma del aviso (header x-signature) según la documentación de
 * Mercado Pago (ver lib/reglas.ts). Fuera de Production, sin MP_WEBHOOK_SECRET
 * se acepta (pruebas locales): igual el pago se vuelve a consultar a la API, así
 * que un aviso falso no aprueba nada. En Production sin secreto → false.
 */
export function firmaValida(firma: string | null, requestId: string | null, dataId: string): boolean {
  const secreto = process.env.MP_WEBHOOK_SECRET;
  if (!secreto) return !faltaSecretoWebhook();
  return verificarFirmaMP({ firma, requestId, dataId, secreto });
}
