# 00 — Empezá acá

Bienvenido. En esta página dejás el proyecto corriendo en tu compu y entendés dónde está cada cosa. Tomate el tiempo: hacerlo bien una vez te ahorra días.

---

## 1. Qué es este proyecto (en 30 segundos)

**Sweet Flowers Deco Party** es la marca de **Flor**: decoración de eventos + workshops/formación del rubro, en Argentina. Estamos construyendo su sitio premium **desde cero**: no es una landing, es una plataforma que junta **e-commerce propio** (catálogo, carrito, pago con Mercado Pago), **eventos/workshops**, **membresía/comunidad** y un **panel para cargar todo el contenido**.

- **Franco** → diseño (front) + carga de contenido.
- **Vos** → backend, funcionalidades y el panel de administración.

El detalle del negocio está en [`../../docs/00_PROJECT_HANDOFF.md`](../../docs/00_PROJECT_HANDOFF.md) y [`../../docs/01_BUSINESS.md`](../../docs/01_BUSINESS.md). Leelos cuando quieras contexto; no son obligatorios para empezar.

---

## 2. Qué necesitás instalado

| Herramienta | Para qué | Cómo verificar |
|---|---|---|
| **Node.js 20 o superior** | correr el proyecto | `node -v` |
| **Git** | control de versiones | `git --version` |
| **Un editor** (VS Code recomendado) | escribir código | — |
| **Claude Code y/o opencode** | tu copiloto de IA | ya lo tenés |
| Cuenta de **GitHub** | subir tu trabajo | pedile acceso a Franco al repo |

> Si `node -v` te da menos de 20, instalá la versión LTS desde [nodejs.org](https://nodejs.org).

---

## 3. Clonar y correr (paso a paso)

Abrí una terminal y ejecutá, uno por uno:

```bash
# 1. Cloná el repositorio (Franco te pasa la URL y te da acceso)
git clone https://github.com/FrancoKaddour/sweet-flower-deco-party.git
cd sweet-flower-deco-party

# 2. Instalá las dependencias (tarda un minuto la primera vez)
npm install

# 3. Levantá el proyecto en modo desarrollo
npm run dev
```

Abrí el navegador en **http://localhost:3000**. Deberías ver la home de Sweet Flowers. Si la ves: ✅ ya tenés el proyecto corriendo. Para frenarlo, en la terminal apretá `Ctrl + C`.

Otros comandos útiles:

```bash
npm run build   # compila como si fuera producción — SIEMPRE tiene que pasar antes de un PR
npm run lint    # revisa errores de estilo/código
```

---

## 4. Cómo está organizado el repo (mapa real)

```
sweet-flowers-deco-party/
├─ app/              ← páginas y rutas (Next.js App Router). Acá viven las URLs.
│  ├─ page.tsx       ← la home
│  ├─ layout.tsx     ← el "marco" común a todo el sitio
│  └─ globals.css    ← estilos base y tokens de diseño
├─ components/       ← componentes de React
│  ├─ sections/      ← las secciones de la home (Hero, Productos, etc.) — territorio de Franco
│  ├─ ui/            ← piezas reutilizables (Button, Eyebrow…)
│  ├─ motion/        ← animaciones (GSAP)
│  └─ site/          ← Header, Footer
├─ content/          ← contenido/datos (hoy poco; va a crecer con tu trabajo)
├─ lib/              ← utilidades y lógica (acá va a vivir mucho de lo tuyo)
├─ docs/             ← la "Project Bible": negocio, marca, decisiones, estándares
├─ colaboracion/     ← handoff del equipo
│  ├─ franco/        ← track de Franco (diseño + contenido)
│  ├─ gonzalo/       ← TU track (esta carpeta)
│  └─ compartido/    ← reglas comunes a los dos
└─ public/           ← imágenes y archivos estáticos
```

**Detalle clave:** el alias `@/` apunta a la **raíz** del proyecto. O sea `@/lib/commerce` = `lib/commerce`, `@/components/ui/Button` = `components/ui/Button`. Usá siempre `@/...` para importar, no rutas relativas largas (`../../..`).

> Ojo: en `docs/10_TECH_STACK.md` vas a ver una estructura con carpeta `src/`. **Esa es una propuesta vieja; el repo real NO usa `src/`.** Guiate por este mapa y por lo que ves en el repo.

---

## 5. Las reglas no negociables del proyecto

Estas aplican SIEMPRE (a vos y a la IA). Están explicadas en detalle en [`01_COMO_TRABAJAMOS.md`](./01_COMO_TRABAJAMOS.md), pero conocelas desde ya:

1. **Esta NO es la versión de Next.js que la IA "conoce de memoria".** Antes de escribir código de Next, hay que leer la guía real que viene en `node_modules/next/dist/docs/`. Es una regla del repo (está en [`../../AGENTS.md`](../../AGENTS.md)). En tus prompts, pedile a Claude: *"leé primero la doc relevante en node_modules/next/dist/docs antes de escribir código"*.
2. **TypeScript estricto, sin `any`.** Los tipos son tu red de seguridad.
3. **Runtime Node, nunca `edge`.** No pongas `export const runtime = "edge"`.
4. **Servicios externos (base de datos, pagos, emails) se conectan por el Marketplace de Vercel**, no cableando un proveedor a mano. Más sobre esto en la arquitectura.
5. **Nada de secretos en el código.** Claves y tokens van en variables de entorno (`.env.local`, que NO se sube a Git).
6. **Placeholders marcados** con `TODO(contenido):` y nunca inventar datos reales (precios, fechas, cupos).

La versión completa de "cómo pensar y trabajar" está en [`../../docs/CLAUDE.md`](../../docs/CLAUDE.md).

---

## 6. Tu primer día

1. Dejá el proyecto corriendo (paso 3). ✅
2. Leé [`01_COMO_TRABAJAMOS.md`](./01_COMO_TRABAJAMOS.md) y [`02_ARQUITECTURA_BACKEND.md`](./02_ARQUITECTURA_BACKEND.md). Sin apuro.
3. Abrí [`03_BACKLOG.md`](./03_BACKLOG.md) y arrancá por la **Tarea 0** (el "spike" de compatibilidad). Es corta y define el resto.
4. Cuando termines la Tarea 0, avisale a Franco el resultado antes de seguir.

---

## Mini-glosario (términos que vas a ver)

- **Repo / repositorio:** la carpeta del proyecto versionada con Git.
- **Rama (branch):** una copia paralela donde trabajás sin tocar lo estable (`main`).
- **Commit:** una "foto" guardada de tus cambios, con un mensaje.
- **PR (Pull Request):** pedido para incorporar tu rama a `main`; es donde Franco revisa.
- **Frontend (front):** lo que se ve en el navegador. **Backend:** la lógica y los datos por detrás.
- **RSC (React Server Component):** componente que se renderiza en el servidor (rápido, sin JS al cliente). En Next, por defecto todo es RSC salvo que pongas `"use client"`.
- **Route handler / API route:** un archivo en `app/api/...` que responde pedidos (por ejemplo, un webhook de pago).
- **CMS:** sistema para cargar contenido con un panel (nuestro será **Payload**).
- **ORM:** capa que traduce entre el código y la base de datos.
- **Webhook:** un aviso automático que un servicio externo (Mercado Pago) le manda a nuestro servidor cuando pasa algo (ej: "se pagó").
- **Migración:** cambio versionado en la estructura de la base de datos.
- **Idempotencia:** que procesar el mismo evento dos veces no rompa nada (clave en pagos).
- **Env var (variable de entorno):** un valor secreto o de configuración que vive fuera del código.
