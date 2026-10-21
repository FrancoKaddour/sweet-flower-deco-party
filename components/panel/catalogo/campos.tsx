// Campos de formulario del panel (label real, error accesible, foco visible).

export const inputCls =
  "w-full rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-[length:var(--text-step-0)] text-ink placeholder:text-ink/35 transition-colors focus:border-ink/50 focus:outline-none aria-[invalid=true]:border-bordeaux";

export function Campo({
  id,
  label,
  ayuda,
  error,
  children,
}: {
  id: string;
  label: string;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[length:var(--text-step--1)] text-bordeaux">
          {error}
        </p>
      ) : ayuda ? (
        <p className="text-[length:var(--text-step--1)] text-muted">{ayuda}</p>
      ) : null}
    </div>
  );
}

export function Interruptor({ name, label, defaultChecked, ayuda }: { name: string; label: string; defaultChecked?: boolean; ayuda?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-4 accent-[var(--color-ink)]" />
      <span>
        <span className="block text-[length:var(--text-step-0)] font-medium text-ink">{label}</span>
        {ayuda && <span className="block text-[length:var(--text-step--1)] text-muted">{ayuda}</span>}
      </span>
    </label>
  );
}
