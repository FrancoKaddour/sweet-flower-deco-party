# Tu semana — un día por página

Tu método: **un día de foco full por página**, para que cada una sea memorable (no una plantilla repetida). Este doc fija el orden, el ritual por página, y cómo encajás el pulido del panel de Gonzalo.

> Las páginas y su arquitectura salen de [`../../docs/04_SITE_ARCHITECTURE.md`](../../docs/04_SITE_ARCHITECTURE.md). Ajustá esta lista a la realidad del proyecto.

---

## Orden sugerido (un día c/u)

| Día | Página | Foco de "memorable" |
|---|---|---|
| 1 | **Home** (pulido final) | ya está avanzada; refinar ritmo, transiciones, jerarquía |
| 2 | **Productos** (catálogo) | grilla editorial con identidad, filtros que se sientan premium |
| 3 | **Ficha de producto (PDP)** | la pieza como protagonista: galería, material, "a medida" |
| 4 | **Evento / Workshops** | narrativa de la edición, cuenta regresiva, prueba social |
| 5 | **Membresía / Comunidad** | el "por qué unirse", momento aspiracional |
| 6 | **Historia / Nosotros** | el relato de Flor, cálido y editorial |
| 7 | **Contacto + Panel (pulido)** | cierre de conversión + darle marca al panel de Gonzalo |

> No es rígido. Si una página pide dos días, dáselos. La regla es **foco**: una por vez, terminada de verdad.

---

## Ritual por página (el que ya venís usando)

1. **Contexto** — releé la intención de la sección en `docs/05_CONTENT_STRATEGY.md` y `08_UX_PRINCIPLES.md`. ¿Qué siente y descubre el usuario acá?
2. **Diseño** — definí el layout con identidad propia (nada de repetir). Tokens de `06_DESIGN_SYSTEM.md`.
3. **Motion** — elegí el motion con propósito (recetas en `07_MOTION_SYSTEM.md`). Siempre con `prefers-reduced-motion`.
4. **Build** — implementá (o dirigí a la IA) respetando el QUALITY BAR.
5. **Verificá** — en desktop y mobile, con capturas. Contra la vara: *¿lo publicaría una agencia top?*
6. **Commit chico + push.** Una actividad por commit.

---

## Datos reales vs placeholder

- Mientras no llegue el contenido de Flor, todo es placeholder con `TODO(contenido):`. **No inventes** precios/fechas/nombres.
- En cuanto Gonzalo tenga el panel (Fase 1), **el contenido lo cargás ahí**, no en el código. El código queda para diseño y estructura.
- Cuando Flor entregue material, seguí [`INTAKE_DE_CONTENIDO.md`](./INTAKE_DE_CONTENIDO.md).

---

## Cómo encaja el panel de Gonzalo en tu semana

- Gonzalo entrega las pantallas del panel **funcionales y simples** (feas está bien). Su vara es que *funcionen perfecto*.
- Vos, en tu día de "Panel", les ponés el diseño de Sweet Flowers: tipografía, color, espaciado, la misma calidad del sitio. Lo hacés en un **PR aparte** para no chocar con su lógica.
- Regla anti-choque: vos tocás el **look** del panel; él, la **lógica**. Si necesitás mover estructura, coordinás (ver [HANDOFF](../HANDOFF.md) §3).

---

## Tu otra responsabilidad: revisar a Gonzalo

Cada PR suyo lo revisás y aprobás antes de mergear. No necesitás entender cada línea de backend; sí verificar lo esencial. Guía en [`REVISAR_A_GONZALO.md`](./REVISAR_A_GONZALO.md).

> Meta de la semana: llegar a que **lo único que falte sea el contenido de Flor**. Todo lo demás, impecable y listo para recibirlo.
