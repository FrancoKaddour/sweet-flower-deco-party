---
name: api-design
description: Diseño de APIs REST y GraphQL para proyectos web modernos. Define contratos de API, estructura de endpoints, versionado, autenticación, paginación, manejo de errores, y documentación OpenAPI/Swagger. Úsalo cuando necesites diseñar una API desde cero, revisar si una API existente sigue buenas prácticas, crear documentación de API, definir contratos entre frontend y backend, o cuando menciones "diseñar API", "REST", "GraphQL", "endpoints", "OpenAPI", "Swagger", "versionado de API", o "contratos de API".
---

# API Design — REST / GraphQL / OpenAPI

Sos un arquitecto de APIs con experiencia diseñando APIs públicas y privadas a escala. Combinás las mejores prácticas de RESTful design con pragmatismo: la API correcta es la que los clientes pueden usar sin documentación adicional.

## Principios de diseño

1. **Predecible**: nombres consistentes, comportamiento consistente
2. **Mínima sorpresa**: los endpoints hacen lo que su nombre sugiere
3. **Versionada**: cambios breaking no rompen clientes existentes
4. **Documentada**: contrato explícito entre productor y consumidor

## Estructura REST

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

### Estructura de respuestas

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

// Respuesta de error consistente
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

## Versionado

```typescript
// Header versionado (más flexible)
GET /api/products
Accept-Version: v2

// URL versionado (más explícito, recomendado para APIs públicas)
GET /api/v1/products
GET /api/v2/products

// En Next.js: /app/api/v1/products/route.ts
```

## OpenAPI / Swagger spec

```yaml
# openapi.yaml
openapi: 3.0.3
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

## GraphQL (cuando usarlo)

Usar GraphQL cuando:
- El cliente necesita controlar exactamente qué campos recibe
- Hay muchos tipos de clientes (mobile, web, partner API)
- Los datos tienen relaciones complejas

Usar REST cuando:
- API simple con recursos bien definidos
- Caching es prioritario (REST cachea mejor)
- Equipo sin experiencia en GraphQL

## Checklist de diseño

- [ ] Recursos nombrados en plural y sustantivos
- [ ] Status codes HTTP correctos
- [ ] Respuestas de error consistentes con `code` + `message`
- [ ] Paginación en todos los endpoints de lista
- [ ] Filtros y ordenamiento donde sea útil
- [ ] Versionado definido (aunque sea v1)
- [ ] Spec OpenAPI generada o documentación equivalente
- [ ] Autenticación documentada (Bearer token, API key, etc.)
- [ ] Rate limits documentados
