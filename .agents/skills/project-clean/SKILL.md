---
name: project-clean
description: Limpieza y organización de proyectos Next.js 16 (App Router) + React 19 + TypeScript estricto para llevarlos a estándares de producción. Detecta y elimina código muerto, imports sin usar, dependencias obsoletas, archivos huérfanos, console.log, y limpia los límites Server/Client. Reorganiza la estructura de carpetas (app/, components/, lib/, hooks/, types/ en la raíz, sin src/). Úsalo cuando el usuario quiera limpiar el proyecto, ordenar carpetas, eliminar código que no se usa, preparar para deploy, hacer un refactor de estructura, revisar dependencias, o cuando mencione "limpiar el proyecto", "ordenar", "hacer limpieza", "eliminar lo que no se usa", "código muerto", "imports sin usar", "preparar para producción", "organizar carpetas", "knip", "depcheck", o "deuda técnica acumulada".
---

# Project Clean — Next.js 16 / React 19 / TypeScript

Sos un ingeniero de software senior especializado en mantenimiento y calidad de proyectos. Tu objetivo es llevar el proyecto a un estado limpio, ordenado y profesional — como si hubiera sido trabajado por un equipo experimentado desde el inicio.

Este stack asume **Next.js 16 App Router + React 19 + TypeScript en modo estricto**, con la estructura de carpetas **en la raíz (sin `src/`)**: `app/`, `components/`, `lib/`, `hooks/`, `types/`.

> Antes de tocar código de Next.js, revisá la guía relevante en `node_modules/next/dist/docs/`: la versión 16 tiene cambios de API respecto de versiones previas.

## Proceso de limpieza

### 1. Auditoría inicial — relevamiento completo

Antes de cambiar cualquier cosa, mapeá el estado actual:

```bash
# Ver estructura del proyecto (carpetas en la raíz, sin src/)
find app components lib hooks types -type f 2>/dev/null | sort

# Buscar console.log / console.error / console.warn
grep -rn "console\." app components lib hooks --include="*.ts" --include="*.tsx"

# Buscar TODOs, FIXMEs y debugger
grep -rn "TODO\|FIXME\|HACK\|XXX\|debugger" app components lib hooks

# Buscar directivas de cliente para auditar la frontera Server/Client
grep -rln "'use client'" app components
```

Herramientas de análisis estático (correr en modo reporte primero, no borrar a ciegas):

```bash
# knip: análisis unificado de código muerto, exports, archivos y deps sin usar
npx knip

# ts-prune: exports de TypeScript que nadie importa (código muerto entre módulos)
npx ts-prune

# depcheck: dependencias declaradas pero no usadas (y usadas pero no declaradas)
npx depcheck
```

`knip` cubre gran parte de lo que antes requería varias herramientas; usá `ts-prune` y `depcheck` para confirmar hallazgos puntuales.

### 2. Checklist de limpieza

#### Código muerto
- [ ] Variables declaradas pero nunca usadas
- [ ] Funciones definidas pero nunca llamadas
- [ ] Importaciones no usadas en todos los archivos
- [ ] Componentes definidos pero no importados en ningún lugar
- [ ] Exports que ningún módulo consume (usar `ts-prune` / `knip`)
- [ ] Branches inalcanzables (`if (false)`, código después de `return`)
- [ ] Props pasadas a un componente que nunca las consume

```typescript
// ❌ Eliminar
import { useState, useEffect, useCallback } from 'react' // useCallback no se usa
const unusedVariable = 'hello'
function neverCalledFunction() { /* ... */ }

// ✅ Solo lo necesario
import { useState, useEffect } from 'react'
```

#### Console logs y debugging
- [ ] Eliminar todos los `console.log()` de producción
- [ ] Eliminar `console.error()` / `console.warn()` usados para debugging
- [ ] Eliminar `debugger` statements
- [ ] Reemplazar con un logger real si se necesitan logs en producción

```typescript
// ❌ Eliminar
console.log('items:', items)
console.log('render')
debugger

// ✅ Si se necesitan logs en producción usar un logger
import { logger } from '@/lib/logger'
logger.info('Order created', { orderId })
```

#### TODOs y comentarios obsoletos
- [ ] Revisar cada TODO — implementar o eliminar (los TODOs infinitos son deuda técnica)
- [ ] Eliminar código comentado (`// const oldFunction = ...`)
- [ ] Eliminar comentarios que explican código obvio
- [ ] Mantener solo comentarios que explican el "por qué" de decisiones no obvias

#### Archivos huérfanos
Archivos que existen en el proyecto pero nadie importa ni usa:
- [ ] Componentes nunca importados
- [ ] Utilidades y hooks nunca referenciados
- [ ] Assets (imágenes, fuentes) en `public/` que no se usan
- [ ] Archivos de configuración duplicados o abandonados
- [ ] Archivos `.bak`, `.old`, `copy-of-`, etc.

`knip` reporta archivos huérfanos automáticamente. Verificá siempre antes de borrar: un archivo puede referenciarse de forma dinámica (por string, glob o convención de rutas de Next.js).

#### Frontera Server / Client
Next.js 16 App Router renderiza en Server Components por defecto. Una frontera limpia reduce el bundle del cliente y evita bugs sutiles:
- [ ] Un componente solo lleva `'use client'` si realmente usa hooks, estado, eventos o APIs del browser
- [ ] No arrastrar árboles enteros al cliente: empujá `'use client'` a las hojas que lo necesitan
- [ ] No importar código de servidor (acceso a DB, secrets, `fs`) desde componentes cliente
- [ ] Marcar módulos server-only con `import 'server-only'` para fallar en build si se filtran al cliente
- [ ] `async`/`await` para fetching en Server Components; evitar `useEffect` para cargar datos
- [ ] Directivas `'use client'` huérfanas (el componente ya no usa nada de cliente) → eliminarlas

```typescript
// ❌ 'use client' en la raíz obliga a todo el árbol a ser cliente
'use client'
export default function ProductPage() { /* mucho contenido estático */ }

// ✅ Server Component que solo hace cliente la parte interactiva
import { AddToCartButton } from './add-to-cart-button' // este sí lleva 'use client'
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return <><ProductInfo product={product} /><AddToCartButton id={product.id} /></>
}
```

#### Dependencias
```bash
# Dependencias no usadas / faltantes
npx depcheck

# Versiones desactualizadas
npm outdated

# Actualizar con cuidado (probar después de cada update mayor)
npm update              # actualiza dentro del rango semver
npm install pkg@latest  # actualizar a última versión

# Auditar vulnerabilidades
npm audit
npm audit fix
```

- [ ] Eliminar paquetes en `package.json` que no se usan en el código
- [ ] Mover paquetes a `devDependencies` si solo se usan en build/dev/test
- [ ] Verificar que no haya paquetes duplicados con funcionalidad similar
- [ ] Verificar que los `@types/` matcheen la versión de su librería (o eliminarlos si el paquete ya trae tipos propios)
- [ ] Revisar peer dependencies rotas tras subir React 19 / Next.js 16

#### Variables de entorno
- [ ] `.env.example` actualizado con todas las variables necesarias (sin valores reales)
- [ ] Eliminar variables de entorno que ya no se usan
- [ ] Documentar para qué sirve cada variable
- [ ] Variables públicas correctamente prefijadas con `NEXT_PUBLIC_`; el resto nunca debe llegar al cliente
- [ ] Verificar que `.env`, `.env.local` y `.env*.local` están en `.gitignore`

#### Estructura de carpetas — reorganización

**Estructura recomendada (Next.js 16 App Router, carpetas en la raíz, sin `src/`):**
```
app/                         # Solo routing: page.tsx, layout.tsx, loading.tsx, error.tsx
├── (marketing)/             # Grupo de rutas (sin segmento en la URL)
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── api/                     # Route Handlers (route.ts)
components/
├── ui/                      # Componentes base: Button, Input, Card, Modal
├── layout/                  # Header, Footer, Nav, Sidebar
└── [feature]/               # Componentes de dominio agrupados por feature
hooks/                       # Custom hooks de cliente: use-media-query.ts, use-cart.ts
lib/                         # Config, acceso a datos y utilidades: db.ts, auth.ts, utils.ts
types/                       # Tipos e interfaces de TypeScript compartidos
```

- [ ] Colocar cada archivo cerca de donde se usa; subir a compartido solo cuando lo usan varias features
- [ ] Un naming consistente para archivos (elegí kebab-case o el que use el repo, y respetalo)
- [ ] Nada de lógica en `app/` más allá del routing; la lógica vive en `lib/`, `hooks/`, `components/`

#### TypeScript — modo estricto, cero errores
```bash
# Ver todos los errores de TypeScript (con la config estricta del proyecto)
npx tsc --noEmit
```

- [ ] `strict: true` en `tsconfig.json` (y no relajarlo para "arreglar" errores)
- [ ] Resolver todos los errores `ts` (no solo los que impiden el build)
- [ ] Eliminar `// @ts-ignore` / `// @ts-expect-error` cuando sea posible
- [ ] Eliminar `any` explícitos (reemplazar por el tipo correcto o `unknown` + narrowing)

#### ESLint — warnings acumulados
```bash
# Lint del proyecto (Next.js 16 usa flat config: eslint.config.mjs)
npx eslint .

# Fix automático de lo que se pueda resolver
npx eslint . --fix
```

- [ ] Cero warnings al terminar (o justificados con comentario explícito)
- [ ] Regla `no-unused-vars` / `no-console` activas para prevenir reincidencia

#### Git — limpieza
- [ ] `.gitignore` incluye: `.env*`, `node_modules/`, `.next/`, `*.log`, `coverage/`
- [ ] No hay archivos sensibles trackeados por git
- [ ] Branches mergeados eliminados (locales y remotas)

### 3. Orden de ejecución recomendado

1. **Primero** — commit de todo lo actual (backup antes de limpiar)
2. Correr `knip` / `ts-prune` / `depcheck` en modo reporte para tener el mapa
3. Eliminar console.logs y debuggers
4. Eliminar imports y exports no usados
5. Eliminar código comentado y TODOs no viables
6. Eliminar archivos huérfanos (verificar que nada los importe, incluidas referencias dinámicas)
7. Limpiar dependencias no usadas (`depcheck`)
8. Auditar la frontera Server/Client (`'use client'` innecesarios, filtraciones de código server)
9. Reorganizar estructura de carpetas si es necesario
10. Correr `tsc --noEmit` en modo estricto y resolver errores
11. Correr ESLint y resolver warnings
12. **Al final** — build de producción (`npm run build`) para verificar que todo funciona

### 4. Script de limpieza automática

```bash
# Formatear todo (Prettier o el formatter del repo)
npx prettier --write .

# Fix ESLint automático
npx eslint . --fix

# Type-check estricto
npx tsc --noEmit

# Verificar build de producción
npm run build
```

## Reporte de salida

```
## Project Clean Report — [Fecha]

### Estado inicial del proyecto
- Archivos revisados: X
- Console.logs encontrados: X
- TODOs pendientes: X
- Dependencias no usadas: X
- 'use client' innecesarios: X

### Cambios realizados
- [ ] Console.logs eliminados: X
- [ ] Imports/exports no usados eliminados: X
- [ ] Archivos huérfanos eliminados: X
- [ ] Dependencias removidas: [lista]
- [ ] Fronteras Server/Client limpiadas: X
- [ ] Errores TypeScript resueltos: X
- [ ] Warnings ESLint resueltos: X

### Pendientes que requieren decisión del equipo
- [TODO importante] → [opciones]

### Reorganización de estructura
[cambios de carpetas si aplica]

### Estado final
- Build: ✅ / ❌
- TypeScript errors (strict): X
- ESLint warnings: X
```

Siempre hacer un commit antes de empezar, y otro al terminar con el resumen de los cambios.
