import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { darDeBaja } from "@/modules/newsletter/publico";

export const metadata: Metadata = { title: "Baja del newsletter", robots: { index: false } };

/**
 * Baja del newsletter. Se confirma con un botón (no al abrir el link): los
 * antivirus de correo "abren" los links y darían de baja a la gente sin querer.
 */
export default async function BajaPage({ searchParams }: { searchParams: Promise<{ t?: string; ok?: string }> }) {
  const { t, ok } = await searchParams;

  async function confirmar() {
    "use server";
    const listo = await darDeBaja(t ?? "");
    redirect(`/newsletter/baja?ok=${listo ? "1" : "0"}`);
  }

  return (
    <main id="main" data-theme="light" className="flex min-h-[100svh] items-center justify-center bg-bone px-6 pb-20 pt-32 text-ink md:pb-24 md:pt-40">
      <div className="w-full max-w-[28rem] text-balance text-center">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">Club Sweet Flowers</p>
        {ok === "1" ? (
          <>
            <h1 className="mt-4 font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.95]">Listo, te dimos de baja</h1>
            <p className="mt-5 text-ink/70">No vas a recibir más mails del club. Si cambiás de idea, te podés volver a sumar desde cualquier página del sitio.</p>
            <Link href="/" className="mt-6 inline-flex min-h-11 items-center underline decoration-ink underline-offset-[6px] text-[0.75rem] font-medium uppercase tracking-[0.14em]">Volver al inicio</Link>
          </>
        ) : ok === "0" || !t ? (
          <>
            <h1 className="mt-4 font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.95]">Link no válido</h1>
            <p className="mt-5 text-ink/70">No encontramos tu suscripción. Escribinos por WhatsApp y te damos de baja a mano.</p>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.95]">¿Te vas del club?</h1>
            <p className="mt-5 text-ink/70">Vas a dejar de recibir lanzamientos, preventas del Summit y promos exclusivas.</p>
            <form action={confirmar} className="mt-8 flex flex-col items-center gap-4">
              <button type="submit" className="min-h-12 rounded-full bg-ink px-8 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone hover:bg-bordeaux">
                Sí, darme de baja
              </button>
              <Link href="/" className="inline-flex min-h-11 items-center px-3 text-[0.75rem] uppercase tracking-[0.14em] text-ink/60 hover:text-ink">
                Mejor me quedo
              </Link>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
