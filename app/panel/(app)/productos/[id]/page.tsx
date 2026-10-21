import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/PageHeader";
import { SinBase } from "@/components/panel/SinBase";
import { ProductoForm } from "@/components/panel/catalogo/ProductoForm";
import { ImagenesProducto } from "@/components/panel/catalogo/ImagenesProducto";
import { AccionesProducto } from "@/components/panel/catalogo/AccionesProducto";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { listarCategoriasPanel, obtenerProductoPanel } from "@/modules/catalog/admin";

export const metadata: Metadata = { title: "Editar producto" };

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
}) {
  const user = await requireStaff();
  if (!hasDb()) return <SinBase />;
  const [{ id }, { creado }] = await Promise.all([params, searchParams]);
  const [p, categorias] = await Promise.all([obtenerProductoPanel(id), listarCategoriasPanel()]);
  if (!p) notFound();
  const cat = categorias.find((c) => c.id === p.categoryId);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        seccion="Catálogo"
        titulo={p.nombre}
        descripcion={`${cat?.nombre ?? ""} · ${p.visible ? "Visible en el sitio" : "Oculto"}`}
        accion={
          cat && (
            <Link
              href={`/productos/${cat.slug}/${p.slug}`}
              target="_blank"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-ink/20 px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink"
            >
              Ver en el sitio ↗
            </Link>
          )
        }
      />
      {creado && (
        <p role="status" className="rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-ink">
          Producto creado. Ahora subile las fotos.
        </p>
      )}

      <section aria-labelledby="fotos" className="flex flex-col gap-4">
        <h2 id="fotos" className="font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink">
          Fotos
        </h2>
        <ImagenesProducto
          productId={p.id}
          nombre={p.nombre}
          imagenes={p.imagenes.map((i) => ({ id: i.id, url: i.url, alt: i.alt }))}
        />
      </section>

      <section aria-labelledby="datos" className="flex flex-col gap-4">
        <h2 id="datos" className="font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink">
          Datos
        </h2>
        <ProductoForm
          id={p.id}
          valores={{
            nombre: p.nombre,
            slug: p.slug,
            categoryId: p.categoryId,
            precio: p.precio,
            descripcion: p.descripcion,
            medidas: p.medidas,
            variantes: p.variantes,
            destacado: p.destacado,
            visible: p.visible,
          }}
          categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))}
        />
      </section>

      <section className="border-t border-line pt-8">
        <AccionesProducto id={p.id} nombre={p.nombre} puedeBorrar={user.role !== "editor"} />
      </section>
    </div>
  );
}
