import { IconBuscar } from "@/components/panel/icons";

// Barra de herramientas sobre una tabla: campo de búsqueda + filtros + acción.
// Es UI mock (el input no filtra todavía). Layout responsive: apila en mobile,
// fila en desktop. El label del buscador va con <label> real (sr-only) por a11y.

type ToolbarProps = {
  /** id único para asociar el <label> del buscador con su <input>. */
  buscarId: string;
  placeholderBuscar: string;
  /** Controles de filtro (selects, etc.). Opcional. */
  filtros?: React.ReactNode;
  /** Acción primaria a la derecha (ej. "Nuevo producto"). Opcional. */
  accion?: React.ReactNode;
};

export function Toolbar({
  buscarId,
  placeholderBuscar,
  filtros,
  accion,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <label htmlFor={buscarId} className="sr-only">
            {placeholderBuscar}
          </label>
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          >
            <IconBuscar />
          </span>
          <input
            id={buscarId}
            type="search"
            placeholder={placeholderBuscar}
            className="min-h-11 w-full rounded-[var(--radius-pill)] border border-line bg-cloud pl-10 pr-4 text-[length:var(--text-step--1)] text-ink placeholder:text-muted focus:border-champagne focus:outline-none"
          />
        </div>
        {filtros ? (
          <div className="flex flex-wrap items-center gap-2">{filtros}</div>
        ) : null}
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </div>
  );
}

// Select de filtro con estética de marca — se usa dentro de `filtros`.
type FiltroSelectProps = {
  label: string;
  id: string;
  opciones: readonly string[];
  /** Texto de la opción "todos". */
  placeholder: string;
};

export function FiltroSelect({
  label,
  id,
  opciones,
  placeholder,
}: FiltroSelectProps) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        defaultValue=""
        className="min-h-11 rounded-[var(--radius-pill)] border border-line bg-cloud px-4 text-[length:var(--text-step--1)] text-ink focus:border-champagne focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {opciones.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </>
  );
}
