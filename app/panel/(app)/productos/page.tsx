import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { Toolbar, FiltroSelect } from "@/components/panel/Toolbar";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { Badge } from "@/components/panel/Badge";
import { ChipProducto } from "@/components/panel/status";
import {
  getMockProductos,
  formatARS,
  MATERIALES,
  type Producto,
} from "@/lib/panel/mock";

export const metadata: Metadata = { title: "Productos" };

const COLUMNS: Column<Producto>[] = [
  {
    key: "titulo",
    header: "Producto",
    // Thumbnail (next/image + picsum como en Destacados) + título + material en
    // champagne debajo. El material va como acento champagne sobre claro (rótulo,
    // no cuerpo — docs/06 §7). alt="" porque es decorativo (placeholder).
    cell: (p) => (
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
          <Image
            src={`https://picsum.photos/seed/sfdp-panel-${p.id}/96/96`}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne">
            {p.material}
          </p>
          <p className="truncate font-medium text-ink">{p.titulo}</p>
        </div>
      </div>
    ),
  },
  {
    key: "precio",
    header: "Precio",
    align: "right",
    cell: (p) => formatARS(p.precio),
  },
  {
    key: "stock",
    header: "Stock",
    align: "right",
    hideOnMobile: true,
    cell: (p) =>
      p.stock === 0 ? (
        // No solo color: chip textual "Agotado" (WCAG 1.4.1).
        <span className="inline-flex items-center gap-2">
          <span className="text-bordeaux">0</span>
          <Badge variant="danger">Agotado</Badge>
        </span>
      ) : (
        <span>{p.stock}</span>
      ),
  },
  {
    key: "aMedida",
    header: "A medida",
    align: "center",
    hideOnMobile: true,
    cell: (p) =>
      p.aMedida ? (
        <Badge variant="info">Sí</Badge>
      ) : (
        <span className="text-muted">—</span>
      ),
  },
  {
    key: "estado",
    header: "Estado",
    cell: (p) => <ChipProducto estado={p.estado} />,
  },
  {
    key: "acciones",
    header: "Acciones",
    align: "right",
    cell: (p) => (
      // 🔌 GONZALO: cablear a editar/borrar (con confirmación) sobre Products.
      <div className="flex justify-end gap-2 whitespace-nowrap">
        <PanelButton
          variant="ghost"
          className="px-3"
          aria-label={`Editar ${p.titulo}`}
          title={`Pendiente: editar ${p.titulo}`}
        >
          Editar
        </PanelButton>
        <PanelButton
          variant="ghost"
          className="px-3"
          aria-label={`Borrar ${p.titulo}`}
          title={`Pendiente: borrar ${p.titulo}`}
        >
          Borrar
        </PanelButton>
      </div>
    ),
  },
];

export default function ProductosPage() {
  // 🔌 GONZALO: reemplazá getMockProductos() por la query a la colección Products
  // (payload.find({ collection: "products" })). Búsqueda/filtro por material del
  // lado del server.
  const productos = getMockProductos();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        seccion="Catálogo"
        titulo="Productos"
        descripcion="Catálogo de piezas: título, material, precio, stock, a medida y estado."
        accion={
          // 🔌 GONZALO: abrir el ABM de alta sobre Products (hoy self-href mock).
          <PanelButton href="/panel/productos" title="Pendiente: nuevo producto">
            Nuevo producto
          </PanelButton>
        }
      />

      <PlugHint coleccion="Products">
        Reemplazá <code className="font-mono">getMockProductos()</code> por la
        query a Payload. Los sub-módulos <strong>Categorías/Materiales</strong> y{" "}
        <strong>Medios</strong> van como colecciones aparte (
        <code className="font-mono">Categories</code>,{" "}
        <code className="font-mono">Media</code>) — dejá el lugar acá con tabs
        cuando los necesites.
      </PlugHint>

      <Toolbar
        buscarId="buscar-productos"
        placeholderBuscar="Buscar productos…"
        filtros={
          <FiltroSelect
            id="filtro-material"
            label="Filtrar por material"
            opciones={MATERIALES}
            placeholder="Todos los materiales"
          />
        }
      />

      <DataTable
        caption="Listado de productos del catálogo"
        columns={COLUMNS}
        rows={productos}
        getRowKey={(p) => p.id}
        emptyTitulo="Sin productos todavía"
        emptyDescripcion="Cuando cargues el catálogo, tus piezas van a aparecer acá."
        emptyAccion={
          // 🔌 GONZALO: abrir el ABM de alta sobre Products (hoy self-href mock).
          <PanelButton href="/panel/productos" title="Pendiente: nuevo producto">
            Nuevo producto
          </PanelButton>
        }
      />
    </div>
  );
}
