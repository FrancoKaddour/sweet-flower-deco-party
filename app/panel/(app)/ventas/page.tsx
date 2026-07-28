import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { Toolbar } from "@/components/panel/Toolbar";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { ChipPago, ChipEnvio } from "@/components/panel/status";
import { getMockOrdenes, formatARS, type Orden } from "@/lib/panel/mock";

export const metadata: Metadata = { title: "Órdenes" };

const COLUMNS: Column<Orden>[] = [
  {
    key: "id",
    header: "Orden",
    cell: (o) => <span className="font-medium">#{o.id}</span>,
  },
  {
    key: "comprador",
    header: "Comprador",
    hideOnMobile: true,
    cell: (o) => <span className="text-muted">{o.comprador}</span>,
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    cell: (o) => formatARS(o.total),
  },
  {
    key: "pago",
    header: "Pago",
    cell: (o) => <ChipPago estado={o.estadoPago} />,
  },
  {
    key: "envio",
    header: "Envío",
    cell: (o) => <ChipEnvio estado={o.estadoEnvio} />,
  },
  {
    key: "fecha",
    header: "Fecha",
    align: "right",
    hideOnMobile: true,
    cell: (o) => <span className="text-muted">{o.fecha}</span>,
  },
];

export default function VentasPage() {
  // 🔌 GONZALO: reemplazá getMockOrdenes() por la query a Orders (cuelga de un
  // Contact). El estado de PAGO es SOLO LECTURA (lo fija el webhook de Mercado
  // Pago); el estado de ENVÍO sí es editable desde acá.
  const ordenes = getMockOrdenes();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        seccion="Ventas"
        titulo="Órdenes"
        descripcion="Ventas del storefront: total, estado de pago (solo lectura) y de envío."
      />

      <PlugHint coleccion="Orders">
        Cada <code className="font-mono">Order</code> cuelga de un{" "}
        <code className="font-mono">Contact</code> (ADR-014): ese cruce es el que
        habilita campañas tipo <em>&ldquo;compradores del último mes&rdquo;</em>.
        El <strong>estado de pago</strong> lo fija el{" "}
        <strong>webhook de Mercado Pago</strong> — nunca se edita a mano acá (es
        solo lectura). El <strong>estado de envío</strong> sí es editable: cablealo
        a un update sobre <code className="font-mono">Orders</code>.
      </PlugHint>

      <Toolbar
        buscarId="buscar-ordenes"
        placeholderBuscar="Buscar por orden o comprador…"
      />

      <DataTable
        caption="Listado de órdenes de venta"
        columns={COLUMNS}
        rows={ordenes}
        getRowKey={(o) => o.id}
        emptyTitulo="Sin órdenes todavía"
        emptyDescripcion="Cuando alguien compre en el sitio, la orden va a aparecer acá."
      />
    </div>
  );
}
