"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { auditLog, inquiries, orders, summitRegistrations } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { ESTADOS_CONSULTA, ESTADOS_INSCRIPCION, ESTADOS_PEDIDO } from "./estados";

/** Acciones del panel sobre pedidos, consultas e inscripciones (staff). */

export type TipoRegistro = "pedido" | "consulta" | "inscripcion";

const TABLAS = { pedido: orders, consulta: inquiries, inscripcion: summitRegistrations } as const;
const ESTADOS = {
  pedido: ESTADOS_PEDIDO.map((e) => e.v) as string[],
  consulta: ESTADOS_CONSULTA.map((e) => e.v) as string[],
  inscripcion: ESTADOS_INSCRIPCION.map((e) => e.v) as string[],
};
const RUTAS = { pedido: "/panel/pedidos", consulta: "/panel/consultas", inscripcion: "/panel/summit" } as const;

const tipoSchema = z.enum(["pedido", "consulta", "inscripcion"]);

async function auditar(userId: string, accion: string, entidad: string, entidadId: string, datos?: object) {
  await requireDb()
    .insert(auditLog)
    .values({ userId, accion, entidad, entidadId, datos: (datos ?? null) as Record<string, unknown> | null });
}

function refrescar(tipo: TipoRegistro) {
  revalidatePath(RUTAS[tipo], "layout");
  revalidatePath("/panel");
}

export async function cambiarEstado(tipo: TipoRegistro, id: string, estado: string) {
  const user = await assertStaff();
  const t = tipoSchema.parse(tipo);
  if (!ESTADOS[t].includes(estado)) throw new Error("Estado inválido");
  const tabla = TABLAS[t];
  // El enum de cada tabla ya fue validado arriba contra su propia lista.
  await requireDb()
    .update(tabla)
    .set({ estado } as never)
    .where(eq(tabla.id, id));
  await auditar(user.id, `${t}.estado`, t, id, { estado });
  refrescar(t);
}

const seguimientoSchema = z.object({
  telefono: z.string().trim().max(40).transform((v) => v || null),
  notaInterna: z.string().trim().max(3000).transform((v) => v || null),
});

export async function guardarSeguimiento(
  tipo: TipoRegistro,
  id: string,
  _prev: { ok: boolean; mensaje: string } | null,
  fd: FormData,
): Promise<{ ok: boolean; mensaje: string }> {
  const user = await assertStaff();
  const t = tipoSchema.parse(tipo);
  const p = seguimientoSchema.safeParse({ telefono: fd.get("telefono") ?? "", notaInterna: fd.get("notaInterna") ?? "" });
  if (!p.success) return { ok: false, mensaje: "Revisá los datos (texto demasiado largo)." };
  const tabla = TABLAS[t];
  await requireDb().update(tabla).set(p.data).where(eq(tabla.id, id));
  await auditar(user.id, `${t}.seguimiento`, t, id);
  refrescar(t);
  return { ok: true, mensaje: "Guardado." };
}

/** Archiva (soft delete). Solo admin. */
export async function archivarRegistro(tipo: TipoRegistro, id: string) {
  const user = await assertStaff(["superadmin", "admin"]);
  const t = tipoSchema.parse(tipo);
  const tabla = TABLAS[t];
  await requireDb().update(tabla).set({ deletedAt: new Date() }).where(eq(tabla.id, id));
  await auditar(user.id, `${t}.archivar`, t, id);
  refrescar(t);
}
