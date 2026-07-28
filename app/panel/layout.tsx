import type { Metadata } from "next";

// Layout raíz del segmento /panel. NO arma el shell acá: eso se hace en el grupo
// (app), así el login —grupo (auth)— queda por fuera del sidebar/topbar. Este
// layout sólo aporta el skip-link del panel y metadatos (noindex: el panel no se
// indexa). El guard de smooth-scroll vive en components/motion/SmoothScroll.tsx
// (si la ruta empieza con /panel, no se activa Lenis).

export const metadata: Metadata = {
  title: {
    default: "Panel · Sweet Flowers",
    template: "%s · Panel · Sweet Flowers",
  },
  description: "Centro de operaciones de Sweet Flowers Deco Party.",
  robots: { index: false, follow: false },
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip-link propio del panel (el <main> vive en el shell / login). */}
      <a
        href="#panel-main"
        className="sr-only rounded-[var(--radius-pill)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[length:var(--text-step--1)] focus:font-medium focus:uppercase focus:tracking-[0.1em] focus:text-bone"
      >
        Saltar al contenido
      </a>
      {children}
    </>
  );
}
