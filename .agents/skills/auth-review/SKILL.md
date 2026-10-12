---
name: auth-review
description: Revisión e implementación de autenticación y autorización para proyectos Next.js 16 (App Router) + React 19 + TypeScript estricto. Cubre Auth.js (NextAuth v5), sesiones y JWT, OAuth (Google/GitHub), roles y permisos, protección de rutas con proxy (ex middleware) y Data Access Layer, cookies seguras, CSRF, 2FA, y la auth nativa de Payload CMS para paneles/admin. Úsalo cuando el usuario quiera implementar o revisar login, registro, sesiones, tokens, proteger rutas, roles/permisos, OAuth, panel de administración, o cuando mencione "login", "registro", "autenticación", "sesiones", "proteger rutas", "roles", "permisos", "NextAuth", "Auth.js", "OAuth", "JWT", "2FA", "cookies seguras", o "panel de admin".
---

# Auth Review — Next.js 16 / Auth.js (NextAuth v5) / Payload CMS

Sos un experto en seguridad de autenticación y gestión de identidad. Tu objetivo es revisar e implementar sistemas de autenticación seguros, escalables y con buena UX sobre **Next.js 16 App Router + React 19 + TypeScript estricto**.

> **Contexto Next.js 16 (leer antes de escribir código).** Hubo breaking changes: el archivo `middleware.ts` quedó **deprecado y renombrado a `proxy.ts`** (la función se llama `proxy`, no `middleware`). El proxy corre por defecto en **runtime Node.js** (no edge) — mantené todo en Node runtime. Un guard en el proxy **no alcanza como única defensa**: la verificación de auth debe hacerse lo más cerca posible del dato (Data Access Layer, Server Actions, Route Handlers). Los ejemplos usan estructura de proyecto **sin `src/`** (`app/` en la raíz).

## Proceso de revisión

### 1. Relevamiento
- Identificá el sistema de auth: Auth.js / NextAuth v5, auth nativa de Payload CMS, Clerk, Lucia, custom JWT, etc.
- Leé la configuración: `auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `proxy.ts` (ex `middleware.ts`), `payload.config.ts`
- Relevá cómo se protegen las rutas: proxy, layouts/pages Server Components, y sobre todo el **Data Access Layer**
- Chequeá el manejo de sesiones, tokens y cookies (flags de seguridad)
- Identificá los providers configurados (Google, GitHub, credentials, etc.)
- Detectá quién usa el **panel/admin**: en proyectos de e-commerce y sitios con CMS suele ser la **auth nativa de Payload**, separada de la auth de clientes del storefront

### 2. Checklist de Autenticación

#### Configuración base (Auth.js / NextAuth v5)
- [ ] Secret seguro en `AUTH_SECRET` (mínimo 32 chars, generado aleatoriamente: `openssl rand -base64 32`)
- [ ] URL base y `trustHost` configurados correctamente por entorno (`AUTH_URL` / `trustHost: true` detrás de proxy)
- [ ] Session strategy definida: `jwt` (stateless) o `database` (stateful vía adapter)
- [ ] Callbacks `jwt` y `session` tipados para incluir datos custom del user (rol, id)
- [ ] `pages` custom configuradas (signIn, error) para mejor UX
- [ ] Tipos extendidos de `Session`/`JWT` en un `types/next-auth.d.ts` (TS estricto: sin `any`)

```typescript
// auth.ts — configuración base segura (Auth.js v5, runtime Node)
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 días
  pages: { signIn: '/login', error: '/auth/error' },
  providers: [Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role // agregar datos custom al token
      return token
    },
    session({ session, token }) {
      if (token.role) session.user.role = token.role as string
      return session
    },
  },
})
```

```typescript
// types/next-auth.d.ts — tipado estricto de la sesión (sin any)
import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role: 'admin' | 'customer'
  }
  interface Session {
    user: { role: 'admin' | 'customer' } & DefaultSession['user']
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'customer'
  }
}
```

```typescript
// app/api/auth/[...nextauth]/route.ts — handlers en Node runtime
import { handlers } from '@/auth'
export const { GET, POST } = handlers
export const runtime = 'nodejs' // NO edge
```

#### Protección de rutas — Proxy (ex middleware, Next.js 16)
```typescript
// proxy.ts (raíz del proyecto — reemplaza a middleware.ts en Next.js 16)
// Corre en runtime Node.js. Es una PRIMERA barrera / redirect optimista,
// NO la única defensa: reverificá siempre en el DAL / Server Action.
export { auth as proxy } from '@/auth'

export const config = {
  // Excluí assets estáticos para no bloquear CSS/JS/imágenes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

// O con lógica custom:
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminArea = req.nextUrl.pathname.startsWith('/dashboard')
  if (isAdminArea && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})
```

> **Migración desde Next.js 15**: si el proyecto todavía tiene `middleware.ts`, corré el codemod oficial `npx @next/codemod@canary middleware-to-proxy .` (renombra el archivo y la función `middleware` → `proxy`).

#### Protección de rutas — Data Access Layer (defensa principal)
En Next.js 16 la verificación de auth debe estar lo más cerca posible del dato. Centralizá la lógica en un DAL con `cache()` de React y `server-only`.

```typescript
// app/lib/dal.ts — fuente de verdad de la autorización
import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export const verifySession = cache(async () => {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return { userId: session.user.id, role: session.user.role }
})

export const requireAdmin = cache(async () => {
  const session = await verifySession()
  if (session.role !== 'admin') redirect('/') // o notFound()
  return session
})
```

```typescript
// Uso en un Server Component (layout/page de rutas protegidas)
import { verifySession } from '@/app/lib/dal'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await verifySession() // redirige si no hay sesión
  return <>{children}</>
}
```

#### Auth nativa de Payload CMS (paneles / admin)
En proyectos con CMS (e-commerce, sitios con panel a medida), el **admin suele autenticarse con la auth nativa de Payload**, separada de la auth de clientes del storefront. Payload firma un **JWT en cookie httpOnly** y expone helpers server-side.

- [ ] Colección con `auth: true` (agrega login, tokens y hashing de password automáticamente)
- [ ] `access` control por operación (`read`/`create`/`update`/`delete`) basado en `req.user` y su rol
- [ ] Cookie de Payload con `secure` en producción y `sameSite` restrictivo
- [ ] `verify: true` + email si se registran usuarios externos; `maxLoginAttempts` + `lockTime` contra fuerza bruta
- [ ] No mezclar la sesión de Payload con la de Auth.js: cada una protege su superficie (admin vs storefront)

```typescript
// collections/Users.ts — colección auth de Payload con roles y anti-brute-force
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 min de bloqueo
    cookies: { secure: true, sameSite: 'Lax' },
    tokenExpiration: 2 * 60 * 60, // 2 h
  },
  access: {
    // Solo admins pueden crear/borrar otros usuarios
    create: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ['admin', 'editor'],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
}
```

```typescript
// Verificar el usuario de Payload en un Route Handler / Server Action
import { getPayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import config from '@/payload.config'

export async function requirePayloadAdmin() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user || user.role !== 'admin') throw new Error('Sin permisos')
  return user
}
```

#### Manejo de sesión y tokens JWT
- [ ] JWT firmado con HS256 o RS256 (nunca `alg: none` / sin firma)
- [ ] Payload del JWT sin datos sensibles (no incluir password hash, secrets, PII innecesaria)
- [ ] Expiración corta para access token (15 min–1 h), refresh token largo (7–30 días)
- [ ] Rotación de refresh tokens (rotate + detección de reuso)
- [ ] Invalidación de sesión al cambiar password o al hacer logout

#### OAuth Providers (Google / GitHub / etc.)
- [ ] Client ID y Secret en variables de entorno (nunca hardcoded)
- [ ] Redirect URIs configuradas estrictamente (sin wildcards en producción)
- [ ] Scopes mínimos necesarios (no pedir más permisos de los que se usan)
- [ ] `state` parameter activo (protección CSRF en el flujo OAuth — Auth.js lo maneja por defecto)
- [ ] PKCE habilitado para el flujo authorization code (default en Auth.js v5)
- [ ] Vincular cuentas por email verificado, no por email a secas (evita account hijacking)

#### Credentials Provider (login con email/password)
```typescript
// ❌ Peligroso — timing attack en comparación de passwords
if (user.password === hashedInput) { /* ... */ }

// ✅ Correcto — comparación en tiempo constante con argon2id (recomendado 2026) o bcrypt
import argon2 from 'argon2'
const isValid = await argon2.verify(user.hashedPassword, password)
if (!isValid) return null

// Hash al guardar (argon2id es el algoritmo recomendado por OWASP):
const hashedPassword = await argon2.hash(password, { type: argon2.argon2id })

// Alternativa aceptable con bcrypt (cost factor >= 12):
// import bcrypt from 'bcryptjs'
// const isValid = await bcrypt.compare(password, user.hashedPassword)
```

#### Validación de inputs en login/registro
```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener mayúscula')
    .regex(/[0-9]/, 'Debe tener número'),
  name: z.string().min(2).max(50),
})
```

> **Chequeo de passwords filtradas (2026)**: validá contra la API k-anonymity de HaveIBeenPwned (o una lista local) para rechazar contraseñas ya comprometidas, en vez de exigir reglas de composición cada vez más complejas (recomendación NIST 800-63B).

#### Rate Limiting (anti fuerza bruta)
- [ ] Límite de intentos de login (ej: 5 intentos cada 15 min por IP + por cuenta)
- [ ] Bloqueo temporal de cuenta o CAPTCHA tras intentos fallidos
- [ ] Rate limiting en todos los endpoints de auth (login, registro, reset, verificación)
- [ ] Logs de intentos fallidos con IP y timestamp (para auditoría y alertas)

#### Roles y permisos
```typescript
// Reverificar rol en cada Server Action / Route Handler (nunca confiar solo en el proxy)
'use server'
import { requireAdmin } from '@/app/lib/dal'

export async function deleteProduct(id: string) {
  await requireAdmin() // lanza redirect si no es admin
  // proceder con el borrado...
}
```

#### Flujos de recuperación de contraseña
- [ ] Tokens de reset únicos, de un solo uso, con expiración (15–60 min), guardados **hasheados** en DB
- [ ] No exponer si el email existe o no (respuesta genérica siempre: "si existe, te enviamos un mail")
- [ ] Envío de email de reset con link seguro (HTTPS, token en el path, no en query loggeable)
- [ ] Invalidar todos los tokens de reset y sesiones activas al cambiar la password

#### 2FA / MFA
- [ ] Modelo de usuario preparado para `twoFactorEnabled` y `twoFactorSecret` (cifrado en reposo)
- [ ] Flujo de login en 2 pasos (credenciales → código TOTP), estándar RFC 6238
- [ ] Backup codes de un solo uso generados al activar 2FA
- [ ] Considerar **passkeys / WebAuthn** como segundo factor o passwordless (tendencia 2026, resistente a phishing)

### 3. Checklist de Cookies y CSRF
- [ ] `httpOnly: true` en todas las cookies de auth/sesión (no accesibles desde JS → mitiga XSS)
- [ ] `secure: true` en producción (solo por HTTPS)
- [ ] `sameSite: 'lax'` (o `'strict'` para acciones sensibles) → mitiga CSRF
- [ ] Nombre de cookie con prefijo `__Host-` cuando aplique (fuerza secure + path `/` + sin domain)
- [ ] Protección CSRF activa en endpoints de mutación (Auth.js incluye token CSRF; en Server Actions validar origen)
- [ ] Sesiones invalidadas en logout (delete del token en DB si la strategy es `database`)

## Reporte de salida

```
## Auth Review — [Fecha]

### Sistema de auth detectado: [Auth.js v5 / Payload CMS nativo / Custom / etc]
### Superficies: [storefront: Auth.js] · [admin/panel: Payload]

### Vulnerabilidades críticas
- [problema] → [solución con código]

### Configuración incompleta
- [elemento] → [configuración correcta]

### Mejoras de UX y flujo
- [mejora]

### Próximos pasos recomendados
1. [acción prioritaria]
2. [acción secundaria]

### Score auth: X/10
```
