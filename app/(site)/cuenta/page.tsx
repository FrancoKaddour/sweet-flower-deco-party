import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { orders, subscribers } from "@/db/schema";
import { requireUser } from "@/lib/dal";
import { salir } from "@/lib/auth/actions";
import { fechaCorta } from "@/lib/panel/formato";
import { formatARS } from "@/modules/catalog/types";
import { ESTADOS_PEDIDO, infoEstado } from "@/modules/ventas/estados";
import { bajaDesdeCuenta, suscribirDesdeCuenta } from "@/modules/newsletter/publico";
import { CLUB, DESCUENTO_BIENVENIDA } from "@/content/newsletter";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };

async function misPedidos(userId: string) {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), isNull(orders.deletedAt)))
      .orderBy(desc(orders.createdAt))
      .limit(30);
  } catch {
    return [];
  }
}

async function miClub(email: string | null | undefined) {
  if (!db || !email) return null;
  try {
    const [s] = await db
      .select({ estado: subscribers.estado, codigo: subscribers.codigo, usado: subscribers.codigoUsadoAt })
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase()));
    return s ?? null;
  } catch {
    return null;
  }
}

export default async function CuentaPage() {
  const user = await requireUser("/cuenta");
  const [pedidos, club] = await Promise.all([misPedidos(user.id), miClub(user.email)]);
  const enClub = club?.estado === "activo";
  const nombre = (user.name ?? "").split(" ")[0];

  return (
    <main id="main" data-theme="light" className="bg-bone px-6 pb-24 pt-32 text-ink md:px-10 md:pt-40">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">Mi cuenta</p>
        <h1 className="mt-4 font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] text-ink [overflow-wrap:anywhere]">
          Hola{nombre ? `, ${nombre}` : ""}
        </h1>
        <p className="mt-4 text-ink/70 [overflow-wrap:anywhere]">{user.email}</p>

        <section aria-labelledby="pedidos-h" className="mt-14">
          <h2 id="pedidos-h" className="font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink">
            Mis pedidos
          </h2>
          {pedidos.length === 0 ? (
            <p className="mt-5 text-ink/70">
              Todavía no hiciste pedidos con esta cuenta.{" "}
              <Link href="/productos" className="underline underline-offset-4 hover:text-bordeaux">
                Ver productos
              </Link>
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {pedidos.map((p) => (
                <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
                  <div>
                    <p className="font-mono font-medium">{p.codigo}</p>
                    <p className="text-[length:var(--text-step--1)] text-ink/60">
                      {fechaCorta(p.createdAt)} · {p.items.reduce((t, i) => t + i.qty, 0)} productos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums">{formatARS(p.total)}</p>
                    <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne">
                      {infoEstado(ESTADOS_PEDIDO, p.estado).l}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="club-h" data-theme="dark" className="mt-14 rounded-[var(--radius-lg)] bg-bordeaux p-7 text-bone md:p-9">
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">✧ {CLUB.nombre}</p>
          <h2 id="club-h" className="mt-3 font-display text-[length:var(--text-step-2)] font-bold uppercase leading-tight">
            {enClub ? "Sos parte del club" : CLUB.titulo}
          </h2>
          {enClub ? (
            <>
              <p className="mt-3 text-bone/80">
                {club?.usado
                  ? "Ya usaste tu código de bienvenida. Igual vas a recibir primero las preventas y promos."
                  : <>Tu código de {DESCUENTO_BIENVENIDA}%: <span className="font-mono font-bold tracking-[0.1em] text-champagne">{club?.codigo}</span></>}
              </p>
              <form action={bajaDesdeCuenta} className="mt-5">
                <button type="submit" className="min-h-11 text-[length:var(--text-step--1)] text-bone/60 underline-offset-4 hover:text-bone hover:underline">
                  Dejar de recibir novedades
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mt-3 max-w-[48ch] text-bone/80">{CLUB.bajada}</p>
              <form action={suscribirDesdeCuenta} className="mt-6">
                <button type="submit" className="min-h-12 max-w-full rounded-full bg-bone px-7 py-3 text-[0.75rem] leading-snug [overflow-wrap:anywhere] font-semibold uppercase tracking-[0.14em] text-ink hover:bg-champagne">
                  Sumarme con {user.email}
                </button>
              </form>
            </>
          )}
        </section>

        <form action={salir.bind(null, "/")} className="mt-14">
          <button type="submit" className="min-h-11 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-ink/60 underline-offset-4 hover:text-ink hover:underline">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
