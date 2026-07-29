import { EmptyState } from "@/components/panel/EmptyState";

// Tabla reutilizable y TIPADA por genéricos. Renderiza un <table> semántico real
// (thead/tbody, <th scope="col">) con densidad cómoda, en el registro EDITORIAL
// del sitio: vive en una superficie cloud con border-line + radius-md, encabezado
// en versalitas con hairline champagne, filas con hover cálido y reveal de entrada
// escalonado (CSS panel-enter, respeta reduced-motion).
//
// En mobile envuelve la tabla en un contenedor con scroll horizontal contenido.
// Si no hay filas, muestra el EmptyState en lugar de una tabla vacía.
//
// Uso: <DataTable columns={[...]} rows={data} getRowKey={r => r.id} />

export type Column<T> = {
  /** Clave única de la columna. */
  key: string;
  /** Texto del encabezado. */
  header: string;
  /** Render de la celda para una fila. */
  cell: (row: T) => React.ReactNode;
  /** Alineación del contenido. Por defecto a la izquierda. */
  align?: "left" | "right" | "center";
  /** Oculta la columna en mobile (< sm) para tablas densas. */
  hideOnMobile?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  /** Título del estado vacío. */
  emptyTitulo: string;
  /** Descripción del estado vacío. */
  emptyDescripcion: string;
  /** Acción sugerida en el estado vacío. Opcional. */
  emptyAccion?: React.ReactNode;
  /** Caption accesible de la tabla (sr-only). */
  caption: string;
};

const ALIGN: Record<NonNullable<Column<unknown>["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyTitulo,
  emptyDescripcion,
  emptyAccion,
  caption,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        titulo={emptyTitulo}
        descripcion={emptyDescripcion}
        accion={emptyAccion}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-cloud">
      {/* Scroll horizontal contenido en pantallas chicas */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[length:var(--text-step--1)]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            {/* Hairline champagne bajo el encabezado (acento sobre claro, no texto). */}
            <tr className="border-b-2 border-champagne/30 bg-bone/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`whitespace-nowrap px-5 py-3.5 text-[length:var(--text-step--1)] font-semibold uppercase tracking-[0.12em] text-muted ${
                    ALIGN[col.align ?? "left"]
                  } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={getRowKey(row)}
                className="panel-enter border-b border-line/70 transition-colors duration-200 last:border-b-0 hover:bg-bone/70"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.24)}s` }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 align-middle text-ink ${
                      ALIGN[col.align ?? "left"]
                    } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
