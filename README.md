# Sweet Flowers Deco Party

Plataforma de marca premium para **Sweet Flowers Deco Party** (Flor): decoración de eventos, formación (Summit) y comunidad, con **e-commerce propio** y un **panel de administración a medida**. No es una landing: es una plataforma que tiene que verse de nivel de agencia top y **funcionar perfecto**.

> **Antes de escribir código, leé la documentación.** La fuente de verdad del proyecto vive en [`docs/`](./docs/) (la "Project Bible"). Si el código y la documentación se contradicen, **manda la documentación**.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript estricto**
- **Tailwind CSS** · **GSAP** (ScrollTrigger + SplitText) + **Lenis** (smooth scroll)
- Deploy en **Vercel** · imágenes con `next/image`, fuentes con `next/font`
- Backend (en construcción): **Payload CMS** sobre **Postgres (Neon)** + **Vercel Blob** + **Mercado Pago**

## Correr en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción — tiene que pasar antes de cada PR
npm run lint
```

> Esta **no** es la versión de Next.js que la IA conoce de memoria. Antes de tocar código de Next, revisá `node_modules/next/dist/docs/` (regla del repo — ver [`AGENTS.md`](./AGENTS.md)).

## Cómo está organizado

| Carpeta | Qué hay |
|---|---|
| [`app/`](./app/) | Páginas y rutas (App Router), `layout`, `globals.css`, `sitemap`/`robots` |
| [`components/`](./components/) | UI del sitio: `sections/`, `motion/`, `site/`, `ui/` |
| [`lib/`](./lib/) · [`content/`](./content/) | Utilidades/lógica y contenido centralizado del sitio |
| [`docs/`](./docs/) | **Project Bible**: negocio, marca, arquitectura, decisiones, estándares |
| [`colaboracion/`](./colaboracion/) | Onboarding y división de trabajo del equipo (Franco / Gonzalo) |
| [`.claude/skills/`](./.claude/skills/) | Skills de Claude Code versionadas para el equipo |

## Por dónde empezar

- **IA / Claude Code:** [`docs/CLAUDE.md`](./docs/CLAUDE.md) → [`docs/00_PROJECT_HANDOFF.md`](./docs/00_PROJECT_HANDOFF.md)
- **Backend (Gonzalo):** [`colaboracion/gonzalo/00_EMPEZA_ACA.md`](./colaboracion/gonzalo/00_EMPEZA_ACA.md)
- **Diseño y dirección (Franco):** [`colaboracion/franco/`](./colaboracion/franco/)

## Estado

Fase de **documentación estratégica + prototipo visual**. El contenido real (fotos, textos, productos, precios) se marca como `TODO(contenido)` hasta que llega — nunca se inventan datos duros. Decisiones y pendientes en [`docs/16_DECISIONS.md`](./docs/16_DECISIONS.md).
