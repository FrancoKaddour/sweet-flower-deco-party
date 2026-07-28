# 02 — Arquitectura del backend

El **qué** y sobre todo el **por qué**. Es la decisión de ingeniería que sostiene todo. Está pensada para escalar y para que el sitio sea un puente de crecimiento para la clienta. Registrada en [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) (ADR-007, ADR-011, ADR-013).

---

## 1. El objetivo

Construir, **desde cero**, la plataforma de Sweet Flowers, a **nivel de un producto que cotiza USD 30k**: que **funcione perfecto**, escale y se pueda mostrar como logro.

- **E-commerce propio**: catálogo, ficha de producto, carrito, checkout con **Mercado Pago**, control de stock.
- **Productos a medida**: no es compra directa, es un **flujo de presupuesto** (consulta → cotización).
- **Eventos/workshops**: ediciones, disertantes, sponsors, inscripción.
- **Membresía / comunidad**.
- **Un panel de administración a medida** (el "centro de operaciones") desde donde el negocio gestiona TODO.

---

## 2. La decisión clave: motor sólido + panel a medida

Queremos un **panel 100% a medida** con la identidad de la marca (Franco diseña, vos lo construís funcional, Franco lo pule). Pero hay una trampa: en una plataforma que maneja **pagos y datos de clientes**, programar a mano la **autenticación, los permisos y la validación** es donde se cuelan los bugs y los agujeros de seguridad. Eso NO lo puede improvisar nadie, y menos para "que funcione perfecto".

**La solución profesional (lo mejor de los dos mundos):**

> **Payload como MOTOR (headless)** resuelve lo peligroso y aburrido: base de datos, **auth, permisos (RBAC), validación, migraciones, API tipada y uploads** — todo probado en producción por miles de proyectos.
>
> **Encima, un panel `/panel` 100% a medida** (Next.js) que consume ese motor. Vos construís las pantallas funcionales; Franco les pone el diseño de Sweet Flowers.

Así el panel es propio y con marca, pero **los cimientos no los inventamos**: los aporta Payload. Resultado: se ve único y funciona perfecto.

> El `/admin` que Payload trae de fábrica **no se tira**: queda como herramienta interna de dev/superadmin (para vos), mientras el negocio usa el `/panel` a medida.

---

## 3. La foto grande

```
   Visitante                                   Vos + Flor
      │                                            │
      ▼                                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)                     │
│                                                                │
│  Storefront (RSC)          /panel  (admin a medida — Franco    │
│  · catálogo, PDP            diseña / Gonzalo construye)         │
│  · carrito, checkout        · productos, eventos, testimonios   │
│        │                    · órdenes y pagos                   │
│        │                    · CRM / miembros / leads            │
│        │                    · métricas                          │
│        │                          │                             │
│        │      lib/commerce        │   Payload (MOTOR headless)  │
│        └──────── (adapter) ───────┴── auth · RBAC · API · CRUD  │
│                     │                  migraciones · uploads    │
└─────────────────────┼──────────────────────┬───────────────────┘
                      │                       │
             ┌────────▼──────┐   ┌────────────▼───┐   ┌──────────────┐
             │  Mercado Pago │   │  Postgres      │   │ Vercel Blob  │
             │ (Checkout +   │   │ (Neon, vía     │   │ (imágenes)   │
             │  webhooks)    │   │  Marketplace)  │   │              │
             └───────────────┘   └────────────────┘   └──────────────┘
```

Todo vive en **un solo proyecto Next.js**, desplegado en **Vercel**. No hay un servidor backend aparte: Next hace de front **y** de backend (route handlers + server actions), Payload aporta el motor de datos, y el `/panel` es la UI de administración.

---

## 4. Las piezas y por qué cada una

- **Payload CMS 3 (motor headless)** — corre dentro del mismo Next. Colecciones definidas en TypeScript → base de datos + **auth + permisos + API tipada + migraciones + uploads**, gratis y probado. Genera `payload-types.ts` → todo tipado, sin `any`.
- **Postgres (Neon) vía Vercel Marketplace** — base SQL, robusta, escalable, serverless. Conectada por el Marketplace (no cableando credenciales a mano). Detalle en [`07_DB_IMPLEMENTACION.md`](./07_DB_IMPLEMENTACION.md).
- **Vercel Blob** — las imágenes de productos/eventos van acá (CDN), no en la base ni en el repo.
- **Mercado Pago** (detrás de un adapter) — **Checkout Pro** primero (el cliente paga en el flujo de MP → menos carga de seguridad PCI y menos código), luego **Bricks** si la UX lo pide. **Webhooks** en route handler Node: verificar firma → idempotencia → crear la orden → descontar stock.
- **Resend** (vía Marketplace) — emails transaccionales (confirmación de compra, aviso de presupuesto).
- **El panel `/panel`** — Next.js (server components + acciones), consume Payload. Es donde vive el "centro de operaciones". Spec completa en [`06_DASHBOARD_SPEC.md`](./06_DASHBOARD_SPEC.md).

---

## 5. Principios de diseño (esto lo hace "memorable")

1. **Adapter para commerce.** La UI nunca habla con Mercado Pago directo: habla con `lib/commerce/` (interfaz estable). Cambiar de proveedor = tocar una implementación, no las pantallas.
   ```ts
   // lib/commerce/types.ts — el contrato NO depende del proveedor
   export interface CommerceProduct {
     id: string; slug: string; title: string;
     priceARS: number | null;                 // null mientras sea placeholder
     material: "hierro" | "mdf" | "madera" | "fundas-telas";
     isDismountable: boolean; isPaintable: boolean; stock: number;
   }
   ```
2. **El modelo de datos es código** (colecciones tipadas, revisadas por PR).
3. **Leer en el servidor** (RSC + Local API de Payload): rápido, tipado, buen SEO. `"use client"` solo donde hay interacción real.
4. **Migraciones versionadas.** Nunca cambios a mano en la base de producción.
5. **Robustez en pagos.** Webhooks con firma + idempotencia + registro. No es opcional.
6. **Secretos afuera del código** (env vars de Vercel).
7. **Simple primero.** Checkout como invitado primero; cuentas de cliente/membresía después. El panel arranca funcional y feo; el diseño lo pule Franco.

---

## 6. El modelo de datos (borrador de colecciones)

Lo refinás en la Fase 0. Punto de partida.

> **Principio que hace la base "reutilizable a futuro" (ADR-014):** `Contacts` es el **centro**. Toda persona que toca la marca —compra, se anota al evento, pide presupuesto, es miembro, se suscribe— es **UN contacto**. Las demás cosas (orden, inscripción, membresía, lead) **se relacionan a un contacto**, no repiten su email suelto. Así podés hacer **campañas cruzadas** ("mail a todos los que se anotaron al evento y no compraron") y los datos que junta el evento hoy sirven para las campañas mañana. **No guardes `email`/`name` sueltos en cada colección: apuntá a `Contacts`.**

| Colección | Para qué | Campos clave (borrador) |
|---|---|---|
| **Contacts** ⭐ | **el centro**: toda persona (lead, comprador, inscripto, miembro, newsletter) | name, email, phone, tags[], source, **consentEmail** (bool + fecha + origen), createdAt |
| **Products** | catálogo | title, slug, priceARS, material, stock, isDismountable, isPaintable, isCustomOrder, images (→Media), category |
| **Media** | imágenes | archivo (→Blob), alt |
| **Categories** / **Materials** | clasificar | name, slug |
| **Events** | ediciones/summit | name, date, location, edition, description, speakers, sponsors, gallery |
| **EventRegistrations** 🆕 | inscripciones al evento (data-capture) | **contact (→Contacts)**, event (→Events), status, ticketType, notes, createdAt |
| **Speakers** | disertantes | name, bio, photo, role |
| **Sponsors** | auspiciantes | name, logo, url |
| **Testimonials** | prueba social | quote, authorName, city, avatar |
| **Memberships** | membresía/comunidad | **contact (→Contacts)**, plan, status, startedAt, renewsAt *(cobro TBD con Flor — ADR-014)* |
| **EmailCampaigns** 🆕 | campañas de email desde el panel | subject, body, segment (filtro sobre Contacts), status, sentAt, stats (enviados/aperturas) |
| **Orders** | compras | items, total, status, mpPaymentId, **buyer (→Contacts)**, createdAt |
| **Quotes / Leads** | presupuestos "a medida" | **contact (→Contacts)**, detalle, producto relacionado, estado |
| **Users** | staff del panel (auth de Payload) | email, rol (admin/editor) |
| **Globals: Site** | textos/config del sitio | nav, contacto, redes, home |

> ⭐ = eje del modelo · 🆕 = suma por ADR-014 (CRM + campañas + inscripción al evento). El **envío** de campañas es por la **API de Resend** a segmentos de `Contacts` (panel a medida, no ESP externo). El **opt-in (`consentEmail`)** es obligatorio para poder mandarle mails a un contacto (legal — ver skill `legal-review`).

> Antes de modelar, mirá el checklist de contenido en [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) §C y el ADR-014 (CRM/campañas/evento). El **formulario de inscripción al evento** (que crea `EventRegistration` + `Contact`) es candidato a priorizarse por el deadline del 18/09 — coordinalo con Franco.

---

## 7. El riesgo que validás primero (honestidad de ingeniero)

Payload 3 se integra **muy de cerca** con Next. Este proyecto usa **Next 16.2.11**, versión nueva. **No damos por sentado que funcione sin fricción.** Por eso tu **Tarea 0** es un *spike*: probar la integración en una rama y confirmarlo.

- **Si el spike sale bien** → seguimos con Payload (plan principal).
- **Si falla de forma irresoluble** → fallback: (1) **Sanity** (CMS headless *hosted*, desacoplado de la versión de Next) o (2) **Postgres + Drizzle + auth con una librería probada (ej. Auth.js)**.

En los tres casos, el resto (adapter de commerce, Mercado Pago, webhooks, Blob, RSC, el `/panel` a medida) **no cambia**. Por eso el adapter y el panel-sobre-API nos protegen de la decisión.

> Cerrá la Tarea 0 y **avisale a Franco el resultado** antes de construir sobre Payload.
