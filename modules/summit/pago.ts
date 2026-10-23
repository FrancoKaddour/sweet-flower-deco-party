"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { summitRegistrations } from "@/db/schema";
import { nuevoCodigo } from "@/lib/codigo";
import { crearPreferencia, pagosHabilitados } from "@/lib/mercadopago";
import { SITE_URL } from "@/lib/site";
import { EDICION_LABEL, EVENT_NAME, EVENT_WHEN, PASES, tarifaVigente } from "@/content/evento";
import { quedanLugares } from "./core";

/**
 * Inicio del pago de una inscripción al Summit: valida, guarda la inscripción
 * como "pendiente" con el precio vigente (calculado acá, nunca el del navegador),
 * crea la preferencia de Checkout Pro y devuelve la URL de pago.
 */

export type EstadoPagoSummit = { ok: true; url: string } | { ok: false; mensaje: string; campo?: string } | null;

const esquema = z.object({
  pase: z.enum(["vip", "general"]),
  nombre: z.string().trim().min(3, "Escribí tu nombre y apellido.").max(120),
  email: z.email("Revisá el email.").max(200),
  telefono: z
    .string()
    .trim()
    .min(8, "Escribí tu celular con código de área.")
    .max(30)
    .regex(/^[\d\s()+-]+$/, "Revisá el celular."),
  dni: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(7, "Revisá el DNI.").max(9, "Revisá el DNI.")),
  ciudad: z.string().trim().min(2, "Escribí tu ciudad.").max(120),
  web: z.string().max(0).optional(),
});

export async function iniciarPagoSummit(_prev: EstadoPagoSummit, fd: FormData): Promise<EstadoPagoSummit> {
  const p = esquema.safeParse(Object.fromEntries(fd));
  if (!p.success) {
    const i = p.error.issues[0];
    return { ok: false, mensaje: i?.message ?? "Revisá los datos.", campo: String(i?.path[0] ?? "") };
  }
  if (!db || !pagosHabilitados()) {
    return { ok: false, mensaje: "El pago online todavía no está habilitado. Escribinos por WhatsApp y te reservamos el lugar." };
  }
  const v = p.data;
  try {
    if ((await quedanLugares()) <= 0) {
      return { ok: false, mensaje: "¡Se agotaron los lugares! Escribinos por WhatsApp para quedar en lista de espera." };
    }
    const tarifa = tarifaVigente();
    const monto = tarifa.precios[v.pase];
    const pase = PASES.find((x) => x.id === v.pase)!;

    const [r] = await db
      .insert(summitRegistrations)
      .values({
        codigo: nuevoCodigo("SUM"),
        edicion: EDICION_LABEL,
        pase: v.pase,
        nombre: v.nombre,
        email: v.email.toLowerCase(),
        telefono: v.telefono,
        dni: v.dni,
        ciudad: v.ciudad,
        formaPago: "Mercado Pago",
        precioReferencia: monto,
        pagoEstado: "pendiente",
      })
      .returning();

    const pref = await crearPreferencia({
      referencia: r.id,
      titulo: `${pase.nombre} · ${EVENT_NAME}`,
      descripcion: `${EDICION_LABEL} · ${EVENT_WHEN} · ${tarifa.nombre}`,
      monto,
      comprador: { nombre: v.nombre, email: v.email, dni: v.dni },
      urlVuelta: `${SITE_URL}/event-summit/inscripcion?r=${r.id}`,
      urlAviso: `${SITE_URL}/api/mercadopago/webhook`,
    });
    await db.update(summitRegistrations).set({ mpPreferenceId: pref.id }).where(eq(summitRegistrations.id, r.id));

    // Con credenciales de prueba (TEST-…) se usa el checkout de prueba.
    const prueba = process.env.MP_ACCESS_TOKEN?.startsWith("TEST-");
    return { ok: true, url: (prueba && pref.sandbox_init_point) || pref.init_point };
  } catch (e) {
    console.error("[summit] iniciar pago", e);
    return { ok: false, mensaje: "No pudimos conectar con Mercado Pago. Probá de nuevo en un momento." };
  }
}
