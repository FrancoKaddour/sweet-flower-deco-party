# 00_ACCESOS — credenciales del proyecto (carpeta LOCAL, no se sube a Git)

Esta carpeta guarda los **accesos y credenciales** del proyecto. **Su contenido NO se versiona**: el `.gitignore` ignora todo lo de acá **menos este README**. Nunca pongas credenciales reales en un archivo que se commitee, ni en el código, ni en un mensaje.

> Por qué existe: hay secretos (Mercado Pago, base de datos, etc.) que la app consume por **variables de entorno** (`.env.local`, también gitignoreado), pero el equipo necesita un lugar humano y ordenado donde Franco le deja a Gonzalo los accesos. Ese lugar es esta carpeta, **local a cada máquina**.

---

## Qué va acá (y quién lo consigue)

| Acceso | Para qué | Cuándo | Lo consigue |
|---|---|---|---|
| **Dominio / DNS** | deploy y URLs | Fase 5 | Franco |
| **Vercel** (proyecto / env vars) | deploy, previews, `vercel env pull` | Fase 1 | Franco |
| **Base de datos (Neon/Postgres)** | datos | Fase 0/1 | se crea por el Marketplace de Vercel |
| **Vercel Blob** | imágenes de productos/eventos | Fase 0/1 | Marketplace de Vercel |
| **Mercado Pago — TEST** | probar pagos (sandbox) | Fase 3 | Franco (cuenta de Flor) |
| **Mercado Pago — PRODUCCIÓN** | cobros reales | Fase 5 (final) | Franco |
| **Resend** | emails transaccionales | Fase 3/4 | Marketplace de Vercel |
| **Redes / otros** | según haga falta | — | Franco |

---

## Formato sugerido (archivos locales, NO commiteados)

Creá acá archivos de texto plano para tu referencia, por ejemplo:

```
00_ACCESOS/
├─ README.md                 ← este archivo (lo único que se versiona)
├─ mercadopago-test.txt       ← Public Key + Access Token de TEST + webhook secret
├─ mercadopago-prod.txt       ← (recién en Fase 5)
├─ vercel.txt                 ← cómo acceder al proyecto / notas
└─ base-de-datos.txt          ← string de conexión (o "viene por vercel env pull")
```

Los **secretos que consume la app** (tokens de MP, DB, Blob, Resend) terminan en tu `.env.local`, que traés con:

```bash
vercel env pull .env.local
```

Esta carpeta es para los que **no** entran por env var o para tus notas de acceso.

---

## Reglas (no negociables)

1. **Nada de acá se commitea** (salvo este README). Verificá que el `.gitignore` tenga la regla de `00_ACCESOS/`.
2. **Nunca** pegues una credencial en el código, en un commit, ni en un chat.
3. Si una credencial se filtró (la pegaste sin querer en un commit), **avisá a Franco y rotala** (generar una nueva y anular la vieja).
4. Mercado Pago: **TEST y PRODUCCIÓN separados**. Todo el desarrollo con TEST (ver [`colaboracion/gonzalo/09_TESTEAR_MERCADOPAGO.md`](../colaboracion/gonzalo/09_TESTEAR_MERCADOPAGO.md)).
