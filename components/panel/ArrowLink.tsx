import Link from "next/link";

// Arrow-link editorial del storefront (ver components/sections/Destacados.tsx):
// texto en versalitas con hairline inferior + flecha → que se desplaza al hover
// (group-hover:translate-x-1). Se usa como "ver todo" de las secciones del panel
// y en las listas de "Requiere acción". Sobre fondo claro por defecto (borde ink).

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  /** Variante clara (borde ink) u oscura (borde bone, para momentos oscuros). */
  tono?: "claro" | "oscuro";
  className?: string;
};

export function ArrowLink({
  href,
  children,
  tono = "claro",
  className = "",
}: ArrowLinkProps) {
  const color = tono === "oscuro" ? "border-bone/50 text-bone" : "border-ink text-ink";
  return (
    <Link
      href={href}
      className={`group inline-flex w-max items-center gap-2 border-b pb-1 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.1em] ${color} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
