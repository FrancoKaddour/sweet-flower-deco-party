# 16 — Decisiones y preguntas abiertas

> Registro de decisiones (formato **ADR liviano**), decisiones **abiertas** y **checklist de contenido pendiente**. Es el documento donde vive el "estado real" del proyecto: qué está decidido, qué falta decidir y qué contenido falta entregar.
> Enlaza con: [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) · [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) · [`10_TECH_STACK.md`](./10_TECH_STACK.md) · [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) · [`14_LINKEDIN_STRATEGY.md`](./14_LINKEDIN_STRATEGY.md) · [`15_ROADMAP.md`](./15_ROADMAP.md)

> **Documento VIVO.** Cada vez que se toma una decisión o se recibe contenido, se actualiza acá. Formato de cada ADR: **Contexto → Decisión → Consecuencia → Estado**.

---

## A. Decisiones ya tomadas

### ADR-001 — Framework: Next.js (App Router)
- **Contexto:** sitio premium editorial que necesita excelente SEO, performance y renderizado en servidor, con rutas dinámicas (productos, evento, blog).
- **Decisión:** Next.js con **App Router** + TypeScript estricto.
- **Consecuencia:** RSC por defecto, Metadata API nativa para SEO ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)), streaming, `next/image` y `next/font`. `"use client"` solo donde haya interacción real. Curva de App Router asumida.
- **Estado:** ✅ Firme.

### ADR-002 — Animación: GSAP (ScrollTrigger + SplitText)
- **Contexto:** el mood es cinematográfico; el motion es parte del producto, no decoración.
- **Decisión:** GSAP con ScrollTrigger y SplitText como base de animación.
- **Consecuencia:** reveals con máscara, títulos palabra por palabra, parallax scrubbed ([`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)). **GSAP y todos sus plugins son gratuitos** desde la adquisición por Webflow: no es argumento válido evitarlo. Hay que respetar `prefers-reduced-motion` siempre.
- **Estado:** ✅ Firme.

### ADR-003 — Smooth scroll: Lenis
- **Contexto:** la sensación de scroll editorial (peso, inercia) es central para el premium.
- **Decisión:** Lenis para smooth scroll, integrado con ScrollTrigger.
- **Consecuencia:** scroll cohesivo con las animaciones scrubbed. Riesgo de INP si se abusa: animar solo `transform`/`opacity`. Desactivar/atenuar con `prefers-reduced-motion`.
- **Estado:** ✅ Firme.

### ADR-004 — Deploy: Vercel
- **Contexto:** integración nativa con Next.js, previews por rama, edge, imágenes.
- **Decisión:** deploy en Vercel.
- **Consecuencia:** previews automáticos para validar con Flor, dominios y 301 gestionados en Vercel, analytics disponibles.
- **Estado:** ✅ Firme.

### ADR-005 — Mood: editorial cálido / cinematográfico
- **Contexto:** rubro flores/deco de eventos; se busca emoción y elegancia, no un e-commerce frío.
- **Decisión:** dirección editorial cálida y cinematográfica (ver [`02_BRAND.md`](./02_BRAND.md), [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md)).
- **Consecuencia:** cada sección tiene identidad propia; ningún layout se repite; motion con propósito. Las referencias se **adaptan** a este mood, no se copian (ver [`17_REFERENCES.md`](./17_REFERENCES.md)).
- **Estado:** ✅ Firme.

### ADR-006 — Design tokens provisionales
- **Contexto:** aún no llegó el manual de marca (paleta/tipografía definitivas).
- **Decisión:** trabajar con tokens **provisionales** en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) para no bloquear la Fase 1.
- **Consecuencia:** el prototipo avanza; al llegar el manual, se reemplazan los tokens en un solo lugar. Riesgo consciente: algún reajuste visual cuando lleguen los definitivos.
- **Estado:** ✅ Firme, pero **sujeto a reemplazo** (ver ADR-009).

---

## B. Decisiones ABIERTAS

### ADR-007 — Estrategia de e-commerce (DECIDIDA ✅ · 2026-07-25)
- **Contexto:** hay que vender productos (hierro, MDF, madera, fundas/telas; stock y a medida) con canales Tiendanube/ML/Mercado Pago y **+15%** de recargo por canal.
- **Opciones evaluadas:**
  | Opción | Ventaja | Costo | SEO/UX |
  |---|---|---|---|
  | **A. Custom desde 0 + Mercado Pago** | Control total de UX/SEO, sin comisión de plataforma extra, coherencia visual premium end-to-end | Mayor desarrollo (catálogo, carrito, stock, checkout, webhooks) | Máximo control de fichas y schema Product |
  | ~~B. Tiendanube headless~~ | ~~Aprovecha gestión de Tiendanube~~ | ~~Medio~~ | ~~Checkout externo~~ |
  | ~~C. Enlace a Tiendanube/ML~~ | ~~Mínimo esfuerzo~~ | ~~Bajo~~ | ~~SEO de fichas vive fuera~~ |
- **Decisión:** **Opción A — e-commerce propio, construido desde 0.** No se enlaza ni se integra Tiendanube. El catálogo, la ficha de producto (PDP), el carrito y el checkout viven dentro del sitio; el cobro se resuelve con **Mercado Pago** (Checkout Pro/Bricks) + webhooks. Los productos a medida se manejan como **flujo de consulta/presupuesto**, no compra directa.
- **Motivo:** el objetivo del proyecto es una **plataforma de marca premium**; un checkout externo (Tiendanube) rompería la experiencia editorial y regalaría el SEO de las fichas. El control total de UX/SEO justifica el mayor desarrollo.
- **Consecuencia:** define toda la **Fase 3** del [`15_ROADMAP.md`](./15_ROADMAP.md) (catálogo → PDP → carrito → checkout MP → webhooks → gestión de stock) y el schema `Product`/`Offer` de [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md). Requiere definir origen de datos de productos (CMS/headless o archivos `content/` versionados — ver ADR-011). Pendiente de accesos: credenciales de Mercado Pago (carpeta `00_ACCESOS`).
- **Estado:** ✅ Decidida. Implementación en Fase 3.

### ADR-011 — Origen de datos + CMS (DECIDIDA con spike ✅ · 2026-07-26)
- **Contexto:** al construir el e-commerce desde 0 (ADR-007), los productos —y también eventos, testimonios, membresía y textos de secciones— necesitan una fuente de datos y un **panel para que el equipo cargue contenido** sin tocar código. Opciones: CMS headless (Payload / Sanity) vs. archivos versionados en `content/` (MDX/JSON) vs. base de datos propia con admin a medida.
- **Decisión:** **Payload CMS 3, self-hosted DENTRO del mismo proyecto Next.js**, sobre **Postgres (Neon, vía Vercel Marketplace)** y con **Vercel Blob** para media.
  - Da un panel `/admin` de nivel producción → el equipo carga productos/eventos/testimonios sin tocar código.
  - Colecciones modeladas como TypeScript (`collections/*`) → **el modelo de datos ES código versionado y tipado** (`payload-types.ts`), sin `any`, revisable por PR.
  - Los Server Components leen por la **Local API** de Payload (sin salto HTTP) → rápido y tipado.
- **Salvedad / riesgo (importante):** Payload 3 se integra muy de cerca con Next; hay que **validar su compatibilidad con Next 16.2.11 en un spike de día 1** (ver `colaboracion/03_BACKLOG.md`, Tarea 0). Si hay fricción irresoluble, **fallback documentado**: (a) **Sanity** (headless hosted, desacoplado de la versión de Next) o (b) **Postgres + Drizzle + admin propio**.
- **Consecuencia:** define el modelo de datos, el panel de carga, el origen del schema `Product`/`Event` de [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) y toda la Fase 0 del plan de backend. Reemplaza la recomendación provisional de "archivos en `content/`" (que queda solo como fallback rápido para el prototipo).
- **Estado:** ✅ Decidida (sujeta al resultado del spike de compatibilidad).

### ADR-013 — Arquitectura de pagos y commerce (DECIDIDA ✅ · 2026-07-26)
- **Contexto:** ADR-007 fija e-commerce propio con **Mercado Pago**. Falta definir *cómo* se estructura para que sea robusto, testeable y **cambiable de proveedor** sin reescribir la UI.
- **Decisión:**
  - **Patrón adapter**: una interfaz estable `lib/commerce/` (`CommerceProduct`, `Cart`, `createCheckout`, …) independiente del proveedor. Mercado Pago vive detrás, como implementación intercambiable.
  - **Cobro**: **Checkout Pro** primero (redirect, sin manejar datos de tarjeta → menos carga PCI y menos código), evolución a **Bricks** (embebido) cuando la UX lo pida.
  - **Webhooks** en un route handler **Node** (nunca `edge`): verificar firma → **idempotencia** (no procesar dos veces) → crear/confirmar `Order` en Payload → **descontar stock**.
  - **Órdenes** como colección de Payload → se ven en el mismo panel que el resto del contenido.
  - **A medida**: no es compra directa, es **flujo de presupuesto** (colección `Quotes`/`Leads` + formulario + email transaccional con **Resend**, vía Vercel Marketplace).
- **Consecuencia:** define las Fases 2–4 del plan de backend (`colaboracion/03_BACKLOG.md`). Requiere credenciales de Mercado Pago (carpeta `00_ACCESOS`) para el entorno de test antes de producción.
- **Estado:** ✅ Decidida. Implementación en Fase 3 del [`15_ROADMAP.md`](./15_ROADMAP.md).

### ADR-008 — Nombre del evento (ABIERTA 🔴)
- **Contexto:** la 8va edición es el **18/09**. El nombre no está definido: "**8vo Workshop**" vs "**Sweet Flowers Event Summit**".
- **Decisión:** **PENDIENTE**. Necesita definición de Flor.
- **Consecuencia:** el nombre es la **keyword *brand* del evento**, el `Event.name` del schema ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)), el hashtag y el título de los posts de LinkedIn ([`14_LINKEDIN_STRATEGY.md`](./14_LINKEDIN_STRATEGY.md)). Implementación: usar una sola constante `EVENT_NAME` en el código para cambiarlo en un único lugar.
- **Estado:** 🔴 Abierta. **Debe cerrarse antes de la campaña pre-evento.**

### ADR-009 — Paleta y tipografía definitivas (ABIERTA 🟠)
- **Contexto:** los tokens actuales son provisionales (ADR-006).
- **Decisión:** **PENDIENTE** hasta recibir el manual de marca.
- **Consecuencia:** al llegar, se reemplazan los tokens de [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Cuanto antes lleguen, menos retrabajo en Fase 1.
- **Estado:** 🟠 Abierta. Depende de contenido (carpeta 01_MARCA).

### ADR-010 — Dominio canónico (ABIERTA 🟠)
- **Contexto:** hay que elegir `www` vs apex y el dominio productivo.
- **Decisión:** **PENDIENTE**.
- **Consecuencia:** define `metadataBase`, canonicals y el 301 ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) §1.6).
- **Estado:** 🟠 Abierta. Necesaria para Fase 5.

### ADR-012 — Tipografía (inspiración snask.com) (DECIDIDA con salvedad ✅ · 2026-07-25)
- **Contexto:** el cliente pidió usar "las mismas tipografías" de [snask.com](https://snask.com). Inspección en vivo (estilos computados + `@font-face`): títulos con **Snaskface** (tipografía **propia/custom** de Snask, self-hosted, **no licenciable**), cuerpo con **Apercu** (Colophon Foundry, **comercial de pago**), y acentos **Lacrima Senza** + **Platform** (también **de pago**).
- **Decisión:** **NO** se copian las fuentes de Snask (Snaskface es su identidad de marca y no está a la venta; el resto exige comprar licencia webfont). Se replica el **espíritu** (display grotesca con carácter + cuerpo grotesca limpia tipo Apercu) con equivalentes **gratuitos y de uso comercial**:
  - **Display:** `Bricolage Grotesque` (Google Fonts) — ≈ Snaskface. Upgrade opcional con más punch: `Clash Display` (Fontshare, gratis, self-hosted).
  - **Cuerpo:** `Hanken Grotesk` (Google Fonts) — muy cercana a Apercu.
- **Implementación:** cableadas vía `next/font` en `app/layout.tsx`; tokens `--font-display` / `--font-sans` en `app/globals.css`. Cambiarlas es **un solo lugar**.
- **Salvedad / tensión:** este pairing es más **bold/contemporáneo** que la dirección **editorial-romántica** documentada (Fraunces) en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Reconciliar con el mood definitivo cuando llegue el **manual de marca** (ADR-009). Alternativa si se quiere lujo real: licenciar Apercu o usar una serif editorial premium.
- **Estado:** ✅ Decidida para el boceto (Fase 1), sujeta a revisión con el manual de marca.

---

## C. Checklist de contenido pendiente (mapa de carpetas + 22 preguntas)

> Esta es la lista maestra de lo que **falta entregar**. Mientras esté incompleta, las Fases 2–5 del [`15_ROADMAP.md`](./15_ROADMAP.md) permanecen bloqueadas. Marcar con ✅ a medida que se recibe cada ítem.

### Estructura de carpetas solicitada

| Carpeta | Contenido esperado | Estado | Bloquea |
|---|---|---|---|
| **00_ACCESOS** | Accesos/credenciales (dominio, Tiendanube/ML, Mercado Pago, redes, hosting de assets) | ⬜ | Fases 3, 5 |
| **01_MARCA** | **Logo vectorial** (SVG/AI), **manual de marca** (paleta, tipografía, usos), **fotos de Flor** | ⬜ | ADR-009, Fase 2 |
| **02_PRODUCTOS** | **Listado maestro** (nombre, material, precio, +15% por canal, stock, a medida) + **fotos** de producto | ⬜ | Fase 2, schema Product |
| **03_EVENTOS** | **Ediciones** (las 7 previas + 8va), **testimonios**, **sponsors** (logos + nombres), disertantes | ⬜ | Fase 2, schema Event, LinkedIn |
| **04_MEMBRESIA** | Definición de la membresía/comunidad: qué incluye, precio, beneficios | ⬜ | Fase 2, sección membresía |
| **05_TEXTOS** | **Historia** de la marca, **bio** de Flor, copys de secciones y CTAs | ⬜ | Fase 2, blog, LinkedIn |
| **06_VIDEO** | **SweetDay** + **material bruto** para editar | ⬜ | Fase 2, hero/secciones |

### Las 22 preguntas al cliente (mapa a lo que desbloquean)

> `TODO(contenido)`: pegar aquí el texto exacto de cada una de las 22 preguntas cuando se consolide el cuestionario. Debajo, el mapeo temático a las decisiones/entregables que cada grupo destraba.

| # | Tema de la pregunta | Desbloquea |
|---|---|---|
| 1 | Nombre completo de Flor y de la marca | Organization schema, bio, autoría |
| 2 | Historia / origen de la marca | 05_TEXTOS, blog, Pilar 4 LinkedIn |
| 3 | Misión / visión (ser LA referente) | Copy de marca, storytelling |
| 4 | Público objetivo real | [`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md) |
| 5 | ¿Venden y/o alquilan? | FAQPage, fichas, [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) |
| 6 | ¿Hacen a medida? Cómo funciona | Flag "a medida", FAQ, schema `PreOrder` |
| 7 | Listado maestro de productos | 02_PRODUCTOS, catálogo, sitemap |
| 8 | Precios y política +15% por canal | Fichas, offers de schema, e-commerce |
| 9 | Gestión de stock actual | ADR-007 (elección e-commerce) |
| 10 | Canales de venta (Tiendanube/ML/MP) | ADR-007, 00_ACCESOS |
| 11 | Fotos de productos disponibles | 02_PRODUCTOS, `alt` reales |
| 12 | Nombre definitivo del evento | ADR-008, schema Event, LinkedIn |
| 13 | Fecha/hora/lugar/modalidad del evento | Event schema, sección evento |
| 14 | Disertantes de la 8va edición | Event `performer`, LinkedIn |
| 15 | Sponsors (logos + nombres) | Prueba social, LinkedIn Pilar 3 |
| 16 | Datos de las 7 ediciones previas | Trayectoria, prueba social |
| 17 | Testimonios de alumnas | Prueba social, LinkedIn, blog |
| 18 | Precio e inscripción al evento | Event `offers`, Fase 3 |
| 19 | Membresía: qué incluye y precio | 04_MEMBRESIA, sección membresía |
| 20 | Comunidad: cómo se accede | Sección comunidad, CTAs |
| 21 | Redes y enlaces oficiales | `sameAs` schema, footer, perfiles |
| 22 | Video (SweetDay + bruto) y su uso | 06_VIDEO, hero/secciones |

> Si el cuestionario real tiene un orden o redacción distintos, se reemplaza esta tabla manteniendo la columna "Desbloquea".

---

## D. Cómo usar este documento

1. Toda **decisión nueva** entra como ADR (Contexto → Decisión → Consecuencia → Estado).
2. Cuando una decisión abierta se cierra, se mueve de la sección **B** a la **A** y se actualiza su estado.
3. Cuando se recibe contenido, se marca ✅ en la sección **C** y se avisa qué fase se destraba en [`15_ROADMAP.md`](./15_ROADMAP.md).
4. Nada de datos duros inventados: hasta que un ítem esté ✅, su valor en el código es `TODO(contenido)`.

> Documento **vivo**. Última actualización: al crear la Project Bible (v1.0). Actualizar en cada decisión o entrega de contenido.
