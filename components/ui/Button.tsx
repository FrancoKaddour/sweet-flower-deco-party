import Link from "next/link";

// Botón pill CTA del sitio. Unifica el patrón repetido (Hero, Workshops,
// Contacto, Membresía) con una transición canónica única. Renderiza <a> vía
// next/link, así los enlaces internos hacen navegación cliente y los anclas
// (#seccion) se comportan como siempre.

type Variant = "solid" | "outline" | "inverse";

const BASE =
  "inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-7 py-3.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] transition-transform duration-[400ms] ease-[var(--ease-out-expo)] hover:-translate-y-0.5";

const VARIANT: Record<Variant, string> = {
  solid: "bg-ink text-bone", // sobre fondo claro
  outline: "border border-ink/20 text-ink", // secundario sobre fondo claro
  inverse: "bg-bone text-ink", // sobre fondo oscuro (bordó, tinta)
};

type ButtonProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  variant = "solid",
  className = "",
  children,
}: ButtonProps) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT[variant]} ${className}`}>
      {children}
    </Link>
  );
}
