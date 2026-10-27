import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { EstadoSelect } from "@/components/panel/ventas/EstadoSelect";
import { Seguimiento } from "@/components/panel/ventas/Seguimiento";
import { Archivar } from "@/components/panel/ventas/Archivar";
import { requireStaff } from "@/lib/dal";
import { fechaLarga, linkWhatsApp } from "@/lib/panel/formato";
import { formatARS } from "@/modules/catalog/types";
import { obtenerPedido } from "@/modules/ventas/admin";
import { ESTADOS_PEDIDO, infoEstado, telefonoWhatsApp } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Pedido" };

const MENSAJE: Record<string, string> = {
  nuevo: "¡Hola! Te escribo de Sweet Flowers por tu pedido",
  confirmado: "¡Hola! Te confirmamos tu pedido",
  en_produccion: "¡Hola! Tu pedido ya está en producción",
  enviado: "¡Hola! Tu pedido ya salió",
  entregado: "¡Hola! ¿Llegó todo bien con tu pedido",
  cancelado: "¡Hola! Te escribo por tu pedido",
};

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff();
  const { id } = await params;
  const p = await obtenerPedido(id);
  if (!p) notFound();
  const wa = telefonoWhatsApp(p.telefono);
  const estado = infoEstado(ESTADOS_PEDIDO, p.estado);
  const saludo = `${MENSAJE[p.estado] ?? MENSAJE.nuevo} ${p.codigo}${p.estado === "entregado" ? "?" : "."}`;
  const esAdmin = user.role === "admin" || user.role === "superadmin";
  // Campos que suma el frente F (migración 0005): se muestran solo si existen.
  const x = p as unknown as { fechaEvento?: unknown; pago?: string | null; codigoClub?: string | null; origen?: string | null; userId?: string | null };
  const fecha = x.fechaEvento instanceof Date ? fechaLarga(x.fechaEvento) : x.fechaEvento ? String(x.fechaEvento) : null;
  const PAGO_L: Record<string, string> = { transferencia: "Transferencia", mercadopago: "Mercado Pago" };
  const extras = (
    [
      ["Fecha del evento", fecha],
      ["Forma de pago", x.pago ? (PAGO_L[x.pago] ?? x.pago) : null],
      ["Código del Club", x.codigoClub ?? null],
      ["Llegó desde", x.origen ?? null],
      ["Cuenta", x.userId ? "Pidió con su cuenta del sitio" : null],
    ] as [string, string | null][]
  ).filter((e): e is [string, string] => Boolean(e[1]));

  return (
    <div className="flex flex-col gap-10">
      <Link href="/panel/pedidos" className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink">
        ← Pedidos
      </Link>
      <PageHeader
        seccion={`Pedido · ${estado.l}`}
        titulo={p.codigo}
        descripcion={`${p.nombre ?? "Sin nombre"}${p.localidad ? ` · ${p.localidad}` : ""} — ${fechaLarga(p.createdAt)}`}
        accion={
          wa ? (
            <PanelButton href={linkWhatsApp(wa, saludo)} target="_blank">
              Responder por WhatsApp
            </PanelButton>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="items-h" className="flex flex-col gap-4">
          <h2 id="items-h" className="font-display text-[length:var(--text-step-1)] font-bold uppercase text-ink">
            Lo que pidió
          </h2>
          <ul className="divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
            {p.items.map((i) => (
              <li key={i.slug} className="flex items-baseline justify-between gap-4 px-5 py-4">
                <span className="min-w-0">
                  <span className="font-medium tabular-nums text-ink">{i.qty} ×</span>{" "}
                  <span className="text-ink">{i.nombre}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  {i.precio != null ? formatARS(i.precio * i.qty) : "A consultar"}
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-4 bg-sand/50 px-5 py-4">
              <span className="font-medium uppercase tracking-[0.1em] text-ink">Total (transferencia)</span>
              <span className="font-display text-[length:var(--text-step-1)] font-bold tabular-nums text-ink">
                {p.total === 0 && p.hayConsultar ? "A cotizar" : formatARS(p.total)}
                {p.hayConsultar && p.total > 0 && <span className="block text-right text-[length:var(--text-step--1)] font-normal text-muted">+ productos a consultar</span>}
              </span>
            </li>
          </ul>
          {extras.length > 0 && (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-4 sm:grid-cols-2">
              {extras.map(([l, v]) => (
                <div key={l}>
                  <dt className="text-[length:var(--text-step--1)] text-muted">{l}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {p.nota && (
            <div className="rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-4">
              <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">Comentario del cliente</p>
              <p className="mt-2 whitespace-pre-line text-ink">{p.nota}</p>
            </div>
          )}
          <p className="text-[length:var(--text-step--1)] text-muted">
            Los precios son los del catálogo al momento de pedir. Para encontrar el chat, buscá{" "}
            <span className="font-mono text-ink">{p.codigo}</span> en WhatsApp.
          </p>
        </section>

        <aside className="flex flex-col gap-8">
          <section className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-cloud p-5">
            <h2 className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">Estado</h2>
            <div>
              <EstadoSelect tipo="pedido" id={p.id} valor={p.estado} opciones={ESTADOS_PEDIDO} etiqueta="Estado del pedido" />
            </div>
          </section>
          <section className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-cloud p-5">
            <h2 className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">Seguimiento</h2>
            <Seguimiento tipo="pedido" id={p.id} telefono={p.telefono} nota={p.notaInterna} />
            {!wa && (
              <p className="text-[length:var(--text-step--1)] text-muted">
                Cargá el celular del cliente para responderle con un toque desde acá.
              </p>
            )}
          </section>
          {esAdmin && (
            <div>
              <Archivar tipo="pedido" id={p.id} volverA="/panel/pedidos" />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
