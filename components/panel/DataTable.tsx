import { EmptyState } from "@/components/panel/EmptyState";

// Tabla reutilizable y TIPADA por genéricos. Renderiza un <table> semántico real
// (thead/tbody, <th scope="col">) con densidad cómoda. En mobile envuelve la
// tabla en un contenedor con scroll horizontal contenido (no rompe el layout).
// Si no hay filas, muestra el EmptyState en lugar de una tabla vacía.
//
// Uso: <DataTable columns={[...]} rows={data} getRowKey={r => r.id} />
// Cada columna define un `header` y un `cell(row)` que devuelve el contenido.

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
            <tr className="border-b border-line">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 font-medium uppercase tracking-[0.08em] text-muted ${
                    ALIGN[col.align ?? "left"]
                  } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-line/70 last:border-b-0 transition-colors hover:bg-bone/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 align-middle text-ink ${
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
