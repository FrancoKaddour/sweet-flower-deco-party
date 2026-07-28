// Estado vacío reutilizable: cuando una tabla/lista no tiene datos. Tono cálido,
// no alarmante — invita a la primera acción. Se usa dentro del DataTable y en
// cualquier vista sin contenido.

type EmptyStateProps = {
  titulo: string;
  descripcion: string;
  /** Acción sugerida (ej. botón "Nuevo producto"). Opcional. */
  accion?: React.ReactNode;
};

export function EmptyState({ titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-line bg-bone/60 px-6 py-12 text-center">
      <h2 className="font-display text-[length:var(--text-step-1)] font-semibold text-ink">
        {titulo}
      </h2>
      <p className="max-w-sm text-[length:var(--text-step--1)] text-muted">
        {descripcion}
      </p>
      {accion ? <div className="mt-1">{accion}</div> : null}
    </div>
  );
}
