# 15 — Roadmap

> Fases del proyecto, entregables, criterios de "hecho" y dependencias. La dependencia crítica que atraviesa casi todo es el **contenido real de Flor** (aún no entregado).
> Enlaza con: [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) · [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) · [`10_TECH_STACK.md`](./10_TECH_STACK.md) · [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) · [`16_DECISIONS.md`](./16_DECISIONS.md)

> **Fechas:** el único dato duro real es la **8va edición del evento: 18/09**. El resto de las fechas de este roadmap son estimaciones de secuencia, no compromisos con fecha calendario. `TODO(contenido)`: fijar fechas concretas con Flor.

---

## 0. Estado actual

- **Fase 0 (documentación):** ✅ hecha.
- **Fase 1 (boceto/prototipo visual):** 🔶 en curso / a arrancar.
- **Fases 2–5:** ⬜ pendientes, en gran parte **bloqueadas por contenido real** y por **decisiones abiertas** (e-commerce, nombre del evento).

---

## Fase 0 — Documentación (HECHA ✅)

**Objetivo:** que cualquier persona o IA entienda el negocio, la visión, el nivel de calidad y la forma de trabajar sin preguntar.

**Entregables:**
- Project Bible completa en `docs/` (handoff, negocio, marca, audiencia, arquitectura, contenido, design system, motion, UX/UI, stack, SEO, componentes, estándares, LinkedIn, roadmap, decisiones, referencias).
- `CLAUDE.md` operativo.

**Criterios de "hecho":**
- [x] Un dev senior entiende el proyecto en ~20 min leyendo el handoff.
- [x] Estándares de calidad y motion escritos y no negociables.
- [x] Estructura de docs indexada en el README.

**Dependencias:** ninguna. Es el punto de partida.

---

## Fase 1 — Boceto / prototipo visual con placeholders (EN CURSO 🔶)

**Objetivo:** materializar el mood editorial cinematográfico y el sistema de motion en un prototipo navegable, **con placeholders**, para validar la dirección visual antes de tener contenido real.

**Entregables:**
- Proyecto Next.js (App Router) + TypeScript + Tailwind + GSAP + Lenis inicializado y desplegando en Vercel.
- Design tokens **provisionales** implementados (color, tipografía, espaciado) según [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md).
- Home + estructura de rutas principales (`/`, `/tienda`, `/evento`, `/membresia`, `/nosotros`) con layout y secciones maquetadas.
- Recetas de motion clave funcionando: reveal de títulos palabra por palabra, parallax scrubbed, reveals con máscara (ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)).
- Todo el contenido marcado `TODO(contenido)`: textos, imágenes con proporción correcta, precios como `$ —`, "Edición 0X".

**Criterios de "hecho":**
- [ ] El prototipo transmite el nivel premium (pasa el QUALITY BAR de `CLAUDE.md`).
- [ ] Motion respeta `prefers-reduced-motion`.
- [ ] Ningún dato duro inventado; todos los placeholders son evidentes y rastreables por `TODO(contenido)`.
- [ ] Deploy preview en Vercel navegable en mobile y desktop.
- [ ] Sin `any`, sin `console.log`, sin código muerto.

**Dependencias:**
- Ninguna bloqueante para arrancar (los placeholders permiten avanzar).
- Se beneficia de tener el **manual de marca** (paleta/tipografía definitivas) para no rehacer tokens — ver decisión abierta en [`16_DECISIONS.md`](./16_DECISIONS.md).

---

## Fase 2 — Integración de contenido real (BLOQUEADA POR CONTENIDO ⬜)

**Objetivo:** reemplazar todos los placeholders por el contenido real de la marca. Esta fase **no puede empezar hasta que Flor entregue** los materiales.

**Entregables:**
- Logo vectorial + tipografía/paleta del manual de marca aplicados (reemplazan tokens provisionales).
- Fotos reales de Flor, productos y eventos, con `next/image` y `alt` reales.
- Textos reales: historia, bio, descripciones de secciones, copys de CTA.
- Listado maestro de productos con precios reales (contemplando **+15% por canal** Tiendanube/ML/Mercado Pago), stock y flag de "a medida".
- Datos reales del evento: ediciones previas, testimonios, disertantes, sponsors.
- Video (SweetDay + material bruto) integrado donde corresponda.

**Criterios de "hecho":**
- [ ] Cero `TODO(contenido)` de texto/imagen en las páginas principales (verificable con búsqueda global).
- [ ] `alt` reales y descriptivos en todas las imágenes ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)).
- [ ] Precios y disponibilidad coherentes con la política de canales.
- [ ] Testimonios y logos de sponsors visibles como prueba social.

**Dependencias (críticas):**
- **Todo el checklist de contenido pendiente** de [`16_DECISIONS.md`](./16_DECISIONS.md) (carpetas 00–06 y las 22 preguntas al cliente).
- **Nombre del evento definido** para textos y schema.

---

## Fase 3 — E-commerce + inscripción al evento (BLOQUEADA POR DECISIÓN ⬜)

**Objetivo:** habilitar la transacción: comprar productos e inscribirse al evento.

**Entregables (según decisión de e-commerce — ver [`16_DECISIONS.md`](./16_DECISIONS.md)):**
- **Opción A — Custom + Mercado Pago:** catálogo propio, carrito, checkout con Mercado Pago, webhooks de pago, gestión de stock.
- **Opción B — Tiendanube headless:** fichas en nuestro sitio consumiendo API de Tiendanube, checkout en Tiendanube.
- **Opción C — Enlace:** fichas informativas en el sitio con enlace a Tiendanube/ML (menor control de SEO/UX, menor esfuerzo).
- Flujo de **inscripción al evento** (formulario + pago o enlace de pago), con confirmación.

**Criterios de "hecho":**
- [ ] Un usuario puede completar una compra / inscripción de punta a punta sin fricción.
- [ ] Pagos verificados en entorno de test antes de producción.
- [ ] Precios con el +15% correcto según canal.
- [ ] Estados de "sin stock" / "a medida" manejados correctamente.
- [ ] Página de "gracias" y comunicación post-compra.

**Dependencias:**
- **Decisión de e-commerce cerrada** (bloqueante duro; define toda la arquitectura de esta fase).
- Contenido real de productos (Fase 2).
- Datos reales del evento y precio de inscripción.

---

## Fase 4 — SEO / Analytics / Hardening (⬜)

**Objetivo:** dejar el sitio medible, encontrable y seguro para producción.

**Entregables:**
- Implementación completa del checklist de [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md): metadata por ruta, OG/Twitter, JSON-LD (Organization/Product/Event/Breadcrumb/FAQ), sitemap, robots, canonical, `es-AR`.
- Analytics (GA4 o alternativa de privacidad) + Search Console + eventos de conversión (compra, inscripción, alta a comunidad).
- Core Web Vitals en verde (LCP/CLS/INP) medidos en campo.
- Hardening: headers de seguridad, validación de inputs, manejo de secretos, revisión de dependencias (ver [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)).
- Accesibilidad auditada (foco, teclado, contraste, `prefers-reduced-motion`).

**Criterios de "hecho":**
- [ ] Rich results válidos en el test de Google (Event, Product, FAQ).
- [ ] Sitemap enviado y sin errores en Search Console.
- [ ] Lighthouse ≥ objetivo acordado en Performance/SEO/Best Practices/A11y.
- [ ] Eventos de conversión disparando correctamente.

**Dependencias:**
- Contenido real (Fase 2) para schema y `alt` reales.
- E-commerce (Fase 3) para eventos de conversión de compra.

---

## Fase 5 — Lanzamiento y post-lanzamiento (⬜)

**Objetivo:** publicar en el dominio definitivo y sostener/mejorar tras el lanzamiento.

**Entregables:**
- Dominio productivo configurado (canónico único, 301 de la variante) — ver [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) §1.6.
- Go-live coordinado con la campaña de LinkedIn/redes ([`14_LINKEDIN_STRATEGY.md`](./14_LINKEDIN_STRATEGY.md)) y con la cuenta regresiva al **18/09**.
- Blog inicial publicado (autoridad + SEO).
- Monitoreo activo (errores, uptime, métricas de conversión).
- Backlog de mejoras post-lanzamiento priorizado.

**Criterios de "hecho":**
- [ ] Sitio en producción, indexable, sin errores 5xx/4xx en rutas clave.
- [ ] Inscripción al evento operativa antes del cierre de cupos.
- [ ] Analytics reportando tráfico y conversiones reales.
- [ ] Plan de iteración post-evento (recap, teaser 9na edición).

**Dependencias:**
- Fases 2–4 completas.
- Nombre del evento y dominio definitivos.

---

## Tabla de hitos

| Hito | Fase | Estado | Dependencia crítica | Fecha objetivo |
|---|---|---|---|---|
| Project Bible completa | 0 | ✅ | — | Hecho |
| Prototipo visual navegable en Vercel | 1 | 🔶 | Tokens provisionales | `TODO(contenido)` |
| Manual de marca aplicado (paleta/tipografía) | 1→2 | ⬜ | Manual de marca de Flor | `TODO(contenido)` |
| Contenido real integrado | 2 | ⬜ | Checklist de contenido ([16](./16_DECISIONS.md)) | `TODO(contenido)` |
| Nombre del evento definido | 2 | ⬜ | Decisión de Flor | **antes de campaña** |
| Decisión de e-commerce cerrada | 3 | ⬜ | Decisión de Flor/negocio | **antes de Fase 3** |
| Compra + inscripción end-to-end | 3 | ⬜ | Decisión e-commerce + contenido | `TODO(contenido)` |
| SEO + analytics + hardening | 4 | ⬜ | Contenido + e-commerce | `TODO(contenido)` |
| Inscripción al evento abierta | 3→5 | ⬜ | Fase 3 | **bastante antes del 18/09** |
| 8va edición del evento | — | ⬜ | — | **18/09** (dato real) |
| Lanzamiento en dominio productivo | 5 | ⬜ | Fases 2–4 | `TODO(contenido)` |

---

## Ruta crítica (resumen)

```
Contenido real de Flor ──► Fase 2 ──► Fase 4 (SEO real)
        │                                   │
        └──► Decisión e-commerce ──► Fase 3 ─┴──► Fase 5 (lanzamiento)
                                              (coordinado con 18/09)
```

Los **dos cuellos de botella** que hay que destrabar cuanto antes:
1. **Contenido real** (bloquea Fases 2, 4 y 5).
2. **Decisión de e-commerce + nombre del evento** (bloquean Fase 3 y la campaña).

Fase 1 puede avanzar en paralelo sin ninguno de los dos. Ver el detalle de bloqueos y el checklist accionable en [`16_DECISIONS.md`](./16_DECISIONS.md).

> Documento **vivo**. Actualizar estados y fechas a medida que se destraban dependencias.
