# 08 · Principios de UX (Experience Principles)

> Cómo se **siente** navegar *Sweet Flowers Deco Party*, y las decisiones concretas que lo hacen posible.
> El **qué** y el **porqué** de la marca viven en [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md).
> El **movimiento** que da vida a estos principios vive en [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).
> La **materia visual** (color, tipografía, grid) vive en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md).

**Marca:** decoración de eventos + formación (Flor, Argentina). **Mood:** premium, editorial, cinematográfico, elegante y **cálido**.

> **Tesis central:** No estamos haciendo una web. Estamos construyendo una **experiencia de descubrimiento** que haga pensar al visitante: *"si el sitio tiene este nivel… imaginate los eventos."* Cada decisión de UX sirve a esa frase.

---

## 1. Experience Principles

Estos son los mandamientos de la experiencia. Si un diseño los contradice, el diseño está mal.

### 1.1. No mostrar todo de una

El home no es un catálogo volcado en la pantalla. Se **revela** a medida que el usuario avanza. La primera pantalla insinúa; no explica.

- **Decisión concreta:** el hero muestra un título con mask reveal y una imagen con parallax, y **un solo** CTA. Los servicios, la formación y el portfolio aparecen más abajo, uno por vez, cada uno con su propio momento.

### 1.2. Crear curiosidad

Cada sección deja una pregunta abierta que la siguiente responde. El usuario baja porque **quiere saber qué sigue**, no por inercia.

- **Decisión concreta:** transiciones que dejan ver el borde de la próxima sección (un color cálido asomando, media palabra de un título) antes de llegar. El "casi lo veo" es motor de scroll.

### 1.3. Ritmo: impacto → descanso → contenido → espacio negativo

Una experiencia premium respira. Alternamos momentos de **impacto** (full-bleed, tipografía enorme, motion protagonista) con momentos de **descanso** (mucho aire, texto tranquilo, cero animación).

| Beat | Rol | Ejemplo en el sitio |
|------|-----|---------------------|
| **Impacto** | Detener el scroll, generar emoción | Hero, portfolio full-bleed, cita editorial gigante |
| **Descanso** | Bajar pulsaciones, dar aire | Bloque de manifiesto con mucho margen, sin motion |
| **Contenido** | Informar con claridad | Detalle de servicios, programa de formación |
| **Espacio negativo** | Elegancia, jerarquía por vacío | Separadores generosos entre secciones |

- **Decisión concreta:** ninguna sección de "impacto" va seguida de otra de "impacto". Siempre media un descanso. El espacio en blanco es un elemento de diseño, no un sobrante.

### 1.4. Sensación de descubrimiento

El sitio se siente **explorado**, no consumido. Micro-recompensas (un hover que revela, una imagen que se mueve) premian la atención.

- **Decisión concreta:** hovers ricos en el portfolio (imagen que hace zoom sutil + título que aparece), reveals que solo se ven si prestás atención al scroll.

### 1.5. Cada sección sorprende y tiene identidad propia

**Ninguna sección repite el layout de otra.** Cada una es un pequeño mundo con su composición, su relación imagen/texto, su tipo de motion.

- **Decisión concreta:** prohibido el patrón "N cards iguales en grilla, repetido en cada sección". Servicios puede ser un layout asimétrico; formación, una línea de tiempo; portfolio, un mosaico editorial. Ver anti-patrones (1.7).

### 1.6. Todo cuenta una historia

El orden de las secciones es una **narrativa**: quiénes somos → qué transformamos (eventos) → cómo te enseñamos (formación) → prueba (portfolio/testimonios) → invitación (contacto). El usuario no "recorre secciones": vive un arco.

### 1.7. Anti-patrones (lo que NUNCA hacemos)

| ❌ Anti-patrón | ✅ En su lugar |
|---------------|---------------|
| Scroll infinito de cajas idénticas | Composiciones variadas, cada sección distinta |
| `cards` "porque sí" | Card solo si la comparación lado a lado lo justifica |
| `fade` simple como default | Mask reveals (ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)) |
| Mostrar todo el catálogo arriba del fold | Revelado progresivo |
| Layout de plantilla repetido | Identidad por sección |
| Animar por animar | Motion con propósito narrativo |

---

## 2. Jerarquía visual

La jerarquía dice al ojo **qué mirar primero, segundo, tercero** sin que el usuario lo piense.

**Herramientas, en orden de fuerza:**
1. **Tamaño y escala.** El título de sección es dramáticamente más grande que el cuerpo. El contraste de escala (no el adorno) genera el drama editorial.
2. **Espacio (aislamiento).** Lo que está rodeado de aire pesa más. Un CTA solo en una banda vacía grita más que uno apretado.
3. **Color y contraste.** Un único acento cálido guía la mirada al CTA. El acento se **reserva** para lo accionable; si todo es acento, nada lo es.
4. **Peso tipográfico y posición.** Lo importante arriba/izquierda (en LTR) y con más peso.
5. **Movimiento.** Lo que se mueve capta la atención — por eso el motion es un recurso de jerarquía, no decorativo.

- **Regla práctica:** máximo **un** foco primario por pantalla. Si dos elementos compiten por ser "lo primero", uno pierde.

---

## 3. Arquitectura de la información

Estructura clara para dos audiencias que llegan con intenciones distintas: **contratar un evento/deco** y **formarse**. Detalle de rutas en [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md).

**Principios:**
- **Dos caminos evidentes desde el home:** "Eventos & Deco" y "Formación". No obligar a adivinar cuál es cuál.
- **Profundidad ≤ 3 clics** hasta cualquier acción de valor (ver portfolio, ver programa, contactar).
- **Nombres humanos**, no jerga: "Formación" > "Academy"; "Contacto" > "Get in touch".
- **Navegación honesta:** el menú refleja el modelo mental del usuario (lo que vino a buscar), no el organigrama interno del negocio.
- **Breadcrumb mental:** en cualquier scroll, el usuario sabe dónde está y cómo volver (nav persistente/accesible).

---

## 4. Reducción de fricción en flujos

Cada paso extra es una fuga. Menos fricción = más consultas y ventas. Ver también [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) para captación previa.

### 4.1. Flujo de consulta (evento / deco)

El objetivo primario del sitio es **generar la consulta**. Que sea trivial iniciarla.

- **CTA de contacto siempre accesible** (nav + cierre de cada sección relevante).
- **Formulario mínimo:** nombre, contacto (email o WhatsApp), tipo de evento, fecha aproximada, mensaje. Nada más en el primer paso.
- **WhatsApp como atajo:** para el público argentino, un botón directo a WhatsApp con mensaje pre-armado suele convertir mejor que un form largo. Ofrecer ambos.
- **Sin registro.** Nadie crea cuenta para pedir un presupuesto.

### 4.2. Flujo de compra / inscripción (formación)

- **Precio y qué incluye, visibles.** Ocultar el precio genera fricción y desconfianza (cuando el dato exista; hoy es `TODO(contenido)` — ver [`CLAUDE.md`](./CLAUDE.md)).
- **Un solo paso hasta "reservar lugar".** Resumen claro antes de confirmar (qué, cuándo, cuánto).
- **Cupos y fechas explícitos** para crear urgencia real (no falsa).

- **Regla transversal:** eliminá todo campo que no uses de inmediato. Cada input es un peaje.

---

## 5. Claridad de CTAs

Un CTA es una promesa. Debe decir **qué pasa** al hacer clic.

| ❌ Genérico | ✅ Con intención |
|------------|-----------------|
| "Enviar" | "Quiero mi presupuesto" |
| "Más info" | "Ver el programa completo" |
| "Click aquí" | "Reservar mi lugar" |
| "Contacto" | "Hablemos de tu evento" |

**Reglas:**
- **Un CTA primario por pantalla**, visualmente inequívoco (usa el acento cálido). Los secundarios son claramente menos dominantes (texto/ghost).
- **Verbo + valor** desde la perspectiva del usuario ("Quiero…", "Ver…").
- **Consistencia:** la acción principal de contacto usa siempre el mismo label y estilo en todo el sitio.

---

## 6. Formularios usables

- **Labels visibles siempre** (no placeholders como label: desaparecen al escribir y matan la accesibilidad).
- **Un campo por línea** en mobile; agrupar lógicamente en desktop.
- **Validación inline y amable:** el error aparece junto al campo, en lenguaje humano ("Falta tu email para poder responderte"), no un genérico "Campo inválido".
- **Teclado correcto en mobile:** `type="email"`, `inputmode="tel"`, `autocomplete` adecuado. Un input mal tipado en mobile es fricción pura.
- **Botón de submit describe la acción** ("Enviar consulta"), y muestra estado de carga (ver §7).
- **Nunca perder lo escrito** ante un error de red.

```html
<!-- Patrón base: label visible + inputmode + estados accesibles -->
<label for="tel">WhatsApp o teléfono</label>
<input id="tel" name="tel" type="tel" inputmode="tel"
       autocomplete="tel" aria-describedby="tel-hint" />
<p id="tel-hint">Te respondemos por acá.</p>
```

---

## 7. Estados: vacío, carga, error, feedback

Un producto premium **nunca** deja al usuario sin saber qué pasa. Los estados no son un detalle: son la mitad de la experiencia.

| Estado | Qué mostrar | Ejemplo en el sitio |
|--------|-------------|---------------------|
| **Vacío** | Explicar + guiar a la acción, no una pantalla muda | Portfolio sin ítems de una categoría → "Pronto sumamos más de esto. ¿Querés esto en tu evento?" + CTA |
| **Carga** | Feedback inmediato (< 100ms); skeleton para bloques, spinner en botones | Botón de envío pasa a "Enviando…" y se deshabilita |
| **Error** | Qué pasó + qué hacer, en tono humano, sin perder datos | "No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp." |
| **Éxito** | Confirmación clara + próximo paso | "¡Listo! Te respondemos dentro de las 24–48 hs." |

**Feedback general:**
- **Respuesta a cada acción en < 100ms** (aunque sea un cambio de estado del botón). El silencio genera doble-click y ansiedad.
- **Micro-confirmaciones:** hover que responde, foco que se ve, botón que "se hunde" al presionar.
- **Reduced-motion:** los estados se comunican igual sin animación (ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §10).

---

## 8. Mobile-first y touch targets

La mayoría del tráfico (evento/deco en Argentina) llega desde el celular, muchas veces desde Instagram. **Mobile no es una reducción del desktop: es el diseño primario.**

- **Touch targets ≥ 44×44px** (WCAG 2.5.5 / guía de Apple). Botones y links cómodos para el pulgar.
- **Zona del pulgar:** las acciones primarias (CTA, WhatsApp) al alcance natural en la mitad inferior.
- **Sin hover como única vía:** todo lo que se revela con hover debe tener equivalente en tap (no hay hover en touch).
- **Tipografía fluida y legible:** cuerpo ≥ 16px para evitar zoom automático de iOS y garantizar lectura.
- **Performance en 4G:** imágenes optimizadas (`next/image`), motion que no traba el scroll. Ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §11 y [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md).
- **Menú overlay** cómodo, cerrable con un gesto obvio y con foco atrapado mientras está abierto.

---

## 9. Checklist de accesibilidad

Accesibilidad **no negociable** — es calidad, no un extra. Objetivo: **WCAG 2.1 AA**.

- [ ] **Foco visible** en todos los interactivos. **Nunca** `outline: none` sin reemplazo claro (usar `:focus-visible` con un anillo evidente).
- [ ] **Navegable 100% con teclado:** Tab en orden lógico, Enter/Espacio activan, **Escape cierra** overlays. Sin trampas de foco (salvo foco atrapado *intencional* dentro del menú abierto).
- [ ] **Contraste:** texto normal ≥ **4.5:1**, texto grande ≥ **3:1**. Verificar el acento cálido sobre fondos claros — lo cálido suele fallar contraste; validar antes de usarlo para texto.
- [ ] **`alt` real** en imágenes con contenido; `alt=""` en decorativas. Nunca "imagen1.jpg".
- [ ] **HTML semántico:** `<nav>`, `<main>`, `<section>`, `<button>` para acciones y `<a>` para navegación (no `<div onclick>`).
- [ ] **Jerarquía de headings** correcta (un `<h1>` por página, sin saltos h2→h4).
- [ ] **ARIA solo cuando el HTML nativo no alcanza:** `aria-expanded`/`aria-controls` en el toggle del menú, `aria-live="polite"` para mensajes de éxito/error de formularios, `aria-hidden` en overlays cerrados. *La primera regla de ARIA es no usar ARIA si hay un elemento nativo que ya lo resuelve.*
- [ ] **Labels asociados** a cada input (`for`/`id`). Errores anunciados con `aria-describedby`.
- [ ] **`prefers-reduced-motion`** respetado en todo el motion (ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §10).
- [ ] **`lang="es"`** en `<html>` y textos alternativos en español.
- [ ] **Skip link** ("Saltar al contenido") al inicio para usuarios de teclado/lectores.

```css
/* Foco visible correcto: nunca lo elimines, hacelo hermoso */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

---

## 10. Cómo se conecta todo

Estos principios no son abstractos: cada uno se traduce en decisiones que ya viven en el resto de la biblia.

- **Descubrimiento + ritmo** → se ejecutan con el **motion** de [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) (mask reveals, parallax, silencios).
- **Identidad por sección** → guiada por [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) y construida sin repetir plantillas ([`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md)).
- **Reducción de fricción + CTAs** → sirven a los objetivos de negocio de [`01_BUSINESS.md`](./01_BUSINESS.md) y al recorrido de [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md).
- **Accesibilidad + performance mobile** → estándares obligatorios de [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md).

> **Prueba final de cada sección:** ¿genera curiosidad, tiene identidad propia, reduce fricción hacia la acción y funciona para todos (teclado, mobile, reduced-motion)? Si algo falla, no está terminada.

---

**Relacionado:** [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) · [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) · [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) · [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md) · [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md) · [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)
