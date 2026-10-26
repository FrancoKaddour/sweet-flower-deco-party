import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { getSession } from "@/lib/dal";
import { STAFF_ROLES } from "@/db/schema";

export const metadata: Metadata = { title: "Ingresar" };

// Login del panel: Google (Flor, Tobi y Franco). Solo entra quien figura como
// staff en las env vars (PANEL_*); el resto ve el aviso de permiso.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const s = await getSession();
  if (s?.user && STAFF_ROLES.includes(s.user.role)) redirect("/panel");
  const sinPermiso = error === "permiso" || (s?.user && !STAFF_ROLES.includes(s.user.role));

  return (
    <main
      id="panel-main"
      tabIndex={-1}
      data-area="panel"
      className="flex min-h-dvh items-center justify-center bg-bone px-[max(1rem,env(safe-area-inset-left))] py-[max(3rem,env(safe-area-inset-top))] focus:outline-none [@media(max-height:480px)]:py-4"
    >
      <div className="w-full max-w-md">
        <div className="rounded-[var(--radius-lg)] border border-line bg-cloud px-6 py-8 min-[360px]:p-8 sm:p-10">
          <div className="mb-8 text-center [@media(max-height:480px)]:mb-5">
            <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne min-[360px]:tracking-[0.18em]">
              ✧ Centro de operaciones
            </p>
            <h1 className="mt-3 font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink">
              Sweet
              <br />
              Flowers
            </h1>
            <p className="mt-4 text-[length:var(--text-step-0)] leading-relaxed text-muted">
              Ingresá con tu cuenta de Google para gestionar catálogo, pedidos y comunidad.
            </p>
          </div>

          {sinPermiso && (
            <p role="alert" className="mb-6 rounded-[var(--radius-md)] border border-bordeaux/25 bg-bordeaux/10 px-4 py-3 text-[length:var(--text-step--1)] text-bordeaux">
              Esta cuenta no tiene acceso al panel. Pedile a Franco que la habilite.
            </p>
          )}

          <GoogleButton volver="/panel" tone="dark" />
        </div>
      </div>
    </main>
  );
}
