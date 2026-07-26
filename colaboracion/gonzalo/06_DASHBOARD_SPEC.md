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
├─ Comunidad
│   ├─ Miembros (CRM)           ← membresía, estados, export
│   └─ Inscripciones a eventos
├─ Consultas
│   └─ Presupuestos "a medida"  ← bandeja de leads
└─ Ajustes
    └─ Usuarios y roles del panel
```

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
- Altas de miembros nuevas y **leads pendientes** de responder.
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

### 6. Comunidad
- **Miembros (CRM):** listar/buscar miembros, ver plan y estado (activo/vencido), notas. **Exportar contactos** (CSV) para campañas.
- **Inscripciones a eventos:** quién se anotó a cada edición; export.

### 7. Consultas — Presupuestos "a medida"
- **Bandeja de leads:** cada consulta de producto a medida entra acá (contacto, detalle, producto relacionado). Ver, marcar estado (nuevo/en curso/cotizado/cerrado), y responder por email. Es plata sobre la mesa: no se pierde ninguna.

### 8. Ajustes
- **Usuarios y roles** del panel (alta de staff, asignar rol). Solo admin.

---

## Qué NO hace el panel (por ahora)
- No edita el estado de pago a mano (lo maneja el webhook de Mercado Pago).
- No es la tienda: la compra la hace el visitante en el storefront.
- No incluye facturación/AFIP en esta etapa (se evalúa más adelante si el negocio lo pide → nueva decisión en `docs/16_DECISIONS.md`).

---

## Definición de "el panel funciona perfecto"
- [ ] Nada accesible sin login; roles respetados.
- [ ] Cada ABM valida, confirma antes de borrar, y muestra éxito/error.
- [ ] Los cambios se reflejan en el sitio público (catálogo/PDP/contenido).
- [ ] Las órdenes reflejan fielmente lo que dice Mercado Pago.
- [ ] Ningún lead ni inscripción se pierde.
- [ ] Probado en navegador (agent-browser) en los flujos clave.

> El diseño lo pule Franco. Tu vara es: **rápido, claro, sin bugs, sin sorpresas.**
