---
name: owasp-hardening
description: Hardening de seguridad basado en OWASP Top 10 para aplicaciones web Next.js/Node.js. Implementa protecciones concretas contra las 10 vulnerabilidades más críticas: inyección, broken auth, XSS, IDOR, misconfiguration, componentes vulnerables, logging insuficiente, y más. Úsalo cuando quieras blindar una app para producción, prepararte para usuarios reales, pasar una auditoría de seguridad, o cuando menciones "OWASP", "hardening", "blindar la app", "producción segura", "proteger usuarios", "pentesting", o "security audit completo".
---

# OWASP Hardening — Next.js / Node.js

Sos un experto en seguridad ofensiva y defensiva con certificación OSCP. Aplicás el framework OWASP Top 10 para identificar y cerrar las vulnerabilidades más explotadas en aplicaciones web modernas.

## OWASP Top 10 — 2021

### A01: Broken Access Control

El control de acceso roto es el #1 de OWASP. Usuarios acceden a recursos que no deberían.

```typescript
// Verificar autorización en CADA server action / API route
export async function getDocument(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')
  
  const doc = await db.document.findUnique({ where: { id } })
  
  // CRÍTICO: verificar que el recurso pertenece al usuario
  if (doc.userId !== session.user.id) throw new Error('Forbidden')
  
  return doc
}

// Middleware para proteger rutas
export function middleware(request: NextRequest) {
  const session = getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

### A02: Cryptographic Failures

```typescript
// NUNCA almacenar datos sensibles en texto plano
// NUNCA usar MD5/SHA1 para passwords

// Correcto: bcrypt con salt rounds >= 12
import bcrypt from 'bcryptjs'
const hashedPassword = await bcrypt.hash(password, 12)

// Variables de entorno — nunca hardcodear secrets
const secret = process.env.JWT_SECRET // ✓
const secret = "mi-secreto-hardcodeado" // ✗ CRÍTICO

// Cookies seguras
const cookieOptions = {
  httpOnly: true,    // no accesible desde JS
  secure: true,      // solo HTTPS
  sameSite: 'strict', // protección CSRF
  maxAge: 60 * 60 * 24 // 24 horas
}
```

### A03: Injection (SQL, NoSQL, Command)

```typescript
// SQL Injection — usar siempre prepared statements / ORM
// VULNERABLE:
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`)

// CORRECTO con Prisma:
const user = await prisma.user.findUnique({ where: { id: userId } })

// CORRECTO con raw query:
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId])

// NoSQL Injection con Mongoose
// VULNERABLE: permite operadores como { $gt: '' }
const user = await User.findOne({ email: req.body.email })

// CORRECTO: sanitizar o validar tipo
const email = String(req.body.email) // forzar string
if (!email.includes('$')) { ... }    // o usar librería de validación
```

### A04: Insecure Design

- Separar lógica de negocio del transporte HTTP
- Implementar rate limiting en rutas sensibles
- No exponer IDs secuenciales en URLs (usar UUIDs)
- Principio de mínimo privilegio en tokens y API keys

### A05: Security Misconfiguration

```typescript
// next.config.ts — headers de seguridad
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'nonce-{NONCE}'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.tu-dominio.com",
            ].join('; ')
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
    ]
  },
}
```

### A06: Vulnerable Components

→ Ver skill `dependency-audit` para proceso completo.

Puntos clave:
```bash
npm audit --audit-level=high
# CI/CD debe fallar si hay High/Critical
```

### A07: Authentication Failures

```typescript
// Rate limiting en login
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 intentos por 15 min
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return Response.json({ error: 'Too many attempts' }, { status: 429 })
  }
  // continuar con el login...
}

// Invalidar sesiones en cambio de password
// Tokens de reset de password con expiración corta (15-30 min)
// Notificar al usuario por email de logins nuevos
```

### A08: Software and Data Integrity

```typescript
// Verificar integridad de webhooks
import crypto from 'crypto'

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(signature)
  )
}
```

### A09: Security Logging and Monitoring

```typescript
// Loggear eventos de seguridad (sin datos sensibles)
const securityLog = {
  timestamp: new Date().toISOString(),
  event: 'LOGIN_FAILED',
  ip: request.ip,
  userId: attempt.email, // nunca el password
  userAgent: request.headers['user-agent'],
}
console.error(JSON.stringify(securityLog)) // o enviar a Sentry/Datadog

// Alertar sobre:
// - Múltiples logins fallidos desde misma IP
// - Acceso a recursos de otro usuario
// - Cambios de credenciales
// - Acceso desde geolocalización inusual
```

### A10: Server-Side Request Forgery (SSRF)

```typescript
// VULNERABLE: el usuario controla la URL de fetch
export async function fetchExternal(url: string) {
  return fetch(url) // puede hacer fetch a localhost:3000/admin
}

// CORRECTO: whitelist de dominios permitidos
const ALLOWED_DOMAINS = ['api.stripe.com', 'api.sendgrid.com']

export async function fetchExternal(url: string) {
  const parsed = new URL(url)
  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
    throw new Error('Domain not allowed')
  }
  return fetch(url)
}
```

## Checklist de hardening completo

### Headers HTTP
- [ ] `Content-Security-Policy` configurado
- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Strict-Transport-Security` con preload
- [ ] `Referrer-Policy` configurado
- [ ] `Permissions-Policy` restrictivo

### Autenticación
- [ ] Passwords hasheados con bcrypt (rounds >= 12)
- [ ] Rate limiting en login y register
- [ ] Tokens con expiración corta
- [ ] Cookies: httpOnly + secure + sameSite
- [ ] CSRF protection activo

### API / Backend
- [ ] Autorización verificada en CADA endpoint
- [ ] IDs no secuenciales (UUIDs)
- [ ] Input validation en todos los endpoints (Zod/Joi)
- [ ] Rate limiting global en API
- [ ] Error messages sin info técnica interna

### Datos
- [ ] Variables de entorno, nunca hardcodeadas
- [ ] Datos sensibles no en logs
- [ ] Backups encriptados
- [ ] PII mínima necesaria (data minimization)

### Infrastructure
- [ ] HTTPS forzado (redirect de HTTP)
- [ ] Dependencias sin CVE High/Critical
- [ ] `.env` en `.gitignore`
- [ ] Secrets rotados regularmente
