# 02 — Arquitectura del backend

El **qué** y sobre todo el **por qué**. Esta es la decisión de ingeniería que sostiene todo lo demás. Está pensada para escalar y para que ambos podamos mostrarla con orgullo. Registrada formalmente en [`../docs/16_DECISIONS.md`](../docs/16_DECISIONS.md) (ADR-007, ADR-011, ADR-013).

---

## 1. El objetivo

Construir, **desde cero**, la plataforma de Sweet Flowers:

- **E-commerce propio**: catálogo, ficha de producto, carrito, checkout con **Mercado Pago**, control de stock.
- **Productos a medida**: no es compra directa, es un **flujo de presupuesto** (consulta → cotización).
- **Eventos/workshops**: ediciones, disertantes, sponsors, inscripción.
- **Membresía / comunidad**.
- **Un panel de administración** para que el equipo cargue TODO el contenido sin tocar código.

Y que sea **memorable**: bien modelado, tipado de punta a punta, escalable, y sin lock-in artesanal.

---

## 2. La foto grande

```
                 ┌─────────────────────────────────────────────┐
                 │            Next.js 16 (App Router)          │
                 │                                             │
  Visitante ───► │  Storefront (RSC)      Panel /admin         │ ◄── Equipo (Franco)
                 │  · catálogo, PDP        · cargar productos   │     carga contenido
                 │  · carrito, checkout    · eventos, testim.   │
                 │        │                     │               │
                 │        │   Local API         │  Payload CMS  │
                 │        └─────────┬───────────┘  (mismo repo) │
                 │                  │                           │
                 │        lib/commerce (adapter)               │
                 └──────────┬───────────────┬──────────────────┘
                            │               │
                   ┌────────▼──────┐  ┌──────▼───────┐   ┌──────────────┐
                   │  Mercado Pago │  │  Postgres    │   │ Vercel Blob  │
                   │  (Checkout+   │  │  (Neon, vía  │   │ (imágenes de │
                   │   webhooks)   │  │  Marketplace)│   │  producto)   │
                   └───────────────┘  └──────────────┘   └──────────────┘
```

Todo vive en **un solo proyecto Next.js**, desplegado en **Vercel**. No hay un "servidor backend" separado: Next hace de front **y** de backend (route handlers + server actions), y **Payload** le agrega el modelo de datos y el panel.

---

## 3. Las piezas y por qué cada una

### Payload CMS 3 — el corazón del contenido y el modelo de datos

Corre **dentro del mismo Next.js**. Definís "colecciones" (Productos, Eventos, etc.) como archivos TypeScript y Payload te da automáticamente:

- Un **panel `/admin`** de nivel producción → **Franco carga el contenido sin tocar código** (era el requisito).
- Una **base de datos** bien estructurada en Postgres.
- **Tipos generados** (`payload-types.ts`) → el front lee datos **tipados**, sin `any`.
- **Local API**: los Server Components leen datos **sin salir por HTTP** → rápido y simple.
- **Auth, roles y control de acceso** incluidos → hoy para el admin, mañana para cuentas de clientes.

**Por qué Payload y no otra cosa:**
- vs. *archivos en `content/`*: no le da panel a Franco y no escala a cientos de productos + órdenes.
- vs. *base de datos + panel a mano*: harías durante semanas lo que Payload te da hecho, con más bugs. (Igual vas a aprender DB y modelado **a través** de Payload.)
- vs. *Sanity (hosted)*: Payload es **self-hosted, en nuestro repo, sobre nuestra Postgres** → más control, más "ingeniería real", nada de datos viviendo en un tercero. (Sanity queda como plan B, ver §6.)

### Postgres (Neon) vía Vercel Marketplace — la base de datos

SQL, robusto, estándar, escalable. Lo conectamos por el **Marketplace de Vercel** (no cableando credenciales a mano): Vercel gestiona la conexión y las variables de entorno. Neon es serverless (escala a cero, ideal para arrancar).

### Vercel Blob — las imágenes

Las fotos de productos/eventos no van en la base ni en el repo: van a **Vercel Blob** (almacenamiento de archivos con CDN). Payload tiene un adaptador para esto. Escala sin ensuciar la base.

### Mercado Pago — los pagos (detrás de un adapter)

- **Checkout Pro** primero: el cliente paga en el flujo de Mercado Pago (redirect). No tocamos datos de tarjeta → **menos responsabilidad de seguridad (PCI) y menos código**. Más adelante, **Bricks** (pago embebido) si la UX lo pide.
- **Webhooks**: Mercado Pago nos avisa cuando se pagó. Un route handler (Node) **verifica la firma**, aplica **idempotencia** (no procesar dos veces), crea la **orden** en Payload y **descuenta stock**.
- **Todo detrás de `lib/commerce`** (ver §4).

### Resend — emails transaccionales (vía Marketplace)

Confirmaciones de compra, avisos de presupuesto. Se conecta por el Marketplace de Vercel.

---

## 4. Principios de diseño (esto es lo que lo hace "memorable")

1. **Patrón adapter para commerce.** La UI nunca habla con Mercado Pago directo: habla con una interfaz estable `lib/commerce/` (`getProducts`, `Cart`, `createCheckout`, …). Si mañana cambia el proveedor de pago, tocás **una** implementación, no las pantallas. Contrato base ya esbozado en `docs/10_TECH_STACK.md §14`.

   ```ts
   // lib/commerce/types.ts — el contrato NO depende del proveedor
   export interface CommerceProduct {
     id: string;
     slug: string;
     title: string;
     priceARS: number | null;   // null mientras sea placeholder
     material: "hierro" | "mdf" | "madera" | "fundas-telas";
     isDismountable: boolean;
     isPaintable: boolean;
     stock: number;
   }
   ```

2. **El modelo de datos es código versionado y tipado.** Nada de esquemas sueltos: las colecciones se revisan por PR como cualquier código.

3. **Leer en el servidor (RSC + Local API).** El catálogo se arma en el servidor, tipado, rápido, con buen SEO. `"use client"` solo donde hay interacción real (carrito, filtros).

4. **Migraciones versionadas.** Cada cambio de estructura de la base queda registrado y se puede reproducir. Nunca cambios a mano en producción.

5. **Idempotencia y verificación en los webhooks.** En pagos, la robustez no es opcional: firmar, no duplicar, registrar todo.

6. **Secretos afuera del código.** Todo por env vars de Vercel.

7. **Simple primero, elegante siempre.** Arrancamos con **checkout como invitado** (sin cuentas); las cuentas de cliente/membresía llegan en una fase posterior. No metemos complejidad antes de tiempo.

---

## 5. El modelo de datos (borrador de colecciones)

Esto lo vas a refinar vos en la Fase 0. Punto de partida:

| Colección | Para qué | Campos clave (borrador) |
|---|---|---|
| **Products** | catálogo | title, slug, priceARS, material, stock, isDismountable, isPaintable, isCustomOrder, images (→Media), category |
| **Media** | imágenes | archivo (→Blob), alt |
| **Categories** / **Materials** | clasificar productos | name, slug |
| **Events** | ediciones/workshops | name, date, location, edition, description, speakers, sponsors, gallery |
| **Speakers** | disertantes | name, bio, photo, role |
| **Sponsors** | auspiciantes | name, logo, url |
| **Testimonials** | prueba social | quote, authorName, city, avatar |
| **Members** | membresía/comunidad | (se define en su fase) |
| **Orders** | compras | items, total, status, mpPaymentId, buyer, createdAt |
| **Quotes / Leads** | presupuestos "a medida" | contacto, detalle, producto relacionado, estado |
| **Globals: Site** | textos/config del sitio | nav, datos de contacto, redes, home |

> Antes de modelar, mirá el checklist de contenido en `docs/16_DECISIONS.md §C` para no olvidarte campos (materiales, +15% por canal, "a medida", stock, etc.).

---

## 6. El riesgo que tenés que validar primero (honestidad de ingeniero)

Payload 3 se integra **muy de cerca** con Next. Este proyecto usa **Next 16.2.11**, una versión nueva. **No damos por sentado que Payload 3 funcione sin fricción con esta versión.** Por eso tu **Tarea 0** es un *spike*: probar la integración en una rama y confirmarlo.

**Si el spike sale bien** → seguimos con Payload (plan principal).

**Si el spike falla de forma irresoluble** → fallback, en este orden:
1. **Sanity** (CMS headless *hosted*): desacoplado de la versión de Next (es solo un cliente de API). Te da panel igual; perdés el "self-hosted en nuestra base".
2. **Postgres + Drizzle (ORM) + panel a medida**: máximo control y aprendizaje, más trabajo.

En cualquiera de los tres, el resto de la arquitectura (adapter de commerce, Mercado Pago, webhooks, Blob, RSC) **no cambia**. Por eso el adapter es tan importante: nos protege de la decisión.

> Cerrá la Tarea 0 y **avisale a Franco el resultado** antes de construir sobre Payload. Es una decisión que tomamos entre los dos con el dato en la mano.
