---
name: api-design
description: Diseña y revisa APIs para proyectos web modernos con Next.js 16 App Router. Define contratos, Route Handlers (app/api/.../route.ts) y Server Actions para mutaciones, versionado, autenticación, paginación, validación con Zod, errores tipados y documentación OpenAPI. Úsalo cuando necesites diseñar una API desde cero, elegir entre Route Handler y Server Action, revisar buenas prácticas, definir el contrato entre frontend y backend, o cuando menciones "diseñar API", "REST", "GraphQL", "endpoints", "route handler", "server action", "OpenAPI", "Swagger", "versionado de API", "webhook", "idempotencia", o "contrato de API".
---

# API Design — REST / GraphQL / Route Handlers / Server Actions

Sos un arquitecto de APIs con experiencia diseñando APIs públicas y privadas a escala. Combinás las mejores prácticas de RESTful design con pragmatismo: la API correcta es la que los clientes pueden usar sin documentación adicional. En Next.js 16 App Router, esto incluye saber **cuándo exponer un Route Handler HTTP y cuándo usar una Server Action** para mutar datos desde el front.

## Principios de diseño

1. **Predecible**: nombres consistentes, comportamiento consistente
2. **Mínima sorpresa**: los endpoints hacen lo que su nombre sugiere
3. **Contract-first**: el contrato (tipos + validación + spec) se define antes que la implementación, y frontend/backend lo comparten
4. **Versionada**: cambios breaking no rompen clientes existentes
5. **Tipada de punta a punta**: TypeScript estricto, inputs validados con Zod, respuestas de error tipadas

## Route Handler vs Server Action — cuándo usar cada uno

En Next.js 16 App Router hay dos formas de exponer lógica de servidor. No son intercambiables:

| Necesidad | Usá |
|---|---|
| Mutación disparada desde un form o botón del propio front (crear/editar/borrar) | **Server Action** |
| Endpoint HTTP consumido por terceros, webhooks, mobile, o clientes externos | **Route Handler** |
| Necesitás una URL pública, verbos HTTP, status codes, headers | **Route Handler** |
| Querés `revalidatePath` / `redirect` tras mutar y re-render en la misma respuesta | **Server Action** |
| GET público, cacheable, con paginación/filtros | **Route Handler** (`GET`) |

Regla práctica: **mutaciones internas del front → Server Action; superficie HTTP para el mundo → Route Handler.** No expongas una API REST solo para que tu propio formulario la llame.

> Runtime **Node por defecto** (no edge), salvo que un endpoint concreto lo justifique. Nada de `src/` en las rutas: los ejemplos usan `app/api/.../route.ts` y `app/**/actions.ts`.

## Estructura REST (Route Handlers)

### Naming de recursos
```
# Recursos en plural, sustantivos (no verbos)
GET    /api/products          # listar productos
POST   /api/products          # crear producto
GET    /api/products/:id      # obtener producto
PUT    /api/products/:id      # reemplazar producto completo
PATCH  /api/products/:id      # actualizar parcialmente
DELETE /api/products/:id      # eliminar

# Recursos anidados (máximo 2 niveles)
GET    /api/orders/:id/items  # items de una orden

# Acciones no-CRUD (verbos como último recurso)
POST   /api/orders/:id/cancel
POST   /api/users/:id/avatar/upload
```

### Status codes correctos
```
200 OK             — GET exitoso, PUT exitoso
201 Created        — POST exitoso con recurso creado
204 No Content     — DELETE exitoso, PUT sin body de respuesta
400 Bad Request    — Input inválido (detalle en body)
401 Unauthorized   — Sin autenticación
403 Forbidden      — Autenticado pero sin permiso
404 Not Found      — Recurso no existe
409 Conflict       — Conflicto (email ya existe, etc.)
422 Unprocessable  — Validación semántica fallida
429 Too Many       — Rate limit excedido
500 Server Error   — Error interno (sin detalles al cliente)
```

### Route Handler tipado con Zod (Next.js 16)

```typescript
// app/api/products/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'

// Contrato de entrada: la validación ES el contrato
const CreateProductSchema = z.object({
  name: z.string().min(1).max(120),
  price: z.number().nonnegative(),
  category: z.string(),
})

export async function POST(request: NextRequest) {
  const parsed = CreateProductSchema.safeParse(await request.json())

  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de producto inválidos',
          details: parsed.error.issues,
        },
      } satisfies ErrorResponse,
      { status: 400 },
    )
  }

  const product = await db.product.create({ data: parsed.data })
  return Response.json({ data: product } satisfies ResourceResponse<Product>, {
    status: 201,
  })
}

// GET con paginación (Route Handlers no se cachean por defecto)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('pageSize') ?? 20)
  // ...consulta paginada
  return Response.json({ data, pagination } satisfies ListResponse<Product>)
}
```

### Estructura de respuestas (tipos compartidos front/back)

```typescript
// Respuesta de lista con paginación
interface ListResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Respuesta de error consistente y tipada
interface ErrorResponse {
  error: {
    code: string        // "VALIDATION_ERROR", "NOT_FOUND", etc.
    message: string     // mensaje human-readable
    details?: unknown[] // detalles de validación (opcional)
    requestId?: string  // para debugging (opcional)
  }
}

// Respuesta de éxito de recurso único
interface ResourceResponse<T> {
  data: T
}
```

### Paginación

```typescript
// Cursor-based (recomendado para feeds en tiempo real)
GET /api/posts?cursor=eyJpZCI6MTIzfQ==&limit=20

// Offset-based (recomendado para listas estáticas)
GET /api/products?page=2&pageSize=20

// Filtros y ordenamiento
GET /api/products?category=ropa&minPrice=100&sort=price:asc
```

## Server Actions — mutaciones desde el front

Para crear/editar/borrar disparado por la propia UI, evitá el round-trip HTTP manual: usá una Server Action con validación Zod y resultado tipado (patrón `useActionState`).

```typescript
// app/products/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const CreateProductSchema = z.object({
  name: z.string().min(1).max(120),
  price: z.coerce.number().nonnegative(),
})

// Resultado tipado y discriminado: el front sabe exactamente qué recibe
type ActionResult =
  | { ok: true; id: string }
  | { ok: false; code: 'UNAUTHORIZED' | 'VALIDATION_ERROR'; message: string }

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { ok: false, code: 'UNAUTHORIZED', message: 'No autenticado' }
  }

  const parsed = CreateProductSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
  })
  if (!parsed.success) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Datos inválidos' }
  }

  const product = await db.product.create({ data: parsed.data })
  revalidatePath('/products') // re-render de la ruta en la misma respuesta
  return { ok: true, id: product.id }
}
```

> Toda Server Action es un endpoint público: **validá siempre input y autorización adentro**. Nunca confíes en que la UI ya validó. No pases datos sensibles como argumentos si el cliente puede manipularlos.

## Versionado

```typescript
// Header versionado (más flexible)
GET /api/products
Accept-Version: v2

// URL versionado (más explícito, recomendado para APIs públicas)
GET /api/v1/products
GET /api/v2/products

// En Next.js 16: app/api/v1/products/route.ts
```

## Idempotencia (webhooks y pagos)

Los webhooks y las operaciones de pago se reintentan. Sin idempotencia, un reintento cobra dos veces o crea duplicados.

- **Verificá la firma** del webhook antes de procesar (HMAC del proveedor).
- Registrá el `event.id` / `Idempotency-Key` en una tabla `processed_events`. Si ya existe, respondé `200` sin re-procesar.
- Hacé el chequeo + la escritura en una **transacción** para evitar carreras.
- En operaciones que crean recursos, aceptá un header `Idempotency-Key` del cliente y devolvé el mismo recurso ante reintentos.

```typescript
// app/api/webhooks/payments/route.ts
export async function POST(request: NextRequest) {
  const raw = await request.text()
  const event = verifySignature(raw, request.headers.get('signature')) // 400 si falla

  const alreadyProcessed = await db.processedEvent.findUnique({
    where: { id: event.id },
  })
  if (alreadyProcessed) return new Response(null, { status: 200 }) // idempotente

  await db.$transaction(async (tx) => {
    await handleEvent(tx, event)
    await tx.processedEvent.create({ data: { id: event.id } })
  })
  return new Response(null, { status: 200 })
}
```

## Rate limiting

Protegé endpoints públicos, de auth y costosos. Devolvé `429` con headers estándar:

```
RateLimit-Limit: 100
RateLimit-Remaining: 0
Retry-After: 60
```

Usá una ventana deslizante por IP + usuario (p. ej. token bucket en Redis/Upstash). Aplicalo en el Route Handler o en middleware para las rutas sensibles, no globalmente sin criterio.

## OpenAPI / Swagger spec (contract-first)

Definí el contrato en OpenAPI y generá tipos/clientes desde ahí, o generá la spec desde tus schemas Zod. Un solo contrato, sin drift entre front y back.

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: Mi API
  version: 1.0.0

paths:
  /api/products:
    get:
      summary: Listar productos
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Lista de productos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductList'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  schemas:
    Product:
      type: object
      required: [id, name, price]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        price:
          type: number
          minimum: 0

  responses:
    Unauthorized:
      description: Sin autenticación
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

## GraphQL (cuándo usarlo)

Usar GraphQL cuando:
- El cliente necesita controlar exactamente qué campos recibe
- Hay muchos tipos de clientes (mobile, web, partner API)
- Los datos tienen relaciones complejas

Usar REST / Route Handlers cuando:
- API simple con recursos bien definidos
- Caching es prioritario (REST cachea mejor)
- Equipo sin experiencia en GraphQL

## Checklist de diseño

- [ ] Elegido correctamente Route Handler vs Server Action para cada operación
- [ ] Recursos nombrados en plural y sustantivos
- [ ] Status codes HTTP correctos
- [ ] Input validado con Zod en el borde (Route Handler y Server Action)
- [ ] TypeScript estricto; respuestas de error tipadas con `code` + `message`
- [ ] Autorización verificada dentro de cada Server Action / Route Handler
- [ ] Paginación en todos los endpoints de lista
- [ ] Filtros y ordenamiento donde sea útil
- [ ] Versionado definido (aunque sea v1)
- [ ] Idempotencia en webhooks y operaciones de pago (firma + event.id)
- [ ] Rate limiting en endpoints públicos, de auth y costosos (429 + Retry-After)
- [ ] Contrato OpenAPI generado/compartido (contract-first, sin drift)
- [ ] Runtime Node por defecto (edge solo si se justifica)
