# 09 — Testear Mercado Pago (Fase 3, sin miedo)

La Fase 3 (checkout + pagos) es la más difícil y la más delicada: es **plata**. La regla de oro es **nunca tocar producción hasta que todo el flujo funcione en el entorno de TEST de Mercado Pago**. Esta guía te da el mapa. No la sigas de memoria: cuando llegues a esta fase, **leé también la doc actual de Mercado Pago** (cambia seguido) y pedile a Claude Code la skill [`backend-review`](../../.claude/skills/backend-review/SKILL.md) y [`testing`](../../.claude/skills/testing/SKILL.md).

> **Antes de empezar necesitás los accesos.** Las credenciales de Mercado Pago (y todo lo demás) las pasa Franco y van en la carpeta local `00_ACCESOS/` (ver [`../../00_ACCESOS/README.md`](../../00_ACCESOS/README.md)). Esa carpeta **nunca se sube a Git**.

---

## 1. El concepto: dos entornos, nunca los mezcles

Mercado Pago te da **dos juegos de credenciales** por cada aplicación que creás en su panel de desarrollador:

| Entorno | Para qué | Se usa en |
|---|---|---|
| **TEST** (sandbox) | Probar todo con plata falsa | Desarrollo y `preview` |
| **PRODUCCIÓN** | Cobros reales | Solo el sitio en vivo, al final |

Cada juego tiene un **Public Key** (frontend) y un **Access Token** (backend, secreto). **Todo el desarrollo se hace con las de TEST.** Las de producción se ponen recién al final, y **jamás** en un commit (van por env var).

---

## 2. Setup de TEST (una vez)

1. **Creá una aplicación** en el panel de desarrollador de Mercado Pago (te lo habilita Franco con la cuenta de Flor, o una cuenta de prueba).
2. Copiá las credenciales de **TEST**: `Public Key` y `Access Token`. Van a tu `.env.local` (no al código):
   ```bash
   # .env.local  (NO se sube a Git)
   MP_ACCESS_TOKEN=TEST-xxxxxxxx        # secreto, backend
   NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-xxxx  # público, frontend
   MP_WEBHOOK_SECRET=xxxxxxxx           # para verificar la firma (paso 5)
   ```
3. **Creá usuarios de prueba** (comprador y vendedor) desde el panel de MP. Sirven para simular una compra real sin plata de verdad.

> Regla: `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET` son **secretos** → solo backend, solo env var, nunca `NEXT_PUBLIC_`.

---

## 3. Tarjetas de prueba (forzar aprobado / rechazado)

En TEST no usás tarjetas reales. Mercado Pago da **tarjetas de prueba** y, sobre todo, el **estado del pago lo definís por el nombre del titular** que cargás en el checkout:

| Nombre del titular | Resultado que fuerza |
|---|---|
| `APRO` | Pago **aprobado** |
| `OTHE` | Rechazado por error general |
| `CONT` | Pendiente |
| `CALL` | Rechazado (validá con el emisor) |
| `FUND` | Rechazado por fondos insuficientes |

Los **números de tarjeta de prueba** (Visa/Master/Amex) los da la doc de MP y **pueden cambiar** → tomalos siempre de la doc oficial vigente, no los hardcodees de memoria. Combinás: tarjeta de prueba + nombre `APRO` para probar el camino feliz, y `OTHE`/`FUND` para probar los rechazos.

> **Probá los rechazos, no solo el "compra OK".** La mitad de los bugs de pago viven en el camino que falla.

---

## 4. Probar el webhook en tu compu (el paso que traba a todos)

El **webhook** es el aviso que Mercado Pago le manda a tu servidor cuando pasa algo con un pago ("se aprobó", "se rechazó"). El problema: MP necesita una **URL pública** para avisarte, y tu `localhost:3000` no lo es. Solución: un **túnel** que expone tu local a internet temporalmente.

1. Levantá el proyecto: `npm run dev` (queda en `localhost:3000`).
2. Abrí un túnel (elegí uno):
   ```bash
   # Opción A: cloudflared (gratis, sin cuenta)
   cloudflared tunnel --url http://localhost:3000
   # Opción B: ngrok (requiere cuenta gratis)
   ngrok http 3000
   ```
   Te da una URL tipo `https://algo-random.trycloudflare.com`.
3. En la app de MP (panel), configurá esa URL + tu ruta de webhook como destino de notificaciones:
   `https://algo-random.trycloudflare.com/api/webhooks/mercadopago`
4. Hacé una compra de prueba (usuario comprador + tarjeta test + `APRO`). MP le pega a tu webhook y lo ves llegar en la terminal.

> Alternativa: el panel de MP tiene un **simulador de notificaciones** para disparar webhooks a mano sin hacer toda la compra. Útil para iterar rápido en la lógica del handler.

---

## 5. Verificar la firma del webhook (SEGURIDAD — no opcional)

Cualquiera puede mandarle un POST a tu URL de webhook fingiendo ser Mercado Pago. Por eso **hay que verificar la firma** antes de creer nada. MP manda los headers `x-signature` y `x-request-id`; con tu `MP_WEBHOOK_SECRET` calculás un HMAC y comparás.

- Si la firma **no coincide** → respondés `401` y **no procesás nada**.
- Compará con `crypto.timingSafeEqual` (no con `===`) para no filtrar info por timing.
- El detalle exacto del string a firmar lo da la doc de MP → seguila al pie.

Pedile a Claude la skill [`security-audit`](../../.claude/skills/security-audit/SKILL.md) y [`owasp-hardening`](../../.claude/skills/owasp-hardening/SKILL.md) cuando escribas este handler. Es el punto más sensible del sitio.

---

## 6. Idempotencia (que un aviso repetido no rompa nada)

Mercado Pago puede mandarte **el mismo webhook varias veces** (reintentos, red). Si por cada aviso descontás stock o creás una orden, terminás con **stock mal y órdenes duplicadas**.

Regla: **procesá cada pago una sola vez.**
1. Cuando llega el webhook, tomá el `id` del pago/evento.
2. Fijate en la base si ya lo procesaste. Si sí → respondé `200` y cortá (no vuelvas a procesar).
3. Si no → procesá (crear Order, descontar stock) **dentro de una transacción** y marcá ese `id` como procesado.

> Esto es *idempotencia* (está en el glosario de [`00_EMPEZA_ACA.md`](./00_EMPEZA_ACA.md)). Es la diferencia entre un checkout serio y uno que te descuadra el stock el primer fin de semana.

---

## 7. El flujo completo que tenés que ver funcionar en TEST

```
Cliente en la PDP → "Comprar"
  → backend crea una PREFERENCIA en MP (con el precio final = catálogo / (1 - 0,15))
  → redirect a Checkout Pro
  → cliente paga con tarjeta de prueba (APRO)
  → MP redirige a la página de "gracias"
  → MP dispara el WEBHOOK a /api/webhooks/mercadopago
     → verificás firma (paso 5)
     → chequeás idempotencia (paso 6)
     → creás la Order en Payload
     → descontás stock
     → (opcional) email de confirmación con Resend
  → la Order aparece en el módulo "Ventas" del panel
```

> **El precio final** que le cobrás sale de la fórmula confirmada: `precio_final = precio_catalogo / (1 - 0,15)` ≈ **+17,6%** (se comunica como "15%"). El catálogo guarda el precio **base**; el recargo se **calcula**, nunca se hardcodea. Fuente: [`../../docs/CONTENIDO_FLOR.md`](../../docs/CONTENIDO_FLOR.md) §4.

---

## 8. Checklist antes de pasar a PRODUCCIÓN

- [ ] Todo el flujo del §7 funciona en TEST (aprobado **y** rechazado **y** pendiente).
- [ ] La firma del webhook se verifica; un POST falso da `401`.
- [ ] Idempotencia probada: mandé el mismo webhook 2 veces y **no** se duplicó la orden ni se descontó stock de más.
- [ ] Stock se descuenta **en el webhook confirmado**, no al iniciar el checkout.
- [ ] El precio final usa la fórmula, no un número hardcodeado.
- [ ] Cero credenciales en el código o en commits (todo por env var).
- [ ] Tests de los caminos críticos con la skill [`testing`](../../.claude/skills/testing/SKILL.md) (checkout, webhook, idempotencia).
- [ ] Recién ahí: cambiar credenciales TEST → PRODUCCIÓN (en Vercel env vars, no en el código) y hacer **una** compra real chica de verificación.

> Si algo de esto no está en verde, **no** se pasa a producción. Ante la duda, hablalo con Franco. Un checkout que falla en vivo cuesta plata y confianza.

---

## Se conecta con

- **Tu backlog de esta fase** → [`03_BACKLOG.md`](./03_BACKLOG.md) (Fase 3).
- **Skills para esta fase** → [`08_SKILLS_POR_TAREA.md`](./08_SKILLS_POR_TAREA.md) (`backend-review`, `security-audit`, `owasp-hardening`, `testing`).
- **La fórmula del recargo** → [`../../docs/CONTENIDO_FLOR.md`](../../docs/CONTENIDO_FLOR.md) §4.
- **La decisión de checkout** → [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) (ADR-007/013).
- **Accesos y credenciales** → [`../../00_ACCESOS/README.md`](../../00_ACCESOS/README.md).
