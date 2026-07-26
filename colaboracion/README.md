# Colaboración — Sweet Flowers Deco Party

Carpeta de **handoff del equipo**. Acá está definido **quién hace qué**, **cómo trabajamos** y **qué construimos**, para que Franco y Gonzalo se enfoquen a full sin pisarse y hagan un trabajo de nivel.

Objetivo: un sitio **memorable** que funcione perfecto y sea un **puente de crecimiento** para Flor. Nivel de un producto que cotiza USD 30k.

---

## Empezá por acá

1. **[HANDOFF.md](./HANDOFF.md)** — la división del trabajo: roles, quién es dueño de qué, límites de archivos, cómo colaboramos, y el plan de contenido. **Léanlo los dos.**

## Las dos pistas

- **[franco/](./franco/)** → diseño, contenido, dirección y revisión.
  Un día por página, cómo hacer cada una memorable, cómo revisar a Gonzalo, y el intake de contenido de Flor.
- **[gonzalo/](./gonzalo/)** → backend, funcionalidades y el panel a medida.
  Onboarding, metodología, skills/setup, arquitectura, spec del panel, base de datos y el backlog tarea por tarea.

## Común a los dos

- **[compartido/](./compartido/)** → reglas no negociables, convención de Git y glosario.

---

## El reparto en una línea

| | Franco | Gonzalo |
|---|---|---|
| **Hace** | diseño + contenido + dirección | backend + funcionalidades + panel |
| **Dueño de** | look del sitio y del panel, tokens, contenido | modelo de datos, e-commerce, pagos, panel (lógica), DB |
| **Además** | revisa y aprueba los PRs | abre PRs, propone arquitectura |

## La decisión técnica base (ya tomada)

E-commerce **propio desde cero** + **Mercado Pago**; **Payload como motor** (datos/auth/API) con un **panel `/panel` 100% a medida** encima; **Postgres (Neon)** + **Vercel Blob**, todo por el Marketplace de Vercel. El detalle y el porqué: [`gonzalo/02_ARQUITECTURA_BACKEND.md`](./gonzalo/02_ARQUITECTURA_BACKEND.md) y `docs/16_DECISIONS.md` (ADR-007, ADR-011, ADR-013).

## La meta

Dejar todo el **diseño + backend + panel** sólido y listo, de modo que **lo único que falte** para tener el sitio "de verdad" sea el **contenido real de Flor** (imágenes y textos). Cuando llegue, se carga por el panel o se integra al código con las mejores prácticas. 🌷
