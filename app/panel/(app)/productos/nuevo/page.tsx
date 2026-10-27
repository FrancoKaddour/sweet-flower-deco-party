import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { SinBase } from "@/components/panel/SinBase";
import { ProductoForm } from "@/components/panel/catalogo/ProductoForm";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { listarCategoriasPanel } from "@/modules/catalog/admin";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NuevoProductoPage() {
  await requireStaff();
  const header = <PageHeader seccion="Catálogo" titulo="Nuevo producto" descripcion="Se crea oculto. Después de crearlo le subís las fotos y lo publicás." />;
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;
  const categorias = await listarCategoriasPanel();
  return (
    <div className="flex flex-col gap-8">
      {header}
      <ProductoForm id={null} categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))} />
    </div>
  );
}
