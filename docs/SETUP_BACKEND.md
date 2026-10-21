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
git add -A && git commit -m "chore(db): migración inicial" && git push
```

## 5. Probar
- `npm run dev` → http://localhost:3000/panel → **Continuar con Google** con tu cuenta.
- Editá un producto, subile una foto y mirá que cambie en el sitio.

## Roles
- **superadmin** (Franco) y **admin** (Flor): todo, incluido borrar y categorías.
- **editor** (Tobi): productos y fotos; no borra ni toca categorías.
- Para dar o sacar acceso: editá las variables `PANEL_*` y redeployá; el rol se aplica en el siguiente ingreso.
