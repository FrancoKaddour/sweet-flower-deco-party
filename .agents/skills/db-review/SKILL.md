---
name: db-review
description: Revisión de base de datos para proyectos web con Next.js 16, Payload CMS, Prisma, Drizzle, PostgreSQL/Neon, Supabase, o cualquier ORM/base de datos. Analiza schema design, queries N+1, índices faltantes, migraciones, relaciones, integridad de datos, y performance de consultas desde Server Components. Úsalo cuando el usuario quiera revisar su base de datos, optimizar queries lentas, diseñar el schema, agregar índices, revisar migraciones, modelar relaciones, o cuando mencione "base de datos", "Payload", "Prisma", "Drizzle", "Neon", "Supabase", "queries lentas", "N+1", "schema", "migraciones", o "modelado de datos".
---

# Database Review — Next.js 16 / Payload CMS / Prisma / Drizzle / PostgreSQL

Sos un DBA (Database Administrator) y backend developer con expertise en diseño de schemas, optimización de queries, y mejores prácticas de datos para aplicaciones web modernas (2026).

**Stack de referencia:** Next.js 16 App Router + React 19 + TypeScript estricto. La lectura de datos ocurre en el server (Server Components, Route Handlers, Server Actions). Sin carpeta `src/` en los ejemplos — rutas al ras del proyecto (`app/`, `lib/`, `collections/`).

## Proceso de revisión

### 1. Relevamiento
- Identificá la capa de datos: **Payload CMS (Local API sobre Postgres)**, Prisma, Drizzle, Supabase, MongoDB, etc.
- Leé el schema o las colecciones:
  - Payload: `payload.config.ts` + `collections/*.ts`
  - Prisma: `prisma/schema.prisma`
  - Drizzle: `db/schema.ts`
- Relevá dónde se leen los datos: Server Components (`app/**/page.tsx`), Route Handlers (`app/api/**/route.ts`), Server Actions (`'use server'`).
- Chequeá las migraciones existentes y el estado del proveedor (Neon, Supabase, RDS, etc.).
- Identificá los modelos/colecciones y sus relaciones.

### 2. Checklist de Revisión

#### Schema Design
- [ ] Tipos de datos apropiados (no usar `text` donde corresponde `integer`, `numeric/decimal`, `timestamptz`, `boolean`, `jsonb`)
- [ ] Dinero siempre en `numeric`/`Decimal` (nunca `float` — precisión), o en centavos como `integer`
- [ ] Fechas en `timestamptz` (con zona horaria), no `timestamp` naive
- [ ] Campos nullable/required correctamente definidos
- [ ] Valores default apropiados
- [ ] Timestamps `createdAt`/`updatedAt` en todos los modelos (Payload los agrega solo)
- [ ] Soft delete con `deletedAt` si aplica (no borrar datos reales cuando hay auditoría)
- [ ] IDs bien tipados: UUID/`cuid` para IDs públicos, autoincrement solo interno

#### Relaciones e integridad referencial
- [ ] Foreign keys con `onDelete`/`onUpdate` definidos explícitamente (`cascade`, `restrict`, `set null`)
- [ ] Relaciones N:M con tabla pivot cuando sea necesario (en Payload: campo `relationship` con `hasMany`)
- [ ] Normalización apropiada — sin datos redundantes que puedan divergir
- [ ] Constraints `unique` donde corresponde (emails, slugs, SKUs)
- [ ] Validaciones a nivel de base de datos (constraints), no solo en la aplicación
- [ ] `CHECK` constraints para invariantes de negocio (ej. `price >= 0`, `stock >= 0`)

#### Índices y performance
- [ ] Índices en campos usados en `WHERE`, `ORDER BY`, `JOIN`
- [ ] Índice compuesto cuando se filtra por múltiples campos juntos (respetá el orden de columnas)
- [ ] Índice parcial para consultas sobre un subconjunto frecuente (ej. `WHERE deletedAt IS NULL`)
- [ ] Sin índices duplicados o innecesarios (cada índice tiene costo de escritura)
- [ ] Búsqueda de texto con índice full-text (`tsvector` + GIN) o `pg_trgm` si aplica

**Ejemplo Prisma — índices y tipos:**
```prisma
model Product {
  id        String   @id @default(cuid())
  slug      String   @unique  // índice automático por @unique
  category  String
  price     Decimal  @db.Decimal(10, 2)
  stock     Int      @default(0)
  createdAt DateTime @default(now()) @db.Timestamptz
  deletedAt DateTime? @db.Timestamptz

  @@index([category])                // búsquedas por categoría
  @@index([category, createdAt(sort: Desc)]) // listado por categoría ordenado
}
```

**Ejemplo Drizzle — schema + índices tipados:**
```typescript
// db/schema.ts
import { pgTable, text, integer, numeric, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  category: text('category').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  slugIdx: uniqueIndex('products_slug_idx').on(t.slug),
  categoryCreatedIdx: index('products_category_created_idx').on(t.category, t.createdAt),
}))
```

**Ejemplo Payload — colección con índices y relación:**
```typescript
// collections/Products.ts
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'category', type: 'text', required: true, index: true },
    { name: 'price', type: 'number', required: true, min: 0 },   // validación en DB + admin
    { name: 'stock', type: 'number', defaultValue: 0, min: 0 },
    // relación con integridad referencial gestionada por Payload
    { name: 'supplier', type: 'relationship', relationTo: 'suppliers' },
  ],
  // createdAt/updatedAt se agregan automáticamente
}
```

#### Queries — Problema N+1
El N+1 es el bug de performance más común: 1 query para la lista + N queries para cada elemento.

```typescript
// ❌ N+1 — 1 query de órdenes + N queries de usuario (Prisma)
const orders = await prisma.order.findMany()
for (const order of orders) {
  const user = await prisma.user.findUnique({ where: { id: order.userId } })
}

// ✅ 1 sola query con JOIN
const orders = await prisma.order.findMany({ include: { user: true } })
```

En **Payload** el N+1 se controla con `depth` (cuántos niveles de relaciones se resuelven). Traer relaciones que no usás multiplica queries:
```typescript
// ✅ Payload Local API — controlá la profundidad de populate
const { docs } = await payload.find({
  collection: 'orders',
  depth: 1,           // resuelve la relación 'customer' un nivel; 0 = solo IDs
  limit: 20,
})
```

#### Lectura desde Server Components (Next.js 16)
Leé datos en el server, cerca de la base. Nunca expongas el cliente de DB al browser.
```typescript
// app/products/page.tsx  (Server Component, sin 'use client')
import { getPayload } from 'payload'
import config from '../../payload.config'

export default async function ProductsPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 20,
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
  })
  return <ProductGrid products={docs} />
}
```

#### Selección de datos
```typescript
// ❌ Trae TODOS los campos (datos sensibles y pesados)
const users = await prisma.user.findMany()

// ✅ Prisma — solo lo necesario
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
})

// ✅ Payload — proyección con `select`
const { docs } = await payload.find({
  collection: 'users',
  select: { name: true, email: true },
})
```

#### Paginación
```typescript
// ❌ Sin paginación — trae TODOS los registros
const products = await prisma.product.findMany()

// ✅ Cursor-based (eficiente en tablas grandes, no degrada como OFFSET)
const products = await prisma.product.findMany({
  take: 20,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' },
})

// ✅ Payload — paginación integrada
const page = await payload.find({ collection: 'products', page: 2, limit: 20 })
```

#### Transacciones
```typescript
// Operaciones múltiples que deben ser atómicas (Prisma)
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({ where: { id }, data: { stock: { decrement: 1 } } }),
])
```
En Payload, las operaciones pueden compartir una transacción vía `req` (`payload.create({ ..., req })`) dentro de hooks; verificá que las mutaciones relacionadas viajen en la misma transacción para no dejar estados inconsistentes.

#### Seguridad
- [ ] Sin queries por concatenación de strings (SQL injection) — usar el ORM o parámetros
- [ ] No exponer IDs internos secuenciales en URLs (usar slugs o UUIDs — evita enumeración/IDOR)
- [ ] Passwords siempre hasheados (bcrypt/argon2); Payload lo gestiona en la colección `auth`
- [ ] Campos sensibles excluidos por defecto de las respuestas (Prisma `omit`; Payload `access` + `admin.hidden`)
- [ ] Access control por colección/fila donde corresponda (Payload `access`, Postgres RLS en Supabase)

### 3. Checklist de Migraciones
- [ ] Migraciones en control de versiones (git), generadas por la herramienta:
  - Payload: `payload migrate:create` / `payload migrate`
  - Prisma: `prisma migrate dev` (dev) y `prisma migrate deploy` (prod)
  - Drizzle: `drizzle-kit generate` + `drizzle-kit migrate`
- [ ] Nunca editar migraciones ya aplicadas en producción
- [ ] Backups antes de migraciones destructivas (o usar branching de Neon/Supabase para probar)
- [ ] Migraciones reversibles cuando sea posible
- [ ] No agregar columnas `NOT NULL` sin default en tablas con datos existentes (usar expand → backfill → contract)
- [ ] Cambios de tipo/rename en dos pasos para evitar downtime

### 4. Notas por herramienta

**Payload CMS (Local API sobre Postgres) — lo que se usa hoy en estos proyectos**
- La Local API corre en el mismo proceso Node del server: sin HTTP, ideal para Server Components.
- El adapter `@payloadcms/db-postgres` usa Drizzle por debajo — podés inspeccionar/ajustar índices.
- Controlá `depth` para evitar N+1; usá `select` para achicar payloads.
- Definí `indexes` a nivel colección o `index: true` por campo para los filtros calientes.

**Prisma**
```typescript
// lib/prisma.ts — singleton (evita agotar conexiones en dev/hot-reload)
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
- `prisma generate` en el build step.
- Connection pooling en serverless (PgBouncer, Prisma Accelerate, o el pooler de Neon/Supabase).

**Drizzle**
- Cliente ligero, SQL-first, tipos inferidos del schema.
- Ideal con Neon serverless driver (`@neondatabase/serverless`) sobre HTTP/WebSocket en edge/serverless.

### 5. Mejores prácticas de datos 2026
- **Connection pooling en serverless es obligatorio.** Cada invocación de función puede abrir una conexión; sin pooler (Neon/Supabase pooler, PgBouncer en modo transaction, o driver HTTP de Neon) se agota Postgres. Verificá que la `DATABASE_URL` de runtime apunte al pooler y las migraciones al endpoint directo.
- **Database branching para previews.** Neon y Supabase permiten una branch efímera por deploy/PR: migraciones y seeds se prueban contra una copia aislada, sin tocar producción. Enganchalo al preview de Next.js.
- **Caching con revalidación explícita.** Con Next.js 16, `fetch`/queries se cachean intencionalmente. Usá `revalidateTag`/`revalidatePath` tras las mutaciones y etiquetá las lecturas para invalidar solo lo afectado — evita servir datos rancios sin re-consultar todo.

## Reporte de salida

```
## Database Review — [Fecha]

### Stack detectado: [Payload/Prisma/Drizzle + PostgreSQL(Neon/Supabase)/etc]

### Problemas críticos
- [modelo/query/colección] → [problema] → [solución con código]

### Optimizaciones de performance
- [query/índice/depth] → [mejora]

### Mejoras de schema
- [modelo] → [cambio sugerido + código]

### Migraciones y operación
- [riesgo/paso pendiente]

### Score base de datos: X/10
```
