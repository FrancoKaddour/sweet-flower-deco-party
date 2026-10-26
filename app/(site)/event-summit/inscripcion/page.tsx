import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { summitRegistrations } from "@/db/schema";
import { sincronizarPago } from "@/modules/summit/core";
import { EDICION_LABEL, EVENT_HORARIO, EVENT_NAME, EVENT_SEDE, EVENT_WHATSAPP, EVENT_WHEN, PASES } from "@/content/evento";
import { formatARS } from "@/modules/catalog/types";

export const metadata: Metadata = { title: "Tu inscripción", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Vuelta del checkout de Mercado Pago. Si el aviso (webhook) todavía no llegó,
 * se consulta el pago acá mismo a la API, así la persona ve el estado real.
 */
export default async function InscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string; payment_id?: string; collection_id?: string }>;
}) {
  const sp = await searchParams;
  const id = sp.r && /^[0-9a-f-]{36}$/i.test(sp.r) ? sp.r : null;
  let r = id && db ? (await db.select().from(summitRegistrations).where(eq(summitRegistrations.id, id)))[0] : undefined;

  const paymentId = sp.payment_id ?? sp.collection_id;
  if (r && paymentId && paymentId !== "null" && r.pagoEstado !== "aprobado") {
    try {
      const act = await sincronizarPago(paymentId);
      if (act && act.id === r.id) r = act;
    } catch (e) {
      console.error("[summit] vuelta", e);
    }
  }

  const estado = r?.pagoEstado === "aprobado" || r?.estado === "pago" ? "ok" : r?.pagoEstado === "rechazado" ? "error" : r ? "pendiente" : "nada";
  const pase = r ? PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase : "";
  const nombre = r?.nombre.split(" ")[0] ?? "";
  const wa = `https://wa.me/${EVENT_WHATSAPP}?text=${encodeURIComponent(
    `¡Hola! Tengo una consulta sobre mi inscripción al ${EVENT_NAME}${r ? ` (${r.codigo})` : ""}.`,
  )}`;

  const titulos = {
    ok: `¡${nombre}, estás adentro!`,
    pendiente: "Tu pago se está procesando",
    error: "El pago no se completó",
    nada: "No encontramos tu inscripción",
  } as const;
  const textos = {
    ok: "Tu lugar está confirmado. Te mandamos el comprobante por mail y unos días antes del evento te escribimos por WhatsApp con todos los detalles.",
    pendiente:
      "Mercado Pago todavía no confirmó el pago (pasa con pagos en efectivo o en revisión). Apenas se acredite, tu lugar queda confirmado y te llega el mail.",
    error: "No te cobramos nada. Podés volver a intentarlo con otro medio de pago, o escribirnos y te ayudamos.",
    nada: "Si pagaste y ves este mensaje, escribinos por WhatsApp y lo revisamos.",
  } as const;

  return (
    <main id="main" data-theme="dark" className="relative flex min-h-[90svh] items-center overflow-hidden bg-ink px-6 pb-24 pt-32 text-bone md:px-10 md:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-[min(34rem,90vw)] w-[min(34rem,90vw)] rounded-full border border-champagne/20" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-32 h-[min(24rem,64vw)] w-[min(24rem,64vw)] rounded-full border border-champagne/10" />
      <div className="relative mx-auto w-full max-w-[60rem]">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">
          ✧ {EVENT_NAME} · {EDICION_LABEL}
        </p>
        <h1 className="mt-6 max-w-[16ch] font-display text-[length:min(var(--text-step-6),calc((100vw-3rem)/8))] font-extrabold uppercase leading-[0.86] tracking-[-0.02em] [overflow-wrap:anywhere] [text-wrap:balance]">
          {titulos[estado]}
        </h1>
        <p className="mt-8 max-w-[52ch] text-[length:var(--text-step-1)] leading-snug text-bone/80">{textos[estado]}</p>

        {r && (
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-bone/15 pt-8 md:grid-cols-4 md:gap-x-8">
            {[
              ["Código", r.codigo],
              ["Pase", pase],
              ["Fecha", EVENT_WHEN],
              ["Valor", r.precioReferencia ? formatARS(r.precioReferencia) : "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-bone/50">{k}</dt>
                <dd className={`mt-2 font-display text-[length:var(--text-step-1)] font-bold [overflow-wrap:anywhere] ${k === "Código" ? "font-mono tracking-[0.08em] text-champagne" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {estado === "ok" && (
          <p className="mt-6 text-[length:var(--text-step--1)] text-bone/55">
            {EVENT_HORARIO}
            {EVENT_SEDE ? ` · ${EVENT_SEDE}` : ""}
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
          {estado === "error" && (
            <Link href="/event-summit#inscripcion" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-bone px-8 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink hover:bg-champagne">
              Intentar de nuevo <span aria-hidden="true">→</span>
            </Link>
          )}
          {estado === "ok" && (
            <Link href="/event-summit" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-bone px-8 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink hover:bg-champagne">
              Volver al Summit <span aria-hidden="true">→</span>
            </Link>
          )}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
            <span className="border-b border-bone pb-1 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone">
            Escribinos por WhatsApp
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
