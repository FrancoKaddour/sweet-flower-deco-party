// Íconos esquemáticos del panel — SVG inline, livianos, sin dependencias.
// Trazo con `currentColor` para heredar el color del contexto (nav, chips).
// `aria-hidden` porque son decorativos: el label textual acompaña siempre.

type IconProps = {
  className?: string;
};

const BASE_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function IconInicio({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function IconCatalogo({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconContenido({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M5 3.5h9l5 5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V9h5" />
      <path d="M8 13h7M8 16.5h7" />
    </svg>
  );
}

export function IconVentas({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M4 5h2l1.5 10.5a1 1 0 0 0 1 .85h7.8a1 1 0 0 0 1-.8L19 8H6.2" />
      <circle cx="9.5" cy="19" r="1.2" />
      <circle cx="17" cy="19" r="1.2" />
    </svg>
  );
}

export function IconComunidad({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6a3 3 0 0 1 0 5.5" />
      <path d="M17 14.5a5.5 5.5 0 0 1 3.5 5" />
    </svg>
  );
}

export function IconCampanas({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M3.5 8.5 12 13l8.5-4.5" />
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
    </svg>
  );
}

export function IconConsultas({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M20 6.5v8a2 2 0 0 1-2 2H9l-4 3.5V6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2Z" />
      <path d="M9 10h7M9 13h4" />
    </svg>
  );
}

export function IconAjustes({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconCerrar({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconBuscar({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconPlug({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" />
      <path d="M12 17v4" />
    </svg>
  );
}
