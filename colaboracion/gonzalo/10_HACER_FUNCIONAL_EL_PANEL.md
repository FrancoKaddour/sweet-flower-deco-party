# 10 — Cómo volver funcional el panel (mock → Payload)

El panel `/panel` ya está **construido y diseñado** (Franco lo dejó con la marca). Tu trabajo es **hacerlo andar con datos reales**. La buena noticia: no tenés que adivinar nada. El panel ya te dice, en cada lugar, qué conectar.

> **La idea en una frase:** toda la UI del panel lee sus datos de **funciones en [`lib/panel/data.ts`](../../lib/panel/data.ts)**. Hoy esas funciones devuelven datos de ejemplo (mock). Vos **cambiás SOLO el cuerpo de cada función** por una consulta a Payload. Como la **firma y la forma del dato no cambian**, la UI sigue andando sin tocarla. Rellenás los huecos, no reescribís el panel.

---

## 1. El patrón (leé esto primero, es TODO el truco)

Abrí [`lib/panel/data.ts`](../../lib/panel/data.ts). Vas a ver funciones así:

```ts
// 🔌 GONZALO: colección `Products`. Reemplazá el cuerpo por:
//   const { docs } = await payload.find({ collection: 'products', depth: 1 })
//   return docs.map(mapProducto)
export async function getProductos(): Promise<Producto[]> {
  return PRODUCTOS_MOCK; // ← esto es lo único que borrás
}
```

Cada función:
- Ya es **`async`** y ya está **tipada** (devuelve `Producto[]`, `Orden[]`, etc. — los tipos viven en [`lib/panel/types.ts`](../../lib/panel/types.ts)).
- Tiene un comentario **`🔌 GONZALO`** que te dice **qué colección** de Payload la resuelve, **con qué campos**, y **un ejemplo** de la consulta real.
- La UI (las páginas en `app/panel/`) ya la llama con `await`. **No la toques.**

**Tu loop por cada módulo es siempre el mismo:**
1. La colección de Payload ya existe (la modelaste en la Fase 0, Tarea 2).
2. Entrás a la función en `data.ts`, borrás el `return X_MOCK` y ponés la consulta a Payload (Local API).
3. Si la forma que devuelve Payload difiere del tipo del contrato, escribís un `mapX(doc): X` que traduzca (el comentario te lo sugiere).
4. Corrés `npm run dev`, abrís esa pantalla del panel, y **ves los datos reales**. Si aparecen bien → ese módulo está funcional.

> Por qué esto es profesional: `data.ts` es una **capa de acceso a datos (adapter)**. La UI depende del **contrato** (los tipos), no de Payload. Si mañana cambia el origen, tocás `data.ts` y nada más. Es el mismo principio que `lib/commerce` en [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) §5.

---

## 2. El mapa: qué función → qué colección

| Módulo del panel | Función(es) en `data.ts` | Colección Payload |
|---|---|---|
| Inicio / Métricas | `getKpis`, `getMetricasClave`, `getAcciones`, `getActividad`, `getUltimasOrdenes` | agregación de `Orders` + `Products` + `EventRegistrations` + `Contacts` + `Quotes` |
| Catálogo / Productos | `getProductos`, `getProductoPorId` | `Products` |
| Contenido | `getEventos`, `getTestimonios`, `getBloquesContenido` | `Events`, `Testimonials`, global `Site` |
| Ventas / Órdenes | `getOrdenes`, `getUltimasOrdenes` | `Orders` |
| Comunidad / Contactos | `getContactos`, `getContactoPorId` | `Contacts` (el **centro** — ADR-014) |
| Comunidad / Miembros | `getMiembros` | `Memberships` |
| Comunidad / Inscripciones | `getInscripciones` | `EventRegistrations` |
| Campañas | `getCampanas` | `EmailCampaigns` |
| Consultas / Leads | `getLeads` | `Quotes`/`Leads` |
| Ajustes / Usuarios | `getUsuarios`, `getUsuarioSesion` | `Users` (auth de Payload) |

> El detalle de campos de cada colección está en el comentario `🔌 GONZALO` de cada función y en [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) §6.

---

## 3. En qué orden hacerlo

**Antes de empezar** tenés que tener el motor en pie (tu Fase 0): Payload instalado (Tarea 0), base conectada (Tarea 1) y **las colecciones modeladas** (Tarea 2). Sin colecciones no hay nada que consultar.

Después, hacé los módulos **del más simple al más complejo** (cada uno es un PR chico):

1. **Productos** — el más directo (una colección, una tabla). Ideal para aprender el patrón.
2. **Contenido** (Eventos, Testimonios) — parecido a Productos.
3. **Ventas / Órdenes** — lectura de `Orders` (las órdenes las crea el webhook de pago; ver [`09_TESTEAR_MERCADOPAGO.md`](./09_TESTEAR_MERCADOPAGO.md)).
4. **Contactos / CRM** — el centro. `getContactoPorId` arma la **ficha 360°** cruzando Orders/Inscripciones/Membresías/Leads por `contactId`.
5. **Campañas, Consultas, Ajustes** — el resto.
6. **Login / Auth** — en paralelo, apenas tengas la colección `Users` (Tarea 4). Ver §5.
7. **Inicio / Métricas** — al final, porque **agrega** datos de varias colecciones (te conviene que ya funcionen).

---

## 4. Ejemplo completo (el patrón, paso a paso)

Volvamos funcional **Productos**. Suponé que ya tenés la colección `Products` en Payload con campos `title`, `slug`, `priceARS`, `material`, `stock`, `isCustomOrder`, `images`.

**Paso 1 — mirá el contrato** en `lib/panel/types.ts`:
```ts
export type Producto = {
  id: string; titulo: string; material: Material;
  precioARS: number | null; stock: number; aMedida: boolean; imagenUrl: string | null;
};
```

**Paso 2 — reemplazá el cuerpo** de `getProductos()` en `data.ts`:
```ts
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProductos(): Promise<Producto[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'products', depth: 1, limit: 100 })
  return docs.map(mapProducto)
}

// El "traductor" entre el doc de Payload y el contrato del panel:
function mapProducto(doc: /* tipo generado por Payload */): Producto {
  return {
    id: String(doc.id),
    titulo: doc.title,
    material: doc.material,
    precioARS: doc.priceARS ?? null,
    stock: doc.stock ?? 0,
    aMedida: Boolean(doc.isCustomOrder),
    imagenUrl: typeof doc.images?.[0] === 'object' ? doc.images[0].url : null,
  }
}
```

**Paso 3 — probá:** `npm run dev` → abrí `http://localhost:3000/panel/productos`. Deberías ver tus productos reales de la base. **Listo: módulo funcional.**

> Fijate que **NO tocaste ninguna página ni componente del panel.** Solo `data.ts`. Ese es el objetivo.

---

## 5. Login y rutas protegidas

Hoy el login es mock (entra directo). Para hacerlo real:

- En [`components/panel/LoginForm.tsx`](../../components/panel/LoginForm.tsx), reemplazá el `onSubmit` mock por `payload.login({ collection: 'users', email, password })` (buscá el comentario `🔌 GONZALO`). En éxito → redirigí a `/panel`; en error → mostrá el mensaje.
- **Protegé `/panel`:** que nadie sin sesión entre. El patrón correcto es un **Data Access Layer** (`requireSession()` que valida con `payload.auth()` en el server) en el layout del panel, más el `proxy` (ex middleware) como primera barrera. La seguridad la aporta Payload — **no la programes a mano.**
- Pedile a Claude la skill **`auth-review`** antes de cerrar esto. Es la puerta del panel: no puede fallar.

---

## 6. Órdenes y el webhook (cómo se llenan solas)

Las órdenes **no se cargan a mano**: las crea el **webhook de Mercado Pago** cuando se confirma un pago (ver [`09_TESTEAR_MERCADOPAGO.md`](./09_TESTEAR_MERCADOPAGO.md)). El flujo:

`pago aprobado → webhook (firma + idempotencia) → crea Order en Payload → descuenta stock`

Una vez que existe la colección `Orders` y el webhook la llena, `getOrdenes()` y `getUltimasOrdenes()` las leen, y aparecen solas en **Ventas** y en el **Dashboard**. No hay que tocar la UI.

---

## 7. El flujo dato→CRM (la tesis del panel — ADR-014)

`Contacts` es **el centro**. Cada orden, inscripción, membresía y consulta **cuelga de un contacto** (por `contactId`). Por eso:
- Cuando hagas `getContactoPorId(id)`, además del contacto traé su **historial** (sus Orders, sus EventRegistrations, sus Memberships, sus Quotes) — eso arma la **ficha 360°** que ya tiene su pantalla (`/panel/contactos/[id]`).
- Ese cruce es lo que después habilita las **campañas segmentadas** ("mail a los inscriptos al Summit que no compraron"). Ver [`06_DASHBOARD_SPEC.md`](./06_DASHBOARD_SPEC.md) → Campañas.

---

## 8. Prompts listos para tu IA (copy-paste)

Pegale esto a Claude Code, uno por módulo (cambiá el nombre del módulo/función/colección):

**Para un módulo de lectura (ej. Productos):**
```
Vamos a volver funcional el módulo Productos del panel. Leé primero:
- lib/panel/data.ts (la función getProductos y su comentario 🔌 GONZALO)
- lib/panel/types.ts (el tipo Producto — el contrato)
- collections/Products (mi colección de Payload)
- Y la doc relevante de Payload Local API en node_modules (esta NO es la versión de Next/Payload que sabés de memoria).
Reemplazá SOLO el cuerpo de getProductos() por una consulta real con la Local API de Payload,
manteniendo la firma y devolviendo Producto[] (usá un mapProducto(doc) si el shape difiere).
No toques ninguna página ni componente del panel. Al terminar, corré npm run build y decime si pasó.
```

**Para el login/auth:**
```
Hacé funcional el login del panel con la auth de Payload. Leé components/panel/LoginForm.tsx
(el comentario 🔌 GONZALO), la doc de auth de Payload, y la skill auth-review.
Implementá payload.login en el onSubmit y protegé las rutas /panel con un Data Access Layer
(requireSession con payload.auth). Explicame el plan ANTES de codear. Correr npm run build al final.
```

---

## 9. Un módulo está "funcional" cuando…

- [ ] La función de `data.ts` consulta Payload (no devuelve mock) y respeta el tipo del contrato.
- [ ] La pantalla del panel muestra los datos reales sin que hayas tocado la UI.
- [ ] `npm run build` pasa (sin `any`).
- [ ] Pasaste la skill que corresponde: **`db-review`** (queries/modelo), **`backend-review`** (lógica de servidor), **`api-design`** (si expusiste endpoints), **`auth-review`** (login), **`testing`** (flujos críticos como checkout/webhook).
- [ ] Abriste un PR chico (una tarea = una rama = un PR) y Franco lo revisó.

---

## Se conecta con

- **Tu plan** → [`03_BACKLOG.md`](./03_BACKLOG.md) · **Arquitectura** → [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md) · **Base de datos** → [`07_DB_IMPLEMENTACION.md`](./07_DB_IMPLEMENTACION.md)
- **Qué skill usar** → [`08_SKILLS_POR_TAREA.md`](./08_SKILLS_POR_TAREA.md) · **Pagos** → [`09_TESTEAR_MERCADOPAGO.md`](./09_TESTEAR_MERCADOPAGO.md)
- **El modelo de datos y el CRM** → ADR-014 en [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) · **Spec del panel** → [`06_DASHBOARD_SPEC.md`](./06_DASHBOARD_SPEC.md)
