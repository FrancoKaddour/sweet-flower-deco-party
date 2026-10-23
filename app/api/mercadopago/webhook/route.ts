import { NextResponse } from "next/server";
import { firmaValida } from "@/lib/mercadopago";
import { sincronizarPago } from "@/modules/summit/core";

/**
 * Aviso de Mercado Pago (Webhooks, evento "Pagos"). Se valida la firma y el
 * pago se vuelve a consultar a la API: nunca se confía en el cuerpo del aviso.
 * Siempre responde 200 rápido (si no, Mercado Pago reintenta).
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = new URL(request.url);
  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await request.json();
  } catch {
    /* algunos avisos vienen solo por query string */
  }
  const tipo = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = String(body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");
  if (tipo !== "payment" || !dataId) return NextResponse.json({ ok: true, ignorado: true });

  if (!firmaValida(request.headers.get("x-signature"), request.headers.get("x-request-id"), dataId)) {
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }
  try {
    await sincronizarPago(dataId);
  } catch (e) {
    console.error("[mp webhook]", e);
    return NextResponse.json({ error: "reintentar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
