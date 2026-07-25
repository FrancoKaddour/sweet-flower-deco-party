# 06 · Sistema de diseño

> **Fuente de verdad de los tokens visuales del proyecto.** Todo componente, página y animación parte de acá.
> Para tokens de animación (duraciones, easings, delays), ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).
> Para las reglas de aplicación de estos tokens en componentes concretos, ver [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md).

---

## ⚠️ Estado: PROVISIONAL

**Los valores de color y las familias tipográficas de este documento son PROVISIONALES.**

Los definitivos vienen del **manual de marca** (pendiente de entrega por Flor) y del **logo vectorial**. Ver checklist en [`16_DECISIONS.md`](./16_DECISIONS.md).

Qué se reemplaza cuando llegue el manual:

- **Colores:** los `HEX/rgba` de las custom properties. Los **nombres semánticos** de los tokens (`--color-ink`, `--color-blush`, etc.) se mantienen; solo cambian los valores.
- **Tipografía:** hoy usamos fuentes **gratuitas que imitan** el registro editorial premium (Fraunces + Geist). Si el manual define fuentes propias/licenciadas, se cambian **las familias** en `next/font` y en el token `--font-display` / `--font-body`; el resto del sistema (escala, tracking, line-heights) no se toca.
- **Todo lo demás** (espaciado, radios, grid, contenedor, sombras, escala fluida) es **decisión de ingeniería de diseño** y **no depende** del manual: se mantiene salvo conflicto explícito.

> **Regla clave:** consumí siempre los tokens por su **nombre semántico** (variable CSS o clase Tailwind mapeada). **Nunca** escribas un `HEX` o un `px` suelto en un componente. Así, cuando llegue el manual, se cambia el valor en **un** lugar.

---

## 1. Principios visuales (el "porqué" del sistema)

El sistema traduce el mood de marca a reglas mecánicas:

| Atributo de marca | Traducción a sistema |
|---|---|
| Premium, editorial | Serif variable para display, mucho espacio negativo, escala tipográfica amplia. |
| Cinematográfico | Base clara dominante + momentos oscuros puntuales (no un tema oscuro global). |
| Cálido (flores/fiesta) | Tinta casi negra **cálida** (no `#000`), marfil/hueso de base, acento blush y champagne. **Nunca** grises fríos azulados tipo befesti. |
| Minimalista, atemporal | Paleta corta, radios sobrios, sombras casi imperceptibles, pocas reglas repetidas con disciplina. |
| Elegante | Contraste alto donde importa (texto), contraste suave en superficies. Detalles finos (`--color-line` al 12%). |

---

## 2. Color

### 2.1 Tokens canónicos (CSS custom properties)

Se definen en `:root` en el CSS global. **Provisional** hasta el manual de marca.

```css
:root {
  /* — Neutros cálidos — */
  --color-ink:    #14110F; /* tinta casi negra cálida · texto principal, titulares */
  --color-bone:   #F7F3EC; /* marfil/hueso · fondo base editorial */
  --color-cloud:  #FFFFFF; /* blanco puro · superficies elevadas, tarjetas */

  /* — Acentos — */
  --color-blush:      #E8C7C8; /* rosa floral romántico · acento cálido, fondos suaves */
  --color-botanical:  #2C3B32; /* verde profundo · acento opcional, detalles orgánicos */
  --color-bordeaux:   #5B2A3A; /* burdeos profundo · base de momentos oscuros */
  --color-champagne:  #C6A15B; /* dorado champagne · acento premium, hairlines, micro-detalles */

  /* — Derivados / utilitarios — */
  --color-muted: rgba(20, 17, 15, 0.55); /* texto secundario sobre fondo claro */
  --color-line:  rgba(20, 17, 15, 0.12); /* bordes finos, hairlines, divisores */
  --overlay:     rgba(0, 0, 0, 0.5);     /* velo sobre imágenes para legibilidad */
}
```

> Los derivados (`--color-muted`, `--color-line`) se construyen a partir de `--color-ink`. Si el manual cambia la tinta, **recalculá** estos rgba con la misma tinta para mantener la coherencia cálida.

### 2.2 Muestras y uso semántico

| Token | Muestra | Rol semántico | Reglas de uso |
|---|---|---|---|
| `--color-ink` | `#14110F` ⬛ | Texto principal, titulares, iconos sobre claro | Nunca uses `#000` puro. Esta tinta cálida es el "negro" de la marca. |
| `--color-bone` | `#F7F3EC` ⬜ | **Fondo base** de todo el sitio | El lienzo por defecto. Editorial, cálido, descansa la vista. |
| `--color-cloud` | `#FFFFFF` ⬜ | Superficies elevadas (tarjetas, inputs, menú overlay) | Crea jerarquía por contraste sutil contra `--color-bone`. |
| `--color-blush` | `#E8C7C8` 🌸 | Acento romántico, fondos de sección suaves, badges | Con moderación. En bloques grandes, texto siempre en `--color-ink`. |
| `--color-botanical` | `#2C3B32` 🌿 | Acento opcional, detalles orgánicos, fondos oscuros alternativos | Sobre él, texto en `--color-bone`. |
| `--color-bordeaux` | `#5B2A3A` 🍷 | Fondo de **momentos oscuros** puntuales (una sección, no todo) | Base para el "modo cinematográfico" cálido. Texto en `--color-bone`. |
| `--color-champagne` | `#C6A15B` ✨ | Acento premium: hairlines, subrayados, micro-detalles, badges "formación" | Es un **detalle**, no un fondo grande. Cuidado con contraste sobre claro (ver §7). |
| `--color-muted` | `rgba(...,.55)` | Texto secundario, captions, metadatos | Solo sobre `--color-bone`/`--color-cloud`. |
| `--color-line` | `rgba(...,.12)` | Bordes finos, divisores, tablas | Casi invisible. Estructura sin ruido. |
| `--overlay` | `rgba(0,0,0,.5)` | Velo sobre imágenes con texto encima | Ajustá opacidad si el texto no llega a AA. |

### 2.3 Pares de superficie (surface → contenido)

Combinaciones **validadas**. No inventes pares nuevos sin chequear contraste (§7).

| Superficie | Texto | Acento | Uso |
|---|---|---|---|
| `--color-bone` | `--color-ink` | `--color-champagne` / `--color-blush` | **Default** del sitio. |
| `--color-cloud` | `--color-ink` | `--color-botanical` | Tarjetas, formularios, overlay de menú. |
| `--color-bordeaux` | `--color-bone` | `--color-champagne` | Momento oscuro cálido (hero alterno, cierre). |
| `--color-botanical` | `--color-bone` | `--color-champagne` | Momento oscuro orgánico. |
| Imagen + `--overlay` | `--color-bone` | — | Hero con foto, texto encima. |

---

## 3. Tipografía

### 3.1 Familias (provisional)

- **Display / titulares → "Fraunces"**: serif editorial variable. Imita el registro de Canela / PP Editorial New. Pesos **300–500** para elegancia (evitar bold pesado en titulares grandes). Activar el eje óptico (`opsz`) alto en tamaños grandes.
- **Body / UI → "Geist"** (fallback **"Inter"**): sans neutro y legible. Pesos **400 / 500**.

Filosofía: **titulares grandes con mucho espacio negativo.** El contraste serif/sans hace el trabajo editorial; no hace falta decorar.

### 3.2 Carga con `next/font`

`app/fonts.ts`:

```ts
import { Fraunces, Geist } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"], // display: elegante, sin bold pesado
  style: ["normal", "italic"],   // itálica editorial para énfasis
  variable: "--font-display",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});
```

`app/layout.tsx`:

```tsx
import { fraunces, geist } from "./fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${fraunces.variable} ${geist.variable}`}>
      <body className="bg-bone text-ink font-body antialiased">{children}</body>
    </html>
  );
}
```

Y en el CSS global exponemos los tokens de familia:

```css
:root {
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Geist", "Inter", system-ui, -apple-system, sans-serif;
}
```

> `next/font` hostea las fuentes localmente (sin request a Google en runtime), evita layout shift con `size-adjust` y respeta el objetivo de CWV verde del proyecto. **No** cargues las fuentes por `<link>` ni por `@import`.

### 3.3 Escala tipográfica fluida (`clamp`)

Escala mobile → desktop, sin breakpoints, con `clamp(min, preferido-vw, max)`. Ratio ~1.2 en cuerpo, más amplia en display.

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.17vw, 0.94rem); /* captions, legales */
  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.13rem); /* cuerpo base */
  --step-1:  clamp(1.20rem, 1.10rem + 0.50vw, 1.50rem); /* lead / subtítulo */
  --step-2:  clamp(1.44rem, 1.25rem + 0.95vw, 2.00rem); /* H4 */
  --step-3:  clamp(1.73rem, 1.40rem + 1.65vw, 2.75rem); /* H3 */
  --step-4:  clamp(2.07rem, 1.55rem + 2.60vw, 3.75rem); /* H2 */
  --step-5:  clamp(2.49rem, 1.65rem + 4.20vw, 5.25rem); /* H1 sección */
  --step-6:  clamp(2.99rem, 1.60rem + 6.95vw, 7.50rem); /* display hero */
}
```

Mapa semántico:

| Token | Uso | Familia | Peso |
|---|---|---|---|
| `--step-6` | Display hero (una vez por página) | Display | 300–400 |
| `--step-5` | H1 de sección | Display | 300–400 |
| `--step-4` | H2 | Display | 400 |
| `--step-3` | H3 | Display | 400–500 |
| `--step-2` | H4 / destacados | Display o Body | 500 |
| `--step-1` | Lead / bajada | Body | 400 |
| `--step-0` | Cuerpo | Body | 400 |
| `--step--1` | Caption, legal, metadatos | Body | 400–500 |

### 3.4 Line-height y tracking

Regla editorial: **cuanto más grande el texto, más apretado el line-height y más negativo el tracking.**

```css
:root {
  --leading-display: 0.95; /* titulares grandes: casi tocándose */
  --leading-tight:   1.10;
  --leading-snug:    1.25;
  --leading-normal:  1.55; /* cuerpo: cómodo para lectura larga */

  --tracking-display: -0.02em; /* -2%: aire justo en serif grande */
  --tracking-tight:   -0.01em;
  --tracking-normal:   0em;
  --tracking-wide:     0.14em; /* MAYÚSCULAS de labels/badges */
}
```

| Contexto | Line-height | Tracking |
|---|---|---|
| Display hero (`--step-5/6`) | `--leading-display` | `--tracking-display` |
| Títulos (`--step-2/4`) | `--leading-tight` | `--tracking-tight` |
| Lead (`--step-1`) | `--leading-snug` | `--tracking-normal` |
| Cuerpo (`--step-0`) | `--leading-normal` | `--tracking-normal` |
| Labels/eyebrows en MAYÚSCULA | `--leading-snug` | `--tracking-wide` |

Ejemplo de clase utilitaria (globals.css con `@layer`):

```css
@layer components {
  .u-display {
    font-family: var(--font-display);
    font-size: var(--step-6);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
    font-weight: 300;
  }
  .u-eyebrow {
    font-family: var(--font-body);
    font-size: var(--step--1);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-muted);
  }
}
```

---

## 4. Espaciado

Base **4px**. Escala en tokens `--space-1 … --space-11`.

```css
:root {
  --space-1:  0.25rem; /*   4px */
  --space-2:  0.5rem;  /*   8px */
  --space-3:  0.75rem; /*  12px */
  --space-4:  1rem;    /*  16px */
  --space-5:  1.5rem;  /*  24px */
  --space-6:  2rem;    /*  32px */
  --space-7:  3rem;    /*  48px */
  --space-8:  4rem;    /*  64px */
  --space-9:  6rem;    /*  96px */
  --space-10: 8rem;    /* 128px */
  --space-11: 10rem;   /* 160px */
}
```

Guía de uso:

| Rango | Uso típico |
|---|---|
| `--space-1/3` | Gaps internos de componentes, padding de badges, gap texto-icono. |
| `--space-4/6` | Padding de botones/inputs/tarjetas, gap entre elementos de una lista. |
| `--space-7/8` | Separación entre bloques dentro de una sección. |
| `--space-9/11` | **Ritmo vertical entre secciones** (el espacio negativo premium vive acá). |

> El espacio negativo es una **decisión de diseño**, no relleno. Secciones respirando con `--space-9/11` en desktop es lo que da el aire editorial. Ver [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md).

---

## 5. Radios

```css
:root {
  --radius-sm:   8px;   /* inputs, badges, botones chicos */
  --radius-md:   16px;  /* tarjetas, contenedores medios */
  --radius-lg:   24px;  /* imágenes grandes, bloques hero */
  --radius-pill: 999px; /* botones pill, chips, avatares */
}
```

Regla: radios **sobrios y consistentes**. No mezclar 3 radios distintos en un mismo componente. Imágenes editoriales grandes pueden ir a `--radius-lg` o **sin radio** (borde recto = más editorial/serio).

---

## 6. Grid, contenedor y elevación

### 6.1 Contenedor

```css
:root {
  --container-max: 1440px;
  --container-pad: clamp(1.25rem, 5vw, 6rem); /* 20px → 96px lateral */
}

.u-container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
}
```

Padding lateral **generoso y fluido**: en mobile respira, en desktop grande enmarca sin pegarse a los bordes.

### 6.2 Grid de 12 columnas (desktop)

```css
.u-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-5); /* 24px */
}
```

En mobile, colapsar a 1 columna (o 4/6 columnas según densidad). El grid de 12 columnas existe para **romper la simetría** con intención (ver "nunca repetir layout" en [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md)): una imagen a `col-span-7`, texto a `col-span-4 col-start-9`, etc.

### 6.3 Elevación / sombras

Premium = sombras **casi imperceptibles**. Nada de drop-shadows marcadas. La jerarquía viene del color de superficie y el espacio, no de sombras dramáticas.

```css
:root {
  --shadow-xs: 0 1px 2px rgba(20, 17, 15, 0.04);
  --shadow-sm: 0 2px 8px rgba(20, 17, 15, 0.06);
  --shadow-md: 0 12px 32px -12px rgba(20, 17, 15, 0.12);
  --shadow-lg: 0 24px 64px -24px rgba(20, 17, 15, 0.18); /* menú overlay, modales */
}
```

| Token | Uso |
|---|---|
| `--shadow-xs` | Reposo de inputs/tarjetas planas. |
| `--shadow-sm` | Tarjetas sobre `--color-bone`. |
| `--shadow-md` | Hover de tarjeta de producto/evento. |
| `--shadow-lg` | Overlay de menú, modales, elementos flotantes. |

> Las sombras usan la **tinta cálida** con baja opacidad, no negro puro. Coherencia con la paleta.

---

## 7. Accesibilidad de contraste (AA / AAA)

Objetivo mínimo **WCAG 2.1 AA**; **AAA** en texto de cuerpo largo siempre que sea posible. Ver también la skill de accessibility-audit y [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md).

Umbrales:

- **AA:** ≥ **4.5:1** texto normal · ≥ **3:1** texto grande (≥ 24px o ≥ 18.66px bold) y UI/bordes.
- **AAA:** ≥ **7:1** texto normal · ≥ **4.5:1** texto grande.

Ratios de los pares clave (provisional, recalcular al cambiar valores):

| Par | Ratio aprox. | Veredicto |
|---|---|---|
| `--color-ink` sobre `--color-bone` | ~15.5:1 | ✅ AAA. Par principal. |
| `--color-ink` sobre `--color-cloud` | ~17:1 | ✅ AAA. |
| `--color-muted` sobre `--color-bone` | ~5.2:1 | ✅ AA (normal), ✅ AAA (grande). Solo texto secundario. |
| `--color-bone` sobre `--color-bordeaux` | ~9:1 | ✅ AAA. Momentos oscuros. |
| `--color-bone` sobre `--color-botanical` | ~10:1 | ✅ AAA. |
| `--color-champagne` sobre `--color-bone` | ~2:1 | ❌ **No** para texto. Solo hairlines/detalle decorativo. |
| `--color-ink` sobre `--color-blush` | ~10:1 | ✅ AAA. Blush como fondo con texto ink. |
| `--color-champagne` sobre `--color-ink` | ~6.5:1 | ✅ AA. Champagne como texto **solo** sobre fondo oscuro. |

Reglas duras:

1. **Champagne nunca es texto sobre fondo claro.** Es acento/hairline. Como texto, solo sobre `--color-ink`/`--color-bordeaux`/`--color-botanical`.
2. **Texto sobre imagen** siempre lleva `--overlay` (o gradiente) que garantice ≥ 4.5:1 en la zona del texto. Verificar en la foto más clara.
3. El **foco visible** no es opcional: outline con `--color-ink` (o `--color-champagne` sobre oscuro), ≥ 2px, con offset. Nunca `outline: none` sin reemplazo.
4. No transmitir información **solo por color** (estados de form, disponibilidad): sumar icono/texto.
5. Todo lo anterior se **revalida** cuando llegue el manual de marca: si un color cambia, correr de nuevo el chequeo de contraste antes de mergear.

---

## 8. Mapeo a `tailwind.config.ts`

Extendemos el theme apuntando a las **custom properties**. Así Tailwind y CSS comparten la misma fuente de verdad, y un cambio en `:root` se propaga a todo.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        bone: "var(--color-bone)",
        cloud: "var(--color-cloud)",
        blush: "var(--color-blush)",
        botanical: "var(--color-botanical)",
        bordeaux: "var(--color-bordeaux)",
        champagne: "var(--color-champagne)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      fontSize: {
        "step--1": "var(--step--1)",
        "step-0": "var(--step-0)",
        "step-1": "var(--step-1)",
        "step-2": "var(--step-2)",
        "step-3": "var(--step-3)",
        "step-4": "var(--step-4)",
        "step-5": "var(--step-5)",
        "step-6": "var(--step-6)",
      },
      lineHeight: {
        display: "var(--leading-display)",
        tight: "var(--leading-tight)",
        snug: "var(--leading-snug)",
        normal: "var(--leading-normal)",
      },
      letterSpacing: {
        display: "var(--tracking-display)",
        tight: "var(--tracking-tight)",
        wide: "var(--tracking-wide)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
        11: "var(--space-11)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
    },
  },
  plugins: [],
};

export default config;
```

> Ojo con el mapeo de `spacing`: sobrescribe la escala default de Tailwind por índices numéricos. Si preferís **convivir** con la escala nativa de Tailwind, prefijá los tokens (ej. `s-1`, `s-2`) en `extend.spacing`. Decisión de proyecto: usamos índices propios porque toda medida debe salir de la escala de 4px.

Uso en JSX:

```tsx
<section className="u-container py-9">
  <p className="u-eyebrow mb-3">Eventos</p>
  <h2 className="font-display text-step-5 leading-display tracking-display text-ink">
    Cada fiesta, una escenografía.
  </h2>
  <p className="mt-5 max-w-[42ch] font-body text-step-1 text-muted">
    Bajada editorial con medida de línea controlada para lectura cómoda.
  </p>
</section>
```

---

## 9. Checklist de adopción

- [ ] Todas las custom properties de §2–6 viven en un único `globals.css` (`:root`).
- [ ] `tailwind.config.ts` apunta a las variables (§8), no a valores literales.
- [ ] Ningún componente tiene `HEX` o `px` hardcodeado (salvo casos justificados y comentados).
- [ ] Fuentes cargadas con `next/font` (§3.2), nunca por `<link>`/`@import`.
- [ ] Pares de color validados contra §7 (AA mínimo, AAA en cuerpo).
- [ ] Foco visible en todo elemento interactivo.
- [ ] Al llegar el manual de marca: cambiar solo **valores** (no nombres), re-chequear contraste, actualizar el banner "PROVISIONAL" de este doc.

---

**Relacionados:** [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) · [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md) · [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md) · [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md) · [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)
