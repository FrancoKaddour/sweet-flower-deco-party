import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { SinBase } from "@/components/panel/SinBase";
import { CategoriaForm } from "@/components/panel/catalogo/CategoriaForm";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { listarCategoriasPanel } from "@/modules/catalog/admin";

export const metadata: Metadata = { title: "Categorías" };

export default async function CategoriasPage() {
  const user = await requireStaff();
  const header = (
    <PageHeader
      seccion="Catálogo"
      titulo="Categorías"
      descripcion="Cómo se agrupa el catálogo en el sitio (Catering, Hierro, Fundas…)."
      accion={<PanelButton href="/panel/productos" variant="outline">Volver a productos</PanelButton>}
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;
  const categorias = await listarCategoriasPanel();
  const puedeEditar = user.role !== "editor";

  return (
    <div className="flex flex-col gap-6">
      {header}
      {!puedeEditar && <p className="text-muted">Solo un administrador puede editar categorías.</p>}
      {categorias.map((c) => (
        <details key={c.id} className="group rounded-[var(--radius-lg)] border border-line bg-cloud">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
            <span>
              <span className="block font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink">{c.nombre}</span>
              <span className="text-[length:var(--text-step--1)] text-muted">
                {c.linea === "catering" ? "Catering" : "Ambientación"} · {c.productos} productos {c.visible ? "" : "· Oculta"}
              </span>
            </span>
            <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          {puedeEditar && (
            <div className="border-t border-line px-6 py-6">
              <CategoriaForm id={c.id} valores={{ ...c, incluye: c.incluye }} />
            </div>
          )}
        </details>
      ))}
      {puedeEditar && (
        <details className="rounded-[var(--radius-lg)] border border-dashed border-line bg-cloud">
          <summary className="cursor-pointer list-none px-6 py-5 font-medium uppercase tracking-[0.08em] text-ink">
            + Nueva categoría
          </summary>
          <div className="border-t border-line px-6 py-6">
            <CategoriaForm id={null} />
          </div>
        </details>
      )}
    </div>
  );
}
