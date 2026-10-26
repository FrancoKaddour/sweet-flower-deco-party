# Jurado 2: Developer Award + Usabilidad

Auditoría de solo lectura, 26/10/2026. Medí en producción (`sweet-flower-deco-party.vercel.app`) con Chrome desktop 1920×863 (DPR 1, caché caliente salvo donde lo aclaro) y revisé el código local de Fran (`$HOME/mnt/sweet-flowers-deco-party`).

> **Ojo con las mediciones previas.** El "LCP 13 s del inicio" que se venía usando lo reproduje: **daba 12,6 s porque la pestaña estuvo oculta hasta los 10,7 s** (`visibility-state: hidden@0 → visible@10758`). Chrome no pinta pestañas en segundo plano. Con la pestaña visible, el LCP real en desktop es **1,33 s**. Igual hay un problema de fondo (ver T-03), pero no es de 13 s en desktop. Desde ahora, toda medición tiene que chequear `performance.getEntriesByType('visibility-state')`.
>
> **Límite del entorno:** este Chrome limita el `requestAnimationFrame` a unos 30 fps (35 ms por frame aun en reposo). Por eso los fps absolutos no sirven para comparar: reporto solo los frames largos por encima de esa base y los Long Animation Frames (LoAF).

---

## 1. Nota del jurado (escala Awwwards 1-10)

| Criterio | Nota | Justificación |
|---|---|---|
| **Usability (30 %)** | **5.5** | En desktop, /event-summit **congela la pestaña para siempre** al llegar a "El camino hasta acá" (T-01). Además, volver al inicio cuesta 6,8 s de intro cada vez y cada click interno ~3 s de cortina. |
| Semantics / SEO | 7.5 | Hay un H1 por página, landmarks correctos, canonical y hreflang. JSON-LD rico, pero `Product` sale sin `offers`, todas las páginas saltan de H2 a H4 en el footer y el 404 no tiene título propio. |
| Animations / Transitions | 7.0 | La coreografía está muy bien hecha y respeta reduced-motion. Pero una animación de layout congela la página, no hay forma de saltear la intro y el video/marquee no se pueden pausar. |
| Accessibility | 6.0 | Están bien el skip link, los diálogos del carrito y del lightbox, el foco visible, la diana táctil ≥24 px y `lang`. Fallan el contraste de los eyebrows champagne (2,19:1) y del anillo de foco sobre bone, los inputs sin label en el carrito, la trampa de foco del menú que se escapa y la falta de pausa para el video. |
| WPO / Performance | 7.0 | TTFB ~45 ms (todo prerender HIT), CLS 0 en las 5 páginas y LCP < 0,6 s en las internas. En cambio: 864 KB de JS decodificado (~282 KB br) en todas las páginas, TBT desktop de 80-292 ms y un LCP del inicio que depende de que hidrate GSAP. |
| Responsive Design | 8.5 | Ningún desborde horizontal en 10 rutas × 320/390/768/1024/1440/2560. Los targets táctiles en 390 están OK. |
| Markup / Meta | 7.5 | OG completo, `metadataBase` y `noindex` correcto en el preview. Faltan headers de seguridad, hay `<div>` dentro de `<h2>`/`<span>` (SplitText) y un `Event` global inyectado en todas las URLs. |

**Nota Developer estimada hoy: 6.6/10.** Si el jurado abre /event-summit en una notebook (cosa casi segura), el freeze lo descalifica. **Con T-01 a T-06 resueltos, sube a ~7.8.**

---

## 2. Hallazgos

### 🔴 Críticos

**T-01 🔴 /event-summit se congela (bucle infinito en el detector de tono del header)**
- **Dónde:** `/event-summit`, viewport ≥768 px de ancho y ≥521 px de alto sin reduced-motion. Código: `components/site/Header.tsx:87-108` (`toneAt`) en combinación con `components/evento/EdicionesScroll.tsx:82` (`pin: panelEl`).
- **Evidencia:**
  - Reproducido 4 veces en 4 pestañas nuevas. Scrolleando a `y≈11 300` (la sección `#trayectoria`), el renderer deja de responder: `Runtime.evaluate` timeout de 45 s hasta para `1+1`, y las pestañas siguieron colgadas minutos después.
  - Con `y=8 500` responde bien; el corte está entre 10 000 y 11 300.
  - Por DOM: el segundo `.pin-spacer` tiene como `firstElementChild` a `DIV.edc-panel`, con `data-theme=null` y `background: rgba(0,0,0,0)`.
  - En `toneAt`, el `while` sube por los ancestros. Al llegar al pin-spacer salta a `firstElementChild` (el panel). El panel no tiene tema ni fondo, así que `el = el.parentElement` vuelve al pin-spacer, que vuelve a saltar al panel: **bucle infinito**.
  - Se dispara con el scroll, con el `setInterval(schedule, 900)` y con el `focusin` de las tarjetas (que hace `scrollTo`). O sea, también llegando con teclado.
- **Por qué importa:** es el freeze de la página de mayor valor de negocio (inscripción paga), justo antes de los pases y la inscripción. Para Awwwards es eliminación directa en Usability y Developer.
- **Arreglo (cualquiera de los tres, mejor los dos primeros):**
  1. En `toneAt`, cuando encuentra un pin-spacer: `const pinned = el.firstElementChild; if (pinned.dataset.theme) …; el = el.parentElement; continue;`. Es decir, evaluar el hijo una sola vez y seguir hacia arriba desde el spacer, nunca volver a bajar.
  2. Poner un límite de seguridad al loop: `for (let i = 0; el && i < 25; i++)` o un `Set` de visitados.
  3. Agregar `data-theme="dark"` a `.edc-panel` (EdicionesScroll.tsx, en el `div ref={panel}`).
- **Esfuerzo:** S (15 min). Lo prioritario es el límite del loop: el mismo patrón vuelve a romper con cualquier pin futuro.

**T-02 🔴 Volver al inicio vuelve a correr la intro completa, cada vez (5,4 a 6,8 s sin poder usar la página)**
- **Dónde:** `components/intro/Loader.tsx:44-63`; la dependencia `[pathname]` vuelve a armar la intro en cada navegación cliente a `/`.
- **Evidencia:**
  - Carga directa al inicio: la página queda usable (`data-loader="false"`) a los **5 443 ms**.
  - Navegación cliente → `/`: usable a los **6 780 y 6 862 ms** (cortina de 1,8 s + intro), medido 2 veces en el mismo recorrido.
  - Mientras corre, el scroll está bloqueado (`overflow:hidden` + `touch-action:none`) y el header está oculto.
  - No hay forma de saltearla (ni click, ni tecla, ni scroll).
- **Por qué importa:** el jurado navega ida y vuelta 10 veces; a la tercera intro la "firma" se vuelve castigo. Usability 30 %. En conversión, quien vuelve desde una ficha de producto al inicio espera 7 s.
- **Arreglo:**
  - (a) Intro **una vez por sesión**: `sessionStorage.sf_intro=1`, que el script inline del `<body>` lea antes del primer paint para poner `data-loader="false"`.
  - (b) En navegación cliente a `/`, nunca intro: solo la cortina de PageTransition y el hero ya expandido.
  - (c) Permitir saltear: `pointerdown`/`keydown`/`wheel` → `tl.timeScale(4)` o `finish()`.
  - (d) Acortar el `delay` inicial de 0,75 s a 0,3 s.
- **Esfuerzo:** S-M (1-2 h).

**T-03 🟠 El LCP del inicio depende de JS y el home queda bloqueado si el JS falla**
- **Dónde:** `app/globals.css:477-480` (`.c-loader__name span{opacity:0;visibility:hidden}`) y `:504-509` (`overflow:hidden` mientras `data-loader="true"`). `app/layout.tsx:125` escribe `data-loader="true"` en el HTML.
- **Evidencia:**
  - El elemento LCP es `SPAN` ("SWEET", 75 465 px²) a 1 332 ms (FCP 772 ms, TTFB 43 ms). Ese span solo se ve cuando GSAP lo revela tras hidratar y esperar el `delay: 0.75`. Con CPU 4× y 4G simulada (Lighthouse mobile), el LCP queda atado a descargar 282 KB br + parsear 864 KB de JS + hidratar + 0,75 s + 0,5 s de fade, y el poster del video entra todavía más tarde.
  - No existe `<noscript>` en todo el proyecto (grep vacío). Si el chunk de JS falla (red mala, bloqueador, error de runtime), el inicio queda **en blanco**: header y hero ocultos, scroll bloqueado y sin salida. La red de seguridad de 9 s también es JS.
- **Arreglo (sin perder la intro):**
  1. Que "SWEET FLOWERS" aparezca **por CSS** (`@keyframes sf-in {from{opacity:0}to{opacity:1}}` con `animation: sf-in .5s .2s both`) en vez de con `autoAlpha` de GSAP. Así el LCP queda en el primer paint con la fuente (~0,8 s desktop, ~1,8 s mobile) y GSAP toma la timeline desde el paso 2.
  2. Agregar en el `<head>`: `<noscript><style>body[data-loader=true] .c-hero__media,body[data-loader=true] .c-hero__content,body[data-loader=true] .c-site-header{opacity:1!important;visibility:visible!important;width:100%!important;height:100%!important}html,body{overflow:auto!important;touch-action:auto!important}.c-loader{display:none}</style></noscript>`.
  3. Un watchdog CSS puro: `body[data-loader=true]{animation: sf-unlock 0s 10s forwards}` que restaure `overflow` aunque el JS no corra.
- **Esfuerzo:** M (2-3 h).

### 🟠 Altos

**T-04 🟠 Cada click interno cuesta ~3 s (cortina de globos sin modo rápido)**
- **Dónde:** `components/motion/PageTransition.tsx:103-149`.
- **Evidencia:** 10 navegaciones cliente medidas: el cambio de ruta ocurre a los 1 450-1 911 ms del click y la página queda usable a los **2 945-3 365 ms**.
  - La cortina tarda 0,7 s en tapar, después espera hasta 1 s a los globos y recién ahí hace el `router.push`. **No aprovecha el tiempo de cobertura para cargar la ruta.**
  - Después la revela en 1,55 s.
- **Por qué importa:** en un ecommerce con 60+ fichas, 3 s por click es fricción pura. El jurado de Usability lo marca como "slow navigation".
- **Arreglo:**
  - Hacer `router.prefetch(href)` en `pointerenter`/`focus` de los links internos.
  - Lanzar `router.push` **al empezar** a cubrir (no al terminar), y que el reveal arranque apenas llega el pathname.
  - Dejar la versión completa (globos) solo para cambios de "sección" (inicio ↔ Summit ↔ productos); entre fichas, una cortina corta de 0,35+0,45 s.
  - Objetivo: ≤1,2 s hasta poder usar la página.
- **Esfuerzo:** M.

**T-05 🟠 Contraste insuficiente en eyebrows champagne y en el anillo de foco sobre fondos claros**
- **Dónde:** `components/ui/Eyebrow.tsx` (`text-champagne`, 70 usos) y `app/globals.css:596-600` (`:focus-visible{outline:2px solid var(--color-champagne)}`).
- **Evidencia:** ratios calculados (WCAG, sRGB):

  | Combinación | Ratio | Mínimo |
  |---|---|---|
  | champagne #c6a15b / bone #f7f3ec | **2,19:1** | 4,5 (texto) y 3,0 (foco, 1.4.11) |
  | ink/50 / bone (migas de pan, "Medidas ·", "Producción", "Envíos", ProductCard 0,66 rem) | 3,45:1 | 4,5 |
  | ink/40 / bone (placeholders, "(opcional)") | 2,57:1 | 4,5 |
  | ink/35 (placeholder del ContactForm) | < 2,3:1 | 4,5 |
  | bone/45 / ink ("Deslizá" del Lightbox) | 4,22:1 | 4,5 |
  | bone/40 / ink | < 4:1 | 4,5 |
  | muted / sand | 4,16:1 | 4,5 |

  Lo que pasa: champagne/ink 7,75, bone/55 / ink 5,71 (links SEO del footer, 13 px), ink/70 / bone 6,7 y muted/bone 4,63.
- **Arreglo:**
  - Crear un token `--color-champagne-ink: #8a6a2c` (≈4,6:1 sobre bone) para eyebrows en secciones `data-theme="light"`.
  - Para el foco: `outline-color: var(--color-ink)` en claro y champagne en oscuro, vía `[data-theme=light] :focus-visible`. O doble anillo: `box-shadow: 0 0 0 2px bone, 0 0 0 4px ink`.
  - Subir ink/50 a ink/65 y los placeholders a ink/55.
- **Esfuerzo:** S-M.

**T-06 🟠 Inputs del carrito sin nombre accesible**
- **Dónde:** `components/cart/CartDrawer.tsx:212-214`.
- **Evidencia:** recorriendo con Tab, el foco llega a `INPUT ""`, `INPUT ""` y `TEXTAREA ""`: solo tienen `placeholder`, sin `<label>` ni `aria-label`. El placeholder además está en ink/40 (2,57:1). Falla 1.3.1, 3.3.2 y 4.1.2.
- **Por qué importa:** es el paso de conversión (el pedido por WhatsApp). Un lector de pantalla anuncia "campo de edición" sin decir cuál.
- **Arreglo:** `<label className="sr-only" htmlFor="cart-nombre">Nombre</label>` (o una label visible chica arriba, mejor para usabilidad) y `id` en cada campo.
- **Esfuerzo:** S.

**T-07 🟠 La trampa de foco del menú se escapa y el fondo no es `inert`**
- **Dónde:** `components/site/Header.tsx:331-348` (el foco entra recién en `onComplete`, ~1 s) y `:438-466` (la trampa solo actúa si el `keydown` nace dentro del overlay).
- **Evidencia:** abrí el menú con Enter y Tab×12. Recorrido del foco: "Abrir menú" → "Cerrar menú" → 01 Inicio → 02 Event Summit → 03 Catering → **"Inicio" (migas de la página de atrás)** → Productos → "Agregar al pedido"…, todo con `aria-modal="true"` abierto.
  - Los links 04+ todavía estaban con `visibility:hidden` por el stagger, así que el navegador los saltea y sale al documento.
  - Escape cierra y devuelve el foco a "Abrir menú" (eso está bien).
- **Arreglo:**
  - Al abrir, `document.querySelector('main')?.setAttribute('inert','')` (más el footer y el resto del header); quitarlo al cerrar.
  - Mover el foco a "Cerrar" de inmediato (aunque visualmente aparezca después).
  - O migrar el overlay a `<dialog>` con `showModal()`, como el Lightbox, que ya lo hace bien.
- **Esfuerzo:** S.

**T-08 🟠 Video del hero y marquee en loop sin control de pausa (WCAG 2.2.2)**
- **Dónde:** `components/sections/HeroMedia.tsx:130` (`<video muted loop …>`, 30 s) y `components/sections/Experiencia.tsx` (marquee con autoplay continuo).
- **Evidencia:** contenido en movimiento de más de 5 s que arranca solo, sin botón de pausa. Reduced-motion lo resuelve solo para quien tiene la preferencia del sistema activada.
- **Arreglo:** botón "Pausar video" (ícono ❚❚ de 44 px, esquina inferior del hero, `aria-pressed`). El mismo control puede pausar el marquee (`tween.pause()`). Es una pieza que el jurado de Awwwards valora como detalle de craft.
- **Esfuerzo:** S.

**T-09 🟠 JSON-LD `Product` sin `offers` en productos "a consultar"**
- **Dónde:** `app/(site)/productos/[categoria]/[slug]/page.tsx:73-98`.
- **Evidencia:**
  - `/productos/catering/alzadas-mdf-mas-pino` emite `Product` con `offers:false`. Google lo marca como error: "Either offers, review or aggregateRating should be specified".
  - En esa misma ficha, la `description` tiene la lista de precios en texto plano ("15cm diámetro x 15cm alto $8.500 … $16.500 15% de recargo x link de mercado pago"), y la UI dice "Precio a consultar". **El JSON-LD, la UI y la descripción se contradicen.**
- **Arreglo:**
  - Si no hay precio, emitir `offers: { "@type":"Offer", availability: MadeToOrder, priceSpecification: {"@type":"PriceSpecification", priceCurrency:"ARS"} }` o directamente no emitir `Product` (usar solo `ItemList` o `WebPage`).
  - Mejor todavía: pasar esas medidas a **variantes** en el panel (medida → precio). Así salen `AggregateOffer lowPrice 8500 highPrice 16500` y "desde $8.500" en la UI.
- **Esfuerzo:** S (JSON-LD) / M (variantes).

### 🟡 Medios

**T-10 🟡 Inicio: 3 Long Animation Frames de hasta 140 ms durante el scroll (GSAP)**
- **Dónde:** el chunk `2klvw9iaxw14b.js` (gsap + ScrollTrigger + SplitText), función minificada `sV`.
- **Evidencia:** scroll programático de 13 801 px en 10 s: p50 de frame igual a la base del entorno (35 ms) y solo 3 frames > 50 ms (140 / 60 / 54 ms).
- **Arreglo:** casi seguro son `ScrollTrigger.refresh()` o splits de SplitText al entrar en la vista. Hacer el split una vez, en `fonts.ready`, con `autoSplit` y `onSplit`. Y no llamar `ScrollTrigger.refresh()` en `Experiencia.tsx:128` dentro del cleanup de matchMedia.
- **Esfuerzo:** M.

**T-11 🟡 INP del botón "Menú": 256 ms en desktop**
- **Evidencia:** PerformanceObserver de tipo `event`: `pointerdown`/`pointerup` sobre "Menú" de 256/248 ms (interactionId 9113). Escape: 120 ms. En mobile con CPU 4× se proyecta a > 500 ms ("poor").
- **Por qué:** `setOpen` re-renderiza todo el Header (712 líneas, con el detector de tono). `buildMenuTimeline` hace `getBoundingClientRect` y una búsqueda binaria de la ease, y `lockScroll` corre en el mismo frame.
- **Arreglo:**
  - Construir la timeline **una vez** en idle (`requestIdleCallback`) y solo `play()` al click.
  - Separar el overlay en un componente memoizado.
  - Pasar `lockScroll` al `onStart` del primer tween.
- **Esfuerzo:** M.

**T-12 🟡 864 KB de JS decodificado (282 KB br) en todas las páginas, incluso fichas estáticas**
- **Evidencia (/productos, 17 chunks):**
  - react-dom 222 KB
  - gsap+plugins 125 KB
  - un chunk de 108 KB
  - gsap core 66 KB
  - lenis 45 KB
  - otros 300 KB
  
  TBT desktop: /productos 292 ms, ficha 205 ms, /event-summit 145 ms, landing SEO 80 ms.
- **Contexto:** 49 archivos con `"use client"`. Entre los innecesarios, o que podrían ser islas más chicas:
  - `components/site/Footer.tsx` es **todo** client por un efecto GSAP: todo el footer (links SEO incluidos) se hidrata en todas las páginas.
  - `components/evento/BotonPase.tsx`: un botón que hace `dispatchEvent`.
- **Arreglo:**
  - Footer como Server Component con un `<FooterMarquee/>` client chico.
  - Cargar SplitText y CustomEase con `import()` dinámico solo donde se usan.
  - Revisar con `@next/bundle-analyzer` qué hay en el chunk de 108 KB.
- **Esfuerzo:** M.

**T-13 🟡 Footer: H4 después de H2 en todas las páginas; H1 → H3 en categoría**
- **Dónde:** `components/site/Footer.tsx:110,129,149`. Además, `/productos/catering` salta de H1 a H3 (cards de producto).
- **Evidencia:** el parser de las 17 rutas reporta `H2>H4` en todas y `H1>H3` en la categoría.
- **Arreglo:** pasar los títulos del footer a `<h2 className="…">` (el estilo no cambia). En la grilla de categoría, que las cards usen `h2`, o meter un `h2` sr-only "Productos de Catering".
- **Esfuerzo:** S.

**T-14 🟡 No hay `error.tsx` / `global-error.tsx` / `loading.tsx` en ningún segmento**
- **Evidencia:** `find app -name error.tsx -o -name loading.tsx -o -name global-error.tsx` no devuelve nada.
  - El catálogo tiene respaldo estático si la base falla (`modules/catalog/repository.ts:89`, muy bien).
  - Pero `/event-summit/inscripcion` (force-dynamic, TTFB ~660 ms), `/cuenta` e `/ingresar` (~1,1 s, `private, no-store`) y todo `/panel/**` muestran la pantalla de error genérica de Next si algo tira, y sin feedback mientras cargan.
- **Arreglo:**
  - `app/(site)/error.tsx` con la marca: "Algo se rompió, escribinos por WhatsApp" + reintentar.
  - `app/global-error.tsx`.
  - `loading.tsx` en `event-summit/inscripcion`, `cuenta` y `panel/(app)` con un skeleton.
- **Esfuerzo:** S-M.

**T-15 🟡 Tras navegar, el foco queda en `<body>`**
- **Evidencia:** después de 10 navegaciones cliente, `document.activeElement = BODY`. El route announcer de Next sí lee el título (verificado), pero quien navega con teclado vuelve a arrancar desde el skip link.
- **Arreglo:** en el reveal de PageTransition, `document.querySelector('main h1')?.focus()` con `tabIndex={-1}` en los H1 (sin outline vía `:focus:not(:focus-visible)`).
- **Esfuerzo:** S.

**T-16 🟡 El carrito muestra "TOTAL TRANSFERENCIA $0" con productos "a consultar"**
- **Dónde:** `components/cart/CartDrawer.tsx:222-223`.
- **Evidencia:** con 1 producto sin precio se ve "$0" grande, y abajo "Algunos productos tienen precio a consultar" (captura en la sesión). El mensaje de WhatsApp sale con "Total (transferencia): $0 (+ productos a consultar)".
- **Arreglo:** si `total === 0 && hayConsultar`, mostrar "A cotizar" y omitir la línea del total en el mensaje.
- **Esfuerzo:** S.

**T-17 🟡 Pie del menú: "Instagram · WhatsApp · Email" es texto plano, no links**
- **Dónde:** `components/site/Header.tsx:706`.
- **Evidencia:** son `<span>` sin `href`. El usuario los ve como links y no pasa nada al tocarlos.
- **Arreglo:** convertirlos en `<a>` reales (IG / wa.me / mailto) con `min-h-11`.
- **Esfuerzo:** S.

**T-18 🟡 El carrito agregado no se anuncia**
- **Dónde:** `components/cart/AddToCartButton.tsx`.
- **Evidencia:** al agregar, el botón cambia a "Agregar otro (1)" y aparece el FAB, pero no hay ninguna región `aria-live`/`role=status` (0 en el DOM). El FAB queda al final del DOM: para llegar al carrito con Tab hay que atravesar toda la página. Además dice "(1 productos)".
- **Arreglo:**
  - `<p role="status" className="sr-only">` en CartProvider: "Agregaste Alzadas mdf. Tenés 1 producto en el pedido".
  - Atajo "Ver pedido" junto al botón tras agregar.
  - Pluralizar el texto.
- **Esfuerzo:** S.

### ⚪ Bajos

- **T-19 ⚪ `Event` del Summit inyectado en el JSON-LD global de todas las URLs** (`components/site/JsonLd.tsx`).
  - Google puede leerlo como un evento duplicado o descontextualizado en 60+ páginas.
  - Arreglo: dejar en el global solo `{"@id": …#summit}` como referencia y el `Event` completo solo en `/event-summit`.
  - Faltan además `performer` (warning; `[BLOQUEADO-TERCEROS]` hasta tener disertantes) y `openingHoursSpecification`/`streetAddress`/`priceRange` en `Store` (`[BLOQUEADO-TERCEROS]`; mientras tanto, `priceRange: "$$"`).
  - Esfuerzo: S.
- **T-20 ⚪ 404 sin título propio** (`app/not-found.tsx`).
  - Hoy sale con el título default del home.
  - Arreglo: `export const metadata = { title: "Página no encontrada" }`.
  - Esfuerzo: S.
- **T-21 ⚪ Sin headers de seguridad.**
  - En las respuestas solo aparece HSTS (de Vercel). Faltan `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy` y `X-Content-Type-Options`.
  - Arreglo: agregarlos en `next.config.ts` `headers()` (CSP con `img-src` para blob/picsum/googleusercontent y `connect-src` para Mercado Pago).
  - Esfuerzo: S-M.
- **T-22 ⚪ HTML inválido por SplitText:** `<div>` dentro de `<span>`/`<h2>` (por ejemplo en el primer H2 de /event-summit).
  - El texto accesible está bien resuelto (sr-only + aria-hidden).
  - Arreglo: `SplitText(…, { tag: "span" })` con `display:inline-block`.
  - Esfuerzo: S.
- **T-23 ⚪ Contenido duplicado en el DOM por la doble versión mobile/desktop.**
  - En /event-summit, "El camino hasta acá" (H2) y "La Rural" (H3) aparecen 2 veces: el DOM queda en 1 033 nodos contra 520-590 del resto.
  - Para el SEO no es grave porque el duplicado va en `display:none`, pero engorda la hidratación.
  - Arreglo: un solo `Intro` y moverlo con CSS grid/order.
  - Esfuerzo: M.
- **T-24 ⚪ Dos links por card de producto con el mismo destino** (imagen + título).
  - Duplica las paradas de Tab: 4 por producto, contando "Agregar" y "Consultar".
  - Arreglo: `tabIndex={-1}` y `aria-hidden` en el link de la imagen.
  - Esfuerzo: S.
- **T-25 ⚪ `/cuenta` e `/ingresar` comparten título "Mi cuenta" y no tienen canonical.**
  - Arreglo: `robots: { index:false }` explícito por página (hoy todo el preview es noindex, pero en el dominio real se indexarían).
  - Esfuerzo: S.

### Lo que está bien (verificado)

- **Responsive:** 0 desbordes horizontales en 10 rutas × 6 anchos (320 → 2560). En 390, ningún target interactivo visible mide menos de 24 px.
- **Diálogos:**
  - Carrito: foco al "Cerrar", trampa Tab/Shift+Tab correcta, Escape cierra y devuelve el foco al FAB.
  - Lightbox: `<dialog>` nativo.
  - Galería: carrusel con flechas de teclado y `aria-current` en las miniaturas.
- **Memoria y limpieza:** 10 navegaciones cliente (incluido el inicio 2 veces y /event-summit). El heap se mantiene entre 17,4 y 20,3 MB sin crecer y los `.pin-spacer` vuelven a 0 fuera del Summit. **Sin leaks de ScrollTrigger.**
- **Rendimiento y estabilidad:**
  - CLS 0,0000 en /, /productos, la ficha, /event-summit y la landing (0,0085 en una carga del inicio).
  - TTFB de 42 a 64 ms en todas las páginas estáticas (`x-vercel-cache: HIT`).
  - LCP: ficha 476 ms (IMG con `priority`), /productos 360 ms (H1), Summit 392 ms (H1), landing 580 ms.
- **Consola:** sin errores ni warnings en la carga de inicio, ficha, trayectoria, inscripción y 404.
- **Marcado y SEO:**
  - `lang="es-AR"`, skip link funcionando como primer Tab, `:focus-visible` global y honeypot correcto (`aria-hidden`, `tabindex=-1`).
  - Un solo H1 en las 17 rutas, sin ids duplicados y sin interactivos anidados.
  - Canonical y hreflang `es-AR` + `x-default`. Títulos de 35-76 caracteres y descripciones de 91-202.
- **Reduced-motion:** lo respetan el Loader, Lenis, PageTransition, el menú, EdicionesScroll (vía matchMedia) y la galería. El CSS global anula animaciones y transiciones.

---

## 3. Top 10 para subir la nota antes del viernes (impacto ÷ esfuerzo)

1. **T-01**: arreglar el bucle de `toneAt` (límite del loop + `data-theme` en `.edc-panel`). 15 min, saca el bloqueante.
2. **T-02**: intro una vez por sesión, nunca en navegación cliente y salteable con cualquier input.
3. **T-05**: token champagne oscuro para eyebrows en claro y anillo de foco ink en secciones claras.
4. **T-06 + T-18**: labels del carrito, `role=status` al agregar y plural.
5. **T-07**: `inert` en el fondo del menú y foco inmediato en "Cerrar".
6. **T-03**: "SWEET FLOWERS" aparece por CSS (LCP sin JS) + `<noscript>` + watchdog CSS.
7. **T-04**: `router.push` al empezar la cortina, prefetch en hover y versión corta entre fichas.
8. **T-08**: botón de pausa del video y del marquee.
9. **T-09 + T-16**: JSON-LD sin `Product` inválido y "A cotizar" en lugar de "$0".
10. **T-13 + T-14 + T-20**: headings del footer, `error.tsx`/`loading.tsx` y título del 404 (una tarde).

---

## 4. Ideas "wow" (viables en 2-3 días)

1. **Intro que aprende:** primera visita con la coreografía completa. En las siguientes de la sesión, un "eco" de 0,8 s: solo el isotipo hace un pulso y los globos se cruzan, como guiño. Con un contador discreto "skip ↵" en la esquina, como los sitios premiados de Locomotive o Active Theory.
2. **Header "camaleón" sin JS por frame:** reemplazar el detector `elementsFromPoint` (que causó T-01) por `animation-timeline: view()` sobre cada sección con `data-theme`, para cambiar `--header-fg` en CSS puro. Cero costo de main thread. Es un argumento de Developer Award ("scroll-driven animations, no JS") que se puede contar en la descripción de la postulación.
3. **View Transitions API para la cortina:** `document.startViewTransition` con los globos como `::view-transition-old/new`. Navegación instantánea con la ruta ya prefetcheada y la firma intacta. El jurado técnico lo detecta en DevTools y suma.
4. **Modo "Accesible por diseño" visible:** un toggle en el footer ("Movimiento: completo / suave / quieto") que guarda la preferencia y desactiva Lenis, la intro y los pins. Muestra intención en accesibilidad, que es un criterio explícito del Developer Award.
5. **Panel de performance de la casa:** una página `/hecho-con` (estilo colophon) con el stack, el peso por página, Core Web Vitals reales tomados con `web-vitals` + `navigator.sendBeacon` a un endpoint propio, y créditos. A Awwwards le encantan los colophons, y da credibilidad a la postulación Developer.
