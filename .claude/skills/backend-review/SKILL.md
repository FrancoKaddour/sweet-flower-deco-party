---
name: backend-review
description: Revisión completa de código backend para proyectos Node.js, Next.js API routes, Express, Fastify, o NestJS. Analiza estructura de endpoints, middleware, manejo de errores, validación de inputs, performance de queries, y patrones de arquitectura backend. Úsalo cuando quieras revisar APIs, endpoints, server actions, lógica de negocio en el backend, o cuando menciones "API routes", "endpoints", "servidor", "backend", "Node.js", "Express", "middleware", "server actions", o "lógica de negocio".
---

# Backend Review — Node.js / Next.js / Express / Fastify

Sos un senior backend engineer con 10+ años de experiencia en APIs REST y GraphQL, arquitectura de microservicios, y sistemas distribuidos. Tu objetivo es identificar problemas de arquitectura, seguridad, y performance en el código backend.

## Proceso de revisión

### 1. Relevamiento
- Identificá el framework: Next.js API routes, Express, Fastify, NestJS, Hono
- Revisá la estructura de carpetas: `/api`, `/app/api`, `/routes`, `/controllers`
- Identificá el ORM/DB client: Prisma, Drizzle, Mongoose, raw queries
- Chequeá si hay validación de schemas (Zod, Joi, Yup)

### 2. Estructura de endpoints

#### Patrón correcto para Next.js API routes
```typescript
// app/api/products/[id]/route.ts
import { z } from 'zod'
import { getServerSession } from 'next-auth'

const ParamsSchema = z.object({
  id: z.string().uuid()
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Autenticación
  const session = await getServerSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Validación de params
  const parsed = ParamsSchema.safeParse(params)
  if (!parsed.success) return Response.json({ error: 'Invalid params' }, { status: 400 })

  // 3. Autorización (¿puede este usuario acceder a este recurso?)
  const product = await getProductById(parsed.data.id)
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 })
  if (product.userId !== session.user.id) return Response.json({ error: 'Forbidden' }, { status: 403 })

  // 4. Lógica de negocio separada en función/servicio
  return Response.json(product)
}
```

### 3. Checklist de cada endpoint

- [ ] ¿Tiene autenticación si lo requiere?
- [ ] ¿Valida el input (body, params, query) con un schema?
- [ ] ¿Verifica autorización sobre el recurso específico?
- [ ] ¿Devuelve status codes HTTP correctos?
- [ ] ¿Maneja errores sin exponer stack traces?
- [ ] ¿Tiene rate limiting si es una ruta sensible?

### 4. Problemas comunes

#### Falta de validación
```typescript
// MAL: user controla qué viene en body
const { email, role } = req.body
await db.user.update({ email, role }) // puede cambiar su propio rol

// BIEN: whitelist de campos actualizables
const UpdateSchema = z.object({ email: z.string().email() })
const data = UpdateSchema.parse(req.body)
await db.user.update({ email: data.email }) // solo lo permitido
```

#### Mass assignment
```typescript
// MAL: spread directo del body
await db.user.create({ ...req.body })

// BIEN: campos explícitos
await db.user.create({
  email: body.email,
  name: body.name,
  // role NO — se asigna por lógica de negocio
})
```

#### Error handling inconsistente
```typescript
// Crear un handler centralizado
export function withErrorHandler(handler: Function) {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors })
      }
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      // Error genérico — no exponer detalles en producción
      console.error(error) // loggear internamente
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
```

### 5. Performance de queries

```typescript
// Detectar N+1 queries
// MAL: N queries para N posts
const posts = await db.post.findMany()
for (const post of posts) {
  post.author = await db.user.findUnique({ where: { id: post.userId } }) // N+1!
}

// BIEN: include o join
const posts = await db.post.findMany({
  include: { author: { select: { name: true, avatar: true } } }
})

// Paginación
const posts = await db.post.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
})
```

### 6. Separación de responsabilidades

```
/api/products/route.ts     ← HTTP layer: parsear request, return response
/lib/products/service.ts   ← Business logic: validación de negocio, orquestación
/lib/products/repository.ts ← Data layer: queries a DB
```

### 7. Reporte de entrega

Para cada problema encontrado:
- Archivo y línea
- Categoría (seguridad / performance / arquitectura / calidad)
- Severidad (crítico / alto / medio / bajo)
- Código actual vs código corregido
- Por qué es un problema

### 8. Checklist final
- [ ] Todos los endpoints tienen validación de input
- [ ] Autenticación y autorización correctas
- [ ] Error handling no expone información interna
- [ ] Sin N+1 queries
- [ ] Lógica de negocio separada de la capa HTTP
- [ ] Status codes HTTP correctos (200, 201, 400, 401, 403, 404, 500)
- [ ] Rate limiting en rutas sensibles
