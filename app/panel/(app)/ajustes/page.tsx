import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { Badge } from "@/components/panel/Badge";
import { requireStaff } from "@/lib/dal";
import { listarStaff } from "@/lib/panel/staff";
import { ROL_LABEL, type RolStaff } from "@/lib/panel/types";

export const metadata: Metadata = { title: "Ajustes" };

const ROLES: { rol: RolStaff; texto: string; fondo: string }[] = [
  {
    rol: "admin",
    texto: "Todo el catálogo: cargar, editar, ocultar y borrar productos, fotos y categorías.",
    fondo: "bg-sand",
  },
  {
    rol: "editor",
    texto: "Carga y edita productos, fotos y categorías. No puede borrar productos.",
    fondo: "bg-sage",
  },
];

const BADGE: Record<RolStaff, "warning" | "info"> = { superadmin: "warning", admin: "warning", editor: "info" };

export default async function AjustesPage() {
  const yo = await requireStaff();
  const equipo = await listarStaff();

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Ajustes"
        titulo="Equipo"
        descripcion="Quién puede entrar al panel y qué puede hacer cada uno. Se ingresa con la cuenta de Google del email habilitado."
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ROLES.map((r, i) => (
            <PanelReveal
              as="article"
              key={r.rol}
              index={i}
              className={`flex flex-col gap-3 rounded-[var(--radius-md)] border border-line ${r.fondo} p-6`}
            >
              <div>
                <Badge variant={BADGE[r.rol]}>{ROL_LABEL[r.rol]}</Badge>
              </div>
              <p className="text-[length:var(--text-step--1)] leading-relaxed text-muted">{r.texto}</p>
            </PanelReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
