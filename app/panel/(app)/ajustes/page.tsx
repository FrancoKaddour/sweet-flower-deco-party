import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { Badge } from "@/components/panel/Badge";
import { requireStaff } from "@/lib/dal";
import { listarStaff } from "@/lib/panel/staff";
import { ROL_LABEL, type RolStaff } from "@/lib/panel/types";
import { PanelButton } from "@/components/panel/PanelButton";
import { CerrarSesiones } from "@/components/panel/ajustes/CerrarSesiones";
import { PERMISOS, puede } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Ajustes" };

const BADGE: Record<RolStaff, "warning" | "info"> = { superadmin: "warning", admin: "warning", editor: "info" };

export default async function AjustesPage() {
  const yo = await requireStaff();
  const equipo = await listarStaff();
  const esAdmin = puede(yo.role, "actividad");
  const ROLES_TABLA: RolStaff[] = ["superadmin", "admin", "editor"];

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Ajustes"
        titulo="Equipo"
        descripcion="Quién puede entrar al panel y qué puede hacer cada uno. Se ingresa con la cuenta de Google del email habilitado."
        accion={esAdmin ? <PanelButton href="/panel/ajustes/actividad" variant="outline">Ver actividad</PanelButton> : undefined}
      />

      <section aria-labelledby="staff-heading" className="flex flex-col gap-6">
        <SectionHeading id="staff-heading" eyebrow="Acceso" titulo="Personas habilitadas" />
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
          {equipo.map((m, i) => (
            <PanelReveal as="li" key={m.email} index={i}>
              <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                {m.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.imagen} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-sand font-display font-bold uppercase text-ink">
                    {m.email[0]}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">
                    {m.nombre ?? m.email}
                    {m.email === yo.email?.toLowerCase() && <span className="text-muted"> (vos)</span>}
                  </p>
                  {m.nombre && <p className="truncate text-[length:var(--text-step--1)] text-muted">{m.email}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {!m.ingreso && <Badge variant="neutral">Todavía no entró</Badge>}
                  <Badge variant={BADGE[m.rol]}>{ROL_LABEL[m.rol]}</Badge>
                </div>
                {esAdmin && m.ingreso && (
                  <div className="w-full sm:w-auto">
                    <CerrarSesiones email={m.email} esYo={m.email === yo.email?.toLowerCase()} />
                  </div>
                )}
              </div>
            </PanelReveal>
          ))}
        </ul>
        <p className="max-w-[70ch] text-[length:var(--text-step--1)] leading-relaxed text-muted">
          Para sumar o quitar a alguien del equipo, pedíselo al desarrollador: los permisos se configuran en el servidor,
          así nadie puede darse acceso a sí mismo.
        </p>
      </section>

      <section aria-labelledby="roles-heading" className="flex flex-col gap-6">
        <SectionHeading id="roles-heading" eyebrow="Permisos" titulo="Qué puede cada rol" />
        {/* P-22: sale de PERMISOS (modules/ventas/estados.ts), la misma tabla que usan las acciones. */}
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-cloud">
          <table className="w-full text-left text-[length:var(--text-step--1)]">
            <caption className="sr-only">Qué puede hacer cada rol</caption>
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Tarea</th>
                {ROLES_TABLA.map((r) => (
                  <th key={r} className="w-[4.5rem] px-2 py-3 text-center font-medium sm:w-28">
                    {ROL_LABEL[r]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {Object.values(PERMISOS).map((p) => (
                <tr key={p.l}>
                  <td className="px-4 py-3 text-ink">{p.l}</td>
                  {ROLES_TABLA.map((r) => {
                    const si = (p.roles as readonly string[]).includes(r);
                    return (
                      <td key={r} className="px-2 py-3 text-center">
                        <span aria-hidden="true" className={si ? "text-ink" : "text-line"}>{si ? "✓" : "—"}</span>
                        <span className="sr-only">{si ? "Sí" : "No"}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
