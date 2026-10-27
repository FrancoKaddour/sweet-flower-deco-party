import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { Badge } from "@/components/panel/Badge";
import { SinBase } from "@/components/panel/SinBase";
import { AvisoEnvio, TabsNewsletter } from "@/components/panel/newsletter/Comunes";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta } from "@/lib/panel/formato";
import { listarCampanas, resumenClub } from "@/modules/newsletter/admin";
import { SEGMENTOS } from "@/content/newsletter";

export const metadata: Metadata = { title: "Newsletter" };

const ESTADO = {
  borrador: { l: "Borrador", v: "neutral" },
  enviando: { l: "Enviando", v: "warning" },
  enviada: { l: "Enviada", v: "success" },
} as const;

export default async function NewsletterPage() {
  await requireStaff();
  const header = (
    <PageHeader
      seccion="Newsletter"
      titulo="Club Sweet Flowers"
      descripcion="La gente se suma desde cualquier página del sitio y recibe su código de descuento. Desde acá armás y mandás campañas a quien quieras."
      accion={<PanelButton href="/panel/newsletter/campanas/nueva">Nueva campaña</PanelButton>}
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;
  const [r, lista] = await Promise.all([resumenClub(), listarCampanas()]);

  return (
    <div className="flex flex-col gap-8">
      {header}
      <AvisoEnvio />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "En el club", v: r.activos, a: "Confirmaron su mail" },
          { l: "Nuevos", v: r.nuevos30, a: "Últimos 30 días" },
          { l: "Compraron", v: r.usados, a: `${r.conversion}% usó su código` },
          { l: "Sin confirmar", v: r.sinConfirmar, a: `Falta que confirmen el mail · ${r.bajas} bajas` },
        ].map((k, i) => (
          <div key={k.l} className={`rounded-[var(--radius-md)] border border-line p-5 ${["bg-sage", "bg-blush", "bg-sand", "bg-cloud"][i]}`}>
            <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">{k.l}</dt>
            <dd className="mt-2 font-display text-[length:var(--text-step-4)] font-extrabold leading-none tabular-nums text-ink">{k.v}</dd>
            <p className="mt-2 text-[length:var(--text-step--1)] text-muted">{k.a}</p>
          </div>
        ))}
      </dl>

      <TabsNewsletter activa="campanas" />

      {lista.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-line bg-cloud px-6 py-12 text-center">
          <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink">Tu primera campaña</p>
          <p className="mx-auto mt-3 max-w-[48ch] text-muted">
            Elegí una plantilla (lanzamiento, promo, preventa del Summit…), editá el texto y mirá cómo queda antes de mandarla.
          </p>
          <div className="mt-6 flex justify-center">
            <PanelButton href="/panel/newsletter/campanas/nueva">Crear campaña</PanelButton>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-cloud">
          {lista.map((c) => (
            <li key={c.id}>
              <Link href={`/panel/newsletter/campanas/${c.id}`} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 hover:bg-bone/60">
                <div className="min-w-[12rem] flex-1">
                  <p className="font-medium text-ink">{c.asunto}</p>
                  <p className="text-[length:var(--text-step--1)] text-muted">
                    {SEGMENTOS.find((s) => s.v === c.segmento)?.l ?? c.segmento} ·{" "}
                    {c.enviadaAt ? `enviada ${fechaCorta(c.enviadaAt)}` : `creada ${fechaCorta(c.createdAt)}`}
                  </p>
                </div>
                {c.estado === "enviada" && (
                  <span className="text-[length:var(--text-step--1)] tabular-nums text-muted">
                    {c.enviados} enviados{c.fallidos ? ` · ${c.fallidos} fallidos` : ""}
                  </span>
                )}
                <Badge variant={ESTADO[c.estado].v}>{ESTADO[c.estado].l}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
