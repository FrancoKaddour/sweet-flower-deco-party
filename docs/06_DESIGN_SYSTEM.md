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
- **Tipografía:** hoy usamos fuentes **gratuitas** (Cormorant Garamond + Hanken Grotesk; ver §3). Si el manual define fuentes propias/licenciadas, se cambian **las familias** en `next/font` y en el token `--font-display` / `--font-body`; el resto del sistema (escala, tracking, line-heights) no se toca.
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

> Actualizado 27/10/2026 (auditoría D-07 / T-05). Fuente de verdad: `app/globals.css` (`@theme`).

### 2.1 Tokens reales

| Token | HEX | Uso |
|---|---|---|
| `--color-ink` | `#14110f` | Texto principal, fondos oscuros (hero, footer, Summit) |
| `--color-bone` | `#f7f3ec` | Base clara del sitio |
| `--color-wine` | `#7A1218` | **El único rojo de fondo** (newsletter, bloques destacados, /historia "Cómo trabajamos") |
| `--color-brand-red` | `#ED1C23` | Rojo del logo: **solo acento** (globos, puntos, hover, chips chicos). Nunca fondo de bloque ni texto largo (bone encima = 3,96:1) |
| `--color-champagne` | `#c6a15b` | Dorado: **solo sobre fondos oscuros** (7,75:1 sobre ink) |
| `--color-champagne-ink` | `#7d5f25` | Dorado para texto sobre claros (5,4:1 sobre bone, 4,8:1 sobre sand) |
| `--color-rose-50` | `#fde8e9` | Superficie rosada muy clara |
| `--color-blush` / `--color-sand` | `#f4e9e4` / `#efe7d6` | Superficies claras que se funden con `ColorBridge` |
| `--color-muted` | `#736d64` | Texto atenuado (4,63:1 sobre bone) |
| `--color-line` | `#e4ddd1` | Filetes |

**Alias históricos** (se mantienen porque los usan ~60 archivos; en código nuevo usá los nombres de arriba): `--color-botanical` = brand-red, `--color-bordeaux` = wine, `--color-sage` = rose-50. Además, `globals.css` fuerza que cualquier bloque `bg-botanical` se pinte de vino.

### 2.2 Reglas de contraste ya resueltas en CSS global

- **Eyebrow** (`components/ui/Eyebrow.tsx`, clase `.sf-eyebrow`): toma `--eyebrow-color`, que cada sección define según su `data-theme` (light → champagne-ink, dark → champagne, sobre vino → `#d8b878`). Prop `tono` para forzarlo.
- **Foco**: `--focus-ring` = ink en claro, champagne en oscuro.
- **Atenuados**: `text-ink/40` y `text-ink/50` se suben a ink 65 % (5,6:1); `text-bone/40-45` a bone 62 %. Placeholders: 60 % del color del campo.
- **Header sobre foto/video**: tono determinista en el Header (zona E) + velo del hero (`.c-hero__media-overlay`) con refuerzo arriba y abajo-izquierda.

---

## 3. Tipografía

### 3.1 Familias

- **Display**: Cormorant Garamond (variable 300–700, `--font-logo` / `--font-display`). La itálica real se carga aparte en `components/ui/fuentes.ts` (`italica.className`).
- **Cuerpo**: Hanken Grotesk (`--font-sans`).
- **Panel**: Bricolage Grotesque (`[data-area="panel"] .font-display`).
- **Números**: todo uso display lleva `lining-nums tabular-nums` (Cormorant trae elzevirianos: "IO% OFF"). Ya está en `.font-display`, `.clip-title`, el loader y las tres voces.

### 3.2 Las tres voces de título (utilidades en `globals.css`, aceptan variantes)

| Voz | Clase | Receta | Cuándo |
|---|---|---|---|
| 1 · Display | `t-voz-display` | Cormorant **300**, caja mixta, tracking −1 %, lh 0,98 | Títulos de sección y momentos emocionales. Es la voz por defecto de los H2 |
| 2 · Nombre | `t-voz-nombre` | Cormorant **500**, versales, tracking +2 % | **Solo** nombres de categorías, productos y del evento |
| 3 · Cita | `t-voz-cita` + `italica.className` | Cormorant itálica **300** | Citas, bajadas, testimonios |

Reglas:
- Nada de "eyebrow + H2 centrado en mayúsculas" en cada sección. El eyebrow va solo si agrega un dato que el título no dice (ej. "2ª edición, 9 de abril de 2027").
- Al menos la mitad de los bloques de la home van alineados a la izquierda (hoy: todos menos el cierre de Contacto; el Summit va a la derecha).
- Numerales (01, 02…) solo donde hay secuencia real (trayectoria de workshops).
- Copy concreto y rioplatense (registro del Summit: "Entrás por la decoración. Te quedás por la gente."). Sin "más que decoración", "momentos inolvidables", "llave en mano".

### 3.3 Escala fluida

`--text-step--1` … `--text-step-7` en `:root` (clamp mobile → desktop). En ≥1920 px el `html` escala (`font-size: 100vw/120`).

### 3.4 Firma de marca en movimiento

- **Intro** (`components/intro/`): SWEET FLOWERS por CSS → el video nace dentro de un **arco** que se arma de abajo hacia arriba → los globos del logo suben y se escapan cuando el arco se abre a pantalla completa (mismo gesto que `PageTransition`). Una vez por sesión, salteable con cualquier input.
- **Footer**: la casita con tres globos atados que siguen el cursor con un resorte (`FooterGlobos`).
- **404**: la casita con un globo que se suelta (CSS puro).

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
