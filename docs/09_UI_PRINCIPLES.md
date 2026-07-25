# 09 · Principios de UI

> **Reglas visuales de componentes e interfaz.** Cómo se ven, se comportan y por qué.
> Los **tokens** (color, tipografía, espaciado, radios, sombras) se definen en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Acá se **aplican**.
> Los **tokens de animación** (duraciones, easings, delays) están en [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md). Acá se referencian, no se redefinen.
> La **intención narrativa** (qué siente el usuario) vive en [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md).

---

## ⚠️ Estado: PROVISIONAL

Los ejemplos usan las clases mapeadas de los tokens **provisionales** de `06`. Cuando llegue el **manual de marca** y el **logo vectorial**, cambian los **valores** de esos tokens, no las reglas de este documento. Las reglas de UI (jerarquía, estados, hover, layout) son estables.

---

## 0. Filosofía de componentes

1. **El componente es el mensaje.** Cada uno debe ser digno de portfolio (ver QUALITY BAR en `CLAUDE.md`). Si Apple/Stripe/Framer no lo firmarían, no está listo.
2. **Menos, pero mejor.** Preferimos pocos componentes muy pulidos a muchos genéricos.
3. **No abusar de "cards".** La tarjeta es **una** herramienta, no el default. Mucho contenido premium se resuelve con tipografía + imagen + espacio, sin caja.
4. **Nunca repetir el mismo layout dos veces** (§14). Cada sección tiene identidad propia.
5. **Cada regla tiene un porqué.** Si no sabés por qué existe, no la apliques.

---

## 1. Botones

Tres variantes. **Una jerarquía por vista**: como mucho **un** botón primario visible por pantalla/hero.

| Variante | Rol | Fondo | Texto | Borde |
|---|---|---|---|---|
| **Primario** | Acción principal (CTA de conversión) | `--color-ink` | `--color-bone` | ninguno |
| **Secundario** | Acción alternativa | transparente | `--color-ink` | `1px --color-line` → hover `--color-ink` |
| **Ghost / link-button** | Acción terciaria, dentro de contenido | transparente | `--color-ink` | ninguno; subrayado en hover |

Forma: por defecto `--radius-pill` (elegante, "botón editorial"). Padding desde la escala: `py-4 px-6` (16/32px). Tipografía **body**, peso 500, tamaño `--step-0`, tracking ligeramente positivo.

```tsx
// Primario
<button className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-4
  font-body text-step-0 font-medium text-bone
  transition-[transform,background-color] duration-200 ease-out
  hover:-translate-y-[1px] hover:bg-ink/90
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
  disabled:pointer-events-none disabled:opacity-50">
  Reservá tu evento
</button>

// Secundario
<button className="inline-flex items-center gap-2 rounded-pill border border-line px-6 py-4
  font-body text-step-0 font-medium text-ink
  transition-colors duration-200 ease-out
  hover:border-ink
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
  Ver galería
</button>

// Ghost
<button className="group inline-flex items-center gap-2 font-body text-step-0 font-medium text-ink">
  <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat
    transition-[background-size] duration-200 ease-out group-hover:bg-[length:100%_1px]">
    Conocé la formación
  </span>
  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
</button>
```

### Estados (todas las variantes)

| Estado | Regla | Porqué |
|---|---|---|
| Hover | Primario: `-translate-y-[1px]` + fondo `ink/90`. Secundario: borde `line → ink`. Ghost: subrayado crece 0→100%. | Feedback sutil, premium; nada de saltos. |
| Focus-visible | `outline-2 outline-offset-2 outline-ink` (sobre oscuro: `outline-champagne`). | Accesibilidad (§AA de `06`). Nunca `outline: none` sin reemplazo. |
| Active | `translate-y-0` + leve `scale-[0.99]`. | Sensación táctil de "presión". |
| Disabled | `opacity-50` + `pointer-events-none`. | Estado claro sin gritar. |
| Loading | Spinner que reemplaza el label, ancho fijo. | Evita layout shift al cambiar de estado. |

Duraciones y easing: **siempre** desde [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md). Regla base: hover ~`200ms`, `ease-out`. Nunca `linear` (salvo marquees, §11).

---

## 2. Links (in-copy)

Regla de marca: **link en gris → hover a tinta (ink) en 0.2s.** Con subrayado fino que aparece o se refuerza.

```tsx
<a href="/eventos"
   className="text-muted underline decoration-line underline-offset-4
   transition-colors duration-200 ease-out
   hover:text-ink hover:decoration-ink
   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
  ver todos los eventos
</a>
```

**Porqué:** en reposo el link no compite con el cuerpo (gris `--color-muted`); al hover "se enciende" a `--color-ink`. El movimiento es de **color**, no de tamaño → estable y elegante. `0.2s ease-out` es el estándar de la marca para micro-interacciones.

> Links de navegación (header/footer) siguen el mismo criterio color-first, pero sin subrayado permanente (§7, §9).

---

## 3. Inputs y formularios

Principios: **editorial, aireado, sin ruido.** Borde inferior o caja muy sutil, foco claro, label siempre visible (nunca solo placeholder).

```tsx
<label className="block">
  <span className="mb-2 block font-body text-step--1 font-medium text-ink">Nombre</span>
  <input
    type="text"
    placeholder="Tu nombre"
    className="w-full rounded-sm border border-line bg-cloud px-4 py-3
      font-body text-step-0 text-ink placeholder:text-muted
      transition-[border-color,box-shadow] duration-200 ease-out
      hover:border-ink/40
      focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15
      aria-[invalid=true]:border-bordeaux" />
</label>
```

Reglas:

| Regla | Detalle | Porqué |
|---|---|---|
| Label visible | `<label>` real, arriba del campo. Nunca reemplazar por placeholder solo. | Accesibilidad + no se pierde el contexto al escribir. |
| Placeholder ≠ label | Placeholder es **ejemplo**, en `--color-muted`. | El placeholder desaparece al escribir; el label debe quedar. |
| Foco inequívoco | `focus:border-ink` + `ring-ink/15`. | Cumple AA de foco visible; sin `outline:none` pelado. |
| Error | `aria-invalid="true"` → borde `--color-bordeaux` + mensaje con **icono + texto**, no solo color. | No transmitir estado solo por color (§7 de `06`). |
| Touch targets | Altura mínima ~44px (`py-3` + line-height). | Usabilidad mobile. Ver skill mobile-design. |
| Espaciado | Gap entre campos `--space-5` (24px). | Ritmo respirable, no formulario apretado. |
| Botón submit | Botón **primario** (§1), ancho auto en desktop, full-width en mobile. | Jerarquía clara del CTA. |

`prefers-reduced-motion`: las transiciones de foco se mantienen (son cortas y no molestan), pero cualquier animación decorativa se anula (ver `07`).

---

## 4. Tarjetas de producto (usar con moderación)

Contexto: catálogo de decoración / kits. **No** convertir todo en una grilla de cajas idénticas.

```tsx
<article className="group">
  <div className="relative overflow-clip rounded-md bg-cloud shadow-sm
    transition-shadow duration-300 ease-out group-hover:shadow-md">
    <img
      src="/placeholder.jpg" /* TODO(contenido): foto real de Flor */
      alt="TODO(contenido): descripción real del producto"
      className="aspect-[4/5] w-full object-cover
        transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
  </div>
  <div className="mt-4 flex items-baseline justify-between gap-4">
    <h3 className="font-display text-step-2 leading-tight text-ink">Arco floral pastel</h3>
    <span className="font-body text-step-0 text-muted">$ —</span> {/* TODO(contenido): precio real */}
  </div>
  <p className="mt-1 font-body text-step--1 text-muted">Kit para 30 invitados</p>
</article>
```

Reglas:

- **La imagen manda.** Aspect ratio editorial `4/5` o `3/4` (vertical, más elegante que cuadrado). Zoom sutil en hover (`scale-[1.03]`, 500ms).
- **Poca caja.** Idealmente la "tarjeta" es imagen + texto debajo, **sin** contenedor con borde. Si necesitás caja, `--radius-md` + `--shadow-sm`.
- **Precio placeholder:** `$ —` (nunca inventar valor, ver `CLAUDE.md` §6).
- La tarjeta **entera** es clickeable; el `<h3>` contiene el link real para semántica.
- No más de **3–4 por fila** en desktop; darles aire (`gap` desde `--space-6`).

---

## 5. Tarjetas de evento y testimonio

**Evento:** más editorial que "card de producto". Foto grande + overlay + metadatos (fecha, tipo). Suele ir en layouts asimétricos (§14), no en grilla uniforme.

```tsx
<article className="group relative overflow-clip rounded-lg">
  <img src="/evento.jpg" alt="TODO(contenido)"
    className="aspect-[16/10] w-full object-cover
      transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]" />
  <div className="absolute inset-0 bg-[var(--overlay)] opacity-70
    transition-opacity duration-300 group-hover:opacity-80" />
  <div className="absolute inset-x-0 bottom-0 p-6">
    <p className="u-eyebrow text-bone/80">Cumpleaños · Edición 0X</p> {/* TODO(contenido) */}
    <h3 className="mt-2 font-display text-step-3 leading-tight text-bone">Jardín de primavera</h3>
  </div>
</article>
```

**Testimonio:** casi nunca es "card". Es **tipografía**. Cita grande, editorial, con la firma pequeña. El protagonismo lo tiene la frase, no una caja.

```tsx
<figure className="mx-auto max-w-[52ch] text-center">
  <blockquote className="font-display text-step-4 font-light italic leading-tight text-ink">
    “Cada rincón parecía sacado de una película. No cambiaría nada.”
  </blockquote>
  <figcaption className="mt-6 u-eyebrow">
     Maru · cumpleaños de 15 {/* TODO(contenido): nombre y evento reales */}
  </figcaption>
</figure>
```

**Porqué:** encajar un testimonio en una caja con avatar y estrellitas lo abarata. En una marca premium, la palabra bien tipografiada **es** el diseño.

---

## 6. Header fijo transparente + menú overlay full-screen

Comportamiento:

1. **Fijo y transparente** sobre el hero: solo logo + botón de menú, texto en `--color-bone` (sobre hero oscuro/imagen) o `--color-ink` (sobre hero claro).
2. Al **scrollear** más allá del hero: fondo `--color-bone/90` con `backdrop-blur`, texto pasa a `--color-ink`, hairline inferior `--color-line`. Transición ~300ms.
3. **Menú = overlay full-screen** (no dropdown): cubre la pantalla, fondo `--color-cloud` o momento oscuro `--color-bordeaux`, links tipográficos grandes con reveal escalonado (ver `07`).

```tsx
<header className="fixed inset-x-0 top-0 z-50">
  <div className="u-container flex items-center justify-between py-5
    transition-colors duration-300 data-[scrolled=true]:bg-bone/90
    data-[scrolled=true]:backdrop-blur data-[scrolled=true]:border-b data-[scrolled=true]:border-line">
    <a href="/" className="font-display text-step-1 text-ink">Sweet Flowers</a> {/* TODO(contenido): logo vectorial */}
    <button aria-expanded={open} aria-controls="menu-overlay"
      className="font-body text-step-0 font-medium text-ink">Menú</button>
  </div>
</header>

{/* Overlay */}
<div id="menu-overlay" role="dialog" aria-modal="true"
  className="fixed inset-0 z-[60] flex flex-col justify-center bg-cloud px-[var(--container-pad)] shadow-lg">
  <nav className="flex flex-col gap-4">
    {["Eventos", "Formación", "Productos", "Sobre Flor", "Contacto"].map((l) => (
      <a key={l} href="#"
        className="font-display text-step-5 leading-display text-ink
        transition-colors duration-200 ease-out hover:text-muted">
        {l}
      </a>
    ))}
  </nav>
</div>
```

Reglas de accesibilidad del overlay: `role="dialog"` + `aria-modal`, **focus trap**, cierre con `Esc`, bloquear scroll del `body` (coordinado con Lenis), devolver el foco al botón al cerrar. El reveal respeta `prefers-reduced-motion` (aparición directa, sin stagger).

**Porqué overlay y no dropdown:** el overlay full-screen es un gesto cinematográfico, da protagonismo a la tipografía y refuerza el mood editorial. Un dropdown se siente "app", no "marca premium".

---

## 7. Footer

Editorial y generoso, no un cementerio de links. Estructura: bloque grande de marca / CTA + columnas de navegación finas + legal.

- Fondo: momento oscuro (`--color-ink` o `--color-bordeaux`) con texto `--color-bone` — cierre "cinematográfico" del scroll.
- Un **CTA grande tipográfico** ("Hagamos tu evento →") como pieza principal, tamaño `--step-4/5`.
- Links de navegación agrupados, `--color-bone/70` → hover `--color-bone` (misma lógica color-first que §2).
- Espaciado vertical amplio: `py-10/11`.
- Legal + placeholder de redes al pie, `--step--1`, `--color-bone/60`.

```tsx
<footer className="bg-ink text-bone">
  <div className="u-container py-11">
    <a href="/contacto" className="font-display text-step-5 leading-display text-bone
      transition-colors duration-200 hover:text-champagne">
      Hagamos tu evento <span aria-hidden>→</span>
    </a>
    {/* columnas de nav + legal */}
  </div>
</footer>
```

---

## 8. Marquees

Cinta de texto/logos en movimiento continuo. Único caso donde `linear` es correcto (movimiento constante, sin aceleración).

```tsx
<div className="overflow-clip border-y border-line py-4">
  <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8
    motion-reduce:animate-none">
    {/* duplicar el contenido para loop sin costura */}
    <span className="font-display text-step-3 text-ink">Eventos · Formación · Deco · </span>
    <span className="font-display text-step-3 text-ink" aria-hidden>Eventos · Formación · Deco · </span>
  </div>
</div>
```

Reglas: velocidad **lenta y elegante** (~20–30s por ciclo). `motion-reduce:animate-none` obligatorio (queda estático). Pausar en hover es opcional y bienvenido. No saturar: **máximo un marquee por vista**.

---

## 9. Badges / labels / eyebrows

Micro-tipografía en MAYÚSCULAS con tracking amplio (`--tracking-wide`), tamaño `--step--1`. Sirven de "eyebrow" sobre títulos y de etiqueta en tarjetas.

```tsx
{/* Eyebrow (sin caja) */}
<p className="u-eyebrow">Formación 2026</p>

{/* Badge (con caja pill) */}
<span className="inline-flex items-center rounded-pill border border-line px-3 py-1
  font-body text-step--1 font-medium uppercase tracking-wide text-ink">
  Nuevo
</span>

{/* Badge acento premium (sobre oscuro) */}
<span className="inline-flex items-center rounded-pill bg-champagne/15 px-3 py-1
  font-body text-step--1 font-medium uppercase tracking-wide text-champagne">
  Cupos limitados
</span>
```

**Porqué mayúsculas + tracking:** en MAYÚSCULA las letras necesitan aire para respirar (`0.14em`); da un aire de "sello editorial". El champagne como **acento** (no como texto sobre claro — recordá §7 de `06`).

---

## 10. Imágenes (tratamiento editorial)

La imagen es el corazón de esta marca (flores, eventos). Regla: **fotos grandes, bien encuadradas, con aire.**

| Contexto | Aspect ratio | Notas |
|---|---|---|
| Hero | `16/9` o full-bleed `100svh` | Con `--overlay` si lleva texto encima. |
| Producto | `4/5` o `3/4` (vertical) | Vertical = más editorial que cuadrado. |
| Evento | `16/10` o `3/2` | Panorámico, cinematográfico. |
| Editorial/retrato | `4/5` / `2/3` | Para "Sobre Flor", detalles. |
| Galería mosaico | mezcla intencional | Romper la grilla (§14). |

Reglas técnicas:

- **Siempre** `next/image` con `sizes` correcto y `alt` real (`TODO(contenido)` mientras no haya foto/copy).
- `object-cover` + `overflow-clip` en el contenedor para zoom en hover sin desbordar.
- Radios: `--radius-md/lg` **o** borde recto (más serio). Coherencia dentro de una misma sección.
- **Parallax scrubbed** ligado al scroll (ver `07`), no CSS decorativo. Respeta `prefers-reduced-motion`.
- Tratamiento de color coherente: si el manual define un preset de fotografía (cálido, luminoso), aplicarlo parejo. Nunca mezclar fotos frías y cálidas en la misma vista.

---

## 11. Jerarquía tipográfica y mayúsculas

- **Un solo display por vista** (`--step-6`): el hero. Repetir el tamaño máximo mata la jerarquía.
- Cascada clara: display → H1 sección (`--step-5`) → H2 (`--step-4`) → lead (`--step-1`) → cuerpo (`--step-0`). No saltar niveles al azar.
- **Serif (display) = emoción / titulares. Sans (body) = información / UI.** No usar serif para párrafos largos ni sans para el hero.
- **MAYÚSCULAS solo en labels/eyebrows/badges** (`--tracking-wide`). **Nunca** un párrafo o un título largo en mayúsculas (se lee peor y grita).
- Medida de línea del cuerpo: **45–75 caracteres** (`max-w-[42ch]`…`[68ch]`). Textos anchos cansan.
- Números/precios: en **body**, alineados; nunca en display grande.

---

## 12. Espacio negativo

- El espacio negativo es **estructura**, no vacío. Entre secciones, `--space-9/11` (96–160px) en desktop.
- Un elemento importante (CTA, título, cita) merece **aire alrededor**: aislarlo comunica jerarquía sin decoración.
- **Porqué:** el lujo se percibe por lo que **no** está. Densidad = catálogo barato; aire = editorial premium.

---

## 13. Uso del color en UI

- **Base clara dominante** (`--color-bone`). Momentos oscuros (`--color-bordeaux`/`--color-ink`/`--color-botanical`) **puntuales** para ritmo cinematográfico: hero alterno, cita, footer.
- **Acentos con cuentagotas:** blush y champagne son **detalle**, no fondos gigantes. Una sección puede tener un toque de champagne; no tres acentos peleando.
- Recordar restricciones de contraste de [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) §7 (champagne nunca es texto sobre claro).

---

## 14. "Nunca repetir el mismo layout"

Regla no negociable (QUALITY BAR). Cada sección debe tener **identidad propia**; el usuario nunca debe sentir "otra fila de tarjetas iguales".

Cómo lograrlo con el grid de 12 columnas (`06` §6.2):

| Sección | Composición sugerida |
|---|---|
| Hero | Full-bleed, título display desbordando, imagen de fondo. |
| Eventos destacados | Asimétrico: imagen `col-span-7` + texto `col-span-4 col-start-9`, alternando lado por ítem. |
| Formación | Split 50/50 con sticky en un lado. |
| Productos | Grilla, pero con **un** ítem destacado a doble ancho. |
| Testimonios | Tipografía centrada, sin caja, mucho aire. |
| Sobre Flor | Editorial: retrato `col-span-5` + texto en columna angosta. |

```tsx
{/* Fila de evento asimétrica y alternante */}
<div className="u-grid items-center gap-y-8">
  <div className="col-span-12 md:col-span-7"> {/* imagen */} </div>
  <div className="col-span-12 md:col-span-4 md:col-start-9"> {/* texto */} </div>
</div>
```

**Porqué:** un sitio premium se recorre como una **revista**, no como una planilla. La variación de layout mantiene la atención y transmite cuidado artesanal. Si dos secciones consecutivas comparten estructura, **rediseñá una**.

---

## 15. Checklist de UI (antes de cerrar un componente)

- [ ] ¿Una agencia top lo publicaría? (QUALITY BAR de `CLAUDE.md`).
- [ ] ¿Usa **solo** tokens de `06` (nada de HEX/px sueltos)?
- [ ] ¿Estados completos? hover / focus-visible / active / disabled / loading (§1).
- [ ] ¿Foco visible y navegable por teclado?
- [ ] ¿Motion desde `07`, con `prefers-reduced-motion`?
- [ ] ¿No abusa de cards? ¿La tipografía y la imagen hacen el trabajo?
- [ ] ¿El layout **no** repite el de la sección anterior (§14)?
- [ ] ¿Contraste AA/AAA verificado (`06` §7)?
- [ ] ¿Placeholders marcados con `TODO(contenido):` (`CLAUDE.md` §6)?

---

**Relacionados:** [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) · [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) · [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md) · [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md) · [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)
