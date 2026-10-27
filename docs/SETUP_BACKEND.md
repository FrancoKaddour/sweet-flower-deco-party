# Setup del backend (una sola vez)

Base: **Postgres (Neon)** · ORM **Drizzle** · login **Auth.js** (Google + link por email) · fotos **Vercel Blob**.
Mientras no hagas esto, el sitio sigue andando con el catálogo estático (no se cae nada).

## 1. Base de datos y fotos (Vercel, 5 min)
1. Vercel → proyecto **sweet-flower-deco-party** → **Storage** → **Create** → **Neon (Postgres)** → conectar al proyecto (Production + Preview + Development).
2. Vercel → **Storage** → **Create** → **Blob** → conectar al proyecto.
   Vercel crea solas `DATABASE_URL` y `BLOB_READ_WRITE_TOKEN`.

## 2. Login con Google (Google Cloud, 10 min)
1. https://console.cloud.google.com → proyecto nuevo "Sweet Flowers".
2. **APIs y servicios → Pantalla de consentimiento OAuth** → Externo → nombre "Sweet Flowers", tu email → guardar.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth** → *Aplicación web*.
   - Orígenes autorizados: `https://sweet-flower-deco-party.vercel.app` y `http://localhost:3000`
   - URIs de redirección: `https://sweet-flower-deco-party.vercel.app/api/auth/callback/google` y `http://localhost:3000/api/auth/callback/google`
4. Copiá el **ID** y el **secreto**.

## 3. Variables de entorno (Vercel → Settings → Environment Variables)
| Variable | Valor |
|---|---|
| `AUTH_SECRET` | un texto aleatorio largo (generalo con `npx auth secret` o en https://generate-secret.vercel.app/32) |
| `AUTH_GOOGLE_ID` | el ID de Google |
| `AUTH_GOOGLE_SECRET` | el secreto de Google |
| `PANEL_SUPERADMINS` | `francokaddour@gmail.com` |
| `PANEL_ADMINS` | el gmail de Flor |
| `PANEL_EDITORS` | el gmail de Tobi |

Opcional (cuando haya dominio propio verificado en Resend): `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM` → habilita el login con link por email.

## 4. En tu compu (en la carpeta del proyecto)
```bash
npm install                 # instala drizzle, auth, blob, zod…
npx vercel link             # si todavía no está vinculado
npx vercel env pull .env.local
npm run db:generate         # crea la migración inicial en ./drizzle
npm run db:migrate          # crea las tablas en Neon
npm run db:seed             # carga categorías + 179 productos del catálogo de WhatsApp
npm run db:deploy           # migraciones + seed (una vez) + actualizaciones, contra la base de .env.local
git add -A && git commit -m "chore(db): migración inicial" && git push
```

## 5. Probar
- `npm run dev` → http://localhost:3000/panel → **Continuar con Google** con tu cuenta.
- Editá un producto, subile una foto y mirá que cambie en el sitio.

## Roles
- **superadmin** (Franco) y **admin** (Flor): todo, incluido borrar y categorías.
- **editor** (Tobi): productos y fotos; no borra ni toca categorías.
- Para dar o sacar acceso: editá las variables `PANEL_*` y redeployá; el rol se aplica en el siguiente ingreso.

## Migraciones y deploy (S-26)
- `scripts/deploy-db.mjs` corre antes de `next build` **solo en Production**
  (`VERCEL_ENV=production`). En Preview no toca la base; en un build local
  tampoco (para migrar a mano: `npm run db:deploy`).
- El seed del catálogo corre una sola vez en la vida de la base (marca
  `seed.catalogo` en `audit_log`): nunca resucita productos borrados o con slug cambiado.
- Los marcadores de `scripts/actualizaciones.ts` tienen índice único
  (`audit_log_datos_accion_idx`): dos deploys a la vez no pueden aplicar la misma dos veces.
- Recomendado: en Vercel → Storage → Neon, activar **branching por Preview** (o
  usar otra base para Preview/Development) para que las pruebas no escriban en producción.

## Perfil de cliente e historial (migración 0005)
- `drizzle/0005_perfil_clientes.sql` (sin aplicar todavía; corre sola en el próximo deploy de Production, después de la 0004):
  - tabla `customer_profiles` (1 a 1 con `users`): nombre, apellido, celular, DNI (7-8 dígitos, CHECK), tipo de cliente, emprendimiento, Instagram, dirección (calle, número, piso/depto, localidad, provincia, CP/CPA), transporte preferido, preferencias de contacto y fecha de aceptación de privacidad;
  - `users.deleted_at` (baja de cuenta: borrado lógico + anonimización);
  - `orders`: `fecha_evento`, `pago` (transferencia | mercadopago), `codigo_club`, `origen` e índice por `user_id`; en `items` (jsonb) cada línea puede traer `variante`;
  - `summit_registrations.user_id` (FK, `on delete set null`) con índice;
  - estado de pedido nuevo **`iniciado`** (la persona tocó "Enviar por WhatsApp"; el equipo lo pasa a "nuevo" cuando le llega el mensaje).
- Historial: con sesión, el pedido y la inscripción guardan el `user_id`. Sin sesión: las **inscripciones** se vinculan al ingresar con el mismo email (solo si Google/el link verificó el email); los **pedidos** (no guardan email) se vinculan desde el mismo navegador al entrar a `/cuenta` (el carrito recuerda los códigos; solo pedidos sin dueño de los últimos 30 días).
- `/cuenta`: mis datos, dirección, pedidos (con "Repetir pedido"), inscripciones, Club y privacidad (descargar mis datos en JSON en `/cuenta/mis-datos` y borrar la cuenta escribiendo BORRAR).
- Al borrar una cuenta: se anonimizan email/nombre de `users`, se borran perfil, accesos y sesiones; los pedidos quedan sin datos personales; las inscripciones **pagadas** se conservan como comprobante (sin vínculo a la cuenta); el Club pasa a baja.

## Captcha (Cloudflare Turnstile, gratis)
Sin claves, el sitio funciona igual que hoy (no se muestra ni se exige). Con la clave pública cargada, el servidor la **exige** en: inscripción al Summit, Club/newsletter, contacto e ingreso por email.
1. https://dash.cloudflare.com → **Turnstile** → **Add widget** (Add site).
2. Nombre "Sweet Flowers". **Hostnames**: `sweet-flower-deco-party.vercel.app`, `localhost` y el dominio propio cuando exista.
3. **Widget mode: Managed** (casi siempre pasa solo; el sitio lo muestra únicamente si Cloudflare pide un clic).
4. Copiá la **Site key** y la **Secret key** a Vercel → Environment Variables (Production y Preview) y redeployá:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key (pública) |
| `TURNSTILE_SECRET_KEY` | Secret key (privada) |

- Si Cloudflare no responde (8 s) o falta la secreta, se deja pasar y queda un error en los logs: un captcha caído nunca frena una venta (el rate limit sigue de respaldo). Un token inválido siempre se rechaza.
- La CSP (modo Report-Only) ya permite `challenges.cloudflare.com`.
- Para probar en local sin molestar: claves de prueba de Cloudflare (Site key `1x00000000000000000000AA`, Secret `1x0000000000000000000000000000000AA`, siempre pasan).
