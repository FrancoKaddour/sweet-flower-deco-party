import { NextResponse } from "next/server";
import { requireDb } from "@/db";
import { auditLog } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { celdaCsv } from "@/lib/reglas";
import { listarSuscriptores } from "@/modules/newsletter/admin";

/**
 * Exporta los suscriptores a CSV para Excel en español: separador ";", fechas
 * de Argentina y celdas protegidas contra fórmulas (S-19). Solo admin (un
 * editor carga productos, no necesita la base de emails). Cada export queda en
 * el audit log.
 */
export async function GET() {
  let user;
  try {
    user = await assertStaff(["superadmin", "admin"]);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const filas = await listarSuscriptores({});
  const csv = [
    ["email", "nombre", "estado", "confirmado", "intereses", "codigo", "codigo_usado", "origen", "alta"].map(celdaCsv).join(";"),
    ...filas.map((s) =>
      [s.email, s.nombre, s.estado, s.confirmadoAt ?? "sin confirmar", s.intereses, s.codigo, s.codigoUsadoAt, s.origen, s.createdAt]
        .map(celdaCsv)
        .join(";"),
    ),
  ].join("\r\n");
  try {
    await requireDb().insert(auditLog).values({ userId: user.id, accion: "suscriptores.exportar", entidad: "subscriber", datos: { filas: filas.length } });
  } catch (e) {
    console.error("[export] audit", e instanceof Error ? e.message : e);
  }
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="club-sweet-flowers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
