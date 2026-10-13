import Link from "next/link";

// CTA del sitio — mismo lenguaje que "Contacto" y "Menú" del header: texto en
// versalitas espaciadas, sin cápsula. Interacción:
//  · el texto "rueda" (sale hacia arriba y entra la copia desde abajo),
//  · la línea de abajo se retira hacia la derecha y se vuelve a dibujar,
//  · primario: un círculo que se rellena y una flecha que sale ↗ y re-entra.
// Todo CSS (sin JS), transiciones con --ease-out-expo. Ver app/globals.css (.sf-btn).

type Variant = "solid" | "outline" | "inverse";
type Tone = "dark" | "light";

type ButtonProps = {
  href: string;
  /** solid/inverse = primario (con círculo + flecha); outline = secundario. */
  variant?: Variant;
  /** Color del texto: "dark" sobre fondos claros, "light" sobre oscuros/foto.
   *  Por defecto: inverse → light, el resto → dark. */
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
};

export function ButtonInner({
  primary,
  tone,
  children,
}: {
  primary: boolean;
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="sf-btn__label relative block overflow-hidden pb-1.5">
        <span className="sf-btn__text block">{children}</span>
        <span aria-hidden="true" className="sf-btn__text sf-btn__text--copy absolute inset-x-0 top-0 block">
          {children}
        </span>
        <span aria-hidden="true" className="sf-btn__line absolute bottom-0 left-0 h-px w-full bg-current" />
      </span>
      {primary ? (
        <span
          aria-hidden="true"
          className={`sf-btn__dot relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-current/35 ${
            tone === "light" ? "sf-btn__dot--light" : "sf-btn__dot--dark"
          }`}
        >
          <span className="sf-btn__arrow">↗</span>
          <span className="sf-btn__arrow sf-btn__arrow--in">↗</span>
        </span>
      ) : (
        <span aria-hidden="true" className="sf-btn__plus relative block h-3 w-3 shrink-0">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        </span>
      )}
    </>
  );
}

export function buttonClasses(tone: Tone, className = "") {
  return `sf-btn group relative inline-flex min-h-11 items-center gap-3 py-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] ${
    tone === "light" ? "text-bone" : "text-ink"
  } ${className}`;
}

export function Button({ href, variant = "solid", tone, className = "", children }: ButtonProps) {
  const t: Tone = tone ?? (variant === "inverse" ? "light" : "dark");
  return (
    <Link href={href} className={buttonClasses(t, className)}>
      <ButtonInner primary={variant !== "outline"} tone={t}>
        {children}
      </ButtonInner>
    </Link>
  );
}
