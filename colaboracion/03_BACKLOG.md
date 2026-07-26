# 03 — Backlog (tu plan de trabajo)

Tu hoja de ruta, por fases. **Hacé las tareas en orden**: cada fase se apoya en la anterior. Las Fases 0 y 1 están detalladas tarea por tarea (tu primera semana+). Las Fases 2–6 están en resumen; las detallamos juntos cuando llegues.

> **Regla:** una tarea = una rama = uno o varios commits chicos = un PR. Franco revisa antes de mergear.

**Cómo se lee cada tarea:**
- **Objetivo** — qué querés lograr.
- **Por qué** — para qué sirve en el todo.
- **Cómo encararlo** — pasos sugeridos.
- **Leé primero** — docs a revisar antes de empezar.
- **Criterios de aceptación** — cómo sabés que está bien.
- **Prompt sugerido** — cómo arrancarlo con Claude Code (plantillas completas en [`04`](./04_PLANTILLAS_PROMPTS.md)).

---

## FASE 0 — Fundaciones (esto desbloquea a Franco)

Meta de la fase: dejar el **modelo de datos + el panel de carga** funcionando, para que Franco empiece a cargar contenido real enseguida.

### Tarea 0 — Spike: validar Payload 3 con Next 16.2 ⏱️ medio día

- **Objetivo:** confirmar en una rama descartable si Payload 3 integra bien con este Next.js. Es una prueba, no producción.
- **Por qué:** toda la fase depende de esto. Si Payload no anda con esta versión, cambiamos de plan ANTES de invertir una semana (ver `02_ARQUITECTURA_BACKEND.md §6`).
- **Cómo encararlo:**
  1. Rama `spike/payload`.
  2. Leé la doc oficial de instalación de Payload (versión 3, con Postgres) y la nota de compatibilidad con Next.
  3. Seguí su guía de instalación en el proyecto (o en una copia limpia si preferís no ensuciar). Levantá `/admin`.
  4. Anotá: ¿instaló?, ¿levanta el panel?, ¿`npm run build` sigue pasando?, ¿hubo que forzar versiones?
- **Leé primero:** [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) · `docs/16_DECISIONS.md` (ADR-011) · [`../AGENTS.md`](../AGENTS.md).
- **Criterios de aceptación:**
  - [ ] Un reporte corto (media carilla) a Franco: "funciona / funciona con estos ajustes / no funciona por X".
  - [ ] Si funciona: el panel `/admin` abre en local.
  - [ ] **Decisión tomada con Franco** antes de seguir a la Tarea 1.
- **Prompt sugerido:** *"Vamos a hacer un spike para validar si Payload CMS 3 es compatible con Next 16.2.11 en este repo. Primero leé `node_modules/next/dist/docs` lo relevante y buscá la doc/versión de Payload compatible. Explicame el plan de instalación paso a paso ANTES de tocar nada. No toques `main`."*

### Tarea 1 — Conectar Postgres (Neon) y Blob por el Marketplace de Vercel ⏱️ medio día

- **Objetivo:** tener la base de datos y el almacenamiento de imágenes conectados.
- **Por qué:** Payload necesita dónde guardar datos (Postgres) e imágenes (Blob).
- **Cómo encararlo:**
  1. En el panel de Vercel del proyecto, agregá desde el **Marketplace** una base **Postgres (Neon)** y **Vercel Blob**.
  2. Traé las variables de entorno a local (`vercel env pull` o copiándolas a `.env.local`). **`.env.local` no se sube a Git** (verificá que esté en `.gitignore`).
  3. Configurá Payload para usar esa Postgres y el adaptador de Blob.
- **Leé primero:** `colaboracion/01_COMO_TRABAJAMOS.md §6` (secretos) · doc de Payload (Postgres adapter + Blob storage).
- **Criterios de aceptación:**
  - [ ] Payload levanta contra la Postgres real (no una local suelta).
  - [ ] Ninguna credencial quedó en el código ni en un commit.
  - [ ] `npm run build` pasa.
- **Prompt sugerido:** ver plantilla "arrancar tarea" en [`04`](./04_PLANTILLAS_PROMPTS.md).

### Tarea 2 — Modelar las colecciones núcleo ⏱️ 1–2 días

- **Objetivo:** crear las colecciones `Products`, `Media`, `Categories`/`Materials`, `Events`, `Testimonials` y el global `Site`.
- **Por qué:** es el modelo de datos sobre el que se apoya todo el sitio.
- **Cómo encararlo:**
  1. Partí del borrador de `02_ARQUITECTURA_BACKEND.md §5` y del checklist de contenido de `docs/16_DECISIONS.md §C` (materiales, +15% por canal, "a medida", stock…).
  2. Modelá **una colección a la vez**, un commit por colección.
  3. Campos tipados y con nombres claros. Slugs para las URLs.
  4. Generá los tipos (`payload-types.ts`) y verificá que no haya `any`.
- **Leé primero:** `docs/16_DECISIONS.md §C` · `docs/11_SEO_STRATEGY.md` (qué campos necesita el schema Product/Event) · `components/sections/*` (mirá qué datos consumen hoy las secciones para no olvidarte campos).
- **Criterios de aceptación:**
  - [ ] Las colecciones aparecen en `/admin` y se puede crear/editar un registro de prueba.
  - [ ] Los campos cubren lo que las secciones actuales muestran (producto: material, precio, stock, a medida; evento: edición, fecha, lugar…).
  - [ ] Tipos generados, sin `any`. `npm run build` pasa.
  - [ ] Un commit por colección.

### Tarea 3 — Seed de datos placeholder ⏱️ medio día

- **Objetivo:** un script que cargue datos de ejemplo (con `TODO(contenido)`), para no trabajar con la base vacía.
- **Por qué:** Franco y vos necesitan datos para ver el sitio funcionando mientras llega el contenido real.
- **Cómo encararlo:** un script que inserte 5–6 productos, 1–2 eventos y 3 testimonios de ejemplo. Precios como `null` o `0` con nota `TODO(contenido)`. Idempotente (correrlo dos veces no duplica).
- **Criterios de aceptación:**
  - [ ] `npm run <script-de-seed>` carga los datos.
  - [ ] Los datos son evidentemente placeholder (nada de precios "reales" inventados).
- **Al terminar la Fase 0:** avisale a Franco. **Ya puede empezar a cargar contenido en `/admin`** mientras vos seguís con la Fase 1. 🎉

---

## FASE 1 — Storefront con datos reales

Meta: que el catálogo y la ficha de producto lean desde Payload. Franco hace el diseño de las pantallas; **vos hacés que muestren datos de verdad**.

### Tarea 4 — Capa de acceso a datos (`lib/commerce`)

- **Objetivo:** funciones tipadas `getProducts()`, `getProductBySlug()`, etc., que leen de Payload por la Local API y devuelven el tipo `CommerceProduct` (el contrato, no el tipo crudo de Payload).
- **Por qué:** es el adapter. Las pantallas dependen de este contrato estable, no de Payload directo.
- **Leé primero:** `02_ARQUITECTURA_BACKEND.md §4` · doc de Payload (Local API).
- **Criterios de aceptación:**
  - [ ] Un Server Component puede pedir productos y recibir datos tipados.
  - [ ] Si mañana cambiara el origen de datos, solo se toca `lib/commerce`, no las pantallas.

### Tarea 5 — Catálogo `/productos` (datos)

- **Objetivo:** la página de catálogo lista los productos reales desde `lib/commerce`. **La UI la maqueta Franco**; vos cableás datos, paginación/filtros por material y estados (sin stock, a medida).
- **Criterios de aceptación:**
  - [ ] `/productos` muestra los productos de la base.
  - [ ] Filtro por material funciona. Estados "sin stock" / "a medida" bien manejados.
  - [ ] Renderiza en el servidor (RSC).

### Tarea 6 — Ficha de producto `/productos/[slug]` (PDP)

- **Objetivo:** la ficha lee el producto por slug, con sus imágenes (Blob), material, medidas, si es desarmable/pintable, y CTA (comprar o pedir presupuesto según si es "a medida").
- **Criterios de aceptación:**
  - [ ] URL por slug funciona; `generateMetadata` con título/desc del producto (SEO).
  - [ ] Imágenes con `next/image`.
  - [ ] Producto inexistente → 404 correcto.

---

## FASE 2 — Carrito (resumen)

Estado de carrito (cliente) + validación de stock en el servidor. Agregar/quitar/actualizar cantidades, persistencia (cookie/localStorage), resumen de compra. **Nada de confiar en precios/stock del cliente: se validan en el servidor.**

## FASE 3 — Checkout + Mercado Pago (resumen)

El corazón transaccional (ADR-013): crear preferencia de **Checkout Pro**, redirigir, recibir el **webhook** (Node, con firma + idempotencia), crear la **Order** en Payload, **descontar stock**, página de "gracias" y email de confirmación (Resend). **Todo probado en entorno de test antes de producción.** Requiere credenciales de Mercado Pago (carpeta `00_ACCESOS`).

## FASE 4 — Productos a medida / presupuesto (resumen)

Flujo de consulta: formulario → colección `Quotes/Leads` → email al equipo y al cliente. No es compra directa.

## FASE 5 — Membresía / cuentas (resumen)

Cuentas de cliente (auth de Payload), acceso a la membresía/comunidad, contenido o beneficios según estado. Se diseña cuando el negocio defina qué incluye la membresía (`docs/16_DECISIONS.md`, carpeta 04_MEMBRESIA).

## FASE 6 — Hardening (resumen)

Tests de los flujos críticos (checkout, webhook), headers de seguridad, validación de inputs, revisión de dependencias, observabilidad/logs, performance (Core Web Vitals) y accesibilidad. Ver `docs/13_DEVELOPMENT_STANDARDS.md` y `docs/11_SEO_STRATEGY.md`.

---

## Tablero rápido

| Fase | Entregable | Desbloquea |
|---|---|---|
| 0 | Modelo de datos + panel `/admin` + seed | **Franco carga contenido** |
| 1 | Catálogo + ficha leyendo datos | mostrar el catálogo real |
| 2 | Carrito | camino a la compra |
| 3 | Checkout + Mercado Pago + webhooks | **vender** |
| 4 | Presupuesto "a medida" | consultas de productos custom |
| 5 | Membresía / cuentas | comunidad |
| 6 | Hardening | producción seria |

> ¿Terminaste una fase o te trabaste? Avisale a Franco. Detallamos la siguiente fase juntos cuando llegues.
