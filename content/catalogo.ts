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

export type Categoria = {
  slug: string;
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
    slug: "hierro",
    index: "01",
    nombre: "Hierro",
    tagline: "Estructuras, arcos y bases para armar la escena.",
    desc: "El corazón de la campaña. Estructuras, arcos y bases que sostienen la escena y se arman una y otra vez.",
    incluye: ["Arcos extensibles", "Teloneras", "Arcadas", "Estructuras Ecos"],
    img: "https://picsum.photos/seed/sfdp-cat-hierro/1200/1500",
  },
  {
    slug: "catering",
    index: "02",
    nombre: "Catering",
    tagline: "Piezas que visten la mesa y el momento de servir.",
    desc: "Piezas que visten la mesa y el momento de servir. Presencia y terminación de nivel evento.",
    incluye: ["Eclipse", "Arcoíris", "Bases y soportes"],
    img: "https://picsum.photos/seed/sfdp-cat-catering/1200/1500",
  },
  {
    slug: "fundas-y-telas",
    index: "03",
    nombre: "Fundas & telas",
    tagline: "Textiles y telas sublimadas para vestir cada estructura.",
    desc: "Textiles y telas sublimadas para vestir cada estructura. Salen todas las semanas.",
    incluye: ["Fundas", "Telas sublimadas", "Terminaciones textiles"],
    img: "https://picsum.photos/seed/sfdp-cat-textil/1200/1500",
  },
  {
    slug: "pies-de-lampara",
    index: "04",
    nombre: "Pies de lámpara",
    tagline: "El detalle que ilumina y ordena el ambiente.",
    desc: "El detalle que ilumina y ordena el ambiente. Una de las piezas que más vuela hoy.",
    incluye: ["Pies altos", "Terminaciones a tono"],
    img: "https://picsum.photos/seed/sfdp-cat-lampara/1200/1500",
  },
] as const;
