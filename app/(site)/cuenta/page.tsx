import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireUser } from "@/lib/dal";
import { salir } from "@/lib/auth/actions";
import { fechaCorta } from "@/lib/panel/formato";
import { formatARS } from "@/modules/catalog/types";
import { ESTADOS_PEDIDO, infoEstado } from "@/modules/ventas/estados";

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

export default async function CuentaPage() {
  const user = await requireUser("/cuenta");
  const pedidos = await misPedidos(user.id);
  const nombre = (user.name ?? "").split(" ")[0];

  return (
    <main id="main" className="bg-bone px-6 pb-24 pt-36 text-ink md:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">Mi cuenta</p>
        <h1 className="mt-4 font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] text-ink">
          Hola{nombre ? `, ${nombre}` : ""}
        </h1>
        <p className="mt-4 text-ink/70">{user.email}</p>

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

        <form action={salir.bind(null, "/")} className="mt-14">
          <button type="submit" className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-ink/60 underline-offset-4 hover:text-ink hover:underline">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
