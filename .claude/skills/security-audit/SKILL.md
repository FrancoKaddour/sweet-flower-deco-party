---
name: security-audit
description: Auditoría de ciberseguridad para proyectos web Next.js/React. Analiza vulnerabilidades frontend y backend: XSS, CSRF, CSP headers, CORS, inyección, cookies inseguras, exposición de datos sensibles, dependencias vulnerables, y configuración de seguridad. Úsalo cuando el usuario quiera revisar la seguridad de su app, prepararse para producción, revisar headers HTTP, configurar Content Security Policy, revisar el manejo de datos del usuario, o cuando mencione "seguridad", "vulnerabilidades", "proteger el sitio", "preparar para producción", o "hardening". También útil antes de cualquier deploy a producción.
---

# Security Audit — Next.js / React

Sos un experto en ciberseguridad web (OWASP Top 10, frontend security, Node.js security). Tu objetivo es identificar vulnerabilidades de seguridad y entregar soluciones concretas e implementables.

## Proceso de auditoría

### 1. Relevamiento
- Revisá `next.config.js/ts` para headers y configuración de seguridad
- Identificá formularios, inputs del usuario, y llamadas a APIs
- Chequeá manejo de variables de entorno (`.env`, `.env.local`)
- Relevá dependencias en `package.json`
- Buscá uso de `dangerouslySetInnerHTML`, `eval()`, `innerHTML`

### 2. Checklist de Seguridad

#### HTTP Security Headers
- [ ] `Content-Security-Policy` configurado (bloquea XSS)
- [ ] `X-Frame-Options: DENY` o `SAMEORIGIN` (clickjacking)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` (limitar acceso a cámara, micrófono, etc.)
- [ ] `Strict-Transport-Security` (HSTS, solo en HTTPS)

**Configuración en next.config.ts:**
```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  },
]
```

#### XSS (Cross-Site Scripting)
- [ ] No usar `dangerouslySetInnerHTML` sin sanitización
- [ ] Sanitizar HTML externo con `DOMPurify` antes de renderizar
- [ ] No construir URLs con input del usuario sin validación
- [ ] Escapar datos del usuario antes de insertarlos en el DOM

#### CSRF (Cross-Site Request Forgery)
- [ ] Tokens CSRF en formularios de mutación (POST/PUT/DELETE)
- [ ] Verificar `Origin` / `Referer` en API routes
- [ ] Cookies con `SameSite=Strict` o `SameSite=Lax`

#### Manejo de cookies y sesiones
- [ ] Cookies de sesión con flags: `HttpOnly`, `Secure`, `SameSite`
- [ ] No almacenar tokens sensibles en `localStorage` (vulnerable a XSS)
- [ ] Tokens en `httpOnly cookies` en su lugar
- [ ] Expiración de sesión configurada
- [ ] Invalidar sesión al logout (server-side)

#### Variables de entorno y secretos
- [ ] NUNCA exponer variables `NEXT_PUBLIC_` con valores sensibles
- [ ] API keys, passwords, y secrets SOLO en variables sin `NEXT_PUBLIC_`
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] No hay secrets hardcodeados en el código fuente

#### Validación e inputs
- [ ] Validar inputs en el servidor (nunca solo en cliente)
- [ ] Sanitizar parámetros de URL antes de usarlos en queries
- [ ] Tipado estricto con TypeScript + Zod/Yup para validación
- [ ] Límites de rate en API routes (evitar fuerza bruta)

#### CORS
- [ ] API routes con CORS restrictivo (solo dominios permitidos)
- [ ] No usar `Access-Control-Allow-Origin: *` en producción con credenciales

#### Dependencias
- [ ] Ejecutar `npm audit` y resolver vulnerabilidades críticas/high
- [ ] Mantener dependencias actualizadas (`npm outdated`)
- [ ] Verificar licencias de paquetes de terceros

#### Next.js específico
- [ ] `next.config.ts` sin `dangerouslyAllowSVG` salvo que sea necesario
- [ ] `images.domains` con lista restrictiva (no `*`)
- [ ] API routes con autenticación donde corresponda
- [ ] No exponer stack traces en producción (`NODE_ENV=production`)

### 3. Vulnerabilidades críticas a buscar activamente

```typescript
// ❌ Peligroso — XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Seguro
import DOMPurify from 'isomorphic-dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ❌ Peligroso — secret expuesto
NEXT_PUBLIC_API_SECRET=abc123

// ✅ Correcto — solo disponible en servidor
API_SECRET=abc123

// ❌ Peligroso — token en localStorage
localStorage.setItem('token', jwt)

// ✅ Seguro — httpOnly cookie (desde el servidor)
res.setHeader('Set-Cookie', `token=${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/`)
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
