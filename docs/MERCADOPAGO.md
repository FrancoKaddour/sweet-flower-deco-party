# Pago online del Event Summit (Mercado Pago · Checkout Pro)

Solo las **inscripciones al Summit** se cobran en el sitio. Productos y demás
servicios siguen por WhatsApp.

## Cómo funciona
1. En /event-summit#inscripcion la persona elige el pase, completa nombre, email,
   celular, DNI y ciudad, acepta el aviso de privacidad (`consentimiento`, se
   guarda `consent_at`) y toca "Pagar".
2. **Reserva de lugar (30 min).** El servidor calcula el precio vigente
   (`content/evento.ts → PREVENTAS`) y, en UNA sentencia SQL con aislamiento
   Serializable, cuenta el cupo y crea la inscripción solo si queda lugar
   (`modules/summit/core.ts → reservarLugar`). La inscripción queda "Consultó"
   con `pago_estado = pendiente` y `reserva_hasta = ahora + 30 min`: mientras la
   reserva está vigente, **ocupa un lugar**. Si vence sin pago, el lugar se
   libera solo (no hay que limpiar nada).
   - Doble clic o "volver e intentar" con el mismo email: se reutiliza la misma
     reserva (no ocupa otro lugar ni crea otra fila).
   - Rate limit: 8 intentos cada 10 min por IP y 5 por email.
3. **Preferencia que vence.** La preferencia de Checkout Pro vence junto con la
   reserva (`expires`, `expiration_date_to`, `date_of_expiration`): pasado ese
   tiempo, el link de pago ya no sirve (nadie paga una tarifa vieja ni con el
   cupo cerrado). Medios: tarjeta, débito y dinero en cuenta. **Efectivo
   (Rapipago/Pago Fácil) y cajero están excluidos**, porque se acreditan días
   después (decisión reversible en `lib/mercadopago.ts → excluded_payment_types`;
   si se habilitan, hay que alargar la reserva).
4. **Aviso de Mercado Pago** (`/api/mercadopago/webhook`): se valida la firma
   (HMAC con `MP_WEBHOOK_SECRET`, `ts` de hasta 15 min) y el pago se vuelve a
   consultar a la API. Si está **aprobado**:
   - Se valida **moneda ARS y monto ≥ precio** guardado. Si no coincide →
     `pago_estado = monto_invalido` + alerta al equipo.
   - Si la reserva estaba vigente al aprobarse (o todavía hay cupo) → "Pagó".
     Si no hay lugar → `pago_estado = sobrecupo` + alerta (devolver el pago en
     MP o pasarla a "Pagó" a mano si se suma un lugar).
   - Nunca pisa "Asistió" ni "Cancelado", ni una inscripción archivada (avisa).
   - Pago repetido de la misma inscripción (dos pestañas) → alerta "Pago DUPLICADO".
   - Devuelto / contracargo → "Cancelado" + alerta.
5. **Mail de la entrada**, una sola vez: `entrada_enviada_at`. Sale después de
   responder a MP (`after()`), así el webhook contesta rápido. Si Resend falla,
   se reintenta en el cron diario (`/api/cron/newsletter`) y se avisa al equipo.
   Desde el panel: botón "Reenviar entrada" (`reenviarEntrada(id)`).
6. Al volver del checkout ve /event-summit/inscripcion con el estado real.
- Cupo: `EVENT_CUPO` (80). Ocupan lugar: Señó, Pagó, Asistió y las reservas vigentes.
- Las inscripciones pagas no se archivan (`puedeArchivarse`): primero se
  devuelve el pago en MP y se pasan a Cancelado.
- Después de la última fecha de preventa se sigue cobrando la última tarifa.
- Todo llamado a MP o Resend corta a los 8 s.

## Alertas al equipo (`lib/alertas.ts → alertarEquipo`)
Mail a `EMAIL_EQUIPO` (o, si falta, a `PANEL_SUPERADMINS`) cuando hay:
inscripción pagada nueva, sobrecupo, monto/moneda inválidos, pago duplicado,
pago de una inscripción archivada o cancelada, devolución, mail de entrada que
no salió, error del webhook (máx. 3 por hora), webhook sin secreto en
Production y consulta nueva del formulario de contacto.
Sin Resend configurado quedan solo en el log ("modo prueba").

## Lo que tiene que hacer Tobías (cuenta que cobra)
1. mercadopago.com.ar/developers → **Tus integraciones** → **Crear aplicación**
   (nombre "Sweet Flowers Web", tipo **Pagos online → Checkout Pro**).
2. **Credenciales de producción** → activarlas (rubro y sitio web).
3. **Webhooks** → Configurar notificaciones:
   - URL modo producción: `https://sweet-flower-deco-party.vercel.app/api/mercadopago/webhook`
     (o el dominio propio cuando esté)
   - Evento: **Pagos**
   - Guardar y copiar la **clave secreta**.

## Variables en Vercel (las pega Tobías o Fran, nunca por chat)
| Variable | Valor | Entornos |
|---|---|---|
| `MP_ACCESS_TOKEN` | Access Token de producción (`APP_USR-…`) | Production |
| `MP_ACCESS_TOKEN` | Access Token de **prueba** (`TEST-…`) | Preview / Development |
| `MP_WEBHOOK_SECRET` | Clave secreta de Webhooks (**obligatoria**: sin ella el webhook responde 500 y avisa) | Production |
| `MP_MODO` | `produccion` en Production · `prueba` en Preview/Development (si falta, se deduce del prefijo `TEST-`; las credenciales de usuarios de prueba nuevas empiezan con `APP_USR-`, por eso conviene ponerla) | todos |
| `EMAIL_EQUIPO` | Emails que reciben las alertas, separados por coma (ej. el de Flor y el de Fran). Si falta, van a `PANEL_SUPERADMINS` | Production |

Sin `MP_ACCESS_TOKEN` el formulario avisa que escriban por WhatsApp y el panel
muestra "Pago online desactivado".

## Probar antes de activar
Con el token `TEST-…` el sitio usa el checkout de prueba. Pagar con las
tarjetas de prueba de Mercado Pago (developers → Tarjetas de prueba; titular
`APRO` = aprobado, `OTHE` = rechazado). Revisar en /panel/summit que pase a "Pagó".

Ojo (S-26): los pagos de prueba de Preview o de `npm run dev` se guardan en la
base que use ese entorno. Si es la misma que producción, **ocupan cupo real**.
Usar una base aparte (branch de Neon) para Preview/Development.

## Tests
`npm test` corre los tests de las reglas puras (firma del webhook, monto y
moneda, modo prueba, rutas seguras, CSV, roles, tarifa vigente) con
`node --test` sin paquetes extra (necesita Node 22.6+).
