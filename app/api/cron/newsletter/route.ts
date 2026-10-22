import { NextResponse } from "next/server";
import { and, eq, inArray, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { BASE_URL, enviarLote, envioHabilitado } from "@/lib/email/enviar";
import { correoRecordatorioCodigo } from "@/lib/email/plantillas";
import { bajaUrl, bajaUrlUnClic } from "@/modules/newsletter/core";

/**
 * Automatización diaria (Vercel Cron, ver vercel.json): a quien se sumó hace
 * 7+ días y todavía no usó su código, le llega UN recordatorio. Protegido con
 * CRON_SECRET (Vercel lo manda solo en el header Authorization).
 */
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!db || !envioHabilitado()) return NextResponse.json({ omitido: "sin base o sin envío configurado" });

  const pendientes = await db
    .select()
    .from(subscribers)
    .where(
      and(
        eq(subscribers.estado, "activo"),
        isNull(subscribers.codigoUsadoAt),
        isNull(subscribers.recordatorioAt),
        lt(subscribers.createdAt, new Date(Date.now() - 7 * 864e5)),
      ),
    )
    .limit(500);
  if (!pendientes.length) return NextResponse.json({ enviados: 0 });

  const r = await enviarLote(
    pendientes.map((s) => {
      const c = correoRecordatorioCodigo({ base: BASE_URL, nombre: s.nombre, codigo: s.codigo, bajaUrl: bajaUrl(s.token) });
      return { to: s.email, subject: c.asunto, html: c.html, text: c.texto, bajaUrl: bajaUrlUnClic(s.token) };
    }),
  );
  if (r.enviados > 0) {
    await db
      .update(subscribers)
      .set({ recordatorioAt: new Date() })
      .where(inArray(subscribers.id, pendientes.map((s) => s.id)));
  }
  return NextResponse.json(r);
}
