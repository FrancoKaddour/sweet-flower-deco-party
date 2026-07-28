import Link from "next/link";

// Botón del panel — MISMO registro visual que components/ui/Button.tsx del sitio
// (pill, uppercase tracking, transición con ease-out-expo, hover lift), adaptado
// a la escala utilitaria del admin (padding un poco menor, tamaño de texto -1).
//
// A diferencia del Button del storefront, éste soporta tanto <button> (acciones
// como "Nueva campaña") como <Link> (navegación), y una variante "ghost" liviana
// para acciones de fila. Touch target ≥44px garantizado por el padding vertical.

type Variant = "solid" | "outline" | "inverse" | "ghost";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] transition-transform duration-[250ms] ease-[var(--ease-out-expo)] hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";

const VARIANT: Record<Variant, string> = {
  solid: "bg-ink text-bone",
  outline: "border border-ink/20 text-ink hover:border-ink/40",
  inverse: "bg-bone text-ink",
  ghost: "text-muted hover:text-ink",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  /** Tooltip nativo. Útil para marcar andamiaje mock ("Pendiente: …"). */
  title?: string;
  "aria-label"?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
};

type ActionButtonProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export function PanelButton(props: LinkButtonProps): React.JSX.Element;
export function PanelButton(props: ActionButtonProps): React.JSX.Element;
export function PanelButton(
  props: LinkButtonProps | ActionButtonProps,
): React.JSX.Element {
  const { variant = "solid", className = "", children } = props;
  const cls = `${BASE} ${VARIANT[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    return (
      <Link
        href={props.href}
        title={props.title}
        aria-label={props["aria-label"]}
        className={cls}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      aria-label={props["aria-label"]}
      className={cls}
    >
      {children}
    </button>
  );
}
