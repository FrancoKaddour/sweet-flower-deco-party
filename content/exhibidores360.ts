/**
 * Exhibidores con giro 360° (renders de Tobías). Cada uno es una secuencia de
 * cuadros en /public/360/<slug>/000.webp … (una vuelta completa) que el
 * componente Giro360 dibuja según el scroll.
 *
 * Para sumar uno nuevo: exportar la vuelta como cuadros (fondo #f4f2f0,
 * 800 px de ancho, mismo encuadre), copiarlos a /public/360/<slug>/ y
 * agregar la entrada acá. Si en el panel existe un producto de Catering con
 * el mismo slug, su ficha muestra el giro automáticamente.
 */
export type Giro = {
  slug: string;
  nombre: string;
  bajada: string;
  medidas: { k: string; v: string }[];
  detalle: string[];
  /** Cantidad de cuadros de la vuelta (000 … n-1). */
  cuadros: number;
};

/** Color de fondo de los renders: la sección usa el mismo para que no se note el recorte. */
export const FONDO_RENDER = "#f4f2f0";

export const GIROS: Giro[] = [
  {
    slug: "torre-nativa",
    nombre: "Torre Nativa",
    bajada: "Tres niveles de madera sobre una estructura de hierro, con base para vasos o copas.",
    medidas: [
      { k: "Ancho", v: "41 cm" },
      { k: "Alto", v: "35 cm" },
      { k: "Profundidad", v: "15 cm" },
    ],
    detalle: [
      "3 superficies de madera de 20 × 15 cm",
      "Placa metálica perforada de 20 × 15 cm con cuatro agujeros",
    ],
    cuadros: 96,
  },
  {
    slug: "luna-nova",
    nombre: "Luna Nova",
    bajada: "Una media luna de hierro que abraza tres escalones de madera. Para mesas dulces que se recuerdan.",
    medidas: [
      { k: "Ancho", v: "40 cm" },
      { k: "Alto", v: "41 cm" },
      { k: "Profundidad", v: "12 cm" },
    ],
    detalle: ["Superficies de madera de 37 × 12, 25 × 12 y 12 × 12 cm"],
    cuadros: 96,
  },
];

export const giroDe = (slug: string) => GIROS.find((g) => g.slug === slug);

export const cuadroSrc = (slug: string, i: number) => `/360/${slug}/${String(i).padStart(3, "0")}.webp`;
