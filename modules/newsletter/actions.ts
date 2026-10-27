"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, lt, or } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { auditLog, campaigns, subscribers } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { BASE_URL, enviarEmail, enviarLote, envioHabilitado } from "@/lib/email/enviar";
import { correoCampana } from "@/lib/email/plantillas";
import { SEGMENTOS } from "@/content/newsletter";
import { bajaUrl, bajaUrlUnClic, suscribir } from "./core";
import { destinatarios } from "./admin";
import { PERMISOS } from "@/modules/ventas/estados";

/** Acciones del panel: campañas y suscriptores. Enviar = solo admin. */


async function auditar(userId: string, accion: string, entidadId: string, datos?: object) {
  await requireDb()
    .insert(auditLog)
    .values({ userId, accion, entidad: "newsletter", entidadId, datos: (datos ?? null) as Record<string, unknown> | null });
}

const refrescar = () => revalidatePath("/panel/newsletter", "layout");

/* ─────────────── Campañas ─────────────── */

export type EstadoCampanaForm = { ok: boolean; mensaje: string } | null;

const url = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Tiene que empezar con / o https://");

const campanaSchema = z.object({
  asunto: z.string().trim().min(3, "Escribí el asunto.").max(150),
  preheader: z.string().trim().max(150),
  titulo: z.string().trim().min(2, "Escribí el título.").max(150),
  cuerpo: z.string().trim().min(10, "Escribí el mensaje.").max(8000),
  imagen: url,
  ctaTexto: z.string().trim().max(40),
  ctaUrl: url,
  segmento: z.enum(SEGMENTOS.map((s) => s.v) as [string, ...string[]]),
});

export async function guardarCampana(id: string | null, _prev: EstadoCampanaForm, fd: FormData): Promise<EstadoCampanaForm> {
  const user = await assertStaff();
  const p = campanaSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { ok: false, mensaje: p.error.issues[0]?.message ?? "Revisá los campos." };
  const v = { ...p.data, preheader: p.data.preheader || null, imagen: p.data.imagen || null, ctaTexto: p.data.ctaTexto || null, ctaUrl: p.data.ctaUrl || null };
  const db = requireDb();
  if (id) {
    const r = await db
      .update(campaigns)
      .set(v)
      .where(and(eq(campaigns.id, id), eq(campaigns.estado, "borrador")))
      .returning({ id: campaigns.id });
    if (!r.length) return { ok: false, mensaje: "Esta campaña ya se envió: duplicala para hacer otra." };
    refrescar();
    return { ok: true, mensaje: "Guardado." };
  }
  const [c] = await db.insert(campaigns).values({ ...v, createdBy: user.id }).returning({ id: campaigns.id });
  await auditar(user.id, "campana.crear", c.id);
  refrescar();
  redirect(`/panel/newsletter/campanas/${c.id}?creada=1`);
}

/** Manda la campaña solo al mail de quien está logueado, para revisarla. */
export async function enviarPrueba(id: string): Promise<{ ok: boolean; mensaje: string }> {
  const user = await assertStaff();
  if (!envioHabilitado()) return { ok: false, mensaje: "El envío todavía no está activado (falta el dominio en Resend)." };
  const [c] = await requireDb().select().from(campaigns).where(eq(campaigns.id, id));
  if (!c || !user.email) return { ok: false, mensaje: "No se encontró la campaña." };
  const m = correoCampana({ base: BASE_URL, ...c, nombre: user.name, codigo: "CLUB-PRUEBA", bajaUrl: `${BASE_URL}/newsletter/baja` });
  const r = await enviarEmail({ to: user.email, subject: `[PRUEBA] ${m.asunto}`, html: m.html, text: m.texto });
  return r.ok ? { ok: true, mensaje: `Prueba enviada a ${user.email}.` } : { ok: false, mensaje: "No se pudo enviar la prueba." };
}

export async function enviarCampana(id: string): Promise<{ ok: boolean; mensaje: string }> {
  const user = await assertStaff(PERMISOS.campanaEnviar.roles);
  if (!envioHabilitado()) return { ok: false, mensaje: "El envío todavía no está activado (falta el dominio en Resend)." };
  const db = requireDb();
  // Bloqueo: solo pasa de borrador a enviando una vez (evita doble envío). S-27:
  // si quedó trabada en "enviando" más de 10 min (la función se cortó), se puede retomar.
  const trabada = and(eq(campaigns.estado, "enviando"), lt(campaigns.updatedAt, new Date(Date.now() - 10 * 60_000)));
  const [previa] = await db.select({ estado: campaigns.estado }).from(campaigns).where(eq(campaigns.id, id));
  const [c] = await db
    .update(campaigns)
    .set({ estado: "enviando" })
    .where(and(eq(campaigns.id, id), or(eq(campaigns.estado, "borrador"), trabada)))
    .returning();
  if (!c) return { ok: false, mensaje: "Esta campaña ya se envió o se está enviando (si quedó trabada, se puede retomar a los 10 minutos)." };
  const retomada = previa?.estado === "enviando";

  const lista = await destinatarios(c.segmento);
  const mensajes = lista.map((d) => {
    const m = correoCampana({ base: BASE_URL, ...c, nombre: d.nombre, codigo: d.codigo, bajaUrl: bajaUrl(d.token) });
    return { to: d.email, subject: m.asunto, html: m.html, text: m.texto, bajaUrl: bajaUrlUnClic(d.token) };
  });
  const r = await enviarLote(mensajes);
  // Se cuentan como enviados SOLO los que Resend aceptó (okIdx); el resto, fallidos.
  const ok = new Set(r.okIdx);
  const fallaron = lista.filter((_, i) => !ok.has(i)).map((d) => d.email);
  await db
    .update(campaigns)
    .set({ estado: "enviada", enviados: ok.size, fallidos: fallaron.length, enviadaAt: new Date() })
    .where(eq(campaigns.id, id));
  await auditar(user.id, retomada ? "campana.enviar.retomada" : "campana.enviar", id, {
    destinatarios: lista.length,
    enviados: ok.size,
    fallidos: fallaron.length,
    emailsFallidos: fallaron.slice(0, 500),
  });
  refrescar();
  return {
    ok: fallaron.length === 0,
    mensaje: fallaron.length
      ? `Enviada a ${ok.size}; fallaron ${fallaron.length} (quedan anotados en Actividad).`
      : `¡Listo! Enviada a ${ok.size} personas.`,
  };
}

export async function duplicarCampana(id: string) {
  const user = await assertStaff();
  const db = requireDb();
  const [c] = await db.select().from(campaigns).where(eq(campaigns.id, id));
  if (!c) return;
  const [n] = await db
    .insert(campaigns)
    .values({
      asunto: c.asunto,
      preheader: c.preheader,
      titulo: c.titulo,
      cuerpo: c.cuerpo,
      imagen: c.imagen,
      ctaTexto: c.ctaTexto,
      ctaUrl: c.ctaUrl,
      segmento: c.segmento,
      createdBy: user.id,
    })
    .returning({ id: campaigns.id });
  refrescar();
  redirect(`/panel/newsletter/campanas/${n.id}`);
}

export async function borrarCampana(id: string) {
  const user = await assertStaff(PERMISOS.campanaEnviar.roles);
  await requireDb().delete(campaigns).where(and(eq(campaigns.id, id), eq(campaigns.estado, "borrador")));
  await auditar(user.id, "campana.borrar", id);
  refrescar();
  redirect("/panel/newsletter");
}

/* ─────────────── Suscriptores ─────────────── */

export async function marcarCodigo(id: string, usado: boolean): Promise<{ ok: boolean; mensaje: string }> {
  const user = await assertStaff(PERMISOS.suscriptores.roles);
  await requireDb()
    .update(subscribers)
    .set({ codigoUsadoAt: usado ? new Date() : null })
    .where(eq(subscribers.id, id));
  await auditar(user.id, usado ? "codigo.usado" : "codigo.desmarcar", id);
  refrescar();
  return { ok: true, mensaje: usado ? "Código marcado como usado." : "Código desmarcado." };
}

export async function cambiarEstadoSuscriptor(id: string, estado: "activo" | "baja"): Promise<{ ok: boolean; mensaje: string }> {
  const user = await assertStaff(PERMISOS.suscriptorBaja.roles);
  z.enum(["activo", "baja"]).parse(estado);
  await requireDb()
    .update(subscribers)
    .set({ estado, bajaAt: estado === "baja" ? new Date() : null })
    .where(eq(subscribers.id, id));
  await auditar(user.id, `suscriptor.${estado}`, id);
  refrescar();
  return { ok: true, mensaje: estado === "baja" ? "Dada de baja." : "Reactivada." };
}

const altaSchema = z.object({
  email: z.email("Revisá el email.").max(200),
  nombre: z.string().trim().max(80).optional(),
  consentimiento: z.literal("on", { message: "Confirmá que la persona aceptó recibir novedades." }),
});

/** Alta manual (ej. alguien que lo pidió por WhatsApp). Requiere su consentimiento. */
export async function agregarSuscriptor(_prev: EstadoCampanaForm, fd: FormData): Promise<EstadoCampanaForm> {
  const user = await assertStaff();
  const p = altaSchema.safeParse({
    email: String(fd.get("email") ?? "").trim(),
    nombre: String(fd.get("nombre") ?? "") || undefined,
    consentimiento: fd.get("consentimiento") ?? undefined,
  });
  if (!p.success) return { ok: false, mensaje: p.error.issues[0]?.message ?? "Revisá los datos." };
  const { resultado, sub } = await suscribir({ email: p.data.email, nombre: p.data.nombre, origen: "panel" });
  await auditar(user.id, "suscriptor.alta", sub.id);
  refrescar();
  if (resultado === "existente") return { ok: true, mensaje: "Ya estaba suscripta." };
  return { ok: true, mensaje: `Agregada. ${envioHabilitado() ? "Le llegó el mail con su código" : "Su código es"} ${sub.codigo}.` };
}
