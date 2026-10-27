"use client";

import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { useOcultaFlotantes } from "./useOcultaFlotantes";

export type LineaWhatsApp = { numero: string; mensaje: string; linea: "ventas" | "capacitaciones" };

/**
 * Botón flotante de WhatsApp (cliente). Elige la línea según la página: en el
 * Summit y en las landings de capacitación va a la línea de capacitaciones.
 * Se corre cuando hay un formulario, los pases o el footer a la vista.
 */
export function WhatsAppFlotante({
  ventas,
  capacitaciones,
  rutasCapacitacion,
}: {
  ventas: LineaWhatsApp;
  capacitaciones: LineaWhatsApp;
  /** Rutas (además de /event-summit/**) que usan la línea de capacitaciones. */
  rutasCapacitacion: readonly string[];
}) {
  const pathname = usePathname() ?? "/";
  const oculto = useOcultaFlotantes();
  const esSummit =
    pathname === "/event-summit" || pathname.startsWith("/event-summit/") || rutasCapacitacion.includes(pathname);
  const l = esSummit ? capacitaciones : ventas;
  const href = `https://wa.me/${l.numero}?text=${encodeURIComponent(l.mensaje)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={esSummit ? "Consultas del Event Summit por WhatsApp" : "Escribinos por WhatsApp"}
      aria-hidden={oculto || undefined}
      tabIndex={oculto ? -1 : undefined}
      data-oculto={oculto || undefined}
      onClick={() => track("wa_contact_click", { linea: l.linea, pagina: pathname, origen: "flotante" })}
      className="c-wa group fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+var(--sf-barra-compra,0px))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex h-13 items-center overflow-hidden rounded-full bg-ink px-[0.95rem] text-bone shadow-[0_10px_30px_-10px_rgb(20_17_15/0.55)] duration-500 ease-(--ease-out-quart) hover:bg-bordeaux data-[oculto]:pointer-events-none data-[oculto]:translate-y-4 data-[oculto]:opacity-0 md:bottom-[max(2rem,env(safe-area-inset-bottom))] md:right-[max(2rem,env(safe-area-inset-right))]"
    >
      <svg viewBox="0 0 24 24" className="size-[1.35rem] shrink-0" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"
        />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.78rem] font-medium uppercase tracking-[0.12em] opacity-0 transition-[max-width,opacity,margin] duration-500 ease-(--ease-out-quart) group-hover:ml-3 group-hover:max-w-[10rem] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[10rem] group-focus-visible:opacity-100">
        Escribinos
      </span>
    </a>
  );
}
