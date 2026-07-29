// Reveal de entrada sutil para el panel — versión Server-Component del FadeUp del
// storefront. En vez de GSAP + ScrollTrigger (que el panel no necesita: son vistas
// cortas sin smooth-scroll), usa la animación CSS `panel-enter` de globals.css
// (fade + translateY 10px, 0.32s ease-out-expo) con un stagger por índice.
//
// prefers-reduced-motion se respeta en globals.css (la animación se anula). Al ser
// puro CSS no requiere "use client": las tablas/tarjetas siguen siendo server.

type PanelRevealProps = {
  children: React.ReactNode;
  /** Índice del elemento en una lista → retrasa la entrada (stagger sutil). */
  index?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section" | "tr";
};

export function PanelReveal({
  children,
  index = 0,
  className = "",
  as: Tag = "div",
}: PanelRevealProps) {
  // Delay escalonado suave (máx ~240ms para no demorar la lectura del admin).
  const delay = Math.min(index * 0.04, 0.24);
  return (
    <Tag
      className={`panel-enter ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
