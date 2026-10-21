/** Aviso cuando todavía no hay base conectada (antes del setup). */
export function SinBase() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-champagne/70 bg-champagne/5 p-8">
      <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase text-ink">Falta conectar la base</p>
      <p className="mt-3 max-w-[60ch] text-muted">
        El catálogo del sitio se está mostrando desde el respaldo estático. Para editarlo desde acá, seguí los pasos de{" "}
        <code className="font-mono">docs/SETUP_BACKEND.md</code> (Neon + Blob en Vercel, migraciones y seed).
      </p>
    </div>
  );
}
