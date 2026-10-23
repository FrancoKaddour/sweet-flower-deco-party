"use server";

import { inArray, isNull, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { inquiries, orders, products, type ItemPedido } from "@/db/schema";
import { getSession } from "@/lib/dal";

/**
 * Registro de lo que entra por el sitio (carrito y contacto; el Summit se
 * cobra online, ver modules/summit). Son
 * acciones PÚBLICAS: la venta igual se cierra por WhatsApp, así que si algo
 * falla acá no se rompe nada para el cliente (best-effort, nunca tiran error).
 * Defensas: zod con largos máximos, honeypot `web` y precios recalculados
 * desde la base (nunca se confía en el precio que manda el navegador).
 */

const txt = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);
const codigo = z.string().regex(/^[A-Z]{2,3}-[2-9A-Z]{5}$/);

const pedidoSchema = z.object({
  codigo,
  nombre: txt(120),
  localidad: txt(120),
  nota: txt(1000),
  telefono: txt(40),
  items: z
    .array(z.object({ slug: z.string().max(200), nombre: z.string().max(200), qty: z.number().int().min(1).max(999) }))
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
    const slugs = [...new Set(v.items.map((i) => i.slug))];
    const enDb = await db
      .select({ slug: products.slug, nombre: products.nombre, precio: products.precio })
      .from(products)
      .where(and(inArray(products.slug, slugs), isNull(products.deletedAt)));
    const porSlug = new Map(enDb.map((r) => [r.slug, r]));
    const items: ItemPedido[] = v.items.map((i) => {
      const r = porSlug.get(i.slug);
      return { slug: i.slug, nombre: r?.nombre ?? i.nombre, precio: r?.precio ?? null, qty: i.qty };
    });
    const total = items.reduce((t, i) => t + (i.precio ?? 0) * i.qty, 0);
    await db
      .insert(orders)
      .values({
        codigo: v.codigo,
        userId: await userId(),
        nombre: v.nombre,
        localidad: v.localidad,
        nota: v.nota,
        telefono: v.telefono,
        items,
        total,
        hayConsultar: items.some((i) => i.precio == null),
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
});

export async function registrarConsulta(input: unknown): Promise<void> {
  if (!db) return;
  const p = consultaSchema.safeParse(input);
  if (!p.success) return;
  const { web: _web, ...v } = p.data;
  void _web;
  try {
    await db.insert(inquiries).values(v);
  } catch (e) {
    console.error("[registrarConsulta]", e);
  }
}
