import { NextResponse } from "next/server";
import { assertStaff } from "@/lib/dal";
import { listarSuscriptores } from "@/modules/newsletter/admin";

/** Exporta los suscriptores a CSV (para Excel/Sheets). Solo staff. */
export async function GET() {
  try {
    await assertStaff();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const filas = await listarSuscriptores({});
  const celda = (v: unknown) => {
    const s = v == null ? "" : v instanceof Date ? v.toISOString() : Array.isArray(v) ? v.join(" ") : String(v);
    // Evita inyección de fórmulas al abrir en Excel.
    const seguro = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${seguro.replace(/"/g, '""')}"`;
  };
  const csv = [
    ["email", "nombre", "estado", "intereses", "codigo", "codigo_usado", "origen", "alta"].join(","),
    ...filas.map((s) =>
      [s.email, s.nombre, s.estado, s.intereses, s.codigo, s.codigoUsadoAt, s.origen, s.createdAt].map(celda).join(","),
    ),
  ].join("\n");
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="club-sweet-flowers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
