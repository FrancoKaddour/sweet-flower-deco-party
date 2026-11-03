import { CATALOGO_TELAS_URL } from "@/content/site";

/**
 * Link al catálogo completo de telas (Google Drive). Son cientos de diseños:
 * en vez de cargarlos uno por uno, la persona elige en el Drive y manda el
 * código por WhatsApp. Variante "banda" (categoría) o "compacta" (ficha).
 */
export function CatalogoTelas({ compacta = false }: { compacta?: boolean }) {
  if (compacta) {
    return (
      <a
        href={CATALOGO_TELAS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-line bg-sand/60 px-5 py-4 transition-colors hover:border-ink"
      >
        <span>
          <span className="block font-medium text-ink">Ver todas las telas disponibles</span>
          <span className="block text-[length:var(--text-step--1)] text-ink/65">Elegí tu diseño y pasanos el código por WhatsApp.</span>
        </span>
        <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">↗</span>
      </a>
    );
  }
  return (
    <div className="mx-auto mb-14 flex max-w-[87.5rem] flex-col items-center gap-5 rounded-[var(--radius-lg)] bg-ink px-6 py-10 text-center text-bone md:mb-20 md:flex-row md:justify-between md:px-12 md:text-left">
      <div>
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">Catálogo de telas</p>
        <p className="mt-2 font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95]">Cientos de diseños para tus fundas</p>
        <p className="mt-3 max-w-[48ch] text-bone/70">Mirá el catálogo completo, elegí la tela y mandanos el código por WhatsApp con la medida que necesitás.</p>
      </div>
      <a
        href={CATALOGO_TELAS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-bone px-7 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-champagne"
      >
        Ver catálogo completo <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
