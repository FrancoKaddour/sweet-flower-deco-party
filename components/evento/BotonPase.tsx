"use client";

import type { PaseId } from "@/content/evento";
import { EVENTO_ELEGIR_PASE } from "./SummitInscripcion";

/** CTA de cada pase: preselecciona el pase en el formulario y baja hasta él. */
export function BotonPase({ pase, className, children }: { pase: PaseId; className: string; children: React.ReactNode }) {
  return (
    <a
      href="#inscripcion"
      onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_ELEGIR_PASE, { detail: pase }))}
      className={className}
    >
      {children}
    </a>
  );
}
