# Jurado 5 — Seguridad, backend y robustez

Auditoría de solo lectura del código en `$HOME/mnt/sweet-flowers-deco-party` (revisado el 26/10/2026). No leí valores de `.env*` ni de `00_ACCESOS/`. Las pruebas en vivo contra producción quedaron bloqueadas por el proxy (el GET devolvió 403 y no mandé ningún POST), así que todo lo que sigue sale del código, con archivo:línea.

## 1. Nota del jurado (riesgo)

**Veredicto: NO apto para cobrar hoy. Pasa a "apto con reservas" con los ítems 1 a 6 del Top 10 (más o menos 1 día de trabajo).**

| Criterio | Estado | Justificación |
|---|---|---|
| Integridad del cobro (MP) | 🟠 con reservas | Lo básico está bien: el precio lo pone el servidor, el pago se vuelve a consultar a la API, la firma HMAC se compara en tiempo constante y `aplicarPago` es idempotente. **Pero** el cupo de 80 no se respeta al pagar, las preferencias no vencen y un monto que no coincide se pierde en silencio. |
| Autorización del panel | 🟢 sólido | Las 15 páginas del panel, las 22 server actions y las 2 rutas de API llaman a `requireStaff`/`assertStaff` en el servidor. Hay un solo agujero: un staff dado de baja sigue adentro hasta 30 días. |
| Formularios públicos y abuso | 🟠 | Tienen zod y honeypot, pero **ningún** rate limit. Newsletter sin doble opt-in: se pueden sacar códigos de descuento infinitos, se puede reactivar a gente que se dio de baja y se puede meter texto propio en mails que salen con tu dominio. |
| Headers y config | 🟡 | `next.config.ts` no define ningún header de seguridad: ni CSP ni anti-iframe. |
| Datos personales (Ley 25.326) | 🔴 | Se pide DNI, teléfono y email sin aviso de privacidad ni consentimiento, y el link "Privacidad" apunta a `#`. |
| Robustez y operación | 🟠 | Ningún `fetch` externo tiene timeout, no hay alertas, no hay tests y las migraciones corren en cada build (también en Preview) contra una base que posiblemente sea la misma de producción. |

## 2. Hallazgos

### Pagos (Mercado Pago)

**S-01 🔴 Sobreventa: el cupo de 80 no se controla al pagar.** Esfuerzo M.
- **Dónde:**
  - `modules/summit/core.ts:11`: `OCUPAN_LUGAR = ["seno","pago","asistio"]`.
  - `modules/summit/pago.ts:51-73`: la inscripción se crea con el `estado` por defecto `"consulto"` (`db/schema.ts:287`), que **no ocupa lugar**.
  - `core.ts:71-86`: `aplicarPago` pasa a `"pago"` sin volver a mirar el cupo.
- **Qué pasa:** con 79 pagados, 30 personas pueden iniciar el pago a la vez. Todas pasan el control `quedanLugares() > 0` y todas terminan con estado "pago": 109 entradas vendidas. Lo mismo pasa con un pago en efectivo (Rapipago/Pago Fácil) que se acredita días después, cuando el cupo ya se llenó.
- **Impacto:** se cobra plata real por lugares que no existen. Hay que devolverla a mano, con reclamos y riesgo de contracargos.
- **Arreglo:**
  1. Reservar lugar al crear la preferencia: estado `"reservado"` dentro de `OCUPAN_LUGAR`, con `reservaHasta = now + 30 min`, y liberar las reservas vencidas en `lugaresOcupados()` (filtrando por `reservaHasta > now`).
  2. En `aplicarPago`, si el cupo ya está lleno, marcar `estado:"sobrecupo"`, avisar al staff (S-21) y devolver el pago con `POST /v1/payments/{id}/refunds` o tratarlo a mano.
  3. Hacer el conteo y la reserva en una sola sentencia SQL (`INSERT … SELECT … WHERE (select count(*) …) < 80`), porque neon-http no tiene transacciones interactivas.

**S-02 🟠 Las preferencias no vencen: se puede pagar la preventa vieja o con el cupo cerrado.** Esfuerzo S.
- **Dónde:** `lib/mercadopago.ts:43-66`. No se mandan `expires`, `expiration_date_to` ni `date_of_expiration`.
- **Qué pasa:** una preferencia creada el 10/11 a $180.000 (preventa Comunidad, `content/evento.ts:88-91`) se puede pagar el 14/12, cuando la tarifa ya es $260.000. `aplicarPago` la acepta porque compara contra `precioReferencia` de esa inscripción. Además, los cupones de efectivo pueden acreditarse días después (ver S-01).
- **Arreglo:** mandar `expires:true`, `expiration_date_to: now+30min` y `date_of_expiration` (que limita los medios en efectivo) igual al vencimiento de la reserva. Opcional: `payment_methods.excluded_payment_types:[{id:"ticket"}]` si no quieren efectivo.

**S-03 🟠 Si el monto pagado no coincide, el caso se pierde en silencio, y la moneda no se valida.** Esfuerzo S.
- **Dónde:** `modules/summit/core.ts:73-76`.
- **Qué pasa:**
  - Solo se valida `transaction_amount < precioReferencia`, y se saltea si `precioReferencia` es null.
  - No se valida `currency_id === "ARS"` ni `status_detail`.
  - Si el monto no coincide, hace `return r`: el pago queda cobrado, la inscripción sigue "pendiente" y solo queda un `console.error`. Nadie se entera.
  - El tipo `Pago` (`lib/mercadopago.ts:72-79`) no incluye `currency_id`.
- **Arreglo:** validar monto exacto (o ≥) y moneda, guardar `pagoEstado:"monto_invalido"` para que se vea en el panel y mandar una alerta (S-21).

**S-04 🟡 El webhook queda abierto si falta `MP_WEBHOOK_SECRET`, y no se controla la antigüedad de `ts`.** Esfuerzo S.
- **Dónde:** `lib/mercadopago.ts:96` (`if (!secret) return true`) y `:99-107` (no hay tolerancia de `ts`). Según `docs/MERCADOPAGO.md:34`, el secreto está solo en Production.
- **Qué pasa:** el manifest está bien armado (`id:<lowercase>;request-id:…;ts:…;`) y la comparación es en tiempo constante. Como el pago se re-consulta, un aviso falso no aprueba nada, pero sí permite disparar consultas a la API de MP sin límite.
- **Arreglo:** en Production, si falta el secreto, devolver 500 y loguear el problema. Rechazar `ts` con más de 5 minutos de diferencia. Tomar `data.id` de la query (`?data.id=`), que es lo que firma MP, y no del body.

**S-05 🟡 Modo prueba detectado solo por el prefijo `TEST-` del token.** Esfuerzo S.
- **Dónde:** `modules/summit/pago.ts:87`.
- **Qué pasa:** las credenciales de prueba nuevas de MP (cuentas de usuario de prueba) empiezan con `APP_USR-`. Con esas, el código manda a `init_point` y el modo queda ambiguo.
- **Arreglo:** usar una variable explícita `MP_MODO=prueba|produccion` y mostrar en el panel un badge "MODO PRUEBA".

**S-06 🟡 Cada envío del formulario crea una inscripción "consulto" y una preferencia de MP. No hay deduplicación ni rate limit.** Esfuerzo S/M.
- **Dónde:** `modules/summit/pago.ts:58-84`.
- **Qué pasa:** el doble clic o el "volver e intentar" generan inscripciones duplicadas, que llenan el panel (`app/panel/(app)/layout.tsx:23` cuenta las "consulto" como pendientes) y pueden terminar en dos pagos de la misma persona. Un bot puede crear miles de filas.
- **Arreglo:** antes de insertar, reutilizar la inscripción pendiente del mismo email + edición si tiene menos de 30 minutos. Agregar rate limit por IP (ver S-12).

**S-07 ⚪ La página de vuelta procesa cualquier `payment_id` y escribe en la base con un GET.** Esfuerzo S.
- **Dónde:** `app/(site)/event-summit/inscripcion/page.tsx:26-34`.
- **Qué pasa:** no hay IDOR real, porque se aplica según la `external_reference` del pago y el `r` es un UUID. Pero cada visita con `?payment_id=` pega contra la API de MP sin límite.
- **Arreglo:** solo sincronizar si `pago.external_reference === r.id` (comparar antes de aplicar) y cachear la consulta unos segundos.

**S-08 ⚪ Un pago puede aprobar una inscripción archivada.** Esfuerzo S.
- **Dónde:** `core.ts:67` y `:85`: no filtran `deletedAt`.
- **Arreglo:** agregar `isNull(deletedAt)` y alertar si llega un pago para una inscripción archivada.

### Auth y autorización

**S-09 🟠 Sacar a alguien del staff no le quita el acceso: sigue adentro hasta 30 días.** Esfuerzo S.
- **Dónde:** `auth.ts:57` (`maxAge` de 30 días, sesión en base), `auth.ts:62-66` (el rol sale de `users.role`) y `auth.ts:87-93` (el rol se sincroniza **solo** en el evento `signIn`). No existe ninguna acción que revoque sesiones (busqué `sessions` en `app/`, `modules/` y `lib/`: no hay usos).
- **Qué pasa:** si quitás un email de `PANEL_ADMINS`, esa persona mantiene el rol admin mientras no vuelva a iniciar sesión, hasta 30 días. Puede exportar los suscriptores y ver DNIs.
- **Arreglo:** en `requireStaff`/`assertStaff` (`lib/dal.ts:20-34`), comparar también contra `rolDeStaff(s.user.email)` en cada request y usar el menor de los dos roles. Sumar en Ajustes un botón "Cerrar sesiones" (`delete from sessions where user_id = …`). Bajar `maxAge` del staff a 7 días.

**S-10 🟡 Open redirect en `/ingresar?volver=`.** Esfuerzo S.
- **Dónde:** `app/(site)/ingresar/page.tsx:13` y `:23`, y `lib/auth/actions.ts:7` y `:13`.
- **Qué pasa:** la validación (`startsWith("/") && !startsWith("//")`) deja pasar `/\evil.com`, que los navegadores interpretan como `//evil.com`. Con sesión iniciada, `redirect(destino)` (línea 23) manda directo afuera del sitio. Sirve para phishing con un link que empieza con tu dominio.
- **Arreglo:** usar una función `rutaSegura(v)` que valide con `new URL(v, SITE_URL).origin === SITE_URL` y rechace `\`, y reutilizarla en los tres lugares.

**S-11 🟡 Vinculación peligrosa de cuentas y magic link sin límite.** Esfuerzo S/M.
- **Dónde:** `auth.ts:37` (`allowDangerousEmailAccountLinking: true`) y `lib/auth/actions.ts:12-17` (sin rate limit).
- **Qué pasa:**
  - Con Google como único proveedor el riesgo es bajo. Si se activa Resend, el email pasa a ser la identidad que manda y cualquier proveedor futuro hereda el rol de staff del email.
  - `ingresarConEmail` permite mandar links de ingreso a cualquier dirección sin límite: spam desde tu dominio, costo en Resend y reputación del dominio.
- **Arreglo:** dejar `allowDangerousEmailAccountLinking` solo si se entiende el riesgo. Poner rate limit por IP y por email destino (por ejemplo, 3 por hora).

**Matriz de autorización (verificada):**

| Server action / route | Chequeo | Rol |
|---|---|---|
| Páginas `app/panel/(app)/**/page.tsx` (15) | `requireStaff()` en cada una más el layout | staff |
| `guardarProducto`, `alternarProducto`, `duplicarProducto`, `agregarImagen`, `borrarImagen`, `moverImagen` | `assertStaff(ADMIN_EDIT)` | super/admin/editor |
| `borrarProducto`, `guardarCategoria` | `assertStaff(SOLO_ADMIN)` | admin |
| `cambiarEstado`, `guardarSeguimiento` | `assertStaff()` | staff |
| `archivarRegistro` | `assertStaff([super,admin])` | admin |
| `guardarCampana`, `enviarPrueba`, `duplicarCampana`, `marcarCodigo`, `agregarSuscriptor` | `assertStaff()` | staff |
| `enviarCampana`, `borrarCampana`, `cambiarEstadoSuscriptor` | `assertStaff(SOLO_ADMIN)` | admin |
| `GET /api/panel/newsletter/export` | `assertStaff()` | staff (**también editor**, ver S-19) |
| `POST /api/panel/upload` | `assertStaff()` en `onBeforeGenerateToken` | staff |
| `/cuenta` | `requireUser` + `where userId = sesión` | sin IDOR |
| Públicas: `iniciarPagoSummit`, `registrarPedido`, `registrarConsulta`, `suscribirNewsletter`, `darDeBaja`, `ingresarConEmail` | zod + honeypot, **sin rate limit** | público |

Notas menores sobre esta matriz:
- `alternarProducto(id, campo, valor)` (`modules/catalog/actions.ts:82-84`) no valida `campo` en el servidor, porque los tipos de TS no se aplican en runtime. Conviene `z.enum(["visible","destacado"]).parse(campo)`.
- Los IDs no se validan como UUID: un ID mal formado da un 500 genérico. Es poca cosa.

### Entradas y abuso

**S-12 🟠 Ningún formulario público tiene rate limit.** Esfuerzo M.
- **Dónde:** `modules/ventas/registro.ts:42` y `:87`, `modules/newsletter/publico.ts:27`, `modules/summit/pago.ts:40` y `lib/auth/actions.ts:12`. Busqué `ratelimit|upstash|turnstile|captcha` y no hay nada.
- **Qué pasa:** el único freno es el honeypot `web`, que un bot mínimamente armado saltea. Se puede llenar el panel de pedidos y consultas falsas, crear preferencias de MP y mandar mails (ver S-13 y S-11).
- **Arreglo:** Upstash Ratelimit, Vercel KV o una tabla `rate_limits` en Neon, por IP (`x-forwarded-for`) y por email: por ejemplo, 5 por minuto en contacto y pedido, 3 por hora en newsletter y magic link. Cloudflare Turnstile en inscripción y newsletter.

**S-13 🟠 Newsletter sin doble opt-in: códigos infinitos, re-suscripción forzada y texto ajeno en tus mails.** Esfuerzo M.
- **Dónde:** `modules/newsletter/publico.ts:42-50` y `modules/newsletter/core.ts:45-52` y `:63-79`.
- **Qué pasa:**
  - **Códigos infinitos:** el código de 10% se muestra en pantalla (`publico.ts:49`) para cualquier email inventado. Cada email falso da un código nuevo.
  - **Re-suscripción forzada:** si una persona se dio de baja, cualquiera puede volver a suscribirla (`core.ts:45-52` la reactiva y le manda mail). Viola su consentimiento y abre la puerta a denuncias de spam.
  - **Texto ajeno en tus mails:** el `nombre` (80 caracteres) entra en el h1 del mail de bienvenida (`lib/email/plantillas.ts:113-115`). Está escapado, así que no hay XSS, pero se pueden mandar mails desde tu dominio a terceros con texto como "Tu cuenta fue suspendida, entrá a …".
  - **Enumeración:** la respuesta "existente" vs "nuevo" revela si un email está suscripto.
- **Arreglo:** doble opt-in (mail con link de confirmación; el código se muestra o se manda recién al confirmar), no reactivar bajas sin confirmación, respuesta neutra igual para todos los casos, y no poner `nombre` en el asunto ni en el h1 de mails a direcciones no confirmadas.

**S-14 ⚪ XSS: no encontré nada explotable.** Sin acción.
- **Dónde:** `components/site/JsonLd.tsx:30` escapa `<` como `<`. Los otros dos `dangerouslySetInnerHTML` (`app/layout.tsx:131` y `components/sections/HeroMedia.tsx:127`) son constantes. Las plantillas de mail usan `esc()` en todos los datos de usuario (`plantillas.ts:23`, `:41`, `:60`, `:80`, `:100`, `:108`), y `ctaUrl`/`imagen` solo aceptan `/` o `https://` (`modules/newsletter/actions.ts:32-36`).
- **SQL:** los `sql``…`` usan solo parámetros (`modules/newsletter/core.ts:90`, `modules/catalog/admin.ts:24`, `:94`). Bien.

**S-15 ⚪ Upload correcto, con un detalle.** Esfuerzo S.
- **Dónde:** `app/api/panel/upload/route.ts`.
- **Qué está bien:** solo staff, tipos de imagen sin SVG, máximo 15 MB, carpetas permitidas y sufijo aleatorio.
- **Detalle:** `request.json()` (línea 13) está fuera del `try`, así que un body inválido da un 500 sin manejar. Moverlo adentro.

### Cron, baja y export

**S-16 ⚪ Cron: el secreto se compara con `!==`.** Esfuerzo S.
- **Dónde:** `app/api/cron/newsletter/route.ts:19`.
- **Qué pasa:** la comparación no es en tiempo constante (riesgo bajo, aunque se recomienda). Lo bueno: si no hay secreto, devuelve 401.
- **Arreglo:** `timingSafeEqual`.

**S-17 🟡 Cron: marca el recordatorio como enviado aunque un lote haya fallado.** Esfuerzo S.
- **Dónde:** `route.ts:44-49`.
- **Qué pasa:** con `enviados > 0`, marca `recordatorioAt` a los 500, incluidos los de los lotes que fallaron. Esas personas nunca reciben el recordatorio.
- **Arreglo:** que `enviarLote` devuelva qué destinatarios salieron bien, y marcar solo esos.

**S-18 ✅ La baja del newsletter está bien.** Sin acción.
- **Dónde:** `modules/newsletter/core.ts:72`, `app/(site)/newsletter/baja/page.tsx:15-19` y `app/api/newsletter/baja/route.ts:9-13`.
- **Qué está bien:** token aleatorio de 24 bytes, confirmación con botón (los antivirus de correo no dan de baja a nadie al abrir el link) y un clic según RFC 8058.

**S-19 🟡 El export CSV le da toda la base a cualquier staff y su protección contra fórmulas tiene huecos.** Esfuerzo S.
- **Dónde:** `app/api/panel/newsletter/export/route.ts:8` y `:16`.
- **Qué pasa:** un editor (que según Ajustes solo carga productos) puede bajarse todos los emails. La protección contra fórmulas cubre `= + - @` pero no `\t`, `\r` ni espacios al inicio, y el `nombre` lo carga cualquiera desde el sitio.
- **Arreglo:** exigir `assertStaff(SOLO_ADMIN)`, cambiar la regex a `/^[\s=+\-@\t\r]/` y registrar cada export en el audit log.

### Headers y config

**S-20 🟡 No hay ningún header de seguridad.** Esfuerzo S/M.
- **Dónde:** `next.config.ts:9-18` (solo define `Cache-Control`).
- **Qué falta:** CSP, `frame-ancestors`/`X-Frame-Options` (el panel se puede embeber en un iframe para clickjacking), `Referrer-Policy`, `Permissions-Policy` y `X-Content-Type-Options` en el HTML. HSTS lo pone Vercel en `*.vercel.app`, pero hay que configurarlo al pasar al dominio propio.
- **Arreglo:** agregar `source:"/(.*)"` con `X-Frame-Options: DENY` (o `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Content-Type-Options: nosniff` y `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Para empezar, la CSP puede ir en modo `Report-Only` con nonce (GSAP y el script inline de `layout.tsx:131` necesitan nonce o hash).

**Otros puntos de config (⚪):**
- `images.remotePatterns` acepta `*.public.blob.vercel-storage.com` (**cualquier** store de Blob de cualquier cuenta) más `picsum.photos` (`next.config.ts:34-44`). Cualquiera puede usar tu optimizador de imágenes, que cobra Vercel, con imágenes ajenas. Conviene fijar el hostname exacto de tu store y sacar picsum cuando lleguen las fotos `[BLOQUEADO-TERCEROS]`.
- `next-auth` está fijado como `"beta"` en `package.json` (instalado `5.0.0-beta.32`): un `npm install` puede traer otra beta. Fijar la versión exacta.
- Solo hay dos `NEXT_PUBLIC_*` (`SITE_URL` e `INDEX`), sin secretos expuestos. No hay `productionBrowserSourceMaps`. Bien.

**S-22 ⚪ drizzle-orm 0.44.7 está afectada por CVE-2026-39356 (SQL injection en `escapeName`, se arregla en 0.45.2).** Esfuerzo S.
- **Qué pasa:** el proyecto no usa `sql.identifier()` ni `.as()` con datos de usuario (lo busqué), así que hoy no es explotable. Igual hay que actualizar drizzle-orm a ≥0.45.2 y drizzle-kit a la versión que corresponda.

### Datos personales (Ley 25.326)

**S-23 🔴 Se pide DNI, teléfono y email sin informar finalidad ni pedir consentimiento.** Esfuerzo S (texto y checkbox) + `[BLOQUEADO-TERCEROS]` (política legal completa).
- **Dónde:**
  - `components/evento/SummitInscripcion.tsx:113-114` (DNI, sin texto de privacidad ni checkbox).
  - `content/site.ts:43` (`{ label: "Privacidad", href: "#" }`).
  - Formularios de contacto, carrito y newsletter, todos sin aviso.
  - El DNI queda en texto plano en `summit_registrations.dni` y lo ven **todos** los roles en `app/panel/(app)/summit/page.tsx:134`.
- **Qué exige la ley:** el art. 6 obliga a informar finalidad, destinatarios, responsable y derechos de acceso, rectificación y supresión. La base debe inscribirse ante la AAIP.
- **Qué podemos hacer nosotros ya:**
  1. Aviso corto bajo cada formulario ("Usamos tus datos solo para tu inscripción y para contactarte por el evento. Responsable: Sweet Flowers Deco Party. Podés pedir acceso o baja por WhatsApp o email.") y checkbox obligatorio en inscripción y newsletter, guardando `consentAt`.
  2. Página `/privacidad` provisoria con la plantilla de la AAIP, sin inventar datos del negocio.
  3. Mostrar el DNI enmascarado (`***.456`) a los editores.
  4. ¿Hace falta el DNI? Mercado Pago no lo exige en Checkout Pro. Si no se necesita para acreditar en la puerta, sacarlo.

**PII en logs (⚪):** `lib/email/enviar.ts:52` loguea el email destino en cada mail sin enviar, y `:61` y `:89` loguean la respuesta completa de Resend. `mercadopago.ts:68` mete en la excepción el body de error de MP, que puede incluir datos del payer. Conviene loguear solo IDs.

### Robustez

**S-21 🟠 Si falla un pago, nadie se entera.** Esfuerzo S/M.
- **Dónde:** todo el manejo de errores es `console.error` (16 lugares). No hay Sentry, alertas ni mail al staff.
- **Qué pasa:** monto inválido (S-03), sobrecupo (S-01), webhook con 500 o Resend caído al mandar la entrada: todo queda en logs de Vercel que nadie mira.
- **Arreglo:** función `alertarStaff(asunto, datos)` que mande un mail o WhatsApp al superadmin. Conectar Sentry (plan gratis) o Vercel Log Drains. Sumar al panel un "Pagos con problemas" filtrado por `pagoEstado`.

**S-24 🟠 Si falla el mail de la entrada, no se reintenta nunca.** Esfuerzo S.
- **Dónde:** `modules/summit/core.ts:77-93`.
- **Qué pasa:** el estado pasa a "pago" **antes** de mandar el mail. Si Resend falla, el `catch` lo loguea y la persona pagó sin recibir comprobante. Como el `UPDATE … where estado != "pago"` ya no vuelve a matchear, ningún reintento lo arregla.
- **Arreglo:** columna `entradaEnviadaAt`. Mandar si es null (en el webhook y en el cron diario) y botón "Reenviar entrada" en el panel.

**S-25 🟡 Ningún `fetch` externo tiene timeout.** Esfuerzo S.
- **Dónde:** `lib/mercadopago.ts:36` y `:83`, `lib/email/enviar.ts:56` y `:81`.
- **Qué pasa:** el webhook espera a que se mande el mail. Si Resend tarda, MP corta y reintenta. Como es idempotente no duplica, pero alarga la cola de reintentos.
- **Arreglo:** `signal: AbortSignal.timeout(8000)`. En el webhook, mandar el mail con `after()` de Next.

**S-26 🟠 Las migraciones, el seed y las actualizaciones corren en CADA build, también en Preview, y la base parece compartida.** Esfuerzo M. Hay que verificarlo en Vercel.
- **Dónde:** `package.json` (`"build": "node scripts/deploy-db.mjs && next build"`), `scripts/deploy-db.mjs:14-18` y `docs/SETUP_BACKEND.md:7` (Neon conectado a "Production + Preview + Development").
- **Qué pasa si Preview usa la misma `DATABASE_URL`** (no vi si está activado el branching por preview):
  - Una rama experimental migra el esquema de producción.
  - Los pagos de prueba (`TEST-`) de Preview y de `npm run dev` crean inscripciones "pago" en la base real y **ocupan cupo real** (S-01).
- **Problemas aunque no se comparta:**
  - Las actualizaciones no son transaccionales (neon-http): si una falla a la mitad, rompe el deploy y queda a medias.
  - Dos builds simultáneos pueden correr la misma actualización dos veces, porque el chequeo en `audit_log` no tiene unique.
  - El seed resucita productos: si alguien cambia un slug en el panel, el seed vuelve a crear el producto con el slug viejo (`scripts/seed.ts:51-52`).
- **Arreglo:**
  1. Correr `deploy-db` solo si `VERCEL_ENV === "production"`.
  2. Activar el branching de Neon por preview, o usar otra base para Preview y Development.
  3. Índice único en `audit_log(accion)` para `entidad = 'datos'`.
  4. Que el seed corra una sola vez (flag) y no en cada build.

**S-27 🟡 `enviarCampana` puede quedar trabada en "enviando".** Esfuerzo S.
- **Dónde:** `modules/newsletter/actions.ts:87-103`.
- **Qué pasa:** si la server action se corta por timeout, la campaña queda en "enviando" para siempre y la UI no ofrece salida.
- **Arreglo:** guardar `enviandoDesde` y permitir reanudar si pasaron más de 10 minutos. Mejor todavía, mandar por lotes desde el cron.

**S-28 🟡 No hay ningún test.** Esfuerzo M.
- **Dónde:** no hay ningún `*.test.*` ni `*.spec.*`.
- **Arreglo:** como mínimo, tests unitarios de `firmaValida` (con el vector de la doc de MP), `aplicarPago` (aprobado ×2, devuelto, monto menor, sobrecupo), `tarifaVigente` (borde de fecha AR) y `celda()` del CSV.

## 3. Top 10 antes del viernes (impacto / esfuerzo)

1. **S-01** Reserva de cupo al crear la preferencia y control de sobrecupo al pagar. M.
2. **S-02** Vencimiento de preferencias (30 min) y de los medios en efectivo. S.
3. **S-26** `deploy-db` solo en production y confirmar que Preview y dev no usan la base de producción. S/M.
4. **S-23** Aviso de privacidad, checkbox de consentimiento, `/privacidad` provisoria y DNI enmascarado (o eliminarlo). S.
5. **S-21 + S-03 + S-24** Alertas al staff y `entradaEnviadaAt` con reenvío; validar monto exacto y moneda. M.
6. **S-09** Revalidar el rol contra las env vars en cada request y botón "cerrar sesiones". S.
7. **S-12** Rate limit (Upstash) en inscripción, newsletter, contacto, pedido y magic link. M.
8. **S-13** Doble opt-in del newsletter (no mostrar el código en pantalla, no reactivar bajas). M.
9. **S-20** Headers de seguridad (anti-iframe, Referrer-Policy, Permissions-Policy, HSTS y CSP Report-Only). S.
10. **S-10 + S-04 + S-25 + S-22** Redirect seguro, webhook que falle si falta el secreto y con tolerancia de ts, timeouts y actualizar drizzle. S.

## 4. Ideas "wow" (backend que se nota)

1. **Entrada con QR firmado:** HMAC de `codigo|id` en el mail y un check-in desde el panel en el celular (`/panel/summit/checkin` con la cámara) que pasa a "asistio". Impresiona en el evento y evita entradas truchas.
2. **Contador de cupo en vivo y honesto:** "Quedan 12 lugares", con reservas temporales visibles ("3 personas están pagando ahora"). Genera urgencia real, sin manipulación, y queda bien justo después de arreglar S-01.
3. **Página `/estado` pública** con el estado de Mercado Pago, Resend y la base, consultado por el cron. Un detalle de producto serio, poco común en sitios de autor.
4. **Audit log visible en el panel** ("Tobi cambió el precio de Eclipse XL hace 2 h"). La tabla `audit_log` ya existe, solo falta mostrarla.
5. **Comprobante PDF o Apple/Google Wallet pass** con la entrada del Summit, generado en el webhook.
