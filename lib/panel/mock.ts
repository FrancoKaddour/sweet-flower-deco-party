// ============================================================================
// DATOS MOCK DEL PANEL — Sweet Flowers Deco Party
// ----------------------------------------------------------------------------
// 🔌 GONZALO: TODO este archivo es andamiaje temporal. Cada `getMockX()` que ves
// acá se reemplaza por una query a la Local API de Payload a la colección que se
// indica en el comentario. La UI del panel consume estas funciones tal cual:
// cuando cambies el cuerpo de la función por la query real, la MISMA pantalla
// pasa a mostrar datos reales y vas a ver al instante si funciona.
//
// Modelo de datos (ver ADR-014 en docs/16_DECISIONS.md y
// colaboracion/gonzalo/02_ARQUITECTURA_BACKEND.md §6):
//   - `Contacts` es el CENTRO. Toda persona es un Contact con tags + opt-in.
//   - `Orders`, `EventRegistrations`, `Memberships`, `Quotes` CUELGAN de un Contact.
//   - `EmailCampaigns` segmenta sobre Contacts (solo opt-in).
//
// Regla: nada de datos reales de Flor (precios/nombres). Todo es evidentemente
// placeholder + `TODO(contenido)` donde aplique.
// ============================================================================

// ---------------------------------------------------------------------------
// Tipos compartidos
// ---------------------------------------------------------------------------

export type EstadoPedidoPago = "pendiente" | "aprobado" | "rechazado";
export type EstadoEnvio = "a-preparar" | "enviado" | "entregado";
export type EstadoProducto = "publicado" | "borrador" | "agotado";
export type EstadoLead = "nuevo" | "en-curso" | "cotizado" | "cerrado";
export type EstadoCampana = "borrador" | "enviada" | "programada";
export type EstadoMembresia = "activa" | "vencida" | "pendiente";
export type RolStaff = "admin" | "editor";

// ---------------------------------------------------------------------------
// Inicio / Métricas
// ---------------------------------------------------------------------------

export type Kpi = {
  id: string;
  label: string;
  valor: string;
  /** Variación vs. período anterior (texto ya formateado). Opcional. */
  delta?: string;
  /** Dirección de la variación para colorear el chip. */
  tendencia?: "sube" | "baja" | "neutral";
  ayuda: string;
};

// 🔌 GONZALO: reemplazá getMockKpis() por agregaciones sobre Payload:
//   ventas del mes → suma de `Orders` (pago aprobado) del período
//   órdenes por estado → count de `Orders` agrupado por estado de envío
//   stock bajo → count de `Products` con stock < umbral
//   inscripciones → count de `EventRegistrations` de la próxima edición
//   contactos con opt-in → count de `Contacts` con consent.optIn = true (nuevos)
//   leads pendientes → count de `Quotes` en estado "nuevo"
export function getMockKpis(): Kpi[] {
  return [
    {
      id: "ventas-mes",
      label: "Ventas del mes",
      valor: "$ 0", // TODO(contenido): Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })
      delta: "—",
      tendencia: "neutral",
      ayuda: "Órdenes con pago aprobado en el mes en curso.",
    },
    {
      id: "ordenes-abiertas",
      label: "Órdenes a despachar",
      valor: "3",
      delta: "+1",
      tendencia: "sube",
      ayuda: "Pagas y pendientes de preparar o enviar.",
    },
    {
      id: "stock-bajo",
      label: "Stock bajo",
      valor: "2",
      delta: "—",
      tendencia: "neutral",
      ayuda: "Productos por debajo del umbral de reposición.",
    },
    {
      id: "inscripciones",
      label: "Inscripciones al Summit",
      valor: "5",
      delta: "+5",
      tendencia: "sube",
      ayuda: "Anotados a la próxima edición del evento.",
    },
    {
      id: "contactos-optin",
      label: "Contactos con opt-in",
      valor: "4",
      delta: "+2",
      tendencia: "sube",
      ayuda: "Personas nuevas que consintieron recibir email.",
    },
    {
      id: "leads-pendientes",
      label: "Leads pendientes",
      valor: "2",
      delta: "+2",
      tendencia: "baja",
      ayuda: 'Presupuestos "a medida" sin responder.',
    },
  ];
}

export type ItemAccion = {
  id: string;
  tipo: "orden" | "lead" | "inscripcion";
  titulo: string;
  detalle: string;
  /** Fecha ya formateada (es-AR). */
  cuando: string;
  href: string;
};

// 🔌 GONZALO: reemplazá getMockAcciones() por una unión de:
//   `Orders` con envío pendiente + `Quotes` en estado "nuevo".
export function getMockAcciones(): ItemAccion[] {
  return [
    {
      id: "acc-1",
      tipo: "orden",
      titulo: "Orden #0001 lista para despachar",
      detalle: "Pago aprobado · falta preparar",
      cuando: "Hace 2 h", // TODO(contenido)
      href: "/panel/ventas",
    },
    {
      id: "acc-2",
      tipo: "lead",
      titulo: "Consulta a medida sin responder",
      detalle: "Arco floral para casamiento",
      cuando: "Hace 5 h",
      href: "/panel/consultas",
    },
    {
      id: "acc-3",
      tipo: "inscripcion",
      titulo: "Nueva inscripción al Summit",
      detalle: "Llegó del formulario del sitio",
      cuando: "Ayer",
      href: "/panel/contactos",
    },
  ];
}

// ---------------------------------------------------------------------------
// Catálogo → Productos
// ---------------------------------------------------------------------------

export type Producto = {
  id: string;
  titulo: string;
  material: string;
  /** Precio en ARS (entero). Se formatea con Intl en la vista. */
  precio: number;
  stock: number;
  aMedida: boolean;
  estado: EstadoProducto;
};

export const MATERIALES = [
  "Hierro",
  "MDF",
  "Madera",
  "Telas",
] as const;

// 🔌 GONZALO: reemplazá getMockProductos() por la query a la colección `Products`
// (payload.find({ collection: "products" })). Campos: titulo, material, precio,
// stock, aMedida, estado. Aplicá búsqueda/filtro por material del lado del server.
export function getMockProductos(): Producto[] {
  return [
    {
      id: "prod-1",
      titulo: "TODO(contenido): Pieza en hierro A",
      material: "Hierro",
      precio: 0,
      stock: 8,
      aMedida: false,
      estado: "publicado",
    },
    {
      id: "prod-2",
      titulo: "TODO(contenido): Estructura MDF B",
      material: "MDF",
      precio: 0,
      stock: 2,
      aMedida: false,
      estado: "publicado",
    },
    {
      id: "prod-3",
      titulo: "TODO(contenido): Arco a medida C",
      material: "Madera",
      precio: 0,
      stock: 0,
      aMedida: true,
      estado: "borrador",
    },
    {
      id: "prod-4",
      titulo: "TODO(contenido): Telón D",
      material: "Telas",
      precio: 0,
      stock: 1,
      aMedida: false,
      estado: "agotado",
    },
  ];
}

// ---------------------------------------------------------------------------
// Contenido (Eventos / Testimonios / Textos del sitio)
// ---------------------------------------------------------------------------

export type BloqueContenido = {
  id: string;
  titulo: string;
  descripcion: string;
  /** Colección de Payload a la que enchufa este bloque. */
  coleccion: string;
  conteo: string;
  href: string;
};

// 🔌 GONZALO: cada bloque abre un ABM sobre su colección:
//   Eventos/Ediciones → `Events`  ·  Testimonios → `Testimonials`
//   Textos del sitio → global `Site` (home, contacto, redes)
export function getMockBloquesContenido(): BloqueContenido[] {
  return [
    {
      id: "cont-eventos",
      titulo: "Eventos / Ediciones",
      descripcion:
        "Ediciones del Summit con disertantes, sponsors y galería.",
      coleccion: "Events",
      conteo: "8 ediciones", // TODO(contenido)
      href: "/panel/contenido",
    },
    {
      id: "cont-testimonios",
      titulo: "Testimonios",
      descripcion: "Citas de alumnas: autora, ciudad y avatar.",
      coleccion: "Testimonials",
      conteo: "0 cargados", // TODO(contenido)
      href: "/panel/contenido",
    },
    {
      id: "cont-textos",
      titulo: "Textos del sitio",
      descripcion:
        "Home, contacto y redes — para que Flor los edite sin tocar código.",
      coleccion: "Site (global)",
      conteo: "Global",
      href: "/panel/contenido",
    },
  ];
}

// ---------------------------------------------------------------------------
// Ventas → Órdenes
// ---------------------------------------------------------------------------

export type Orden = {
  id: string;
  comprador: string;
  /** Total en ARS (entero). */
  total: number;
  estadoPago: EstadoPedidoPago;
  estadoEnvio: EstadoEnvio;
  /** Fecha ya formateada (es-AR). */
  fecha: string;
};

// 🔌 GONZALO: reemplazá getMockOrdenes() por la query a `Orders` (que cuelga de
// un `Contact`). IMPORTANTE: el `estadoPago` es SOLO LECTURA — lo fija el webhook
// de Mercado Pago, nunca se edita a mano. El `estadoEnvio` sí es editable acá.
export function getMockOrdenes(): Orden[] {
  return [
    {
      id: "0001",
      comprador: "TODO(contenido): Compradora 1",
      total: 0,
      estadoPago: "aprobado",
      estadoEnvio: "a-preparar",
      fecha: "28/07/2026",
    },
    {
      id: "0002",
      comprador: "TODO(contenido): Compradora 2",
      total: 0,
      estadoPago: "aprobado",
      estadoEnvio: "enviado",
      fecha: "27/07/2026",
    },
    {
      id: "0003",
      comprador: "TODO(contenido): Compradora 3",
      total: 0,
      estadoPago: "pendiente",
      estadoEnvio: "a-preparar",
      fecha: "27/07/2026",
    },
    {
      id: "0004",
      comprador: "TODO(contenido): Compradora 4",
      total: 0,
      estadoPago: "rechazado",
      estadoEnvio: "a-preparar",
      fecha: "26/07/2026",
    },
  ];
}

// ---------------------------------------------------------------------------
// Comunidad / CRM → Contactos (el CENTRO), Miembros, Inscripciones
// ---------------------------------------------------------------------------

export type OrigenContacto =
  | "compra"
  | "inscripcion"
  | "lead"
  | "miembro"
  | "newsletter";

export type Contacto = {
  id: string;
  nombre: string;
  email: string;
  tags: string[];
  origen: OrigenContacto;
  /** Consentimiento de email (opt-in). Sin esto NO entra a campañas. */
  optIn: boolean;
  /** Fecha de alta ya formateada (es-AR). */
  creado: string;
};

// 🔌 GONZALO: reemplazá getMockContactos() por la query a `Contacts` — la
// colección CENTRAL del CRM (ADR-014). Órdenes, inscripciones, membresías y leads
// se relacionan a un Contact; no guardan el email suelto. El `optIn` es requisito
// legal (Ley 25.326) para campañas: sin consentimiento con fecha/origen, no entra.
export function getMockContactos(): Contacto[] {
  return [
    {
      id: "cont-1",
      nombre: "TODO(contenido): Contacto 1",
      email: "contacto1@ejemplo.test",
      tags: ["compradora", "newsletter"],
      origen: "compra",
      optIn: true,
      creado: "20/07/2026",
    },
    {
      id: "cont-2",
      nombre: "TODO(contenido): Contacto 2",
      email: "contacto2@ejemplo.test",
      tags: ["inscripta-summit"],
      origen: "inscripcion",
      optIn: true,
      creado: "22/07/2026",
    },
    {
      id: "cont-3",
      nombre: "TODO(contenido): Contacto 3",
      email: "contacto3@ejemplo.test",
      tags: ["lead", "a-medida"],
      origen: "lead",
      optIn: false,
      creado: "25/07/2026",
    },
    {
      id: "cont-4",
      nombre: "TODO(contenido): Contacto 4",
      email: "contacto4@ejemplo.test",
      tags: ["miembro"],
      origen: "miembro",
      optIn: true,
      creado: "18/07/2026",
    },
  ];
}

// 🔌 GONZALO: reemplazá getMockContactoPorId() por payload.findByID({
// collection: "contacts", id }). La FICHA 360° cruza este Contact con sus
// Orders/EventRegistrations/Memberships/Quotes por contactId.
export function getMockContactoPorId(id: string): Contacto | undefined {
  return getMockContactos().find((c) => c.id === id);
}

export type Miembro = {
  id: string;
  contacto: string;
  plan: string;
  estado: EstadoMembresia;
  /** Fecha de alta/renovación ya formateada (es-AR). */
  desde: string;
};

// 🔌 GONZALO: reemplazá getMockMiembros() por la query a `Memberships` (cuelga
// de un `Contact`). El cobro recurrente está PENDIENTE (se define con Flor):
// por ahora el estado se gestiona a mano.
export function getMockMiembros(): Miembro[] {
  return [
    {
      id: "mem-1",
      contacto: "TODO(contenido): Contacto 4",
      plan: "TODO(contenido): Plan comunidad",
      estado: "activa",
      desde: "18/07/2026",
    },
    {
      id: "mem-2",
      contacto: "TODO(contenido): Contacto 5",
      plan: "TODO(contenido): Plan comunidad",
      estado: "vencida",
      desde: "10/05/2026",
    },
  ];
}

export type Inscripcion = {
  id: string;
  contacto: string;
  edicion: string;
  estado: "anotado" | "confirmado" | "asistio";
  /** Fecha ya formateada (es-AR). */
  fecha: string;
};

// 🔌 GONZALO: reemplazá getMockInscripciones() por la query a `EventRegistrations`
// (llega del formulario de inscripción del sitio). Cada inscripción crea/actualiza
// un `Contact` con opt-in.
export function getMockInscripciones(): Inscripcion[] {
  return [
    {
      id: "insc-1",
      contacto: "TODO(contenido): Contacto 2",
      edicion: "TODO(contenido): 8va edición",
      estado: "anotado",
      fecha: "22/07/2026",
    },
    {
      id: "insc-2",
      contacto: "TODO(contenido): Contacto 6",
      edicion: "TODO(contenido): 8va edición",
      estado: "confirmado",
      fecha: "23/07/2026",
    },
  ];
}

// ---------------------------------------------------------------------------
// Campañas → Email
// ---------------------------------------------------------------------------

export type Campana = {
  id: string;
  asunto: string;
  segmento: string;
  estado: EstadoCampana;
  enviados: number;
  /** Fecha ya formateada (es-AR) o "—" si es borrador. */
  fecha: string;
};

export const SEGMENTOS_CONTACTOS = [
  "Todos con opt-in",
  "Inscriptos al Summit",
  "Compradores del último mes",
  "Miembros activos",
] as const;

// 🔌 GONZALO: reemplazá getMockCampanas() por la query a `EmailCampaigns`. El
// envío es por la API de Resend (mismo proveedor que el transaccional) y SOLO a
// contactos con opt-in — nunca a quien no consintió (requisito legal, ADR-014).
export function getMockCampanas(): Campana[] {
  return [
    {
      id: "camp-1",
      asunto: "TODO(contenido): Bienvenida a la comunidad",
      segmento: "Miembros activos",
      estado: "enviada",
      enviados: 0,
      fecha: "24/07/2026",
    },
    {
      id: "camp-2",
      asunto: "TODO(contenido): Últimos lugares del Summit",
      segmento: "Inscriptos al Summit",
      estado: "borrador",
      enviados: 0,
      fecha: "—",
    },
  ];
}

// ---------------------------------------------------------------------------
// Consultas → Presupuestos "a medida" (Leads)
// ---------------------------------------------------------------------------

export type Lead = {
  id: string;
  contacto: string;
  detalle: string;
  producto: string;
  estado: EstadoLead;
  /** Fecha ya formateada (es-AR). */
  fecha: string;
};

// 🔌 GONZALO: reemplazá getMockLeads() por la query a `Quotes`/`Leads` (cuelga de
// un `Contact`). Cada consulta a medida del sitio entra acá: no se pierde ninguna.
export function getMockLeads(): Lead[] {
  return [
    {
      id: "lead-1",
      contacto: "TODO(contenido): Contacto 3",
      detalle: "Arco floral para casamiento (3x2 m)",
      producto: "TODO(contenido): Arco a medida C",
      estado: "nuevo",
      fecha: "25/07/2026",
    },
    {
      id: "lead-2",
      contacto: "TODO(contenido): Contacto 7",
      detalle: "Backdrop personalizado con logo",
      producto: "TODO(contenido): Telón D",
      estado: "en-curso",
      fecha: "24/07/2026",
    },
  ];
}

// ---------------------------------------------------------------------------
// Ajustes → Usuarios y roles del panel
// ---------------------------------------------------------------------------

export type Usuario = {
  id: string;
  email: string;
  rol: RolStaff;
};

// 🔌 GONZALO: reemplazá getMockUsuarios() por la query a `Users` (la auth nativa
// de Payload). Solo admin puede ver/editar esta vista. Ver skill `auth-review`.
export function getMockUsuarios(): Usuario[] {
  return [
    {
      id: "user-1",
      email: "TODO(contenido): admin@sweetflowers.test",
      rol: "admin",
    },
    {
      id: "user-2",
      email: "TODO(contenido): editora@sweetflowers.test",
      rol: "editor",
    },
  ];
}

// ---------------------------------------------------------------------------
// Usuario de sesión mock (para la topbar) — reemplazar por sesión de Payload
// ---------------------------------------------------------------------------

// 🔌 GONZALO: reemplazá esto por el usuario de la sesión de Payload (payload.auth).
export const USUARIO_SESION = {
  nombre: "Flor",
  rol: "admin" as RolStaff,
  email: "TODO(contenido): flor@sweetflowers.test",
};

// ---------------------------------------------------------------------------
// Utilidad de formato — moneda ARS (es-AR)
// ---------------------------------------------------------------------------

/** Formatea un entero en ARS. Usar en todas las vistas de precio/total. */
export function formatARS(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}
