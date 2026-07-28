// Chip de estado del panel. Variantes mapeadas a los tokens de marca:
//   neutral → línea/muted   ·  success → botanical (verde)
//   warning → champagne (dorado)  ·  danger → bordeaux  ·  info → ink suave
// Sin HEX sueltos: todo por token. Contraste verificado sobre superficies claras.

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

const VARIANT: Record<BadgeVariant, string> = {
  neutral: "border-line bg-bone text-muted",
  success: "border-botanical/25 bg-botanical/10 text-botanical",
  warning: "border-champagne/40 bg-champagne/12 text-[color:var(--color-ink)]",
  danger: "border-bordeaux/25 bg-bordeaux/10 text-bordeaux",
  info: "border-ink/15 bg-ink/5 text-ink",
};

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
};

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-1 text-[length:var(--text-step--1)] font-medium leading-none ${VARIANT[variant]}`}
    >
      {children}
    </span>
  );
}
