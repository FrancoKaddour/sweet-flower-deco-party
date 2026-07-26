# 01 — Cómo trabajamos

La metodología. Si la seguís, tu trabajo entra limpio, Franco lo revisa rápido y el proyecto se mantiene de nivel. Es corta a propósito.

---

## 1. El flujo mental: Contexto → Diseño → Código

Nunca empieces por el código. Antes:

1. **Contexto:** ¿qué problema resuelve esta tarea? ¿A qué parte del sistema toca? Leé el/los docs que indica la tarea.
2. **Diseño:** ¿cuál es la mejor forma de resolverlo? Pensá el enfoque, los datos, los casos borde. Escribilo en 3–5 líneas (o pedíselo a Claude como "plan").
3. **Código:** recién ahora, implementás.

Esto no es burocracia: es lo que separa un backend que escala de uno que se rompe en tres meses.

---

## 2. Cómo usar Claude Code / opencode bien

La IA es tu copiloto, no tu piloto automático. Sos vos quien decide y revisa.

**Buenas prácticas:**

- **Dale contexto al empezar.** Decile qué archivo/doc leer primero. Ejemplo: *"Leé `colaboracion/02_ARQUITECTURA_BACKEND.md` y `docs/16_DECISIONS.md` (ADR-011) antes de proponer nada."*
- **Pedí un PLAN antes del código.** *"No escribas código todavía: primero explicame tu plan y qué archivos vas a tocar."* Revisás el plan, y recién ahí le decís "dale".
- **Recordale la regla de Next.** *"Antes de escribir código de Next, leé la doc real en `node_modules/next/dist/docs/`."* (Esta versión de Next tiene cambios; la IA puede tener info vieja.)
- **Pedile que trabaje en pasos chicos** y que te explique cada decisión.
- **No aceptes "porque funciona".** Si no entendés por qué algo funciona, pedile que te lo explique. Vas a tener que mantenerlo.
- **Verificá siempre:** que `npm run build` pase, que no haya `any`, que no haya claves hardcodeadas.

Las **plantillas de prompts** listas para copiar están en [`04_PLANTILLAS_PROMPTS.md`](./04_PLANTILLAS_PROMPTS.md).

> El repo tiene instrucciones que la IA lee sola: [`../AGENTS.md`](../AGENTS.md) y [`../docs/CLAUDE.md`](../docs/CLAUDE.md). No hace falta que las repitas siempre, pero conocelas.

---

## 3. Git: rama por tarea, commits chicos, PR para revisar

**Nunca trabajes sobre `main` ni pushees directo ahí.** El flujo es:

```bash
# 1. Partí siempre de main actualizado
git checkout main
git pull

# 2. Creá una rama para tu tarea (nombre claro)
git checkout -b feat/modelo-productos

# 3. Trabajá y commiteá de a poco (ver abajo)
git add <archivos de ESTA actividad>
git commit -m "feat(payload): colección Products con campos base"

# 4. Subí tu rama
git push -u origin feat/modelo-productos

# 5. Abrí un Pull Request en GitHub hacia main y avisale a Franco
```

**Commits granulares (regla de Franco):** un commit = una actividad terminada. No juntes "creé la colección + arreglé el header + instalé una librería" en un solo commit. Si hiciste tres cosas, son tres commits. Facilita revisar y volver atrás.

Formato de mensaje: `tipo(area): qué hiciste` en presente. Tipos: `feat` (nuevo), `fix` (arreglo), `refactor` (reordenar sin cambiar comportamiento), `docs`, `chore` (config/mantenimiento). Ejemplos:
- `feat(commerce): adapter de carrito con validación de stock`
- `fix(webhook): idempotencia en el webhook de Mercado Pago`

**Ramas:** `feat/...`, `fix/...`, `chore/...`. Una por tarea del backlog.

---

## 4. Definición de "terminado" (checklist antes de abrir el PR)

Una tarea está lista cuando:

- [ ] `npm run build` pasa sin errores.
- [ ] No hay errores de TypeScript ni `any`.
- [ ] No hay `console.log` de prueba ni código muerto.
- [ ] No hay secretos ni claves en el código (están en env vars).
- [ ] Los placeholders quedaron marcados con `TODO(contenido):`.
- [ ] Se cumplen los **criterios de aceptación** que la tarea define en el backlog.
- [ ] El PR tiene una descripción: qué hiciste, cómo probarlo, qué quedó pendiente. (Plantilla en [`04`](./04_PLANTILLAS_PROMPTS.md).)

---

## 5. Cómo pedir ayuda (y cuándo)

- **Trabado 30–40 min sin avanzar → avisá.** Mandá: qué querías hacer, qué probaste, el error exacto (copiá y pegá el mensaje), y el link al PR/rama.
- **Antes de una decisión grande** (elegir una librería, cambiar la estructura, algo que no está en el backlog) → consultá con Franco primero. No lo decidas solo.
- **Dudas conceptuales** ("¿qué es un webhook?", "¿por qué RSC?") → preguntale a Claude que te lo explique en simple, y si queda la duda, a Franco.

Pedir ayuda temprano es parte del trabajo bien hecho, no lo contrario.

---

## 6. Reglas técnicas no negociables (resumen)

| Regla | Por qué |
|---|---|
| Leer `node_modules/next/dist/docs/` antes de escribir Next | esta versión tiene cambios; evita código roto |
| TypeScript estricto, sin `any` | seguridad y mantenibilidad |
| Runtime **Node**, nunca `edge` | los SDKs de pago y el streaming funcionan en Node |
| Servicios externos (DB, pagos, email) por **Marketplace de Vercel** | integración real, credenciales gestionadas, no lock-in artesanal |
| `next/image` para imágenes, `next/font` para fuentes | performance, cero CLS |
| Secretos en **env vars**, nunca en el código | seguridad |
| Placeholders con `TODO(contenido):`, sin datos inventados | el contenido real lo carga Franco |
| Rama + PR, commits chicos | revisión y trazabilidad |

Cuando dudes entre "rápido" y "bien hecho", elegí bien hecho y avisá si tarda más. Esto lo vamos a mostrar como logro.
