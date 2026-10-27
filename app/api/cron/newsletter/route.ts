import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { and, eq, inArray, isNotNull, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { BASE_URL, enviarLote, envioHabilitado } from "@/lib/email/enviar";
import { correoRecordatorioCodigo } from "@/lib/email/plantillas";
import { limpiarRateLimits } from "@/lib/rate-limit";
import { bajaUrl, bajaUrlUnClic } from "@/modules/newsletter/core";
import { reintentarEntradasPendientes } from "@/modules/summit/core";

/**
 * Tareas diarias (Vercel Cron, ver vercel.json). Protegido con CRON_SECRET
 * (Vercel lo manda solo en el header Authorization).
 * 1. Reintenta las entradas del Summit pagadas cuyo mail no salió (S-24).
 * 2. Limpia ventanas viejas del rate limit.
 * 3. Newsletter: a quien confirmó hace 7+ días y no usó su código, UN
 *    recordatorio (se marcan solo los que salieron bien).
 */
export const runtime = "nodejs";
export const maxDuration = 300;

function autorizado(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const a = Buffer.from(request.headers.get("authorization") ?? "");
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!autorizado(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!db) return NextResponse.json({ omitido: "sin base" });

  const resultado: Record<string, unknown> = {};
  try {
    await limpiarRateLimits();
  } catch (e) {
    console.error("[cron] rate limits", e instanceof Error ? e.message : e);
  }
  if (!envioHabilitado()) return NextResponse.json({ ...resultado, omitido: "sin envío configurado" });

  try {
    resultado.entradas = await reintentarEntradasPendientes();
  } catch (e) {
    console.error("[cron] entradas", e instanceof Error ? e.message : e);
  }

  const pendientes = await db
    .select()
    .from(subscribers)
    .where(
      and(
        eq(subscribers.estado, "activo"),
        isNotNull(subscribers.confirmadoAt),
        isNull(subscribers.codigoUsadoAt),
        isNull(subscribers.recordatorioAt),
        lt(subscribers.confirmadoAt, new Date(Date.now() - 7 * 864e5)),
      ),
    )
    .limit(500);
  if (!pendientes.length) return NextResponse.json({ ...resultado, recordatorios: 0 });

  const r = await enviarLote(
    pendientes.map((s) => {
      const c = correoRecordatorioCodigo({ base: BASE_URL, nombre: s.nombre, codigo: s.codigo, bajaUrl: bajaUrl(s.token) });
      return { to: s.email, subject: c.asunto, html: c.html, text: c.texto, bajaUrl: bajaUrlUnClic(s.token) };
    }),
  );
  const ok = r.okIdx.map((i) => pendientes[i].id);
  if (ok.length) {
    await db.update(subscribers).set({ recordatorioAt: new Date() }).where(inArray(subscribers.id, ok));
  }
  return NextResponse.json({ ...resultado, recordatorios: { enviados: r.enviados, fallidos: r.fallidos } });
}
