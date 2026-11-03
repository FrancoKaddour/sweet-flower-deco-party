import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/PageHeader";
import { Badge } from "@/components/panel/Badge";
import { BloquearCliente, ClienteForm } from "@/components/panel/clientes/ClienteForm";
import { requireStaff } from "@/lib/dal";
import { fechaCorta, fechaLarga, linkWhatsApp } from "@/lib/panel/formato";
import { formatARS } from "@/modules/catalog/types";
import { obtenerCliente } from "@/modules/clientes/admin";
import { TIPOS_CLIENTE, TRANSPORTES } from "@/modules/cuenta/opciones";
import { ESTADOS_INSCRIPCION, ESTADOS_PEDIDO, PERMISOS, infoEstado, telefonoWhatsApp } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Cliente" };

const caja = "rounded-[var(--radius-lg)] border border-line bg-cloud p-5 md:p-7";
const h2 = "mb-4 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-muted";

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(PERMISOS.clientes.roles);
  const { id } = await params;
  const c = await obtenerCliente(id);
  if (!c) notFound();
  const { usuario: u, perfil: p, pedidos, inscripciones, club } = c;
  const nombre = [p?.nombre, p?.apellido].filter(Boolean).join(" ") || u.name || "Sin nombre";
  const wa = telefonoWhatsApp(p?.telefono);
  const dato = (l: string, v: React.ReactNode) => (
    <div>
      <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">{l}</dt>
      <dd className="mt-1 break-words text-ink">{v || "—"}</dd>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <Link href="/panel/clientes" className="text-[length:var(--text-step--1)] text-muted hover:text-ink">← Clientes</Link>
      <PageHeader
        seccion="Clientes"
        titulo={nombre}
        descripcion={`${u.email} · cliente desde el ${fechaLarga(u.createdAt)}`}
        accion={<BloquearCliente id={u.id} bloqueado={Boolean(u.bloqueadoAt)} />}
      />

      {u.bloqueadoAt && (
        <p role="status" className="rounded-[var(--radius-md)] border border-bordeaux/25 bg-bordeaux/10 px-4 py-3 text-bordeaux">
          Cuenta bloqueada el {fechaCorta(u.bloqueadoAt)}: no puede ingresar al sitio.
        </p>
      )}

      {/* Resumen */}
      <section className={caja} aria-label="Datos del cliente">
        <h2 className={h2}>Resumen</h2>
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dato("Celular", wa ? <a href={linkWhatsApp(wa)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{p?.telefono}</a> : p?.telefono)}
          {dato("Tipo", TIPOS_CLIENTE.find((t) => t.v === p?.tipoCliente)?.l)}
          {dato("Emprendimiento", p?.emprendimiento)}
          {dato("Instagram", p?.instagram ? <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">@{p.instagram}</a> : null)}
          {dato("Dirección", [p?.calle && `${p.calle} ${p.numero ?? ""}`.trim(), p?.pisoDepto].filter(Boolean).join(", "))}
          {dato("Localidad", [p?.localidad, p?.provincia, p?.codigoPostal].filter(Boolean).join(", "))}
          {dato("Transporte", TRANSPORTES.find((t) => t.v === p?.transporte)?.l)}
          {dato("Club", club ? <Badge variant={club.estado === "activo" ? "success" : "neutral"}>{club.estado === "activo" ? `Activo · ${club.codigo}` : club.estado}</Badge> : "No está en el club")}
        </dl>
        {!p && <p className="mt-5 text-muted">Todavía no cargó sus datos en su perfil.</p>}
      </section>

      {/* Historial */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className={caja} aria-label="Pedidos">
          <h2 className={h2}>Pedidos ({pedidos.length})</h2>
          {pedidos.length === 0 ? (
            <p className="text-muted">Sin pedidos.</p>
          ) : (
            <ul className="divide-y divide-line">
              {pedidos.map((o) => {
                const e = infoEstado(ESTADOS_PEDIDO, o.estado);
                return (
                  <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                    <Link href={`/panel/pedidos/${o.id}`} className="font-medium text-ink hover:underline">{o.codigo}</Link>
                    <span className="text-muted">{fechaCorta(o.createdAt)}</span>
                    <span className="tabular-nums">{o.total ? formatARS(o.total) : "A cotizar"}</span>
                    <Badge variant={e.tono}>{e.l}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <section className={caja} aria-label="Inscripciones al Summit">
          <h2 className={h2}>Event Summit ({inscripciones.length})</h2>
          {inscripciones.length === 0 ? (
            <p className="text-muted">No se inscribió.</p>
          ) : (
            <ul className="divide-y divide-line">
              {inscripciones.map((r) => {
                const e = infoEstado(ESTADOS_INSCRIPCION, r.estado);
                return (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="font-medium text-ink">{r.edicion} · {r.pase === "vip" ? "VIP" : "General"}</span>
                    <span className="text-muted">{fechaCorta(r.createdAt)}</span>
                    <Badge variant={e.tono}>{e.l}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Edición */}
      <section aria-label="Editar datos">
        <h2 className={h2}>Editar datos</h2>
        <ClienteForm
          id={u.id}
          valores={{
            nombre: p?.nombre ?? u.name,
            apellido: p?.apellido ?? null,
            telefono: p?.telefono ?? u.phone,
            dni: p?.dni ?? null,
            tipoCliente: p?.tipoCliente ?? null,
            emprendimiento: p?.emprendimiento ?? null,
            instagram: p?.instagram ?? null,
            calle: p?.calle ?? null,
            numero: p?.numero ?? null,
            pisoDepto: p?.pisoDepto ?? null,
            localidad: p?.localidad ?? u.city,
            provincia: p?.provincia ?? null,
            codigoPostal: p?.codigoPostal ?? null,
            transporte: p?.transporte ?? null,
            contactoWhatsapp: p?.contactoWhatsapp ?? true,
            contactoEmail: p?.contactoEmail ?? true,
          }}
        />
      </section>
    </div>
  );
}
