---
name: project-clean
description: Limpieza y organización completa de proyectos Next.js/React para llevarlos a estándares de producción. Detecta y elimina archivos huérfanos, imports no usados, dependencias obsoletas, código muerto, console.logs, TODOs pendientes, y reorganiza la estructura de carpetas. Úsalo cuando el usuario quiera limpiar el proyecto, ordenar carpetas, eliminar código que no se usa, preparar el proyecto para producción, hacer un refactor de estructura, revisar dependencias, o cuando mencione "limpiar el proyecto", "ordenar", "hacer limpieza", "eliminar lo que no se usa", "preparar para deploy", "organizar carpetas", o "deuda técnica acumulada".
---

# Project Clean — Next.js / React

Sos un ingeniero de software senior especializado en mantenimiento y calidad de proyectos. Tu objetivo es llevar el proyecto a un estado limpio, ordenado, y profesional — como si hubiera sido trabajado por un equipo experimentado desde el inicio.

## Proceso de limpieza

### 1. Auditoría inicial — relevamiento completo

Antes de cambiar cualquier cosa, mapeá el estado actual:

```bash
# Ver estructura del proyecto
find src -type f | sort

# Buscar console.log y console.error
grep -r "console\." src --include="*.ts" --include="*.tsx"

# Buscar TODOs y FIXMEs
grep -r "TODO\|FIXME\|HACK\|XXX" src

# Imports no usados (TypeScript los reporta como warnings)
# Buscar archivos que no importa nadie
```

### 2. Checklist de limpieza

#### Código muerto
- [ ] Variables declaradas pero nunca usadas
- [ ] Funciones definidas pero nunca llamadas
- [ ] Importaciones no usadas en todos los archivos
- [ ] Componentes definidos pero no importados en ningún lugar
- [ ] Branches de código inalcanzables (`if (false)`, código después de `return`)
- [ ] Props pasadas a un componente que nunca las consume

```typescript
// ❌ Eliminar
import { useState, useEffect, useCallback } from 'react'  // useCallback no se usa
const unusedVariable = 'hello'
function neverCalledFunction() { ... }

// ✅ Solo lo necesario
import { useState, useEffect } from 'react'
```

#### Console logs y debugging
- [ ] Eliminar todos los `console.log()` de producción
- [ ] Eliminar `console.error()` usados para debugging
- [ ] Eliminar `debugger` statements
- [ ] Reemplazar con un logger real si se necesitan logs en producción

```typescript
// ❌ Eliminar
console.log('productos:', products)
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
- [ ] Utilidades nunca referenciadas
- [ ] Assets (imágenes, fuentes) en `public/` que no se usan
- [ ] Archivos de configuración duplicados o abandonados
- [ ] Archivos `.bak`, `.old`, `copy-of-`, etc.

#### Dependencias
```bash
# Ver dependencias potencialmente no usadas
npx depcheck

# Ver versiones desactualizadas
npm outdated

# Actualizar con cuidado (test después de cada update mayor)
npm update         # actualiza dentro del rango semver
npm install pkg@latest  # actualizar a última versión

# Auditar vulnerabilidades
npm audit
npm audit fix
```

- [ ] Eliminar paquetes en `package.json` que no se usan en el código
- [ ] Mover paquetes de `dependencies` a `devDependencies` si solo se usan en build/dev
- [ ] Verificar que no haya paquetes duplicados con funcionalidad similar
- [ ] Revisar si `@types/` packages tienen versiones matching con las librerías

#### Variables de entorno
- [ ] `.env.example` actualizado con todas las variables necesarias (sin valores reales)
- [ ] Eliminar variables de entorno que ya no se usan
- [ ] Documentar para qué sirve cada variable
- [ ] Verificar que `.env.local` y `.env` están en `.gitignore`

#### Estructura de carpetas — reorganización

**Estructura recomendada para Next.js App Router:**
```
src/
├── app/                      # Solo routing: page.tsx, layout.tsx, loading.tsx, error.tsx
│   ├── (shop)/               # Grupo de rutas (sin segmento en URL)
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Componentes base: Button, Input, Card, Modal
│   ├── layout/               # Header, Footer, Nav, Sidebar
│   └── [feature]/            # Componentes de dominio agrupados por feature
├── hooks/                    # Custom hooks: useCart.ts, useProducts.ts
├── lib/                      # Configuraciones y utilidades: prisma.ts, auth.ts
├── utils/                    # Funciones puras: formatPrice.ts, validateEmail.ts
├── types/                    # TypeScript types e interfaces
├── services/                 # Lógica de negocio y llamadas a APIs externas
└── constants/                # Constantes globales
```

#### TypeScript — errores y warnings
```bash
# Ver todos los errores de TypeScript
npx tsc --noEmit

# Ver con más detalle
npx tsc --noEmit --strict
```

- [ ] Resolver todos los errores `ts` (no solo los que impiden el build)
- [ ] Eliminar `// @ts-ignore` y `// @ts-expect-error` cuando sea posible
- [ ] Eliminar tipos `any` explícitos (reemplazar con tipos correctos)

#### ESLint — warnings acumulados
```bash
# Ver todos los warnings y errores de ESLint
npx eslint src --ext .ts,.tsx

# Fix automático de los que se pueden resolver
npx eslint src --ext .ts,.tsx --fix
```

#### Git — limpieza
- [ ] `.gitignore` incluye: `.env`, `.env.local`, `node_modules/`, `.next/`, `*.log`
- [ ] No hay archivos sensibles trackeados por git
- [ ] Branches mergeados eliminados (locales y remotas)

### 3. Orden de ejecución recomendado

1. **Primero** — hacer commit de todo lo actual (backup antes de limpiar)
2. Eliminar console.logs y debuggers
3. Eliminar imports no usados (TypeScript ayuda a detectarlos)
4. Eliminar código comentado y TODOs no viables
5. Eliminar archivos huérfanos (verificar que nada los importe primero)
6. Depcheck — limpiar dependencias no usadas
7. Reorganizar estructura de carpetas si es necesario
8. Correr `tsc --noEmit` y resolver errores
9. Correr ESLint y resolver warnings
10. **Al final** — build de producción (`npm run build`) para verificar que todo funciona

### 4. Script de limpieza automática

```bash
# Formatear todo con Prettier
npx prettier --write src/

# Fix ESLint automático
npx eslint src --ext .ts,.tsx --fix

# Verificar build
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

### Cambios realizados
- [ ] Console.logs eliminados: X
- [ ] Imports no usados eliminados: X
- [ ] Archivos huérfanos eliminados: X
- [ ] Dependencias removidas: [lista]
- [ ] Errores TypeScript resueltos: X
- [ ] Warnings ESLint resueltos: X

### Pendientes que requieren decisión del equipo
- [TODO importante] → [opciones]

### Reorganización de estructura
[cambios de carpetas si aplica]

### Estado final
- Build: ✅ / ❌
- TypeScript errors: X
- ESLint warnings: X
```

Siempre hacer un commit antes de empezar, y otro al terminar con el resumen de los cambios.
