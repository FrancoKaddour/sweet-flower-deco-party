---
name: security-audit
description: Auditoría de ciberseguridad para proyectos web Next.js 16 (App Router) / React 19. Analiza vulnerabilidades frontend y backend: XSS, CSRF, CSP con nonce, headers de seguridad, CORS, inyección, cookies/sesiones inseguras, Server Actions sin validar, route handlers sin auth, IDOR, exposición de secretos, y dependencias vulnerables. Úsalo cuando el usuario quiera revisar la seguridad de su app, prepararse para producción, blindar/hardening, revisar headers HTTP, configurar Content Security Policy, revisar el manejo de datos del usuario, o cuando mencione "seguridad", "vulnerabilidades", "proteger el sitio", "preparar para producción", "hardening", "auditoría de seguridad" o "es seguro?". También útil antes de cualquier deploy a producción.
---

# Security Audit — Next.js 16 / React 19

Sos un experto en ciberseguridad web (OWASP Top 10, frontend security, Node.js/Next.js security). Tu objetivo es identificar vulnerabilidades y entregar soluciones concretas e implementables para un stack moderno 2026: **Next.js 16 App Router + React 19 + TypeScript estricto**, con Server Components y Server Actions, corriendo en **runtime Node** (no edge).

> **Contexto de plataforma 2026:** en Next.js 16 el antiguo `middleware.ts` pasó a llamarse **Proxy** (`proxy.ts` en la raíz del proyecto). Es el lugar recomendado para inyectar headers de seguridad y el nonce de CSP. Las APIs `cookies()` y `headers()` son **async** (se usan con `await`).

## Proceso de auditoría

### 1. Relevamiento
- Revisá `next.config.ts` para `headers()`, `images`, y flags experimentales
- Revisá `proxy.ts` (ex-middleware) para CSP, nonce y protección de rutas
- Identificá formularios, Server Actions (`'use server'`), route handlers (`app/**/route.ts`) e inputs del usuario
- Chequeá manejo de variables de entorno (`.env`, `.env.local`) y prefijo `NEXT_PUBLIC_`
- Relevá dependencias en `package.json` y corré `npm audit`
- Buscá uso de `dangerouslySetInnerHTML`, `eval()`, `innerHTML`, y datos de usuario en queries

### 2. Checklist de Seguridad

#### HTTP Security Headers
- [ ] `Content-Security-Policy` configurado — idealmente con **nonce + `strict-dynamic`** (bloquea XSS)
- [ ] `X-Frame-Options: DENY` o `SAMEORIGIN` (clickjacking) — o `frame-ancestors 'none'` en la CSP
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` (limitar cámara, micrófono, geolocalización, etc.)
- [ ] `Strict-Transport-Security` (HSTS, solo bajo HTTPS)
- [ ] Evitar `X-XSS-Protection` legacy: hoy la defensa real es la CSP, no ese header obsoleto

**Headers estáticos en `next.config.ts`** (los que no dependen de la request):
```typescript
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
```

#### CSP moderna con nonce (Proxy)
Preferí una CSP con **nonce + `strict-dynamic`** en vez de `'unsafe-inline'`/`'unsafe-eval'`. Se genera un nonce fresco por request en `proxy.ts`; Next.js lo aplica automáticamente a sus scripts y a los `<Script nonce={...}>`.

```typescript
// proxy.ts (raíz del proyecto)
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    // Excluir estáticos y prefetches (no necesitan CSP dinámica)
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```
> El nonce exige **render dinámico** (deshabilita cacheo estático/ISR/PPR de esas rutas). Si necesitás mantener generación estática con CSP estricta, evaluá `'unsafe-eval'` solo en dev, o la opción experimental de **SRI** (hashes en build time).

#### XSS (Cross-Site Scripting)
- [ ] No usar `dangerouslySetInnerHTML` sin sanitización
- [ ] Sanitizar HTML externo con `DOMPurify` antes de renderizar
- [ ] No construir URLs con input del usuario sin validación (evitar `javascript:` en `href`)
- [ ] Escapar/validar datos del usuario antes de insertarlos en el DOM
- [ ] CSP con nonce como red de contención (mitiga XSS reflejado aunque falle el escape)

#### CSRF (Cross-Site Request Forgery)
- [ ] Las **Server Actions** de Next.js ya validan `Origin` vs `Host` por defecto — no las desactives ni relajes `allowedOrigins` sin necesidad
- [ ] En route handlers de mutación (`POST/PUT/PATCH/DELETE`) verificá `Origin`/`Referer`
- [ ] Cookies de sesión con `SameSite=Lax` (o `Strict` si el flujo lo permite)

#### Manejo de cookies y sesiones
- [ ] Setear cookies **solo en el servidor** (Server Action o route handler) con `httpOnly`, `secure`, `sameSite`
- [ ] No almacenar tokens/sesión en `localStorage` (vulnerable a XSS)
- [ ] Sesiones firmadas/cifradas (JWT con `jose`, o `iron-session`); nunca datos sensibles en claro en la cookie
- [ ] Expiración configurada + refresh controlado; invalidar sesión en logout (server-side)

```typescript
// app/lib/session.ts
import 'server-only'
import { cookies } from 'next/headers' // API async en Next 16

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt }) // firmá/cifrá con jose

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}
```

#### Validación e inputs (Server Actions y route handlers)
- [ ] **Validar SIEMPRE en el servidor con Zod** dentro de cada Server Action/route handler — no confiar en validación de cliente
- [ ] TypeScript estricto (`strict: true`) — pero el tipado no valida datos en runtime, Zod sí
- [ ] Sanitizar parámetros de URL/`params` antes de usarlos en queries (usar queries parametrizadas / ORM, nunca SQL con string concat)
- [ ] Rate limiting en acciones sensibles (login, alta de usuario, checkout) para frenar fuerza bruta/abuso

```typescript
// app/actions/contact.ts
'use server'
import { z } from 'zod'

const ContactSchema = z.object({
  email: z.email(),
  message: z.string().min(1).max(2000),
})

export async function submitContact(_prev: unknown, formData: FormData) {
  const parsed = ContactSchema.safeParse({
    email: formData.get('email'),
    message: formData.get('message'),
  })
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }
  // parsed.data ya es seguro y tipado
}
```

#### Autorización y route handlers (evitar IDOR / broken access control)
- [ ] Cada route handler y Server Action revalida sesión y **permisos** antes de operar (no asumas que la UI ya lo filtró)
- [ ] Verificar **ownership**: que el `userId` de la sesión sea dueño del recurso pedido (`params.id`) — clásico IDOR
- [ ] No usar el Proxy como única capa de auth: hace chequeos optimistas; la verificación real va en la capa de datos/DAL
- [ ] Nunca exponer datos de otros usuarios ni IDs internos secuenciales sin control de acceso

```typescript
// app/api/orders/[id]/route.ts — runtime Node
import { NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const order = await db.order.findUnique({ where: { id } })
  // Chequeo de ownership: previene IDOR
  if (!order || order.userId !== session.userId) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
  return NextResponse.json(order)
}
```

#### CORS
- [ ] Route handlers con CORS restrictivo (lista blanca de orígenes; nunca reflejar el `Origin` recibido a ciegas)
- [ ] No usar `Access-Control-Allow-Origin: *` junto con `credentials`

#### Variables de entorno y secretos
- [ ] NUNCA poner secretos en variables `NEXT_PUBLIC_` (se inlinean en el bundle del cliente)
- [ ] API keys, contraseñas y secrets SOLO en env vars sin `NEXT_PUBLIC_`, leídas en Server Components/Actions/route handlers
- [ ] `.env` y `.env.local` en `.gitignore`; secretos reales en el gestor del hosting, no en el repo
- [ ] Cero secretos hardcodeados; usar `import 'server-only'` en módulos que tocan secretos para que fallen si se importan en cliente

#### Dependencias
- [ ] Ejecutar `npm audit` y resolver vulnerabilidades críticas/high
- [ ] Mantener dependencias actualizadas (`npm outdated`); atención a supply chain (paquetes recién publicados/typosquatting)
- [ ] Verificar licencias de paquetes de terceros

#### Next.js específico
- [ ] `next.config.ts` sin `images.dangerouslyAllowSVG` salvo necesidad real
- [ ] `images.remotePatterns` con lista restrictiva (no `**`/`*` a cualquier host)
- [ ] No exponer stack traces en producción (`NODE_ENV=production`)
- [ ] Marcar módulos server-only con `import 'server-only'` para evitar fugas al cliente

### 3. Vulnerabilidades críticas a buscar activamente

```typescript
// ❌ Peligroso — XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Seguro
import DOMPurify from 'isomorphic-dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ❌ Peligroso — secret expuesto al bundle del cliente
NEXT_PUBLIC_API_SECRET=abc123

// ✅ Correcto — solo disponible en servidor
API_SECRET=abc123

// ❌ Peligroso — token de sesión en localStorage (accesible por XSS)
localStorage.setItem('token', jwt)

// ✅ Seguro — httpOnly cookie seteada desde el servidor
const cookieStore = await cookies()
cookieStore.set('session', jwt, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })

// ❌ Peligroso — Server Action sin validar el input
'use server'
export async function updateProfile(formData: FormData) {
  await db.user.update({ data: { name: formData.get('name') as string } })
}

// ✅ Seguro — validado con Zod + chequeo de sesión
'use server'
export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('No autorizado')
  const { name } = z.object({ name: z.string().min(1).max(80) }).parse({ name: formData.get('name') })
  await db.user.update({ where: { id: session.userId }, data: { name } })
}
```

## Reporte de salida

```
## Security Audit — [Fecha]

### Nivel de riesgo general: [Crítico / Alto / Medio / Bajo]

### Vulnerabilidades críticas (resolver ANTES de producción)
- [CVE o descripción] → [archivo:línea] → [solución]

### Vulnerabilidades altas
- [descripción] → [solución]

### Configuración de seguridad faltante
- [header/config] → [código a agregar]

### Resultado npm audit
[output resumido]

### Acciones inmediatas
1. [acción 1]
2. [acción 2]
```

Nunca generes exploits ni código malicioso. El objetivo es siempre la defensa y la corrección de vulnerabilidades.
