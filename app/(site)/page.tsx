import { ColorBridge } from "@/components/site/ColorBridge";
import { Hero } from "@/components/sections/Hero";
import { Experiencia } from "@/components/sections/Experiencia";
import { Productos } from "@/components/sections/Productos";
import { Destacados } from "@/components/sections/Destacados";
import { Principios } from "@/components/sections/Principios";
import { Servicio } from "@/components/sections/Servicio";
import { SummitHome } from "@/components/sections/SummitHome";
import { Workshops } from "@/components/sections/Workshops";
import { Testimonios } from "@/components/sections/Testimonios";
import { Membresia } from "@/components/sections/Membresia";
import { Historia } from "@/components/sections/Historia";
import { Contacto } from "@/components/sections/Contacto";

// Fondos de las secciones claras (para blendear esas transiciones). Referencian
// los tokens de @theme (app/globals.css) → única fuente de verdad; ColorBridge
// interpola en oklab con estos var(). Los momentos oscuros (Experiencia verde,
// Membresía bordó, Footer tinta) van con CORTE LIMPIO.
// El Header y el Footer los aporta app/(site)/layout.tsx (chrome compartido).
const BONE = "var(--color-bone)";
const SAGE = "var(--color-sage)";
const BLUSH = "var(--color-blush)";
const SAND = "var(--color-sand)";

export default function Home() {
  return (
    <main id="main" className="bg-bone">
      <Hero />
      {/* Experiencia (marfil): las esquinas redondeadas del hero asoman sobre marfil */}
      <Experiencia />
      {/* Event Summit: prioridad de la clienta → arriba, después de "El arte de crear" */}
      <SummitHome />
      <Productos />
      <Destacados />
      <ColorBridge from={BONE} to={SAGE} />
      <Principios />
      <ColorBridge from={SAGE} to={BLUSH} />
      <Servicio />
      <ColorBridge from={BLUSH} to={BONE} />
      <Workshops />
      <ColorBridge from={BONE} to={SAND} />
      <Testimonios />
      {/* Bordó a sangre (corte limpio, momento premium) */}
      <Membresia />
      <Historia />
      <Contacto />
    </main>
  );
}
