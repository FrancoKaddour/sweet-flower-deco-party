import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { EmailLinkForm } from "@/components/auth/EmailLinkForm";
import { getSession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresá a tu cuenta de Sweet Flowers para ver tus pedidos y tus inscripciones.",
  robots: { index: false, follow: false },
};

const seguro = (v?: string) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/cuenta");

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ volver?: string; enviado?: string; error?: string }>;
}) {
  const { volver, enviado, error } = await searchParams;
  const destino = seguro(volver);
  const s = await getSession();
  if (s?.user) redirect(destino);
  const conEmail = Boolean(process.env.AUTH_RESEND_KEY);

  return (
    <main id="main" data-theme="light" className="flex min-h-[100svh] items-center justify-center bg-bone px-6 pb-20 pt-32 text-ink md:pb-24 md:pt-40">
      <div className="w-full max-w-[26rem] text-center">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">Tu cuenta</p>
        <h1 className="mt-4 font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] text-ink">
          Ingresá
        </h1>
        <p className="mx-auto mt-5 max-w-[36ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
          Guardá tus pedidos, seguí su estado y tus inscripciones al Event Summit.
        </p>

        {enviado ? (
          <p role="status" className="mt-10 rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-4 text-ink/80">
            Te enviamos un link a tu email. Abrilo desde este dispositivo para entrar.
          </p>
        ) : (
          <div className="mt-10 flex flex-col gap-8 text-left">
            {error && (
              <p role="alert" className="rounded-[var(--radius-md)] border border-bordeaux/25 bg-bordeaux/10 px-4 py-3 text-[length:var(--text-step--1)] text-bordeaux">
                No pudimos completar el ingreso. Probá de nuevo.
              </p>
            )}
            <GoogleButton volver={destino} />
            {conEmail && <EmailLinkForm volver={destino} />}
          </div>
        )}
      </div>
    </main>
  );
}
