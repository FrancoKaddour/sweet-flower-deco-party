// Header de página del panel: título en display (contenido, no gigante como el
// storefront), descripción en muted, y un slot opcional de acción primaria a la
// derecha. Semántico: el título es el <h1> de cada vista.

type PageHeaderProps = {
  titulo: string;
  descripcion: string;
  /**
   * Nombre del módulo en la nav cuando difiere del título (ej. nav "Catálogo"
   * vs H1 "Productos"). Se muestra como breadcrumb "Catálogo › Productos" para
   * ubicar al usuario. Omitir cuando nav y H1 coinciden.
   */
  seccion?: string;
  /** Acción primaria (botón). Se acomoda a la derecha en desktop. */
  accion?: React.ReactNode;
};

export function PageHeader({
  titulo,
  descripcion,
  seccion,
  accion,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {seccion ? (
          <p className="mb-2 text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted">
            {seccion} <span aria-hidden="true">›</span> {titulo}
          </p>
        ) : null}
        <h1 className="font-display text-[length:var(--text-step-3)] font-bold leading-[1.05] tracking-tight text-ink">
          {titulo}
        </h1>
        <p className="mt-2 text-[length:var(--text-step-0)] text-muted">
          {descripcion}
        </p>
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </header>
  );
}
