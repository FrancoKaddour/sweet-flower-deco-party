import { after, NextResponse } from "next/server";
import { faltaSecretoWebhook, firmaValida } from "@/lib/mercadopago";
import { alertarEquipo } from "@/lib/alertas";
import { limitar } from "@/lib/rate-limit";
import { sincronizarPago } from "@/modules/summit/core";

/**
 * Aviso de Mercado Pago (Webhooks, evento "Pagos"). Se valida la firma y el
 * pago se vuelve a consultar a la API: nunca se confía en el cuerpo del aviso.
 * Responde rápido: los mails (entrada y avisos al equipo) salen con after().
 * Un 500 hace que Mercado Pago reintente.
 */
export const runtime = "nodejs";

/** Avisa al equipo, como mucho `max` veces por hora por motivo (MP reintenta mucho). */
function avisar(motivo: string, max: number, asunto: string, datos: Record<string, string>) {
  after(async () => {
    if (await limitar(`alerta:${motivo}`, max, 3600)) await alertarEquipo(asunto, datos);
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await request.json();
  } catch {
    /* algunos avisos vienen solo por query string */
  }
  const tipo = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  // MP firma el `data.id` de la URL: se usa ese primero (S-04).
  const dataId = String(url.searchParams.get("data.id") ?? body.data?.id ?? url.searchParams.get("id") ?? "");
  if (tipo !== "payment" || !/^\d{1,20}$/.test(dataId)) return NextResponse.json({ ok: true, ignorado: true });

  if (faltaSecretoWebhook()) {
    console.error("[mp webhook] falta MP_WEBHOOK_SECRET en Production");
    avisar("mp-sin-secreto", 1, "Webhook de Mercado Pago sin configurar", {
      "Qué pasa": "Falta MP_WEBHOOK_SECRET en Vercel (Production). Los pagos no se confirman solos hasta cargarla.",
    });
    return NextResponse.json({ error: "configuración" }, { status: 500 });
  }
  if (!firmaValida(request.headers.get("x-signature"), request.headers.get("x-request-id"), dataId)) {
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }
  try {
    await sincronizarPago(dataId);
  } catch (e) {
    console.error("[mp webhook]", e instanceof Error ? e.message : e);
    avisar("mp-webhook-500", 3, "Error al procesar un aviso de Mercado Pago", {
      "Pago MP": dataId,
      Error: e instanceof Error ? e.message.slice(0, 300) : "desconocido",
      "Qué pasa": "Mercado Pago lo va a reintentar solo. Si se repite, revisá los logs de Vercel.",
    });
    return NextResponse.json({ error: "reintentar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
