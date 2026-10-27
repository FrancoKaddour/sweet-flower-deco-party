# Newsletter — Club Sweet Flowers

## Qué hay
- **Captación:** franja `components/newsletter/Newsletter.tsx` arriba del footer en
  todas las páginas del sitio (`app/(site)/layout.tsx`). Beneficio inmediato:
  código personal de 10% (`content/newsletter.ts → DESCUENTO_BIENVENIDA`) que se
  muestra en pantalla y llega por mail. Intereses opcionales para segmentar.
- **Mi cuenta:** sumarse / darse de baja con un botón.
- **Automáticos:** bienvenida al club (con código), bienvenida al crear cuenta
  (`auth.ts → events.createUser`) y recordatorio a los 7 días si no usó el código
  (cron diario `app/api/cron/newsletter`, `vercel.json`).
- **Panel → Newsletter:** métricas, campañas con plantillas y vista previa en
  vivo, prueba a tu mail, envío por segmentos (solo admin), suscriptores con
  "código usado", alta manual con consentimiento y exportación CSV.
- **Baja:** link en cada mail (`/newsletter/baja`, con confirmación) + baja en un
  clic de Gmail/Yahoo (`List-Unsubscribe`, `/api/newsletter/baja`).

## Doble opt-in (S-13)
- El formulario del sitio responde SIEMPRE lo mismo ("Revisá tu mail para
  confirmar"): no revela si el email ya estaba, ni muestra el código.
- Se manda un mail de confirmación (sin el nombre que escribieron) con un link
  a `/newsletter/confirmar?t=…`; ahí se confirma con un botón (los antivirus de
  correo abren los links solos) y recién entonces llega el código CLUB.
- Una baja no se reactiva desde el formulario: hace falta confirmar desde el mail.
- Hasta confirmar, la persona figura con `confirmado_at` vacío y no recibe
  campañas, recordatorios ni cuenta en el total del club.
- Altas desde "Mi cuenta" (email ya verificado) y desde el panel (con el
  consentimiento tildado por el equipo) entran confirmadas.
- Rate limit: 6 por hora por IP y 3 por hora por email.
- En las páginas `/event-summit…` la banda cambia sola al mensaje del Summit
  ("Enterate primero del Summit", interés Summit preseleccionado).
- El export CSV (solo admin) usa `;` y fechas de Argentina, y queda en el audit log.

## Activar el envío (una sola vez)
1. **Comprar el dominio** (ej. `sweetflowers.com.ar` en nic.ar) y apuntarlo a
   Vercel (Vercel → Settings → Domains).
2. **Resend** (resend.com, plan gratis: 3.000 mails/mes, 100/día):
   - Domains → Add domain → el dominio comprado → cargar en el DNS los registros
     que muestra (SPF, DKIM y MX del subdominio `send`), y esperar "Verified".
   - Agregar también un registro DMARC: `TXT _dmarc` = `v=DMARC1; p=none;`
   - API Keys → crear una con permiso "Sending access".
3. **Vercel → Environment Variables (Production):**
   - `RESEND_API_KEY` = la clave de Resend
   - `EMAIL_FROM` = `Sweet Flowers <hola@sweetflowers.com.ar>`
   - `EMAIL_REPLY_TO` = el mail donde Flor quiere recibir respuestas
   - `CRON_SECRET` = una clave larga al azar (protege el recordatorio diario)
   - `NEXT_PUBLIC_SITE_URL` = `https://sweetflowers.com.ar`
4. Redeploy. Desde el panel: Newsletter → una campaña → "Enviarme una prueba".

Sin `RESEND_API_KEY` todo funciona igual (suscripción, códigos, panel) pero los
mails no salen: el panel lo avisa con "Modo prueba".

## Buenas prácticas (para que no caigan en spam)
- Mandar 2–4 campañas por mes, no más. Un solo pedido (botón) por mail.
- Asunto corto (< 50 caracteres) y con un beneficio concreto.
- Siempre mandarse una prueba antes.
- Si el plan gratis queda chico (más de 100 mails por día), pasar a Resend Pro.
