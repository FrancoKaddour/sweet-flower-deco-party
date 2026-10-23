# Pago online del Event Summit (Mercado Pago · Checkout Pro)

Solo las **inscripciones al Summit** se cobran en el sitio. Productos y demás
servicios siguen por WhatsApp.

## Cómo funciona
1. En /event-summit#inscripcion la persona elige el pase, completa nombre, email,
   celular, DNI y ciudad, y toca "Pagar".
2. El sitio guarda la inscripción como **pendiente** con el precio vigente
   (`content/evento.ts → PREVENTAS`, se calcula en el servidor) y la manda al
   checkout de Mercado Pago (tarjeta, cuotas, débito, dinero en cuenta o efectivo).
3. Mercado Pago avisa al sitio (`/api/mercadopago/webhook`). El sitio vuelve a
   consultar el pago a la API y, si está **aprobado**: la inscripción pasa a
   "Pagó", ocupa un lugar del cupo y la persona recibe el mail con su comprobante.
4. Al volver del checkout ve /event-summit/inscripcion con el estado real.
- Cupo: `EVENT_CUPO` (80). Cuando se llena, el formulario no deja pagar.
- Después de la última fecha de preventa se sigue cobrando la última tarifa.

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
| `MP_WEBHOOK_SECRET` | Clave secreta de Webhooks | Production |

Sin `MP_ACCESS_TOKEN` el formulario avisa que escriban por WhatsApp y el panel
muestra "Pago online desactivado".

## Probar antes de activar
Con el token `TEST-…` el sitio usa el checkout de prueba. Pagar con las
tarjetas de prueba de Mercado Pago (developers → Tarjetas de prueba; titular
`APRO` = aprobado, `OTHE` = rechazado). Revisar en /panel/summit que pase a "Pagó".
