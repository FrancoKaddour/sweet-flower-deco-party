// "Eyebrow" — el rótulo champagne en versalitas que precede a los títulos de
// sección (DECORACIÓN DE EVENTOS, etc.). Patrón repetido en 6 secciones.
// El margen inferior lo decide cada sección vía className (mb-5 / mb-6).

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p
      className={`text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne ${className}`}
    >
      {children}
    </p>
  );
}
