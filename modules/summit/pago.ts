"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { summitRegistrations } from "@/db/schema";
import { nuevoCodigo } from "@/lib/codigo";
import { crearPreferencia, modoPrueba, pagosHabilitados } from "@/lib/mercadopago";
import { ipCliente, limitar } from "@/lib/rate-limit";
import { CAMPO_CAPTCHA, MENSAJE_CAPTCHA, verificarCaptcha } from "@/lib/captcha";
import { getSession } from "@/lib/dal";
import { SITE_URL } from "@/lib/site";
import { EDICION_LABEL, EVENT_NAME, EVENT_WHEN, PASES, tarifaVigente } from "@/content/evento";
import { RESERVA_MIN, reservaReutilizable, reservarLugar } from "./core";

/**
 * Inicio del pago de una inscripción al Summit: valida, RESERVA el lugar 30 min
 * (solo si queda cupo, en una sentencia atómica) con el precio vigente
 * (calculado acá, nunca el del navegador), crea la preferencia de Checkout Pro
 * que vence junto con la reserva y devuelve la URL de pago.
 *
 * Campo obligatorio del formulario: `consentimiento` (checkbox, cualquier valor
 * no vacío, ej. "si") = aceptó el aviso de privacidad (Ley 25.326).
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
  consentimiento: z.string({ message: "Para seguir, aceptá el aviso de privacidad." }).min(1, "Para seguir, aceptá el aviso de privacidad."),
  web: z.string().max(0).optional(),
});

const SIN_LUGAR = "¡Se agotaron los lugares! Escribinos por WhatsApp para quedar en lista de espera.";

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
  const email = v.email.toLowerCase();
  // Rate limit (S-12): por IP y por email.
  const ip = await ipCliente();
  if (!(await limitar(`summit:ip:${ip}`, 8, 600)) || !(await limitar(`summit:email:${email}`, 5, 600))) {
    return { ok: false, mensaje: "Hiciste muchos intentos seguidos. Esperá unos minutos y probá de nuevo." };
  }
  // Captcha (Turnstile): solo si está configurado (lib/captcha.ts).
  if (!(await verificarCaptcha(fd.get(CAMPO_CAPTCHA), ip))) return { ok: false, mensaje: MENSAJE_CAPTCHA };
  // Con sesión, la inscripción queda en "Mi cuenta".
  const userId = (await getSession().catch(() => null))?.user?.id ?? null;
  let reservaNueva: string | null = null;
  try {
    const tarifa = tarifaVigente();
    const monto = tarifa.precios[v.pase];
    const pase = PASES.find((x) => x.id === v.pase)!;
    const consentAt = new Date();
    const datos = { pase: v.pase, nombre: v.nombre, telefono: v.telefono, dni: v.dni, ciudad: v.ciudad, precioReferencia: monto, consentAt };

    // Misma persona con una reserva vigente (doble clic, "volver e intentar"):
    // se reutiliza y se renueva, sin ocupar otro lugar (S-06).
    let r: { id: string; reservaHasta: Date };
    const previa = await reservaReutilizable(email);
    if (previa) {
      const reservaHasta = new Date(Date.now() + RESERVA_MIN * 60_000);
      await db.update(summitRegistrations).set({ ...datos, reservaHasta, pagoEstado: "pendiente" }).where(eq(summitRegistrations.id, previa.id));
      r = { id: previa.id, reservaHasta };
    } else {
      const reservada = await reservarLugar({ ...datos, codigo: nuevoCodigo("SUM"), email, precio: monto });
      if (!reservada) return { ok: false, mensaje: SIN_LUGAR };
      r = reservada;
      reservaNueva = reservada.id;
    }

    const pref = await crearPreferencia({
      referencia: r.id,
      vence: r.reservaHasta,
      idempotencia: `${r.id}:${v.pase}:${monto}:${r.reservaHasta.getTime()}`,
      titulo: `${pase.nombre} · ${EVENT_NAME}`,
      descripcion: `${EDICION_LABEL} · ${EVENT_WHEN} · ${tarifa.nombre}`,
      monto,
      comprador: { nombre: v.nombre, email, dni: v.dni },
      urlVuelta: `${SITE_URL}/event-summit/inscripcion?r=${r.id}`,
      urlAviso: `${SITE_URL}/api/mercadopago/webhook`,
    });
    await db
      .update(summitRegistrations)
      .set({ mpPreferenceId: pref.id, ...(userId ? { userId } : {}) })
      .where(eq(summitRegistrations.id, r.id));

    // Modo prueba (MP_MODO o token TEST-…): checkout de prueba.
    return { ok: true, url: (modoPrueba() && pref.sandbox_init_point) || pref.init_point };
  } catch (e) {
    console.error("[summit] iniciar pago", e instanceof Error ? e.message : e);
    // Si no se pudo crear el link de pago, se libera el lugar reservado.
    if (reservaNueva) {
      await db
        .update(summitRegistrations)
        .set({ reservaHasta: new Date() })
        .where(eq(summitRegistrations.id, reservaNueva))
        .catch(() => undefined);
    }
    return { ok: false, mensaje: "No pudimos conectar con Mercado Pago. Probá de nuevo en un momento." };
  }
}
