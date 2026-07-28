# 03 — Backlog (tu plan de trabajo)

Tu hoja de ruta, por fases. **Hacé las tareas en orden**: cada fase se apoya en la anterior. Fases 0 y 1 en detalle (tu primera semana+); Fases 2–6 en resumen (las detallamos juntos cuando llegues). El detalle de cada pantalla del panel está en [`06_DASHBOARD_SPEC.md`](./06_DASHBOARD_SPEC.md).

> **Regla:** una tarea = una rama = uno o varios commits chicos = un PR. Franco revisa antes de mergear.

**Formato de cada tarea:** Objetivo · Por qué · Cómo encararlo · Leé primero · Criterios de aceptación · Prompt sugerido (plantillas en [`04_PLANTILLAS_PROMPTS.md`](./04_PLANTILLAS_PROMPTS.md)).

---

## FASE 0 — Fundaciones (el motor)

Meta: dejar el **motor de datos** en pie para que todo lo demás se apoye. Al terminar, Franco ya puede cargar contenido (por ahora con el `/admin` de Payload, hasta que exista el `/panel`).

### Tarea 0 — Spike: validar Payload 3 con Next 16.2 ⏱️ medio día
- **Objetivo:** confirmar en una rama descartable si Payload 3 integra con este Next.
- **Por qué:** toda la fase depende de esto (ver [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) §7).
- **Cómo:** rama `spike/payload`; leé la doc de instalación de Payload 3 (con Postgres) y su compatibilidad con Next; instalá; levantá `/admin`; anotá si `npm run build` sigue pasando.
- **Criterios:** reporte corto a Franco ("funciona / con ajustes / no") + **decisión tomada juntos** antes de la Tarea 1.
- **Prompt:** *"Vamos a hacer un spike para validar Payload CMS 3 con Next 16.2.11. Leé lo relevante en node_modules/next/dist/docs y la doc de Payload compatible. Explicame el plan ANTES de tocar nada. No toques main."*

### Tarea 1 — Conectar Postgres (Neon) + Blob por el Marketplace ⏱️ medio día
- **Objetivo:** base de datos y almacenamiento de imágenes conectados.
- **Cómo:** desde Vercel → Marketplace, agregá **Postgres (Neon)** y **Vercel Blob**; traé las env vars a local (`vercel env pull`); configurá Payload para usarlas. `.env.local` **no** se sube.
- **Leé primero:** [`07_DB_IMPLEMENTACION.md`](./07_DB_IMPLEMENTACION.md) · [`01_COMO_TRABAJAMOS.md`](./01_COMO_TRABAJAMOS.md) §6.
- **Criterios:** Payload levanta contra la Neon real; ninguna credencial en el código; `npm run build` pasa.

### Tarea 2 — Modelar las colecciones núcleo ⏱️ 2–3 días
- **Objetivo:** `Contacts` (⭐ el centro), `Products`, `Media`, `Categories`/`Materials`, `Events`, `EventRegistrations`, `Memberships`, `EmailCampaigns`, `Testimonials`, `Orders`, `Quotes/Leads`, `Users` y el global `Site`.
- **Clave (ADR-014):** `Contacts` es el eje. `Orders`, `EventRegistrations`, `Memberships` y `Quotes` **se relacionan a un `Contact`** (no repiten email/nombre sueltos). Cada contacto lleva `tags` y `consentEmail` (opt-in con fecha y origen). Esto es lo que hace la base reutilizable para campañas.
- **Cómo:** partí del modelo de [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) §6, el ADR-014 y el checklist de [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) §C. Una colección por commit. Mirá qué datos consumen hoy `components/sections/*` para no olvidar campos.
- **Criterios:** las colecciones aparecen y se puede crear/editar un registro; las relaciones a `Contacts` funcionan; tipos generados sin `any`; build pasa; un commit por colección.

### Tarea 3 — Seed de datos placeholder ⏱️ medio día
- **Objetivo:** script idempotente que cargue 5–6 productos, 1–2 eventos y 3 testimonios de ejemplo (con `TODO(contenido)`; precios `null`).
- **Criterios:** `npm run <seed>` carga datos evidentemente placeholder (nada de precios inventados).

> **Fin de Fase 0:** avisá a Franco. El motor está en pie.

---

## ⚡ PRIORIDAD — Inscripción al evento (deadline 18/09)

> Va **fuera del orden normal** por el **deadline real** del Summit (18/09). Se puede hacer **apenas esté el motor** (Fase 0), en paralelo con la Fase 1. Coordiná con Franco cuándo entra. Es **captura de datos, SIN pago online** — el pago del evento sigue como hoy (transferencia/link de MP), según ADR-014.

### Tarea P1 — Formulario de inscripción + captura en el CRM ⏱️ 1–2 días
- **Objetivo:** una página pública en el sitio donde la gente se anota al Summit; los datos se guardan creando/actualizando un `Contact` + un `EventRegistration`, con **opt-in de email** explícito.
- **Por qué:** junta los datos de los interesados para las campañas y para organizar el evento. Es lo que pidió el negocio y tiene fecha.
- **Cómo:** form → **Server Action** → valida con **Zod** → crea `Contact` (o lo actualiza si el email ya existe) + `EventRegistration` ligado al `Event` del 18/09. Email de confirmación con Resend (opcional). Se ve en el panel (Comunidad → Inscripciones).
- **Leé primero:** ADR-014 en [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) · [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) §6 · [`09_TESTEAR_MERCADOPAGO.md`](./09_TESTEAR_MERCADOPAGO.md) (no aplica pago acá, pero sí el patrón de Server Action + Zod).
- **Criterios:** una persona se anota desde el sitio; queda un `Contact` con opt-in + un `EventRegistration`; **no se duplica** el contacto si el email ya existía; se ve en el panel; sin datos inventados; build pasa.

---

## FASE 1 — Panel a medida (base) + storefront con datos

Meta: levantar el esqueleto del `/panel` (login + layout + primer CRUD real) y que el catálogo lea datos. Franco diseña las pantallas; vos las hacés funcionar.

### Tarea 4 — Auth y layout del panel `/panel` ⏱️ 1–2 días
- **Objetivo:** login seguro (usando la auth de Payload) y un layout base del panel con navegación. Diseño simple/funcional; Franco lo pule después.
- **Por qué:** es la puerta del centro de operaciones. La seguridad la aporta Payload, vos armás la UI.
- **Leé primero:** [`06_DASHBOARD_SPEC.md`](./06_DASHBOARD_SPEC.md) (§ estructura del panel) · doc de Payload (auth / access control).
- **Criterios:** solo un usuario autenticado entra a `/panel`; rutas protegidas; logout funciona; layout con secciones (Catálogo, Ventas, Comunidad, Métricas) aunque estén vacías.

### Tarea 5 — Capa de acceso a datos (`lib/commerce`) ⏱️ 1 día
- **Objetivo:** funciones tipadas (`getProducts`, `getProductBySlug`, …) que leen de Payload (Local API) y devuelven el contrato `CommerceProduct`, no el tipo crudo.
- **Por qué:** es el adapter; la UI depende del contrato, no de Payload.
- **Criterios:** un Server Component pide productos y recibe datos tipados; cambiar el origen tocaría solo `lib/commerce`.

### Tarea 6 — CRUD de Productos en el panel ⏱️ 2 días
- **Objetivo:** en `/panel`, listar/crear/editar/borrar productos (con imágenes a Blob). Es el primer módulo real del centro de operaciones.
- **Criterios:** se puede alta/baja/modificación de un producto desde la UI a medida; validaciones (precio, stock) respetadas; cambios se reflejan en el storefront.

### Tarea 7 — Catálogo `/productos` (datos) ⏱️ 1 día
- **Objetivo:** el catálogo (UI de Franco) lista productos reales desde `lib/commerce`, con filtro por material y estados (sin stock / a medida). RSC.
- **Criterios:** `/productos` muestra los productos de la base; filtro funciona; estados bien manejados.

### Tarea 8 — Ficha de producto `/productos/[slug]` (PDP) ⏱️ 1 día
- **Objetivo:** ficha por slug con imágenes (Blob), material, medidas, desarmable/pintable y CTA (comprar o pedir presupuesto según "a medida").
- **Criterios:** `generateMetadata` con datos del producto (SEO); `next/image`; producto inexistente → 404.

---

## FASE 2 — Carrito (resumen)
Estado de carrito (cliente) + **validación de stock/precio en el servidor** (nunca confiar en el cliente). Agregar/quitar/cantidades, persistencia, resumen.

## FASE 3 — Checkout + Mercado Pago (resumen)
El corazón transaccional (ADR-013): preferencia de **Checkout Pro** → redirect → **webhook** (Node, firma + idempotencia) → crear **Order** en Payload → **descontar stock** → página de "gracias" + email (Resend). **Probado en test antes de producción.** Las órdenes se ven en el módulo **Ventas** del panel. Requiere credenciales de MP (carpeta `00_ACCESOS`).

## FASE 4 — Productos a medida / presupuesto (resumen)
Formulario de consulta → colección `Quotes/Leads` → email al equipo y al cliente → **bandeja de leads** en el panel (ver / responder / cambiar estado).

## FASE 5 — Centro de operaciones completo (resumen)
Los módulos que faltan del panel (ver [`06_DASHBOARD_SPEC.md`](./06_DASHBOARD_SPEC.md)): **Comunidad/CRM** con `Contactos` unificados (opt-in, tags, historial por persona), **Miembros**, **Inscripciones a eventos**, **Campañas de email** (envío propio a segmentos por Resend — ADR-014), y **Métricas** (ventas, stock bajo, inscripciones, altas). Es lo que convierte el panel en el cerebro del negocio.

## FASE 6 — Hardening (resumen)
Tests de los flujos críticos (checkout, webhook), headers de seguridad, validación de inputs, revisión de dependencias, observabilidad/logs, performance (Core Web Vitals) y accesibilidad. Ver [`../../docs/13_DEVELOPMENT_STANDARDS.md`](../../docs/13_DEVELOPMENT_STANDARDS.md).

---

## Tablero rápido

| Fase | Entregable | Desbloquea |
|---|---|---|
| 0 | Motor: modelo de datos + seed | base para todo; Franco carga contenido |
| 1 | Panel base + CRUD productos + catálogo/PDP | operar y mostrar el catálogo |
| 2 | Carrito | camino a la compra |
| 3 | Checkout + Mercado Pago + Ventas en el panel | **vender** |
| 4 | Presupuesto "a medida" + bandeja de leads | consultas custom |
| P1 | ⚡ Form de inscripción al evento (data-capture) | datos para el Summit + campañas (deadline 18/09) |
| 5 | Comunidad/CRM + campañas + inscripciones + métricas | centro de operaciones completo |
| 6 | Hardening | producción seria |

> ¿Terminaste una fase o te trabaste? Avisá a Franco. Detallamos la siguiente juntos.
