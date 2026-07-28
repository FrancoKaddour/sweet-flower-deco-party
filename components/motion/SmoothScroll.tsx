"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Instancia de Lenis a nivel de módulo. Permite que otros componentes
 * (p. ej. el menú overlay del Header) puedan pausar/reanudar el scroll suave.
 * Si reduced-motion está activo, nunca se crea → queda en null y los
 * controles de abajo son no-op.
 */
let lenisInstance: Lenis | null = null;

/** Pausa el scroll suave (no-op si Lenis no está activo). */
export function stopLenis() {
  lenisInstance?.stop();
}

/** Reanuda el scroll suave (no-op si Lenis no está activo). */
export function startLenis() {
  lenisInstance?.start();
}

/**
 * Smooth scroll con Lenis, sincronizado con GSAP ScrollTrigger vía el ticker.
 * Respeta prefers-reduced-motion: si el usuario lo pide, no se activa el scroll suave.
 * Ver docs/07_MOTION_SYSTEM.md §Lenis.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // El panel de administración (/panel) NO usa smooth scroll: es una UI
  // utilitaria (tablas, formularios) donde el scroll suave estorba. Detectamos
  // la ruta y, si estamos en /panel, no inicializamos Lenis. La lógica de
  // reduced-motion de abajo se mantiene intacta.
  const pathname = usePathname();
  const isPanel = pathname?.startsWith("/panel") ?? false;

  useEffect(() => {
    if (isPanel) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1, // scroll "con peso" — ver docs/07
      smoothWheel: true,
    });
    // Exponemos la instancia para poder pausarla/reanudarla desde fuera.
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [isPanel]);

  return <>{children}</>;
}
