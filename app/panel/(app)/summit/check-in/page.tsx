import type { Metadata } from "next";
import Link from "next/link";
import { SinBase } from "@/components/panel/SinBase";
import { CheckIn } from "@/components/panel/summit/CheckIn";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { resumenSummit } from "@/modules/ventas/admin";
import { PERMISOS } from "@/modules/ventas/estados";
import { EDICION_LABEL, EVENT_CUPO, EVENT_WHEN } from "@/content/evento";

export const metadata: Metadata = { title: "Acreditación" };

/** Modo puerta del Summit (P-05): pensado para el celular el día del evento. */
export default async function CheckInPage() {
  await requireStaff(PERMISOS.checkIn.roles);
  if (!hasDb()) return <SinBase />;
  const s = await resumenSummit();
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Link href="/panel/summit" className="inline-flex min-h-11 items-center text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink">
        ← Summit
      </Link>
      <header>
        <h1 className="text-[length:var(--text-step-4)] font-semibold leading-[0.95] text-ink [font-family:var(--font-logo)]">Acreditación</h1>
        <p className="mt-2 text-muted">
          {EDICION_LABEL} · {EVENT_WHEN}. Buscá por DNI o código, o escaneá el QR del mail, y tocá “Marcó asistencia”.
        </p>
      </header>
      <CheckIn adentroInicial={s.asistieron} cupo={Math.max(EVENT_CUPO, s.confirmados)} />
    </div>
  );
}
