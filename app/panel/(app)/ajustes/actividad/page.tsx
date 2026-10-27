import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { Paginacion } from "@/components/ui/Paginacion";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta } from "@/lib/panel/formato";
import { listarActividad } from "@/modules/ventas/admin";
import { PERMISOS } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Actividad" };

/** Qué significa cada acción, en castellano simple. */
const ACCION: Record<string, string> = {
  "product.create": "Creó un producto",
  "product.update": "Editó un producto",
  "product.visible": "Publicó u ocultó un producto",
  "product.destacado": "Cambió un destacado",
  "product.delete": "Mandó un producto a la papelera",
  "product.restore": "Restauró un producto",
  "product.duplicate": "Duplicó un producto",
  "product.precio": "Cambió un precio",
  "product.precio.masivo": "Actualizó precios de una categoría",
  "product.precio.masivo.deshacer": "Deshizo una actualización de precios",
  "product.orden": "Cambió el orden de un producto",
  "product.image.add": "Subió una foto",
  "product.image.delete": "Borró una foto",
  "product.image.move": "Reordenó fotos",
  "category.create": "Creó una categoría",
  "category.update": "Editó una categoría",
  "pedido.estado": "Cambió el estado de un pedido",
  "consulta.estado": "Cambió el estado de una consulta",
  "inscripcion.estado": "Cambió el estado de una inscripción",
  "pedido.seguimiento": "Anotó en un pedido",
  "consulta.seguimiento": "Anotó en una consulta",
  "inscripcion.seguimiento": "Anotó en una inscripción",
  "pedido.archivar": "Archivó un pedido",
  "consulta.archivar": "Archivó una consulta",
  "inscripcion.archivar": "Archivó una inscripción",
  "pedido.restaurar": "Restauró un pedido",
  "consulta.restaurar": "Restauró una consulta",
  "inscripcion.restaurar": "Restauró una inscripción",
  "inscripcion.asistio": "Acreditó a alguien en el Summit",
  "inscripcion.asistio_deshacer": "Quitó una acreditación",
  "inscripcion.reenviar_entrada": "Reenvió una entrada",
  "inscripcion.exportar": "Descargó la lista del Summit",
  "campana.crear": "Creó una campaña",
  "campana.enviar": "Envió una campaña",
  "campana.enviar.retomada": "Retomó el envío de una campaña",
  "campana.borrar": "Borró una campaña",
  "codigo.usado": "Marcó un código del club como usado",
  "codigo.desmarcar": "Desmarcó un código del club",
  "suscriptor.alta": "Sumó a alguien al club",
  "suscriptor.baja": "Dio de baja a alguien del club",
  "suscriptor.activo": "Reactivó a alguien del club",
  "sesiones.cerrar": "Cerró las sesiones de alguien",
};

const ENTIDADES = [
  { v: "product", l: "Productos" },
  { v: "category", l: "Categorías" },
  { v: "pedido", l: "Pedidos" },
  { v: "consulta", l: "Consultas" },
  { v: "inscripcion", l: "Summit" },
  { v: "newsletter", l: "Newsletter" },
];

const LINK: Record<string, (id: string) => string> = {
  product: (id) => `/panel/productos/${id}`,
  pedido: (id) => `/panel/pedidos/${id}`,
};

export default async function ActividadPage({ searchParams }: { searchParams: Promise<{ persona?: string; entidad?: string; pagina?: string }> }) {
  await requireStaff(PERMISOS.actividad.roles);
  const sp = await searchParams;
  const header = (
    <PageHeader
      seccion="Ajustes"
      titulo="Actividad"
      descripcion="Quién hizo qué en el panel y cuándo. Sirve para responder “¿quién ocultó esto?”."
      accion={<PanelButton href="/panel/ajustes" variant="outline">Volver a Ajustes</PanelButton>}
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;
  const entidad = ENTIDADES.find((e) => e.v === sp.entidad)?.v;
  const r = await listarActividad({ persona: sp.persona?.slice(0, 64), entidad, pagina: Number(sp.pagina) || 1 });
  const href = (n: number) => {
    const u = new URLSearchParams();
    if (sp.persona) u.set("persona", sp.persona);
    if (entidad) u.set("entidad", entidad);
    if (n > 1) u.set("pagina", String(n));
    const t = u.toString();
    return `/panel/ajustes/actividad${t ? `?${t}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {header}
      <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <select name="persona" defaultValue={sp.persona ?? ""} className={inputCls} aria-label="Persona">
          <option value="">Todas las personas</option>
          {r.personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre ?? p.email}
            </option>
          ))}
        </select>
        <select name="entidad" defaultValue={entidad ?? ""} className={inputCls} aria-label="Sección">
          <option value="">Todas las secciones</option>
          {ENTIDADES.map((e) => (
            <option key={e.v} value={e.v}>
              {e.l}
            </option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline">
          Filtrar
        </PanelButton>
      </form>

      {r.filas.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-line bg-cloud px-4 py-12 text-center text-muted">Todavía no hay actividad con esos filtros.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-cloud">
          {r.filas.map((a) => {
            const quien = a.nombre ?? a.email ?? "Sistema";
            const link = a.entidadId && LINK[a.entidad]?.(a.entidadId);
            const texto = ACCION[a.accion] ?? a.accion;
            return (
              <li key={a.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
                <span className="w-28 shrink-0 text-[length:var(--text-step--1)] tabular-nums text-muted">{fechaCorta(a.createdAt)}</span>
                <span className="min-w-0 flex-1 text-ink">
                  <strong className="font-medium">{quien}</strong> · {link ? <Link href={link} className="underline decoration-line underline-offset-4 hover:decoration-ink">{texto.toLowerCase()}</Link> : texto.toLowerCase()}
                </span>
              </li>
            );
          })}
        </ol>
      )}
      <Paginacion pagina={r.pagina} total={r.paginas} href={href} />
    </div>
  );
}
