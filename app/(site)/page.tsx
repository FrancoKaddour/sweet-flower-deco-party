import type { Metadata } from "next";
import { getDestacados } from "@/modules/catalog/repository";
import { seleccionarDestacados } from "@/modules/catalog/destacados";
import { ColorBridge } from "@/components/site/ColorBridge";
import { Hero } from "@/components/sections/Hero";
import { Experiencia } from "@/components/sections/Experiencia";
import { Productos } from "@/components/sections/Productos";
import { Destacados } from "@/components/sections/Destacados";
import { Servicio } from "@/components/sections/Servicio";
import { SummitHome } from "@/components/sections/SummitHome";
import { Workshops } from "@/components/sections/Workshops";
import { Testimonios } from "@/components/sections/Testimonios";
import { Contacto } from "@/components/sections/Contacto";

// Fondos de las secciones claras (para blendear esas transiciones). Referencian
// los tokens de @theme (app/globals.css) → única fuente de verdad; ColorBridge
// interpola en oklab con estos var(). Los momentos oscuros (Experiencia verde,
// Footer tinta) van con CORTE LIMPIO. Inicio recortado: Historia y Principios viven
// en /historia. Membresía se sacó (oct-2026: simplificar).
// El Header y el Footer los aporta app/(site)/layout.tsx (chrome compartido).
const BONE = "var(--color-bone)";
const BLUSH = "var(--color-blush)";
const SAND = "var(--color-sand)";

// La home usa título/OG del layout; solo fija su canonical.
export const metadata: Metadata = { alternates: { canonical: "/" } };

// Se regenera cada 5 min y al instante cuando se edita el catálogo en el panel.
export const revalidate = 300;

export default async function Home() {
  const destacados = seleccionarDestacados(await getDestacados());
  return (
    <main id="main" className="bg-bone">
      <Hero />
      {/* Experiencia (marfil): las esquinas redondeadas del hero asoman sobre marfil */}
      <Experiencia />
      {/* Event Summit: prioridad de la clienta → arriba, después de "El arte de crear" */}
      <SummitHome />
      <Productos />
      <Destacados items={destacados} />
      <ColorBridge from={BONE} to={BLUSH} />
      <Servicio />
      <ColorBridge from={BLUSH} to={BONE} />
      <Workshops />
      <ColorBridge from={BONE} to={SAND} />
      <Testimonios />
      <ColorBridge from={SAND} to={BONE} />
      <Contacto />
    </main>
  );
}
