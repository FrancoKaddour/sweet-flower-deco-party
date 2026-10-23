import "server-only";
import { and, count, eq, inArray, isNull, ne } from "drizzle-orm";
import { requireDb } from "@/db";
import { summitRegistrations, type DbSummitRegistration } from "@/db/schema";
import { BASE_URL, enviarEmail } from "@/lib/email/enviar";
import { correoEntradaSummit } from "@/lib/email/plantillas";
import { obtenerPago, type Pago } from "@/lib/mercadopago";
import { EDICION_LABEL, EVENT_CUPO, EVENT_HORARIO, EVENT_NAME, EVENT_SEDE, EVENT_WHEN, PASES } from "@/content/evento";

/** Estados que ocupan un lugar del cupo. */
export const OCUPAN_LUGAR = ["seno", "pago", "asistio"] as const;

export async function lugaresOcupados(): Promise<number> {
  const [r] = await requireDb()
    .select({ n: count() })
    .from(summitRegistrations)
    .where(
      and(
        isNull(summitRegistrations.deletedAt),
        eq(summitRegistrations.edicion, EDICION_LABEL),
        inArray(summitRegistrations.estado, [...OCUPAN_LUGAR]),
      ),
    );
  return r?.n ?? 0;
}

export async function quedanLugares(): Promise<number> {
  return Math.max(0, EVENT_CUPO - (await lugaresOcupados()));
}

async function enviarEntrada(r: DbSummitRegistration) {
  if (!r.email) return;
  const c = correoEntradaSummit({
    base: BASE_URL,
    nombre: r.nombre,
    codigo: r.codigo,
    pase: PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase,
    monto: r.precioReferencia ?? 0,
    evento: EVENT_NAME,
    edicion: EDICION_LABEL,
    fecha: EVENT_WHEN,
    horario: EVENT_HORARIO,
    sede: EVENT_SEDE,
  });
  await enviarEmail({ to: r.email, subject: c.asunto, html: c.html, text: c.texto });
}

const ESTADO_PAGO: Record<Pago["status"], string> = {
  approved: "aprobado",
  authorized: "en_proceso",
  in_process: "en_proceso",
  pending: "pendiente",
  rejected: "rechazado",
  cancelled: "rechazado",
  refunded: "devuelto",
  charged_back: "devuelto",
};

/**
 * Aplica el estado REAL de un pago (consultado a la API de Mercado Pago) a su
 * inscripción. Idempotente: el mail de confirmación sale una sola vez.
 */
export async function aplicarPago(pago: Pago): Promise<DbSummitRegistration | null> {
  const ref = pago.external_reference;
  if (!ref) return null;
  const db = requireDb();
  const [r] = await db.select().from(summitRegistrations).where(eq(summitRegistrations.id, ref));
  if (!r) return null;
  const pagoEstado = ESTADO_PAGO[pago.status] ?? "pendiente";

  if (pagoEstado === "aprobado") {
    // El monto cobrado tiene que coincidir con el precio de la inscripción.
    if (r.precioReferencia != null && Math.round(pago.transaction_amount) < r.precioReferencia) {
      console.error("[summit] monto menor al esperado", ref, pago.transaction_amount);
      return r;
    }
    const [nueva] = await db
      .update(summitRegistrations)
      .set({
        pagoEstado,
        estado: "pago",
        mpPaymentId: String(pago.id),
        pagadoAt: pago.date_approved ? new Date(pago.date_approved) : new Date(),
      })
      .where(and(eq(summitRegistrations.id, ref), ne(summitRegistrations.estado, "pago")))
      .returning();
    if (nueva) {
      try {
        await enviarEntrada(nueva);
      } catch (e) {
        console.error("[summit] mail de entrada", e);
      }
      return nueva;
    }
    return r;
  }

  if (pagoEstado === "devuelto") {
    const [n] = await db
      .update(summitRegistrations)
      .set({ pagoEstado, estado: "cancelado", mpPaymentId: String(pago.id) })
      .where(eq(summitRegistrations.id, ref))
      .returning();
    return n ?? r;
  }

  // Pendiente / en proceso / rechazado: solo si todavía no estaba aprobado.
  if (r.pagoEstado === "aprobado") return r;
  const [n] = await db
    .update(summitRegistrations)
    .set({ pagoEstado, mpPaymentId: String(pago.id) })
    .where(eq(summitRegistrations.id, ref))
    .returning();
  return n ?? r;
}

/** Consulta un pago por id y lo aplica (vuelta del checkout o aviso). */
export async function sincronizarPago(paymentId: string): Promise<DbSummitRegistration | null> {
  const pago = await obtenerPago(paymentId);
  if (!pago) return null;
  return aplicarPago(pago);
}
