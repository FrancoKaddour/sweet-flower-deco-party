---
name: auth-review
description: Revisión completa de autenticación y autorización para proyectos Next.js. Analiza NextAuth/Auth.js, JWT, session management, OAuth flows, manejo de roles/permisos, protección de rutas, password policies, y preparación para 2FA. Úsalo cuando el usuario quiera implementar login, revisar la seguridad del sistema de autenticación, configurar NextAuth, manejar sesiones, proteger rutas, agregar roles de usuario, configurar OAuth con Google/GitHub, o cuando mencione "login", "registro", "autenticación", "sesiones", "proteger rutas", "roles", "permisos", "NextAuth", o "Auth.js".
---

# Auth Review — Next.js / NextAuth / Auth.js

Sos un experto en seguridad de autenticación y gestión de identidad. Tu objetivo es revisar e implementar sistemas de autenticación seguros, escalables y con buena UX.

## Proceso de revisión

### 1. Relevamiento
- Identificá el sistema de auth: NextAuth v4/v5 (Auth.js), Clerk, Lucia, custom JWT, etc.
- Leé la configuración: `auth.ts`, `[...nextauth]/route.ts`, middleware
- Relevá cómo se protegen las rutas (middleware, layout, server components)
- Chequeá el manejo de sesiones y tokens
- Identificá los providers configurados (Google, GitHub, credentials, etc.)

### 2. Checklist de Autenticación

#### Configuración base (NextAuth / Auth.js)
- [ ] Secret seguro en `NEXTAUTH_SECRET` (mínimo 32 chars, generado aleatoriamente)
- [ ] `NEXTAUTH_URL` configurado correctamente en cada entorno
- [ ] Session strategy definida: `jwt` (stateless) o `database` (stateful)
- [ ] Callbacks `jwt` y `session` configurados para incluir datos custom del user
- [ ] `pages` custom configuradas (signIn, error, signOut) para mejor UX

```typescript
// auth.ts — configuración base segura
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 días
  pages: { signIn: '/login', error: '/auth/error' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role  // agregar datos custom
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      return session
    },
  },
})
```

#### Protección de rutas — Middleware
```typescript
// middleware.ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}

// O con lógica custom:
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})
```

#### Protección de rutas — Server Components
```typescript
// En layout o page de rutas protegidas
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  return <>{children}</>
}
```

#### Manejo de sesión y tokens JWT
- [ ] JWT firmado con HS256 o RS256 (no sin firma)
- [ ] Payload JWT sin datos sensibles (no incluir password hash, secrets)
- [ ] Expiración corta para access token (15min-1h), refresh token largo (7-30 días)
- [ ] Rotación de refresh tokens
- [ ] Invalidación de sesión al cambiar password

#### OAuth Providers
- [ ] Client ID y Secret en variables de entorno (nunca hardcoded)
- [ ] Redirect URIs configuradas estrictamente (sin wildcards en producción)
- [ ] Scopes mínimos necesarios (no pedir más permisos de los necesarios)
- [ ] State parameter activo (CSRF protection en OAuth)

#### Credentials Provider (login con email/password)
```typescript
// ❌ Peligroso — timing attack en comparación de passwords
if (user.password === hashedInput) ...

// ✅ Correcto — bcrypt con compare (tiempo constante)
import bcrypt from 'bcryptjs'
const isValid = await bcrypt.compare(password, user.hashedPassword)
if (!isValid) return null

// Hash al guardar:
const hashedPassword = await bcrypt.hash(password, 12) // cost factor 12
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
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Debe tener mayúscula')
    .regex(/[0-9]/, 'Debe tener número'),
  name: z.string().min(2).max(50),
})
```

#### Rate Limiting (anti fuerza bruta)
- [ ] Límite de intentos de login (ej: 5 intentos cada 15 min)
- [ ] Bloqueo temporal de cuenta o CAPTCHA tras intentos fallidos
- [ ] Rate limiting en endpoints de autenticación
- [ ] Logs de intentos fallidos

#### Roles y permisos
```typescript
// Verificar roles en server actions y API routes
import { auth } from '@/auth'

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autenticado')
  if (session.user.role !== 'admin') throw new Error('Sin permisos')
  // proceder...
}
```

#### Flujos de recuperación de contraseña
- [ ] Tokens de reset únicos, de un solo uso, con expiración (15-60 min)
- [ ] No exponer si el email existe o no en el mensaje de respuesta
- [ ] Envío de email de reset con link seguro
- [ ] Invalidar todos los tokens de reset al cambiar la password

#### Preparación para 2FA
- [ ] Estructura del modelo de usuario preparada para `twoFactorEnabled` y `twoFactorSecret`
- [ ] Flujo de login en 2 pasos (credenciales → código TOTP)
- [ ] Backup codes generados al activar 2FA

### 3. Checklist de Seguridad de Sesiones
- [ ] Sesiones invalidadas en logout (delete del token en DB si es session strategy database)
- [ ] `secure: true` en cookies de sesión en producción
- [ ] `httpOnly: true` en todas las cookies de auth
- [ ] `sameSite: 'lax'` o `'strict'` en cookies de auth

## Reporte de salida

```
## Auth Review — [Fecha]

### Sistema de auth detectado: [NextAuth v5 / Clerk / Custom / etc]

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
