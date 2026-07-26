import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ColorBridge } from "@/components/site/ColorBridge";
import { Hero } from "@/components/sections/Hero";
import { Experiencia } from "@/components/sections/Experiencia";
import { Productos } from "@/components/sections/Productos";
import { Destacados } from "@/components/sections/Destacados";
import { Principios } from "@/components/sections/Principios";
import { Servicio } from "@/components/sections/Servicio";
import { Workshops } from "@/components/sections/Workshops";
import { Testimonios } from "@/components/sections/Testimonios";
import { Membresia } from "@/components/sections/Membresia";
import { Historia } from "@/components/sections/Historia";
import { Contacto } from "@/components/sections/Contacto";

// Fondos de las secciones claras (para blendear esas transiciones). Los momentos
// oscuros (Experiencia verde, Membresía bordó, Footer tinta) van con CORTE LIMPIO.
const BONE = "#f7f3ec";
const SAGE = "#e7eadf";
const BLUSH = "#f4e9e4";
const SAND = "#efe7d6";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        {/* Verde a sangre: corte limpio con las secciones marfil (sin puente) */}
        <Experiencia />
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
      <Footer />
    </>
  );
}
