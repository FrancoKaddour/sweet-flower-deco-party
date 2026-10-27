"use client";

import { useEffect, useState } from "react";
import { italica } from "@/components/ui/fuentes";

/**
 * TESTIMONIOS — una sola cita grande en Cormorant itálica light que alterna
 * (D-09), sin tarjetas ni avatares de iniciales.
 *
 * HOY NO SE MUESTRA: las citas que había eran inventadas. Flor tiene 8–10
 * testimonios reales (nombre, ciudad, captura de WhatsApp — CONTENIDO_FLOR §12)
 * que todavía no mandó. Mientras la lista esté vacía, la sección no renderiza
 * nada; la prueba social verificable vive en Workshops (sedes, fechas y
 * asistentes reales).
 * TODO(contenido): cargar acá los testimonios REALES con permiso de publicación
 * y sumar en app/(site)/page.tsx <Testimonios /> después de <Workshops />.
 */
type Testimonio = { cita: string; nombre: string; ciudad: string };
const TESTIMONIOS: readonly Testimonio[] = [];

export function Testimonios() {
  const [i, setI] = useState(0);
  const total = TESTIMONIOS.length;

  useEffect(() => {
    if (total < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % total), 7000);
    return () => window.clearInterval(id);
  }, [total]);

  if (!total) return null;
  const t = TESTIMONIOS[i];
  return (
    <section id="testimonios" data-theme="light" className="bg-sand px-6 py-28 text-ink md:px-10 md:py-40">
      <figure className="mx-auto max-w-[87.5rem]" aria-live="polite">
        <blockquote
          key={i}
          className={`${italica.className} t-voz-cita max-w-[24ch] text-[length:var(--text-step-5)] leading-[1.08] text-ink`}
        >
          “{t.cita}”
        </blockquote>
        <figcaption className="mt-8 text-[length:var(--text-step-0)] text-ink/75">
          {t.nombre}, {t.ciudad}
        </figcaption>
      </figure>
    </section>
  );
}
