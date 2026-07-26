# Compartido — Reglas, Git y Glosario

Lo que aplica a **los dos** (Franco y Gonzalo). Fuente única para no repetir en cada track.

---

## 1. Reglas no negociables del proyecto

Valen para ambos y para la IA:

1. **Contexto → Diseño → Código.** Nunca al revés.
2. **Esta NO es el Next.js de memoria de la IA.** Antes de escribir código de Next, leer la guía real en `node_modules/next/dist/docs/` (regla de `AGENTS.md`).
3. **TypeScript estricto, sin `any`.**
4. **Runtime Node, nunca `edge`.**
5. **Servicios externos (DB, pagos, email) por el Marketplace de Vercel.**
6. **`next/image` para imágenes, `next/font` para fuentes.**
7. **Secretos en env vars, nunca en el código.** `.env.local` no se sube.
8. **Placeholders con `TODO(contenido):`. Nunca inventar datos reales** (precios, fechas, cupos).
9. **Rama + PR + commits chicos.** Nunca push directo a `main`.
10. **QUALITY BAR** (`docs/CLAUDE.md` §3): si no lo publicaría una agencia top, se mejora.

---

## 2. Git (convención común)

**Flujo:**
```bash
git checkout main && git pull
git checkout -b feat/lo-que-sea      # feat/ fix/ chore/ refactor/
# ...trabajás, commits chicos...
git push -u origin feat/lo-que-sea
# abrís PR en GitHub → el otro revisa → merge a main
```

**Commits:** uno por actividad. Formato `tipo(area): qué hiciste` (presente).
Tipos: `feat` · `fix` · `refactor` · `docs` · `chore`.
Ej: `feat(commerce): adapter de carrito con validación de stock`.

**Ramas:** una por tarea. Nombre claro.

**PR:** descripción con qué / cómo probarlo / qué queda pendiente. Lo revisa y mergea Franco.

**Nunca:** push directo a `main` · secretos en un commit · `--no-verify` · mezclar diez cosas en un commit.

---

## 3. Definición de "terminado" (común)

- [ ] `npm run build` pasa.
- [ ] Sin `any`, sin `console.log`, sin código muerto, sin secretos.
- [ ] Placeholders marcados `TODO(contenido):`.
- [ ] Cumple los criterios de la tarea.
- [ ] PR con descripción y probado en navegador.

---

## 4. Glosario

- **Repo:** carpeta del proyecto versionada con Git.
- **Rama (branch):** copia paralela para trabajar sin tocar `main`.
- **Commit:** foto guardada de cambios, con mensaje.
- **PR (Pull Request):** pedido para incorporar una rama a `main`; donde se revisa.
- **`main`:** la rama estable, lo que va a producción. No se toca directo.
- **Frontend / Backend:** lo que se ve / la lógica y datos por detrás.
- **RSC (React Server Component):** componente que se renderiza en el servidor; por defecto en Next salvo `"use client"`.
- **Route handler / API route:** archivo en `app/api/...` que responde pedidos (ej: webhook).
- **CMS:** sistema para cargar contenido con panel (usamos **Payload** como motor).
- **ORM / motor de datos:** capa entre el código y la base de datos.
- **Webhook:** aviso automático de un servicio externo (Mercado Pago) cuando pasa algo.
- **Migración:** cambio versionado de la estructura de la base.
- **Idempotencia:** que procesar el mismo evento dos veces no rompa nada (clave en pagos).
- **Env var:** valor secreto/de configuración fuera del código.
- **Token (de diseño):** variable de color/tipografía/espaciado, fuente única del look.
- **CLS / LCP / INP:** métricas de performance (Core Web Vitals) que queremos en verde.
- **PCI:** normas de seguridad para datos de tarjetas (por eso el pago lo maneja Mercado Pago, no nosotros).

> Si aparece un término que no está acá, sumalo. Este glosario es de los dos.
