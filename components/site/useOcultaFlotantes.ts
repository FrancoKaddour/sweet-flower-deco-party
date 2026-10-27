"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Lo que, mientras esté a la vista, pide que los flotantes (WhatsApp, barra de compra) se corran. */
export const SELECTOR_OCULTA_FLOTANTES = "[data-oculta-flotantes], footer";

/**
 * true mientras haya a la vista un formulario, los pases del Summit o el footer
 * (cualquier elemento con `data-oculta-flotantes`, o el <footer>). Se vuelve a
 * medir en cada cambio de ruta.
 */
export function useOcultaFlotantes(): boolean {
  const pathname = usePathname();
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    const visibles = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visibles.add(e.target);
          else visibles.delete(e.target);
        }
        setOculto(visibles.size > 0);
      },
      // Un poco antes del borde de abajo: el flotante se va antes de tapar.
      { rootMargin: "0px 0px -8% 0px" },
    );
    // La página nueva puede montar un frame después del cambio de ruta.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(SELECTOR_OCULTA_FLOTANTES).forEach((el) => io.observe(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      setOculto(false);
    };
  }, [pathname]);

  return oculto;
}
