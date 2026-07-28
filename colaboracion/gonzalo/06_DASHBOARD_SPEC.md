# 06 — Especificación del panel (centro de operaciones)

Qué tiene que **hacer** el panel `/panel`. Es el cerebro del negocio: desde acá Flor y el equipo gestionan todo. **Alcance: completo** (contenido + ventas + comunidad + leads + métricas).

**Reglas del panel:**
- **Diseño:** simple y funcional lo hace Gonzalo; **Franco lo pule** después. No te trabes en lo visual — que **funcione perfecto** es lo que importa.
- **Seguridad:** todo detrás de login. Los permisos y la validación los aporta el motor (Payload), no los inventes a mano.
- **A prueba de errores:** validaciones claras, estados de carga, mensajes de éxito/error, confirmación antes de borrar. Nivel plataforma seria.
- **Todo en español** (es-AR), moneda en ARS con `Intl`.

> Esto es el *qué*. El *cómo* (tareas y orden) está en [`03_BACKLOG.md`](./03_BACKLOG.md). No hace falta construir todo junto: se va módulo por módulo.

---

## Estructura general

```
/panel
├─ (login)                      ← entrada, con auth de Payload
├─ Inicio (métricas)            ← resumen del negocio de un vistazo
├─ Catálogo
│   ├─ Productos                ← CRUD + imágenes + stock + "a medida"
│   ├─ Categorías / Materiales
│   └─ Medios (imágenes)
├─ Contenido
│   ├─ Eventos / Ediciones      ← + disertantes, sponsors, galería
│   ├─ Testimonios
│   └─ Textos del sitio (home, contacto, redes)
├─ Ventas
│   ├─ Órdenes                  ← estado de pago y de envío
│   └─ (stock bajo)
├─ Comunidad (CRM)
│   ├─ Contactos                ← el CENTRO: toda persona + tags + opt-in
│   ├─ Miembros                 ← membresías (plan, estado)
│   └─ Inscripciones a eventos  ← quién se anotó (viene del form del sitio)
├─ Campañas
│   └─ Email                    ← armar y enviar a segmentos (vía Resend)
├─ Consultas
│   └─ Presupuestos "a medida"  ← bandeja de leads
└─ Ajustes
    └─ Usuarios y roles del panel
```

> **El centro del CRM son los `Contactos`, no "los miembros" (ADR-014).** Toda persona —comprador, inscripto, miembro, lead— es un contacto con `tags` y `opt-in`. Miembros, inscripciones, órdenes y leads **cuelgan** de un contacto. Así una campaña puede segmentar cruzando todo ("inscriptos al evento que no compraron").

---

## Módulos (qué hace cada uno)

### 1. Login y roles
- Entrada con email + contraseña (auth de Payload). Rutas de `/panel` protegidas; sin sesión → al login.
- Roles: **admin** (todo) y **editor** (contenido, sin ajustes ni usuarios). Ampliable.
- Logout. Recuperar contraseña (deseable, no bloqueante).

### 2. Inicio — Métricas
Un vistazo al estado del negocio:
- Ventas del período (hoy / semana / mes) y total de órdenes por estado.
- **Stock bajo** (productos por debajo de un umbral).
- Inscripciones a la próxima edición del evento.
- Altas de miembros nuevas, **contactos nuevos con opt-in**, y **leads pendientes** de responder.
- Accesos rápidos a "lo que requiere acción" (órdenes a despachar, leads sin responder).

### 3. Catálogo
- **Productos:** listar (con búsqueda y filtro por material/estado), crear, editar, borrar (con confirmación). Campos: título, slug, precio ARS, material, stock, medidas, desarmable, pintable, **a medida** (sí/no), categoría, imágenes (→ Blob). Validaciones: precio y stock coherentes; slug único.
- **Categorías / Materiales:** ABM simple.
- **Medios:** subir/gestionar imágenes con su `alt`.

### 4. Contenido
- **Eventos / Ediciones:** ABM de ediciones (nombre, fecha, lugar, edición N.º, descripción), con **disertantes**, **sponsors** (logo + link) y **galería**.
- **Testimonios:** ABM (cita, autora, ciudad, avatar).
- **Textos del sitio:** editar los textos/enlaces que hoy están en el código como placeholder (home, contacto, redes) — para que Flor los cambie sin tocar código.

### 5. Ventas
- **Órdenes:** listar con estado de **pago** (pendiente/aprobado/rechazado) y de **envío** (a preparar/enviado/entregado). Ver detalle: ítems, total, comprador, ID de pago de Mercado Pago. Cambiar estado de envío. **Solo lectura del pago** (la verdad la fija el webhook, no se edita a mano).
- **Stock bajo:** vista/atajo de productos por reponer.

### 6. Comunidad (CRM)
- **Contactos (el centro):** listar/buscar/filtrar por `tags` y por origen (compró, se anotó, lead, miembro, newsletter). Ver la ficha de un contacto con **todo su historial** (órdenes, inscripciones, membresía, consultas). Editar tags y notas. **Opt-in de email visible y editable** (con fecha y origen del consentimiento). Exportar (CSV).
- **Miembros:** el subconjunto de contactos con membresía. Ver plan y estado (activo/vencido), fecha de alta/renovación. *(El cobro de la membresía se define con Flor — ADR-014; por ahora, alta/estado manual.)*
- **Inscripciones a eventos:** quién se anotó a cada edición (llega del **formulario de inscripción del sitio**). Ver datos, estado, y exportar. Cada inscripción crea/actualiza un `Contacto`.

### 7. Campañas — Email
- **Armar y enviar campañas** a un **segmento** de contactos (ej: "inscriptos al Summit", "compradores del último mes", "miembros activos"). Editor simple (asunto + cuerpo). Envío por la **API de Resend** (mismo proveedor que los mails transaccionales), **solo a contactos con opt-in**.
- Ver campañas enviadas con métricas básicas (enviados, aperturas si Resend las provee) y estado (borrador/enviada).
- **No es un ESP externo** (Mailchimp/Brevo): es una herramienta mínima propia dentro del panel (ADR-014). Respeta el opt-in **siempre** (requisito legal — ver skill `legal-review`).

### 8. Consultas — Presupuestos "a medida"
- **Bandeja de leads:** cada consulta de producto a medida entra acá (contacto, detalle, producto relacionado). Ver, marcar estado (nuevo/en curso/cotizado/cerrado), y responder por email. Cada consulta crea/actualiza un `Contacto`. Es plata sobre la mesa: no se pierde ninguna.

### 9. Ajustes
- **Usuarios y roles** del panel (alta de staff, asignar rol). Solo admin.

---

## Qué NO hace el panel (por ahora)
- No edita el estado de pago a mano (lo maneja el webhook de Mercado Pago).
- No es la tienda: la compra la hace el visitante en el storefront.
- No incluye facturación/AFIP en esta etapa (se evalúa más adelante si el negocio lo pide → nueva decisión en `docs/16_DECISIONS.md`).
- Campañas: **no** es un ESP externo ni tiene automations complejas — es un envío propio y simple a segmentos por Resend (ADR-014). Si el negocio pide más (automations, plantillas ricas), es una decisión nueva.
- Cobro recurrente de membresía: **pendiente** (se define con Flor). Por ahora el estado de membresía se gestiona a mano.

---

## Definición de "el panel funciona perfecto"
- [ ] Nada accesible sin login; roles respetados.
- [ ] Cada ABM valida, confirma antes de borrar, y muestra éxito/error.
- [ ] Los cambios se reflejan en el sitio público (catálogo/PDP/contenido).
- [ ] Las órdenes reflejan fielmente lo que dice Mercado Pago.
- [ ] Ningún lead ni inscripción se pierde; cada uno queda ligado a un **Contacto**.
- [ ] Las campañas se envían **solo a contactos con opt-in** (nunca a quien no consintió).
- [ ] Probado en navegador (agent-browser) en los flujos clave.

> El diseño lo pule Franco. Tu vara es: **rápido, claro, sin bugs, sin sorpresas.**
