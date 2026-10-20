// Fuente única de las CATEGORÍAS del catálogo (placeholder de diseño).
// La consumen la Home (sección Productos) y la página /productos, para que los
// slugs y nombres NO se desincronicen entre pantallas.
//
// TAXONOMÍA — DECISIÓN ABIERTA (placeholder). docs/04_SITE_ARCHITECTURE.md
// propone categorías por material (hierro · mdf · madera · fundas-y-telas), pero
// docs/CONTENIDO_FLOR.md aclara que MDF/madera casi no se trabajan y la campaña
// real es hierro + catering + fundas/telas + pies de lámpara. La taxonomía final
// la define Flor con Gonzalo (afecta los slugs de /productos/[categoria] y el
// schema del panel). Hasta entonces, este archivo es lo ÚNICO a editar.
// TODO(contenido): confirmar categorías, textos y foto representativa por cat.

/** Las dos líneas del negocio (pedido de Flor, §18): Catering y Ambientación. */
export type Linea = "catering" | "ambientacion";

export type Categoria = {
  slug: string;
  linea: Linea;
  index: string;
  nombre: string;
  /** Bajada corta — para las cards de la Home. */
  tagline: string;
  /** Bajada larga — para el catálogo raíz. */
  desc: string;
  /** Micro-lista de lo que se encuentra dentro (señales concretas). */
  incluye: readonly string[];
  img: string;
};

export const CATEGORIAS: readonly Categoria[] = [
  {
    slug: "catering",
    linea: "catering",
    index: "01",
    nombre: "Catering",
    tagline: "Exhibidores, alzadas y piezas para el momento de servir.",
    desc: "Estanterías, alzadas, torres de cupcakes, bandejas y bases para mesas dulces y catering. Lo que más sale hoy.",
    incluye: ["Estanterías", "Alzadas", "Torres de cupcakes", "Bandejas y bases"],
    img: "/productos/estanteria-eclipse.jpg",
  },
  {
    slug: "hierro",
    linea: "ambientacion",
    index: "02",
    nombre: "Hierro",
    tagline: "Arcos, arcadas, columnas y estructuras para armar la escena.",
    desc: "Arcos extensibles, arcadas, aros, columnas, mesas y sillones de hierro. En blanco, negro, dorado, plateado o rosa gold.",
    incluye: ["Arcos extensibles", "Arcadas", "Aros", "Columnas", "Mesas y sillones"],
    img: "/productos/arco-extensible-esencial.jpg",
  },
  {
    slug: "fundas-y-telas",
    linea: "ambientacion",
    index: "03",
    nombre: "Fundas & telas",
    tagline: "Fundas y telas sublimadas para vestir cada estructura.",
    desc: "Fundas a medida para aros, arcadas, cilindros y mesas, telas y pisos. Salen todas las semanas.",
    incluye: ["Fundas para aros", "Fundas para arcadas", "Fundas para mesas", "Telas y pisos"],
    img: "/productos/funda-aro-2m.jpg",
  },
  {
    slug: "mdf",
    linea: "ambientacion",
    index: "04",
    nombre: "MDF",
    tagline: "Paneles, siluetas y piezas temáticas.",
    desc: "Paneles, arcadas, siluetas temáticas y piezas en MDF, pintadas o sin pintar.",
    incluye: ["Paneles", "Siluetas temáticas", "Cubos y bases"],
    img: "/productos/arcada-arcoiris.jpg",
  },
  {
    slug: "madera",
    linea: "ambientacion",
    index: "05",
    nombre: "Madera",
    tagline: "Paneles, mesas y mobiliario de pino.",
    desc: "Paneles, mesas, cómodas y mobiliario de pino para ambientar.",
    incluye: ["Paneles", "Mesas", "Mobiliario"],
    img: "/productos/panel-arcada-140x60.jpg",
  },
] as const;
