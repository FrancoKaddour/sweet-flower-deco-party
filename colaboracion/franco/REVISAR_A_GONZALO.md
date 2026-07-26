# Cómo revisar los PRs de Gonzalo

No necesitás entender cada línea de backend para revisar bien. Sí verificar lo que importa. Sos el último filtro antes de `main`.

---

## El proceso

1. Gonzalo abre un PR y te avisa.
2. Abrís el PR en GitHub → pestaña **"Files changed"** para ver el diff, y la **descripción** (qué hizo, cómo probarlo).
3. **Bajás su rama y lo probás** (no revises solo leyendo):
   ```bash
   git fetch origin
   git checkout <nombre-de-su-rama>
   npm install   # por si agregó dependencias
   npm run build # TIENE que pasar
   npm run dev   # probalo en el navegador
   ```
4. Si está bien → aprobás y **mergeás a `main`**. Si no → comentás qué corregir (con onda) y queda en su cancha.

---

## Checklist de revisión

**Funciona (lo más importante):**
- [ ] `npm run build` pasa sin errores.
- [ ] Probaste el flujo que dice la descripción y **hace lo que promete**.
- [ ] No rompió nada de lo que ya andaba (home, secciones, navegación).

**Calidad / seguridad (rápido de chequear en el diff):**
- [ ] **No hay secretos** en el código (claves, tokens, URLs con contraseña). Todo eso va en env vars. 🚩 Si ves algo que parece una clave, frená y preguntá.
- [ ] No hay `console.log` de prueba ni archivos raros/basura.
- [ ] Los placeholders están marcados con `TODO(contenido):`.
- [ ] No metió datos inventados (precios, fechas) como si fueran reales.
- [ ] Si agregó una dependencia (`package.json` cambió), que esté justificada en la descripción.

**Límites (que no invada tu territorio):**
- [ ] No tocó el **diseño** del sitio (`components/sections`, `components/ui`, `globals.css`) sin avisar. Si lo hizo, revisá que no rompa el look.
- [ ] Cambios en zona frontera (`app/layout.tsx`, `content/site.ts`, schema con datos ya cargados) → que lo hayan conversado antes.

---

## Cómo dar feedback

- **Específico y accionable:** "en tal pantalla, al borrar no pide confirmación" > "revisá esto".
- **Preguntá cuando no entiendas:** "¿por qué elegiste X acá?" es una revisión válida y le sirve para aprender.
- **Reconocé lo bueno.** Está aprendiendo; el feedback equilibrado rinde más.

---

## Cuándo pedir una segunda opinión (a la IA)

Si un PR toca algo sensible (pagos, webhooks, auth, migraciones que afectan datos) y no estás seguro, pedile a Claude que **revise el diff** con foco en seguridad y casos borde antes de aprobar. Ejemplo:

```
Revisá este diff con ojo crítico: seguridad, manejo de errores, idempotencia y
casos borde. Es código de <pagos/webhook/auth>. Decime si mergearías o qué falta.
```

> Regla: si algo de plata o datos de clientes no te cierra, **no mergees**. Mejor una vuelta más que un bug en producción.
