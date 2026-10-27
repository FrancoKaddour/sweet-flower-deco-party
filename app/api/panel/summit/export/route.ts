import { NextResponse } from "next/server";
import { requireDb } from "@/db";
import { auditLog } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { celdaCsv, enmascararDni, fechaAR } from "@/lib/reglas";
import { EDICION_LABEL, PASES } from "@/content/evento";
import { inscripcionesParaExport } from "@/modules/ventas/admin";
import { ESTADOS_INSCRIPCION, PERMISOS, puede } from "@/modules/ventas/estados";

/**
 * P-05: lista de acreditación del Summit en CSV para Excel en español:
 * separador ";", BOM UTF-8, fechas dd/mm/aaaa hh:mm (hora AR) y celdas a prueba
 * de fórmulas. El DNI completo solo para admin; los editores lo ven enmascarado.
 */
export const runtime = "nodejs";

const PAGO: Record<string, string> = {
  pendiente: "Sin pagar",
  en_proceso: "En proceso",
  aprobado: "Pagado",
  rechazado: "Rechazado",
  devuelto: "Devuelto",
  sobrecupo: "Sobrecupo: devolver o aceptar",
  monto_invalido: "Monto no coincide",
};

export async function GET(request: Request) {
  let user;
  try {
    user = await assertStaff(PERMISOS.checkIn.roles);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const edicion = new URL(request.url).searchParams.get("edicion")?.slice(0, 40) || EDICION_LABEL;
  const filas = await inscripcionesParaExport(edicion);
  const dniCompleto = puede(user.role, "dniCompleto");
  const cab = ["Código", "Nombre", "DNI", "Pase", "Estado", "Pago", "Precio", "Email", "Teléfono", "Ciudad", "Inscripción", "Pagó el", "Asistió"];
  const lineas = filas.map((r) =>
    [
      r.codigo,
      r.nombre,
      dniCompleto ? r.dni : enmascararDni(r.dni),
      PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase,
      ESTADOS_INSCRIPCION.find((e) => e.v === r.estado)?.l ?? r.estado,
      r.pagoEstado ? (PAGO[r.pagoEstado] ?? r.pagoEstado) : "",
      r.precioReferencia ?? "",
      r.email,
      r.telefono,
      r.ciudad,
      fechaAR(r.createdAt),
      r.pagadoAt ? fechaAR(r.pagadoAt) : "",
      r.estado === "asistio" ? "Sí" : "",
    ]
      .map(celdaCsv)
      .join(";"),
  );
  // Exportar datos personales queda registrado (Ley 25.326).
  await requireDb().insert(auditLog).values({ userId: user.id, accion: "inscripcion.exportar", entidad: "inscripcion", entidadId: null, datos: { edicion, filas: filas.length, dniCompleto } });
  const csv = String.fromCharCode(0xfeff) + [cab.map(celdaCsv).join(";"), ...lineas].join("\r\n");
  const nombre = `summit-${edicion.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombre}"`,
      "Cache-Control": "no-store",
    },
  });
}
