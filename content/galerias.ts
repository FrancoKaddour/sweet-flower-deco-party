// Galerías de cada workshop / edición (páginas /event-summit/trayectoria/<slug>).
// Las que todavía no tienen fotos reales usan placeholders (picsum) con
// proporciones variadas para que la grilla se vea como va a quedar.
// TODO(contenido): fotos preseleccionadas de cada workshop (las manda Tobi).

export type Foto = { src: string; w: number; h: number; placeholder?: boolean };

const REALES: Record<string, Foto[]> = {
  "rio-cuarto": [
    { src: "/img/rio-cuarto/rc-01.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-02.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-03.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-04.webp", w: 1499, h: 1000 },
    { src: "/img/rio-cuarto/rc-05.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-06.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-07.webp", w: 1503, h: 1000 },
    { src: "/img/rio-cuarto/rc-08.webp", w: 1503, h: 1000 },
    { src: "/img/rio-cuarto/rc-09.webp", w: 1503, h: 1000 },
    { src: "/img/rio-cuarto/rc-10.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-11.webp", w: 1500, h: 1000 },
    { src: "/img/rio-cuarto/rc-12.webp", w: 1500, h: 1000 },
  ],
  "primera-edicion": [
    { src: "/img/summit/lg/sum-01.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-02.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-03.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-04.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-05.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-06.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-07.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-08.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-09.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-10.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-11.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-12.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-13.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-14.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-15.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-16.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-17.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-18.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-19.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-20.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-21.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-22.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-23.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-24.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-25.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-26.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-27.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-28.webp", w: 1080, h: 1350 },
    { src: "/img/summit/lg/sum-29.webp", w: 1080, h: 1350 },
    { src: "/img/summit/lg/sum-30.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-31.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-32.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-33.webp", w: 1200, h: 1800 },
    { src: "/img/summit/lg/sum-34.webp", w: 1080, h: 1350 },
    { src: "/img/summit/lg/sum-35.webp", w: 1800, h: 1200 },
    { src: "/img/summit/lg/sum-36.webp", w: 1201, h: 1800 },
  ],
};

// Ritmo editorial: verticales y horizontales alternadas.
const FORMAS: [number, number][] = [
  [900, 1200], [1200, 800], [900, 1100], [1200, 900], [900, 1300], [1200, 800],
  [900, 1200], [1100, 1100], [1200, 800], [900, 1200], [1200, 900], [900, 1100],
];

export function galeriaDe(slug: string): Foto[] {
  const reales = REALES[slug];
  if (reales?.length) return reales;
  return FORMAS.map(([w, h], i) => ({
    src: `https://picsum.photos/seed/sfdp-ws-${slug}-${i}/${w}/${h}`,
    w,
    h,
    placeholder: true,
  }));
}

/** Portada de la página: la foto de la tarjeta si es real, o la primera de la galería. */
export function portadaDe(slug: string, foto?: string): Foto {
  const g = galeriaDe(slug);
  if (foto) return g.find((f) => f.src === foto) ?? { src: foto, w: 1800, h: 1200 };
  return g[0];
}
