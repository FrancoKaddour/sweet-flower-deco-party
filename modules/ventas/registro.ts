"use server";

import { eq, inArray, isNull, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customerProfiles, inquiries, orders, products, type ItemPedido } from "@/db/schema";
import { verificarCaptcha } from "@/lib/captcha";
import { normalizarVariantes } from "@/modules/catalog/types";
import { after } from "next/server";
import { getSession } from "@/lib/dal";
import { alertarEquipo } from "@/lib/alertas";
import { ipCliente, limitar } from "@/lib/rate-limit";

/**
 * Registro de lo que entra por el sitio (carrito y contacto; el Summit se
 * cobra online, ver modules/summit). Son
 * acciones PÚBLICAS: la venta igual se cierra por WhatsApp, así que si algo
 * falla acá no se rompe nada para el cliente (best-effort, nunca tiran error).
 * Defensas: zod con largos máximos, honeypot `web`, rate limit por IP (S-12)
 * y precios recalculados desde la base (nunca se confía en el precio que manda
 * el navegador).
 */

const txt = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);
const codigo = z.string().regex(/^[A-Z]{2,3}-[2-9A-Z]{5}$/);

const pedidoSchema = z.object({
  codigo,
  nombre: txt(120),
  localidad: txt(120),
  nota: txt(1000),
  telefono: txt(40),
  // Datos propios del pedido (antes viajaban solo dentro de `nota`). Todos opcionales:
  // un carrito viejo en caché que no los manda sigue funcionando.
  fechaEvento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined)
    .transform((v) => v || null),
  pago: z.enum(["transferencia", "mercadopago"]).optional().catch(undefined).transform((v) => v ?? null),
  codigoClub: z
    .string()
    .trim()
    .toUpperCase()
    .max(24)
    .regex(/^[A-Z0-9-]*$/)
    .optional()
    .catch(undefined)
    .transform((v) => v || null),
  origen: txt(200).catch(null),
  items: z
    .array(
      z.object({
        slug: z.string().max(200),
        nombre: z.string().max(200),
        variante: z.string().trim().max(120).nullish().transform((v) => v || null),
        qty: z.number().int().min(1).max(999),
      }),
    )
    .min(1)
    .max(60),
  web: z.string().max(0).optional(),
});

async function userId() {
  try {
    return (await getSession())?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function registrarPedido(input: unknown): Promise<void> {
  if (!db) return;
  const p = pedidoSchema.safeParse(input);
  if (!p.success) return;
  const v = p.data;
  try {
    if (!(await limitar(`pedido:ip:${await ipCliente()}`, 5, 60))) return;
    const slugs = [...new Set(v.items.map((i) => i.slug))];
    const enDb = await db
      .select({ slug: products.slug, nombre: products.nombre, precio: products.precio, variantes: products.variantes })
      .from(products)
      .where(and(inArray(products.slug, slugs), isNull(products.deletedAt)));
    const porSlug = new Map(enDb.map((r) => [r.slug, r]));
    // Con variante, el precio es el de ESA variante en la base (si no se
    // encuentra, queda "a cotizar": nunca se usa el precio del navegador).
    const items: ItemPedido[] = v.items.map((i) => {
      const r = porSlug.get(i.slug);
      const precio = i.variante
        ? (normalizarVariantes(r?.variantes).find((x) => x.etiqueta === i.variante)?.precio ?? null)
        : (r?.precio ?? null);
      return { slug: i.slug, nombre: r?.nombre ?? i.nombre, variante: i.variante, precio, qty: i.qty };
    });
    const total = items.reduce((t, i) => t + (i.precio ?? 0) * i.qty, 0);
    const uid = await userId();
    // Con sesión y sin teléfono en el carrito, se completa con el del perfil.
    let telefono = v.telefono;
    if (uid && !telefono) {
      telefono = await db
        .select({ t: customerProfiles.telefono })
        .from(customerProfiles)
        .where(eq(customerProfiles.userId, uid))
        .then((r) => r[0]?.t ?? null)
        .catch(() => null);
    }
    await db
      .insert(orders)
      .values({
        codigo: v.codigo,
        userId: uid,
        nombre: v.nombre,
        localidad: v.localidad,
        nota: v.nota,
        telefono,
        items,
        total,
        hayConsultar: items.some((i) => i.precio == null),
        // E-21: tocó "Enviar por WhatsApp", no sabemos si lo mandó.
        estado: "iniciado",
        fechaEvento: v.fechaEvento,
        pago: v.pago,
        codigoClub: v.codigoClub,
        origen: v.origen,
      })
      .onConflictDoNothing();
  } catch (e) {
    console.error("[registrarPedido]", e);
  }
}

const consultaSchema = z.object({
  tipo: z.string().trim().min(1).max(80),
  nombre: z.string().trim().min(1).max(120),
  email: z.union([z.literal(""), z.email().max(200)]).optional().transform((v) => v || null),
  telefono: txt(40),
  mensaje: z.string().trim().min(1).max(3000),
  web: z.string().max(0).optional(),
  /** Token de Turnstile (solo se exige si hay NEXT_PUBLIC_TURNSTILE_SITE_KEY). */
  captcha: z.string().max(2048).optional(),
});

export async function registrarConsulta(input: unknown): Promise<void> {
  if (!db) return;
  const p = consultaSchema.safeParse(input);
  if (!p.success) return;
  const { web: _web, captcha, ...v } = p.data;
  void _web;
  try {
    const ip = await ipCliente();
    if (!(await limitar(`consulta:ip:${ip}`, 5, 60))) return;
    if (!(await verificarCaptcha(captcha, ip))) return;
    await db.insert(inquiries).values(v);
    // Aviso al equipo (P-25), después de responder.
    after(() =>
      alertarEquipo(`Consulta nueva: ${v.tipo}`, { Nombre: v.nombre, Email: v.email, Teléfono: v.telefono, Mensaje: v.mensaje.slice(0, 500) }, "/panel/consultas"),
    );
  } catch (e) {
    console.error("[registrarConsulta]", e);
  }
}
