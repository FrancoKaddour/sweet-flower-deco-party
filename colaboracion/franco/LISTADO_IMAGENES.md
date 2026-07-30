# Listado de imágenes — qué pedirle a Flor y dónde va cada una

> Censo real de **todos los slots de imagen** del sitio (hoy placeholders de picsum)
> y el pedido ordenado para Flor. Parte A = se le manda a Flor tal cual.
> Parte B = mapa técnico nuestro (slot → carpeta) para distribuir cuando llegue.
> Regla de Flor: *"producto sin buena foto, no se sube"* — mismo criterio acá.

---

## PARTE A — El pedido para Flor (mandar tal cual, 6 carpetas)

**Cómo mandarlas:** una carpeta de Drive con estas 6 subcarpetas. Nombres simples,
sin editar ni achicar: **originales de la cámara/celu** (nosotros las optimizamos).
Regla de oro: mejor **verticales** (el sitio es mobile-first) y con buena luz.

### 📁 01_LOGO
- El logo en **vector** (AI, SVG o PDF). Si no existe vector, el archivo más
  grande que tengan (PNG de alta).

### 📁 02_PRODUCTOS (los primeros: la selección con Tobías)
- Por cada producto elegido, **2 a 3 fotos**: una con **fondo limpio/neutro**
  (la principal) y una o dos **montadas en un evento real**.
- Arrancar por los 6 que más se venden: **Eclipse, Arcoíris, Telonera S,
  Arcos extensibles, Ecos, Pies de lámpara** (+ fundas y telas sublimadas).
- Vertical u cuadrada. Que la pieza se vea entera.

### 📁 03_EVENTOS_MONTADOS (las ambientaciones)
- **20 a 25 de las mejores fotos** de eventos decorados por Sweet Flowers:
  escenas completas, detalles de telas, mesas, arcos con globos, luz linda.
- Mezcla de verticales (la mayoría) y algunas horizontales.
- Estas alimentan casi todo el sitio: la home, los principios, el carrusel,
  la membresía. Cuantas más, mejor elegimos.

### 📁 04_SUMMIT (el evento de formación)
- **10 a 15 fotos** de las ediciones pasadas: el salón lleno, gente trabajando,
  disertantes en escena, detalles.
- Si se puede, **al menos 1 por sede**: Centro Naval, Madero Tango, La Rioja,
  Río Cuarto, Palacio San Miguel, La Rural. (La 7ª sede no la usamos.)
- Una foto **épica horizontal** del salón lleno (va gigante de fondo).

### 📁 05_FLOR_Y_EQUIPO
- **2-3 retratos de Flor** (en el taller o en un evento, natural, vertical).
- **3-4 del oficio**: manos cosiendo, soldando, armando, textura de telas.
- 1-2 del **equipo** (si deciden mostrarse — a definir).

### 📁 06_TESTIMONIOS
- Las **8-10 capturas de WhatsApp** de alumnas (con nombre y ciudad).
- Si alguna alumna presta una **foto de su cara** (chiquita, cuadrada), suma
  muchísimo para ponerla junto a su testimonio.

> **Total aproximado: 50-70 fotos.** No hace falta todo junto: el orden ideal es
> 01 → 03 → 04 → 05 → 02 → 06. Con las primeras 3 carpetas el sitio ya cambia
> de cara por completo.

---

## PARTE B — Mapa técnico: slot por slot (para nosotros)

Cada fila = un slot real del código (hoy `picsum`). "Fuente" = carpeta de Flor.

### Home (`app/(site)/page.tsx`)
| Slot | Archivo | Cant. | Proporción | Mín. px | Fuente |
|---|---|---|---|---|---|
| Galería en movimiento (Experiencia) | `sections/Experiencia.tsx` | 7 | verticales variadas (~3:4) | 800×1100 | 03 |
| Colecciones (caída CANCAN) | `content/catalogo.ts` → `sections/Productos.tsx` | 3 de 4 | 8:11 vertical | 800×1100 | 03 (una por material) |
| Destacados (tienda) | `sections/Destacados.tsx` | 6 | 4:5 | 700×880 | 02 (fondo limpio) |
| Principios | `sections/Principios.tsx` | 3 | ~4:5 | 860×1050 | 03 |
| Carrusel Servicio | `sections/Servicio.tsx` | 6 | 3:4 | 600×800 | 03 |
| Collage Workshops | `sections/Workshops.tsx` | 42 slots (se repiten ~15-20 fotos) | 2:3 | 500×750 | 04 + 03 |
| Testimonios (avatares) | `sections/Testimonios.tsx` | 3 | cuadrada | 240×240 | 06 |
| Membresía (retrato) | `sections/Membresia.tsx` | 1 | 4:5 | 800×1000 | 03 ó 05 |
| Historia (retrato + detalle) | `sections/Historia.tsx` | 2 | 4:5 + cuadrada | 800×1000 / 500×500 | 05 |
| Hero | — (hoy tipográfico) | 0 | — | — | (futuro: video/foto 03) |

### Productos (`/productos` + `/productos/[categoria]`)
| Slot | Archivo | Cant. | Proporción | Mín. px | Fuente |
|---|---|---|---|---|---|
| Foto por categoría (se usa en raíz + categoría) | `content/catalogo.ts` | 4 | 4:5 | 1200×1500 | 03 (la mejor por material) |
| Grilla de productos (cuando exista) | panel/DB de Gonzalo | por producto | 4:5 | 1400×1750 | 02 |

### Evento (`/evento`)
| Slot | Archivo | Cant. | Proporción | Mín. px | Fuente |
|---|---|---|---|---|---|
| Hero full-bleed (duotono) | `evento/EventoHero.tsx` | 1 | vertical/cover | 1920×2400 | 04 (la más épica) |
| "La experiencia" | `app/(site)/evento/page.tsx` | 1 | 5:4 | 1200×1400 | 04 |
| Sedes (scroll horizontal) | `evento/EdicionesScroll.tsx` | 6 | 3:4 | 900×1200 | 04 (una por sede) |
| Cierre full-bleed | `app/(site)/evento/page.tsx` | 1 | apaisada | 1920×1400 | 04 (salón lleno) |
| Disertantes | (slots de intriga, sin foto) | 0 → 3 | 4:5 | 700×880 | cuando se confirmen |

### Membresía (`/membresia`)
| Slot | Archivo | Cant. | Proporción | Mín. px | Fuente |
|---|---|---|---|---|---|
| Arcos del umbral | `membresia/HeroUmbral.tsx` | 4 | 2:3 vertical | 600×900 | 03 |
| El portal | `membresia/ArcoPortal.tsx` | 1 | 3:4.4 vertical | 700×1000 | 03/04 (interior cálido) |
| Ventana de beneficios | `membresia/BeneficiosVentana.tsx` | 5 (una por beneficio) | 3:4.2 | 700×1000 | 03 + 04 + 05 |

### Historia (`/historia`)
| Slot | Archivo | Cant. | Proporción | Mín. px | Fuente |
|---|---|---|---|---|---|
| Retrato en arco | `app/(site)/historia/page.tsx` | 1 | 3:4 | 700×1000 | 05 (Flor) |

### Extras (los hacemos nosotros con material de Flor)
| Pieza | Nota |
|---|---|
| OG image (`app/opengraph-image.tsx`) | Hoy generada tipográfica; con foto real la rediseñamos. |
| Favicon / logo header | Del vector de 01_LOGO. |
| Capturas de testimonios | Se transcriben (no se publican las capturas crudas); avatar opcional. |

### Reglas al distribuir (cuando llegue el material)
1. **Optimizar siempre**: exportar a WebP/AVIF vía `next/image` — nosotros solo
   necesitamos el original grande; NUNCA subir al repo originales de >4MB sin
   pasar por imports estáticos (`width/height` + `blurDataURL` automáticos).
2. Al migrar un slot: **quitar el dominio picsum** de `next.config.ts` cuando no
   quede ninguno, y borrar el `TODO(contenido)` correspondiente.
3. `alt` real y descriptivo en cada foto (accesibilidad + SEO) — nada de `alt=""`
   salvo decorativas puras.
4. Duotono del Evento: las fotos van igual — el tinte lo pone el CSS; elegir
   fotos con buen contraste.
5. Collage Workshops: repetir fotos está bien (42 slots ≠ 42 fotos); que no se
   repitan dos iguales en la misma columna.
