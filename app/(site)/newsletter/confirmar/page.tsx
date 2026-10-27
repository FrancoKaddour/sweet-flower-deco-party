import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { DESCUENTO_BIENVENIDA } from "@/content/newsletter";
import { confirmarDesdeMail } from "@/modules/newsletter/publico";
import { GuardarCodigoClub } from "@/components/newsletter/GuardarCodigoClub";

export const metadata: Metadata = { title: "Confirmá tu suscripción", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Doble opt-in del Club (S-13). Se confirma con un botón y no al abrir el link:
 * los antivirus de correo "abren" los links y confirmarían solos. Después de
 * confirmar, la misma página muestra el código (también llega por mail).
 */
export default async function ConfirmarPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const token = t && t.length <= 100 ? t : "";
  const sub =
    token && db
      ? (
          await db
            .select({ estado: subscribers.estado, confirmadoAt: subscribers.confirmadoAt, codigo: subscribers.codigo })
            .from(subscribers)
            .where(eq(subscribers.tokenConfirmacion, token))
        )[0]
      : undefined;
  const confirmado = sub?.estado === "activo" && sub.confirmadoAt != null;

  async function confirmar() {
    "use server";
    await confirmarDesdeMail(token);
    redirect(`/newsletter/confirmar?t=${encodeURIComponent(token)}`);
  }

  const h1 = "mt-4 font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.95]";
  const cta =
    "mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-8 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone hover:bg-bordeaux";

  return (
    <main id="main" data-theme="light" className="flex min-h-[100svh] items-center justify-center bg-bone px-6 pb-20 pt-32 text-ink md:pb-24 md:pt-40">
      <div className="w-full max-w-[30rem] text-balance text-center">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">Club Sweet Flowers</p>
        {!sub ? (
          <>
            <h1 className={h1}>Link no válido</h1>
            <p className="mt-5 text-ink/70">Puede que ya lo hayas usado o que haya vencido. Sumate de nuevo desde el pie de cualquier página y te mandamos otro.</p>
            <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-[0.75rem] font-medium uppercase tracking-[0.14em] underline decoration-ink underline-offset-[6px]">
              Volver al inicio
            </Link>
          </>
        ) : confirmado ? (
          <>
            <GuardarCodigoClub codigo={sub.codigo} />
            <h1 className={h1}>¡Ya estás adentro!</h1>
            <p className="mt-5 text-ink/70">Tu código de {DESCUENTO_BIENVENIDA}% para el primer pedido:</p>
            <p className="mx-auto mt-5 w-fit rounded-[var(--radius-md)] border border-dashed border-champagne bg-cloud px-6 py-3 font-mono text-[length:var(--text-step-2)] font-bold tracking-[0.12em] text-bordeaux">
              {sub.codigo}
            </p>
            <p className="mt-5 text-[length:var(--text-step--1)] leading-relaxed text-ink/60">
              También te lo mandamos por mail. Mencionalo cuando nos mandes tu pedido por WhatsApp.
            </p>
            <Link href={`/productos?codigo=${encodeURIComponent(sub.codigo)}`} className={cta}>
              Elegir mis piezas <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </>
        ) : (
          <>
            <h1 className={h1}>Confirmá tu suscripción</h1>
            <p className="mt-5 text-ink/70">Un clic y te mandamos tu código de {DESCUENTO_BIENVENIDA}% para el primer pedido.</p>
            <form action={confirmar}>
              <button type="submit" className={cta}>
                Sí, quiero sumarme
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
