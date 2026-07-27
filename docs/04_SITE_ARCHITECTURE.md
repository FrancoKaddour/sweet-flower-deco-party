# 04 — ARQUITECTURA DEL SITIO

**Versión 1.0** · Mapa de rutas, jerarquía, navegación y estados.

> Este documento define **la estructura navegable** del sitio: qué rutas existen, cómo se relacionan, cómo se navegan y en qué estados pueden encontrarse.
> El **qué** y el **porqué** del negocio viven en [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) y [`01_BUSINESS.md`](./01_BUSINESS.md).
> El **cómo se cuenta cada pantalla** (narrativa, secciones, copy) vive en [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md).
> Las **decisiones abiertas** (checkout, dominio del evento) viven en [`16_DECISIONS.md`](./16_DECISIONS.md).

Si el código y este documento se contradicen, **este documento tiene prioridad** hasta que se actualice de forma explícita.

---

## Índice

1. [Principio rector: dos flujos, un mismo relato](#1-principio-rector-dos-flujos-un-mismo-relato)
2. [Mapa del sitio (árbol de rutas)](#2-mapa-del-sitio-árbol-de-rutas)
3. [Tabla ruta × propósito × prioridad](#3-tabla-ruta--propósito--prioridad)
4. [Estructura de URL amigable para SEO](#4-estructura-de-url-amigable-para-seo)
5. [Jerarquía y navegación](#5-jerarquía-y-navegación)
6. [Breadcrumbs](#6-breadcrumbs)
7. [Estados de página (loading, vacío, error, 404)](#7-estados-de-página-loading-vacío-error-404)
8. [Convivencia e-commerce ↔ eventos](#8-convivencia-e-commerce--eventos)
9. [Decisión abierta: el checkout](#9-decisión-abierta-el-checkout)
10. [Pendientes de contenido](#10-pendientes-de-contenido)

---

## 1. Principio rector: dos flujos, un mismo relato

El sitio tiene que sostener **dos intenciones de usuario distintas** sin fricción y sin que una degrade a la otra:

- **Flujo transaccional (e-commerce):** alguien busca un producto de decoración, evalúa material/medida/precio/envío y quiere comprar o pedir presupuesto. Su prioridad es **claridad, confianza y rapidez**.
- **Flujo aspiracional (marca / eventos / membresía):** alguien descubre a Flor, recorre el relato, quiere sumarse al evento o a la membresía. Su prioridad es **deseo, autoridad y pertenencia**.

La arquitectura no los separa en dos sitios: los **entrelaza en un mismo relato**. La Home es el hub donde ambos flujos nacen; a partir de ahí, cada rama tiene su propio tono (ver [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md)) pero comparten header, footer y sistema de diseño.

Regla arquitectónica: **el catálogo nunca se siente como "una tienda pegada"** y el evento **nunca se siente como "una landing aparte"**. Todo pertenece a la misma casa.

---

## 2. Mapa del sitio (árbol de rutas)

Rutas del **App Router de Next.js**. Los segmentos entre corchetes son dinámicos. `(grupos)` son *route groups* que no afectan la URL, solo organizan layouts.

```
app/
├── layout.tsx                      # Root layout: <html>, fuentes, header, footer, smooth scroll (Lenis)
├── page.tsx                        # /                         Home — hub narrativo + puertas a las unidades
├── loading.tsx                     # skeleton global de primer nivel
├── not-found.tsx                   # 404 global
├── error.tsx                       # error boundary global
│
├── (marca)/                        # route group: relato de marca (tono editorial)
│   ├── historia/
│   │   └── page.tsx                # /historia                 Sobre Flor / la marca / autoridad
│   ├── membresia/
│   │   └── page.tsx                # /membresia                Propuesta de valor + alta
│   └── contacto/
│       └── page.tsx                # /contacto                 Consulta general + presupuesto a medida
│
├── productos/                      # e-commerce (tono claro, funcional, confiable)
│   ├── page.tsx                    # /productos                Catálogo raíz: todas las categorías
│   ├── loading.tsx                 # skeleton de grilla de catálogo
│   ├── error.tsx                   # error de catálogo (falla de datos)
│   └── [categoria]/
│       ├── page.tsx                # /productos/[categoria]    Listado filtrable por material
│       ├── loading.tsx             # skeleton de listado
│       └── [slug]/
│           └── page.tsx            # /productos/[categoria]/[slug]   Ficha de producto (PDP)
│
├── evento/                         # eventos (tono cinematográfico, aspiracional)
│   ├── page.tsx                    # /evento                   Próxima edición (18/09) + inscripción
│   ├── ediciones/
│   │   ├── page.tsx                # /evento/ediciones         Las 7 ediciones previas (archivo)
│   │   └── [edicion]/
│   │       └── page.tsx            # /evento/ediciones/[edicion]   Detalle de una edición pasada
│   ├── disertantes/
│   │   ├── page.tsx                # /evento/disertantes       Grilla de disertantes
│   │   └── [slug]/
│   │       └── page.tsx            # /evento/disertantes/[slug]    Perfil de disertante
│   └── inscripcion/
│       └── page.tsx                # /evento/inscripcion       Formulario / paso de inscripción
│
├── carrito/
│   └── page.tsx                    # /carrito                  Carrito (según decisión de checkout, §9)
│
├── legales/
│   ├── terminos/page.tsx           # /legales/terminos
│   ├── privacidad/page.tsx         # /legales/privacidad
│   └── envios-y-cambios/page.tsx   # /legales/envios-y-cambios
│
├── sitemap.ts                      # sitemap.xml dinámico (SEO)
├── robots.ts                       # robots.txt
└── api/                            # (si aplica según decisión de checkout)
    └── ...                         # webhooks Mercado Pago, revalidación, etc. — ver 16_DECISIONS.md
```

Notas de arquitectura:

- **`/evento` es un hub**, no una sola landing. Contiene la próxima edición, el archivo de ediciones, disertantes e inscripción. Esto permite crecer la autoridad (7 ediciones + disertantes) sin ahogar la landing principal de conversión.
- **`disertantes` y `ediciones`** son colecciones dinámicas: cada perfil / edición es una pieza de SEO y de prueba social. TODO(contenido): confirmar si en la v1 se publican perfiles individuales o solo la grilla.
- El **route group `(marca)`** agrupa páginas de tono editorial que comparten un layout más pausado; no cambia la URL (sigue siendo `/historia`, `/membresia`, `/contacto`).
- **`/carrito`** es parte del flujo: el checkout es **propio con Mercado Pago** (decidido, ADR-007). La ruta existe en la v1.

---

## 3. Tabla ruta × propósito × prioridad

**Prioridad**: P0 = crítica para el lanzamiento; P1 = importante, deseable en v1; P2 = puede llegar en una segunda ola.
**Flujo**: 🛍️ e-commerce · ✨ marca/evento · ⚙️ soporte.

| Ruta | Propósito | Flujo | Prioridad | Indexable |
|---|---|---|---|---|
| `/` | Hub narrativo; abre las 4 unidades de negocio; primera pieza de "decoración" de la marca | ✨🛍️ | **P0** | Sí |
| `/productos` | Catálogo raíz; muestra las categorías/materiales; entrada al flujo de compra | 🛍️ | **P0** | Sí |
| `/productos/[categoria]` | Listado por material (hierro, MDF, madera, fundas y telas); filtros y orden | 🛍️ | **P0** | Sí |
| `/productos/[categoria]/[slug]` | Ficha de producto (PDP): fotos, medidas, material, precio, envío, comprar/consultar | 🛍️ | **P0** | Sí |
| `/evento` | Próxima edición (18/09): programa, valor, inscripción; conversión principal del flujo evento | ✨ | **P0** | Sí |
| `/evento/inscripcion` | Paso/formulario de inscripción a la próxima edición | ✨ | **P0** | Parcial* |
| `/evento/ediciones` | Archivo de las 7 ediciones previas; autoridad + prueba social | ✨ | P1 | Sí |
| `/evento/ediciones/[edicion]` | Detalle de una edición pasada (números, sede, testimonios, sponsors) | ✨ | P1 | Sí |
| `/evento/disertantes` | Grilla de disertantes; autoridad | ✨ | P1 | Sí |
| `/evento/disertantes/[slug]` | Perfil individual de disertante | ✨ | P2 | Sí |
| `/membresia` | Propuesta de valor de la membresía + alta | ✨ | P1 | Sí |
| `/historia` | Relato de marca / Sobre Flor; construye confianza y autoridad | ✨ | P1 | Sí |
| `/contacto` | Consulta general + presupuesto a medida; captura de leads | 🛍️✨ | **P0** | Sí |
| `/carrito` | Revisión de compra (condicionado a §9) | 🛍️ | P0† | No |
| `/legales/terminos` | Términos y condiciones | ⚙️ | P1 | Sí |
| `/legales/privacidad` | Política de privacidad / datos | ⚙️ | P1 | Sí |
| `/legales/envios-y-cambios` | Envíos, tiempos de fabricación, cambios/garantía | ⚙️🛍️ | P1 | Sí |
| `/404` (not-found) | Recuperación elegante ante ruta inexistente | ⚙️ | P1 | No |

\* La página de inscripción es indexable pero el **paso con datos personales** no debe cachearse ni indexarse.
† `/carrito` es **P0**: el checkout es propio con Mercado Pago (ADR-007).

TODO(contenido): confirmar el listado real de **categorías/materiales** para fijar los slugs de `[categoria]`. Provisionales: `hierro`, `mdf`, `madera`, `fundas-y-telas`.

---

## 4. Estructura de URL amigable para SEO

Principios (detalle SEO completo en [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)):

- **URLs limpias, en minúscula, con guiones**, sin acentos ni caracteres especiales. `fundas-y-telas`, no `Fundas_y_Telas`.
- **Jerarquía legible**: la URL cuenta la historia sin abrir la página. `/productos/hierro/arco-globos-desarmable` se entiende sola.
- **Slugs semánticos y estables** por producto/edición/disertante. Nunca IDs numéricos crudos en la URL pública (`/productos/hierro/12345` está prohibido). Si se necesita un ID, va como slug enriquecido (`arco-globos-desarmable` con lookup interno).
- **Un contenido = una URL canónica.** Filtros y orden viajan como *query params* (`?orden=precio-asc&color=blanco`) y **no** generan URLs indexables nuevas; se define `rel=canonical` a la ruta base de la categoría.
- **Sin `.html`, sin trailing slash inconsistente.** Elegir una convención (sin trailing slash) y forzarla por redirect.
- **Redirecciones 301** planificadas para cualquier cambio de slug (evitar 404 que rompan SEO/enlaces externos).

Ejemplos canónicos:

```
BIEN   /productos/hierro
BIEN   /productos/hierro/arco-globos-desarmable
BIEN   /evento/ediciones/edicion-07
BIEN   /evento/disertantes/nombre-apellido
MAL    /productos?cat=hierro           (categoría como query → debe ser segmento)
MAL    /Productos/Hierro/Arco_Globos   (mayúsculas / guion bajo)
MAL    /producto.php?id=12345          (no semántico)
```

TODO(contenido): definir convención de slug para ediciones. Provisional: `edicion-07` (edición 7 = la última previa) hasta confirmar si se prefiere año (`2024`) o nombre propio de cada edición.

---

## 5. Jerarquía y navegación

La navegación tiene **tres piezas**: header persistente, menú full-screen overlay, y footer.

### 5.1 Header (persistente, minimal)

- **Siempre presente**, minimalista. En estado inicial es casi invisible (logotipo + botón de menú + acceso al carrito/consulta). No compite con el hero.
- **Comportamiento en scroll:** se contrae/oculta al bajar y reaparece al subir (patrón "smart header"), con un fondo que se vuelve sólido/translúcido al salir del hero para garantizar contraste. Motion suave, nunca brusco (ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)).
- **Contenido mínimo del header:**
  - Logotipo → `/`
  - Disparador del **menú overlay** (botón "Menú" / ícono)
  - Acceso al **carrito / consulta** (según §9)
  - (Opcional) CTA contextual del evento cuando la fecha está cerca — ver §8.
- **Accesibilidad:** foco visible, `aria-expanded` en el disparador, navegable por teclado, `skip-to-content`.

### 5.2 Menú full-screen overlay

La navegación principal **no vive en una barra horizontal** (sería genérico y no pasaría la Quality Bar). Vive en un **overlay a pantalla completa**, teatral, que ocupa el momento de decisión del usuario.

- **Apertura teatral**: reveal con máscara, entrada escalonada de los ítems, el fondo del sitio se atenúa. `prefers-reduced-motion` → aparición directa sin desplazamientos.
- **Estructura del menú** (agrupada por las unidades de negocio, no como lista plana):

```
MENÚ (overlay full-screen)
├── Productos            → /productos
│   ├── Hierro           → /productos/hierro
│   ├── MDF              → /productos/mdf
│   ├── Madera           → /productos/madera
│   └── Fundas y telas   → /productos/fundas-y-telas
├── Evento               → /evento
│   ├── Próxima edición  → /evento
│   ├── Ediciones        → /evento/ediciones
│   └── Disertantes      → /evento/disertantes
├── Membresía            → /membresia
├── Historia             → /historia
└── Contacto             → /contacto
```

- **Extras del overlay** (refuerzan marca): un dato editorial (la fecha del evento con `EVENT_NAME`), redes, y un micro-relato. No es solo una lista de links: es una pieza de marca.
- **Cierre:** por botón, tecla `Esc`, o clic fuera del bloque de navegación. Devuelve el foco al disparador.

### 5.3 Footer

El footer es el **cierre editorial** y el mapa completo. Tono cálido, no una grilla fría de links.

- **Bloques:** marca + micro-manifiesto · navegación completa (mismas ramas del menú) · newsletter/membresía · contacto + redes · legales.
- **CTA de cierre**: una invitación (al evento o a la membresía según prioridad de campaña).
- **Legales** siempre accesibles desde el footer (`/legales/*`).

TODO(contenido): copy del micro-manifiesto del footer y del texto editorial del overlay (Flor).

---

## 6. Breadcrumbs

Los breadcrumbs se usan **solo en el flujo de e-commerce** (donde el usuario navega en profundidad y necesita orientación), **no** en las páginas de marca/evento (donde romperían el tono editorial e inmersivo).

- **Dónde aparecen:** `/productos/[categoria]` y `/productos/[categoria]/[slug]`.
- **Dónde NO aparecen:** `/`, `/historia`, `/evento`, `/membresia`, `/contacto` (usan navegación contextual y el overlay).
- **Formato visual:** discreto, tipográfico, sin cajas. Debe sentirse editorial, no un widget de tienda genérica.

```
Inicio  ›  Productos  ›  Hierro  ›  Arco de globos desarmable
```

- **SEO:** implementar con **JSON-LD `BreadcrumbList`** (structured data) además del render visual, para *breadcrumbs* enriquecidos en Google. Detalle en [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md).
- **Accesibilidad:** `<nav aria-label="Migas de pan">`, último ítem con `aria-current="page"`.

---

## 7. Estados de página (loading, vacío, error, 404)

Cada estado es una **oportunidad de marca**, no un descarte técnico. Un skeleton feo o un "Error 500" pelado no pasan la Quality Bar.

### 7.1 Loading

- **Nivel App Router:** cada segmento con carga de datos tiene su `loading.tsx` con un **skeleton fiel al layout final** (misma grilla, mismas proporciones), no un spinner centrado.
- **Catálogo:** skeleton de grilla de productos (placeholders con proporción correcta de foto + línea de título + línea de precio).
- **PDP:** skeleton de galería + bloque de datos.
- **Transiciones:** el smooth scroll y los reveals no deben "pelear" con el estado de carga; el contenido aparece con el motion definido, no de golpe.

### 7.2 Estado vacío (empty state)

- **Categoría sin productos / filtro sin resultados:** mensaje cálido + acción clara (limpiar filtros / ver otra categoría / ir a "a medida"). Nunca una pantalla en blanco.
  - Ejemplo de copy: TODO(contenido) — provisional: *"Todavía no hay piezas en esta combinación. Probá con otro color o contanos qué buscás y lo hacemos a medida."* + CTA a `/contacto`.
- **Carrito vacío:** invitación a volver al catálogo, no un callejón sin salida.
- **Ediciones/disertantes vacíos** (antes de cargar datos reales): estado "próximamente" elegante, no un error.

### 7.3 Error

- **`error.tsx` por segmento** (catálogo, PDP, evento): captura fallos de datos y ofrece **reintentar** + una salida (volver al catálogo / a la home). Copy humano, nunca stack traces.
- **Distinguir** error recuperable (fallo de red → reintentar) de error de contenido (dato inexistente → 404).
- Ejemplo de copy: TODO(contenido) — provisional: *"Algo no cargó como esperábamos. Probá de nuevo en un momento."* + botón "Reintentar".

### 7.4 404 (not-found)

- **`not-found.tsx` global** + `notFound()` en rutas dinámicas cuando el slug no existe (producto/edición/disertante inexistente).
- Debe ser una **pieza de marca**: tono cálido, con personalidad, no un "404 Not Found" del navegador.
- **Salidas claras:** a la Home, al catálogo, al evento. Idealmente con un guiño editorial (flores/fiesta).
- Ejemplo de copy: TODO(contenido) — provisional: *"Esta página se fue de fiesta. Volvamos a algo lindo."* + accesos rápidos.

| Estado | Archivo App Router | Prioridad | Nota de tono |
|---|---|---|---|
| Loading global | `app/loading.tsx` | P1 | Skeleton fiel, no spinner |
| Loading catálogo | `app/productos/loading.tsx` | P0 | Grilla skeleton |
| Loading listado | `app/productos/[categoria]/loading.tsx` | P0 | Grilla skeleton |
| Empty (filtros) | dentro de la page | P0 | Cálido + acción |
| Empty (carrito) | dentro de `/carrito` | P0† | Invitación al catálogo |
| Error segmento | `error.tsx` por ruta | P0 | Humano + reintentar |
| 404 | `app/not-found.tsx` | P1 | Pieza de marca |

---

## 8. Convivencia e-commerce ↔ eventos

El riesgo del proyecto es que **un flujo canibalice al otro**: que la tienda "abarate" la marca, o que el evento tape la venta de productos. La arquitectura lo resuelve así:

1. **Home como bifurcación clara, no como mezcla.** La Home no vende un producto puntual ni inscribe directamente: **presenta las puertas** (Productos, Evento, Membresía, Historia) con jerarquía y deseo. La decisión de a dónde ir es del usuario, guiada por el relato. Ver secciones de la Home en [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md).

2. **Tono por rama, sistema compartido.** Productos usa un tono **claro, funcional y confiable** (precio, medida, envío visibles y sin vueltas). Evento usa un tono **cinematográfico y aspiracional**. Ambos comparten header, footer, tipografía y tokens: es la misma casa con habitaciones distintas.

3. **CTA del evento contextual, no invasivo.** Cuando la próxima edición está cerca (18/09), puede aparecer un **CTA de evento en el header y el footer**, e incluso una tira sutil en el catálogo ("La próxima edición es el 18/09"). Nunca un pop-up que interrumpa la compra. TODO(contenido): definir ventana temporal en la que ese CTA aparece.

4. **Cross-links con criterio, no ruido.** La PDP puede sugerir el evento solo si es coherente ("¿Vas a montar el evento vos misma? Sumate al workshop"). El evento puede linkear a productos usados en ediciones ("Estas piezas se usaron en la edición 07"). Son puentes narrativos, no banners.

5. **Métricas separadas.** Cada flujo tiene su propio embudo y KPIs (ver [`15_ROADMAP.md`](./15_ROADMAP.md)): venta/consulta de producto por un lado; inscripción y membresía por el otro. No se mezclan en un único "objetivo" difuso.

Diagrama de convivencia:

```
                          ┌─────────────┐
                          │     /  HOME  │  (relato + puertas)
                          └──────┬──────┘
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
      🛍️ PRODUCTOS          ✨ EVENTO           ✨ MEMBRESÍA
      /productos            /evento             /membresia
        │                     │                    │
        ▼                     ▼                    ▼
   [categoria]           inscripcion            alta
        │                 ediciones
        ▼                 disertantes
   [slug] PDP
        │
        ▼
   carrito / consulta ──── (checkout: ver §9)

         ✨ HISTORIA (/historia)  ── autoridad, alimenta a los tres
         ⚙️ CONTACTO (/contacto)  ── consulta general + presupuesto a medida
```

---

## 9. El checkout (DECIDIDO ✅ — ADR-007)

**Checkout propio con Mercado Pago.** Implica: `/carrito` propio + `app/api/*` (crear preferencia, **webhook** de pago con firma + idempotencia) + gestión de stock propia (en Payload). Control total de la experiencia de punta a punta.

- Tienda Nube y Mercado Libre **quedaron descartados** (Flor ya no los usa; ver [`CONTENIDO_FLOR.md`](./CONTENIDO_FLOR.md)). No hay checkout externo ni "Comprar en la tienda".
- Los productos **a medida** no tienen compra directa: su CTA abre un **flujo de presupuesto** (`/contacto` o formulario dedicado → colección de leads).
- Arquitectura y tareas del backend: `colaboracion/gonzalo/` (02 arquitectura, 03 backlog).

---

## 10. Pendientes de contenido

Todo lo siguiente bloquea o condiciona la arquitectura final. Nada de esto debe presentarse como definitivo hasta confirmarse (ver checklist en [`16_DECISIONS.md`](./16_DECISIONS.md)):

- `TODO(contenido)`: **`EVENT_NAME`** — nombre definitivo del evento del 18/09 (¿"8vo Workshop" vs "Sweet Flowers Event Summit"?). Afecta títulos, `<title>`, breadcrumbs y el segmento `/evento`.
- `TODO(contenido)`: **listado real de categorías/materiales** → fija los slugs de `/productos/[categoria]`.
- `TODO(contenido)`: **decisión de checkout** (§9) → define existencia y prioridad de `/carrito` y `app/api/*`.
- `TODO(contenido)`: **convención de slug de ediciones** (`edicion-07` vs año vs nombre propio).
- `TODO(contenido)`: **¿perfiles individuales de disertantes en v1?** → define si `/evento/disertantes/[slug]` entra en el lanzamiento.
- `TODO(contenido)`: **ventana temporal del CTA de evento contextual** en header/footer/catálogo.
- `TODO(contenido)`: copys de estados vacíos, error y 404 (los de este doc son provisionales).

---

> Este documento es **vivo**. Cualquier ruta nueva, cambio de slug o decisión de checkout debe reflejarse acá **antes** de tocar el código. La documentación manda sobre el código.
