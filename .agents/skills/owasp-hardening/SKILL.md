---
name: owasp-hardening
description: Hardening de seguridad OWASP Top 10 para apps web con Next.js 16 (App Router) + React 19 + TypeScript. Cierra las vulnerabilidades más explotadas con protecciones concretas en Server Actions y Route Handlers: validación Zod, control de acceso en el server, CSP y headers, sanitización XSS, secretos por env, verificación de firma e idempotencia en webhooks de pago. Úsalo cuando quieras blindar una app para producción, prepararla para usuarios reales, pasar una auditoría de seguridad, o cuando menciones "OWASP", "hardening", "blindar la app", "producción segura", "proteger usuarios", "pentesting", "IDOR", "CSP", o "security audit completo".
---

# OWASP Hardening — Next.js 16 / React 19 / TypeScript

Sos un experto en seguridad ofensiva y defensiva con certificación OSCP. Aplicás el framework OWASP Top 10 para identificar y cerrar las vulnerabilidades más explotadas en aplicaciones web modernas.

## Contexto técnico (2026)

- **Next.js 16 App Router** con **React 19** y **TypeScript estricto** (`strict: true`, sin `any`).
- Runtime **Node.js** para todo lo que toque secretos, crypto o base de datos (evitar Edge para crypto pesado). Declarar explícitamente cuando aplique: `export const runtime = 'nodejs'`.
- La superficie de ataque vive en **Server Actions** (`'use server'`) y **Route Handlers** (`app/api/**/route.ts`), no en `pages/api`. Sin carpeta `src/`.
- **Regla de oro**: el cliente es hostil. Toda validación, autorización y decisión de negocio ocurre en el server. Nunca confíes en props, headers, `formData`, ni en lo que "el frontend ya validó".
- Los Server Components y Server Actions corren en el server pero son invocables por cualquiera: una Server Action es un endpoint HTTP público. Tratala como tal.

## OWASP Top 10 — aplicado a Next.js

### A01: Broken Access Control (IDOR incluido)

El control de acceso roto es el #1 de OWASP. El caso típico es **IDOR**: el usuario cambia un `id` en la request y accede a un recurso ajeno.

```typescript
// app/actions/orders.ts
'use server'

import { auth } from '@/auth'
import { z } from 'zod'
import { db } from '@/lib/db'

const GetOrderSchema = z.object({ orderId: z.string().uuid() })

export async function getOrder(input: unknown) {
  // 1. Autenticación: ¿quién sos?
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  // 2. Validación: ¿el input tiene forma correcta?
  const { orderId } = GetOrderSchema.parse(input)

  const order = await db.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Not found')

  // 3. Autorización (IDOR): ¿este recurso es TUYO?
  //    Nunca alcanza con estar logueado — verificar ownership SIEMPRE.
  if (order.userId !== session.user.id) throw new Error('Forbidden')

  return order
}
```

```typescript
// middleware.ts — protección de rutas (defensa en profundidad, NO la única capa)
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isProtected = request.nextUrl.pathname.startsWith('/panel')

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/panel/:path*'] }
```

> El middleware protege navegación, no datos. La autorización real va en cada Server Action / Route Handler. Un atacante puede llamar la action directamente sin pasar por la ruta.

**Checklist A01:** ownership verificado en cada operación · roles chequeados en el server · sin IDs secuenciales adivinables (usar UUID/CUID) · endpoints de admin con doble verificación de rol.

### A02: Cryptographic Failures

```typescript
// NUNCA passwords en texto plano. NUNCA MD5/SHA1 para passwords.
// Preferir Argon2id; bcrypt (rounds >= 12) es aceptable.
import argon2 from 'argon2'
const hash = await argon2.hash(password) // Argon2id por defecto
const ok = await argon2.verify(hash, password)

// Secretos SIEMPRE por variable de entorno, nunca hardcodeados
const secret = process.env.AUTH_SECRET        // ✓
const secret = 'mi-secreto-hardcodeado'       // ✗ CRÍTICO — fuga en el repo

// Cookies de sesión seguras
const cookieOptions = {
  httpOnly: true,       // no accesible desde JS (mitiga robo por XSS)
  secure: true,         // solo HTTPS
  sameSite: 'lax',      // 'strict' si no necesitás navegación cross-site
  path: '/',
  maxAge: 60 * 60 * 24, // 24 h
}
```

Reglas: TLS en tránsito, cifrado en reposo para PII, comparaciones de tokens en tiempo constante (`crypto.timingSafeEqual`), y nunca loguear secretos ni tokens.

### A03: Injection (SQL, NoSQL, Command, XSS)

```typescript
// SQL Injection — siempre ORM o prepared statements, nunca string concat
// VULNERABLE:
const user = await db.$queryRawUnsafe(`SELECT * FROM users WHERE id = '${userId}'`)

// CORRECTO con Prisma (parametrizado):
const user = await db.user.findUnique({ where: { id: userId } })

// CORRECTO con raw query parametrizada (tagged template — escapa el valor):
const user = await db.$queryRaw`SELECT * FROM users WHERE id = ${userId}`
```

```typescript
// NoSQL Injection — no pasar objetos del cliente directo al query
// VULNERABLE: el body puede traer { email: { $gt: '' } } y matchea cualquiera
const user = await User.findOne({ email: req.body.email })

// CORRECTO: validar tipo con Zod antes de tocar la DB
const { email } = z.object({ email: z.string().email() }).parse(body)
const user = await User.findOne({ email })
```

XSS: React escapa por defecto. El riesgo aparece con `dangerouslySetInnerHTML`. Si tenés que renderizar HTML (ej. contenido de un editor), sanitizá en el server:

```typescript
import DOMPurify from 'isomorphic-dompurify'
const clean = DOMPurify.sanitize(userHtml, { ALLOWED_TAGS: ['b', 'i', 'a', 'p', 'ul', 'li'] })
// <div dangerouslySetInnerHTML={{ __html: clean }} />  ← solo con contenido ya sanitizado
```

### A04: Insecure Design

- Separar lógica de negocio del transporte HTTP (la action orquesta, el dominio decide).
- Rate limiting en rutas sensibles (login, registro, reset, checkout, webhooks).
- No exponer IDs secuenciales en URLs ni respuestas (usar UUID/CUID).
- Principio de mínimo privilegio en tokens, API keys y roles de DB.
- Validar reglas de negocio en el server: precios, stock, cupones y totales se recalculan del lado del server, nunca se confía en el monto que manda el cliente.

### A05: Security Misconfiguration (CSP + headers)

CSP moderna con **nonce por request** vía `middleware.ts` (App Router). Evita `unsafe-inline` en scripts.

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",     // Tailwind inyecta estilos inline
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.tu-dominio.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)              // el layout lo lee para inyectar scripts

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}
```

```typescript
// next.config.ts — headers estáticos que no dependen del nonce
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig
```

> `X-Frame-Options` quedó cubierto por `frame-ancestors 'none'` en la CSP (más flexible y moderno). Mantené ambos solo si necesitás soportar browsers legacy.

### A06: Vulnerable Components

→ Ver skill `dependency-audit` para el proceso completo.

Puntos clave:
```bash
npm audit --audit-level=high
# El pipeline de CI/CD debe fallar si hay High/Critical.
# Fijar versiones y revisar el lockfile; evitar rangos abiertos (^ / ~) en deps críticas.
```

### A07: Authentication Failures

```typescript
// app/api/auth/login/route.ts — rate limiting por IP
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 intentos / 15 min
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return Response.json({ error: 'Too many attempts' }, { status: 429 })
  }
  // ...validar credenciales, verificar hash, crear sesión
}
```

Reglas: invalidar sesiones al cambiar password · tokens de reset con expiración corta (15-30 min) y de un solo uso · mensajes de login genéricos (no revelar si el email existe) · notificar por email logins nuevos · 2FA opcional para cuentas sensibles.

### A08: Software and Data Integrity — Webhooks de pago

Un webhook de pago es la puerta a fraude: verificá **firma** (que viene del proveedor) e **idempotencia** (que no se procese dos veces).

```typescript
// app/api/webhooks/payments/route.ts
export const runtime = 'nodejs' // crypto necesita Node runtime

import crypto from 'crypto'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  // 1. Leer el cuerpo CRUDO (sin parsear) — la firma se calcula sobre el raw body
  const raw = await request.text()
  const signature = request.headers.get('x-webhook-signature') ?? ''
  const eventId = request.headers.get('x-webhook-id') ?? ''

  // 2. Verificar firma HMAC en tiempo constante
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(raw)
    .digest('hex')

  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

  if (!valid) return new Response('Invalid signature', { status: 401 })

  // 3. Idempotencia: si ya procesamos este eventId, salir sin re-ejecutar
  const already = await db.webhookEvent.findUnique({ where: { id: eventId } })
  if (already) return new Response('OK (duplicate)', { status: 200 })

  const event = JSON.parse(raw)
  await db.webhookEvent.create({ data: { id: eventId } }) // marcar como procesado
  // ...actualizar el pedido / la orden según event

  return new Response('OK', { status: 200 })
}
```

> No confíes en el monto ni el estado que trae el webhook a ciegas: reconciliá contra tu registro interno del pedido antes de marcarlo pagado.

### A09: Security Logging and Monitoring

```typescript
// Loggear eventos de seguridad — NUNCA con datos sensibles
const securityLog = {
  timestamp: new Date().toISOString(),
  event: 'LOGIN_FAILED',
  ip: request.headers.get('x-forwarded-for') ?? 'unknown',
  userId: attempt.email,   // el email del intento, NUNCA el password ni el token
  userAgent: request.headers.get('user-agent'),
}
console.error(JSON.stringify(securityLog)) // o enviar a Sentry / Datadog / Axiom

// Alertar sobre:
// - Múltiples logins fallidos desde la misma IP
// - Acceso (o intento) a recursos de otro usuario → señal de IDOR
// - Cambios de credenciales o de email
// - Firmas de webhook inválidas repetidas
```

### A10: Server-Side Request Forgery (SSRF)

```typescript
// VULNERABLE: el usuario controla la URL del fetch
export async function fetchExternal(url: string) {
  return fetch(url) // puede pegarle a http://localhost, a metadata cloud (169.254.169.254), etc.
}

// CORRECTO: allowlist de dominios + bloquear IPs internas
const ALLOWED_HOSTS = new Set(['api.proveedor-pagos.com', 'api.proveedor-mail.com'])

export async function fetchExternal(url: string) {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:') throw new Error('Only HTTPS allowed')
  if (!ALLOWED_HOSTS.has(parsed.hostname)) throw new Error('Host not allowed')
  return fetch(parsed, { redirect: 'error' }) // no seguir redirects a hosts no permitidos
}
```

## Protecciones 2026 (extra)

### Server Actions como endpoints públicos

Cada función `'use server'` es invocable por HTTP sin pasar por tu UI. Tratala como un endpoint: autenticar, validar con Zod y autorizar dentro de la función. No dependas de que "solo se llama desde tal botón".

```typescript
'use server'
import { auth } from '@/auth'
import { z } from 'zod'

const Schema = z.object({ productId: z.string().uuid(), qty: z.number().int().min(1).max(100) })

export async function addToCart(input: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  const data = Schema.parse(input)     // rechaza cualquier payload malformado
  // ...lógica con data ya validada
}
```

### Origin / CSRF en mutaciones

Next.js 16 verifica el header `Origin` contra `Host` para Server Actions, pero configurá `allowedOrigins` cuando corras detrás de proxy o multi-dominio, y mantené cookies `sameSite`. Para Route Handlers que mutan estado, validá `Origin` explícitamente.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['tu-dominio.com', 'www.tu-dominio.com'] },
  },
}
```

### Separar entorno server/cliente de las variables

Solo las variables con prefijo `NEXT_PUBLIC_` llegan al bundle del cliente. Cualquier otra (secretos, API keys) queda en el server. Validá el `env` al arrancar (ej. con Zod) para fallar rápido si falta un secreto, y nunca importes un módulo con secretos desde un Client Component.

## Checklist de hardening completo

### Headers HTTP
- [ ] `Content-Security-Policy` con nonce por request (sin `unsafe-inline` en scripts)
- [ ] `frame-ancestors 'none'` (o `X-Frame-Options: DENY` para legacy)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Strict-Transport-Security` con `preload`
- [ ] `Referrer-Policy` y `Permissions-Policy` restrictivos

### Autenticación
- [ ] Passwords con Argon2id (o bcrypt rounds >= 12)
- [ ] Rate limiting en login, registro y reset
- [ ] Tokens de reset de un solo uso y expiración corta
- [ ] Cookies: `httpOnly` + `secure` + `sameSite`
- [ ] Mensajes de login genéricos (no revelan si el email existe)

### Server Actions / Route Handlers
- [ ] Autenticación + autorización (ownership) verificadas en CADA función
- [ ] Validación Zod de todo input (`.parse` sobre `unknown`)
- [ ] IDs no secuenciales (UUID/CUID)
- [ ] Precios, totales y stock recalculados en el server
- [ ] Mensajes de error sin stack traces ni info interna
- [ ] Rate limiting en rutas sensibles

### Webhooks de pago
- [ ] Verificación de firma HMAC sobre el raw body en tiempo constante
- [ ] Idempotencia por `eventId` (no reprocesar duplicados)
- [ ] Reconciliación contra el registro interno del pedido
- [ ] `runtime = 'nodejs'` para el handler

### Datos
- [ ] Secretos por env var, nunca hardcodeados; `env` validado al arrancar
- [ ] Solo `NEXT_PUBLIC_*` expuesto al cliente
- [ ] Datos sensibles fuera de los logs
- [ ] PII mínima necesaria (data minimization); backups cifrados

### Infraestructura
- [ ] HTTPS forzado (redirect de HTTP)
- [ ] Dependencias sin CVE High/Critical (CI falla si hay)
- [ ] `.env*` en `.gitignore`
- [ ] Secretos rotados periódicamente
