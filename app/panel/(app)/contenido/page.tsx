import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { EmptyState } from "@/components/panel/EmptyState";
import { getMockBloquesContenido } from "@/lib/panel/mock";

// Un bloque está "en cero" cuando su conteo arranca con 0 (ej. "0 cargados").
// Se muestra con el patrón de estado vacío para que Gonzalo/Flor vean cómo luce
// un módulo sin contenido y su CTA de "cargar el primero".
function estaVacio(conteo: string): boolean {
  return /^0\b/.test(conteo.trim());
}

export const metadata: Metadata = { title: "Contenido" };

// Contenido — tres bloques de acceso: Eventos/Ediciones, Testimonios y Textos
// del sitio. Cada card enchufa a su propia colección de Payload.
export default function ContenidoPage() {
  // 🔌 GONZALO: reemplazá getMockBloquesContenido() por conteos reales de cada
  // colección (Events, Testimonials) y el global Site.
  const bloques = getMockBloquesContenido();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        titulo="Contenido"
        descripcion="Lo que Flor edita sin tocar código: eventos, testimonios y textos del sitio."
      />

      <PlugHint coleccion="Events · Testimonials · Site (global)">
        Cada tarjeta abre un ABM sobre su colección. Los textos del sitio son un{" "}
        <strong>global</strong> de Payload (home, contacto, redes) — hoy están
        como <code className="font-mono">TODO(contenido)</code> en el código.
      </PlugHint>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {bloques.map((b) => {
          const vacio = estaVacio(b.conteo);
          return (
            <article
              key={b.id}
              className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-line bg-cloud p-6"
            >
              <div className="flex-1">
                <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-champagne">
                  {b.coleccion}
                </p>
                <h2 className="mt-2 font-display text-[length:var(--text-step-1)] font-semibold text-ink">
                  {b.titulo}
                </h2>
                <p className="mt-2 text-[length:var(--text-step--1)] text-muted">
                  {b.descripcion}
                </p>
              </div>

              {vacio ? (
                // Módulo en cero → patrón de estado vacío con CTA de "cargar el
                // primero" (así Gonzalo ve cómo luce un módulo sin contenido).
                <EmptyState
                  titulo="Nada cargado todavía"
                  descripcion={`Cuando cargues ${b.titulo.toLowerCase()}, van a aparecer acá.`}
                  accion={
                    // 🔌 GONZALO: abrir el ABM de alta de la colección (hoy self-href mock).
                    <PanelButton
                      href={b.href}
                      variant="outline"
                      className="px-4"
                      title={`Pendiente: cargar ${b.titulo}`}
                    >
                      Cargar el primero
                    </PanelButton>
                  }
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[length:var(--text-step--1)] text-muted">
                    {b.conteo}
                  </span>
                  {/* 🔌 GONZALO: abrir el ABM de la colección del bloque (hoy self-href mock). */}
                  <PanelButton
                    href={b.href}
                    variant="outline"
                    className="px-4"
                    title={`Pendiente: gestionar ${b.titulo}`}
                  >
                    Gestionar
                  </PanelButton>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
