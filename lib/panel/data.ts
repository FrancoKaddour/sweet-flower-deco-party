// ============================================================================
// CAPA DE ACCESO A DATOS DEL PANEL — Sweet Flowers Deco Party
// ----------------------------------------------------------------------------
// 🔌 GONZALO: ESTE es el único archivo que tocás para pasar de mock a Payload.
// Regla de oro: cambiás SOLO EL CUERPO de cada función; NO cambiás su FIRMA ni la
// FORMA que devuelve (definida en lib/panel/types.ts). Si respetás eso, "borrás el
// mock, ponés Payload, y la UI sigue andando" — las páginas del panel ni se enteran.
//
// Patrón de reemplazo (Local API de Payload, sin HTTP, desde Server Components):
//
//   import { getPayload } from "payload";
//   import config from "@payload-config";
//
//   export async function getProductos(): Promise<Producto[]> {
//     const payload = await getPayload({ config });
//     const { docs } = await payload.find({ collection: "products", depth: 1 });
//     return docs.map(mapProducto); // mapProducto: traduce el doc al contrato
//   }
//
// Si el shape del doc de Payload NO coincide con el contrato (nombres de campos
// distintos, relations en vez de strings, fechas ISO sin formatear), escribís una
// función `mapX(doc): X` por colección. Los mocks de abajo son la referencia de la
// forma exacta que tiene que salir.
//
// Modelo de datos: ver ADR-014 (docs/16_DECISIONS.md) y §6 de
// colaboracion/gonzalo/02_ARQUITECTURA_BACKEND.md. `Contacts` es el centro.
// ============================================================================

import type {
  Kpi,
  MetricaClave,
  ItemAccion,
  ItemActividad,
  Producto,
  BloqueContenido,
  Evento,
  Testimonio,
  Orden,
  Contacto,
  Miembro,
  Inscripcion,
  Campana,
  Lead,
  Usuario,
  UsuarioSesion,
} from "@/lib/panel/types";

// ============================================================================
// DATOS MOCK PRIVADOS
// ----------------------------------------------------------------------------
// 🔌 GONZALO: estos arrays son andamiaje temporal — placeholders evidentes con
// `TODO(contenido)`. NO los expongas: la UI llega a ellos SOLO por las funciones
// async de más abajo. Cuando enchufes Payload, borrás estos arrays y devolvés
// `docs.map(mapX)` desde cada función. Nada de datos reales de Flor acá.
// ============================================================================

const MOCK_PRODUCTOS: Producto[] = [
  { id: "prod-1", titulo: "TODO(contenido): Pieza en hierro A", material: "Hierro", precio: 0, stock: 8, aMedida: false, estado: "publicado" },
  { id: "prod-2", titulo: "TODO(contenido): Estructura MDF B", material: "MDF", precio: 0, stock: 2, aMedida: false, estado: "publicado" },
  { id: "prod-3", titulo: "TODO(contenido): Arco a medida C", material: "Madera", precio: 0, stock: 0, aMedida: true, estado: "borrador" },
  { id: "prod-4", titulo: "TODO(contenido): Telón D", material: "Telas", precio: 0, stock: 1, aMedida: false, estado: "agotado" },
];

const MOCK_ORDENES: Orden[] = [
  { id: "0001", comprador: "TODO(contenido): Compradora 1", total: 0, estadoPago: "aprobado", estadoEnvio: "a-preparar", fecha: "28/07/2026" },
  { id: "0002", comprador: "TODO(contenido): Compradora 2", total: 0, estadoPago: "aprobado", estadoEnvio: "enviado", fecha: "27/07/2026" },
  { id: "0003", comprador: "TODO(contenido): Compradora 3", total: 0, estadoPago: "pendiente", estadoEnvio: "a-preparar", fecha: "27/07/2026" },
  { id: "0004", comprador: "TODO(contenido): Compradora 4", total: 0, estadoPago: "rechazado", estadoEnvio: "a-preparar", fecha: "26/07/2026" },
];

const MOCK_CONTACTOS: Contacto[] = [
  { id: "cont-1", nombre: "TODO(contenido): Contacto 1", email: "contacto1@ejemplo.test", tags: ["compradora", "newsletter"], origen: "compra", optIn: true, creado: "20/07/2026" },
  { id: "cont-2", nombre: "TODO(contenido): Contacto 2", email: "contacto2@ejemplo.test", tags: ["inscripta-summit"], origen: "inscripcion", optIn: true, creado: "22/07/2026" },
  { id: "cont-3", nombre: "TODO(contenido): Contacto 3", email: "contacto3@ejemplo.test", tags: ["lead", "a-medida"], origen: "lead", optIn: false, creado: "25/07/2026" },
  { id: "cont-4", nombre: "TODO(contenido): Contacto 4", email: "contacto4@ejemplo.test", tags: ["miembro"], origen: "miembro", optIn: true, creado: "18/07/2026" },
];

const MOCK_MIEMBROS: Miembro[] = [
  { id: "mem-1", contacto: "TODO(contenido): Contacto 4", plan: "TODO(contenido): Plan comunidad", estado: "activa", desde: "18/07/2026" },
  { id: "mem-2", contacto: "TODO(contenido): Contacto 5", plan: "TODO(contenido): Plan comunidad", estado: "vencida", desde: "10/05/2026" },
];

const MOCK_INSCRIPCIONES: Inscripcion[] = [
  { id: "insc-1", contacto: "TODO(contenido): Contacto 2", edicion: "TODO(contenido): 8va edición", estado: "anotado", fecha: "22/07/2026" },
  { id: "insc-2", contacto: "TODO(contenido): Contacto 6", edicion: "TODO(contenido): 8va edición", estado: "confirmado", fecha: "23/07/2026" },
];

const MOCK_CAMPANAS: Campana[] = [
  { id: "camp-1", asunto: "TODO(contenido): Bienvenida a la comunidad", segmento: "Miembros activos", estado: "enviada", enviados: 0, fecha: "24/07/2026" },
  { id: "camp-2", asunto: "TODO(contenido): Últimos lugares del Summit", segmento: "Inscriptos al Summit", estado: "borrador", enviados: 0, fecha: "—" },
];

const MOCK_LEADS: Lead[] = [
  { id: "lead-1", contacto: "TODO(contenido): Contacto 3", detalle: "Arco floral para casamiento (3x2 m)", producto: "TODO(contenido): Arco a medida C", estado: "nuevo", fecha: "25/07/2026" },
  { id: "lead-2", contacto: "TODO(contenido): Contacto 7", detalle: "Backdrop personalizado con logo", producto: "TODO(contenido): Telón D", estado: "en-curso", fecha: "24/07/2026" },
];

const MOCK_USUARIOS: Usuario[] = [
  { id: "user-1", email: "TODO(contenido): admin@sweetflowers.test", rol: "admin" },
  { id: "user-2", email: "TODO(contenido): editora@sweetflowers.test", rol: "editor" },
];

const MOCK_EVENTOS: Evento[] = [
  { id: "ev-8", nombre: "TODO(contenido): Summit 8va edición", fecha: "18/09/2026", edicion: "8va", lugar: "TODO(contenido): Sede" },
];

const MOCK_TESTIMONIOS: Testimonio[] = [];

// ============================================================================
// FUNCIONES DE ACCESO A DATOS (async, tipadas por el contrato)
// ============================================================================

// ---------------------------------------------------------------------------
// Inicio / Métricas del cockpit
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: KPIs del dashboard = agregaciones (counts/sumas) sobre VARIAS
 * colecciones. Reemplazá el cuerpo por queries con `payload.count(...)` /
 * `payload.find(...)` y armá cada Kpi con el valor ya formateado:
 *   - ventas del mes → suma de `Orders` (estadoPago aprobado) del período
 *   - órdenes a despachar → count `Orders` con estadoEnvio "a-preparar"
 *   - stock bajo → count `Products` con stock < umbral
 *   - inscripciones → count `EventRegistrations` de la próxima edición
 *   - contactos con opt-in → count `Contacts` nuevos con consentEmail = true
 *   - leads pendientes → count `Quotes` en estado "nuevo"
 * Ej: const aprobadas = await payload.find({ collection: "orders",
 *   where: { estadoPago: { equals: "aprobado" } } });
 */
export async function getKpis(): Promise<Kpi[]> {
  return [
    { id: "ventas-mes", label: "Ventas del mes", valor: "$ 0", delta: "—", tendencia: "neutral", ayuda: "Órdenes con pago aprobado en el mes en curso." },
    { id: "ordenes-abiertas", label: "Órdenes a despachar", valor: "3", delta: "+1", tendencia: "sube", ayuda: "Pagas y pendientes de preparar o enviar." },
    { id: "stock-bajo", label: "Stock bajo", valor: "2", delta: "—", tendencia: "neutral", ayuda: "Productos por debajo del umbral de reposición." },
    { id: "inscripciones", label: "Inscripciones al Summit", valor: "5", delta: "+5", tendencia: "sube", ayuda: "Anotados a la próxima edición del evento." },
    { id: "contactos-optin", label: "Contactos con opt-in", valor: "4", delta: "+2", tendencia: "sube", ayuda: "Personas nuevas que consintieron recibir email." },
    { id: "leads-pendientes", label: "Leads pendientes", valor: "2", delta: "+2", tendencia: "baja", ayuda: 'Presupuestos "a medida" sin responder.' },
  ];
}

/**
 * 🔌 GONZALO: las 3 métricas destacadas del "momento oscuro". Subconjunto curado:
 *   - ventas del mes (suma `Orders` aprobadas, formateá con formatARS)
 *   - órdenes del mes (count `Orders` del período)
 *   - a despachar (count `Orders` con estadoEnvio "a-preparar")
 */
export async function getMetricasClave(): Promise<MetricaClave[]> {
  return [
    { id: "ventas-mes", label: "Ventas del mes", valor: "$ 0", ayuda: "Órdenes con pago aprobado en julio." },
    { id: "ordenes-mes", label: "Órdenes del mes", valor: "4", ayuda: "Compras registradas en el período." },
    { id: "a-despachar", label: "A despachar", valor: "3", ayuda: "Pagas, pendientes de preparar o enviar." },
  ];
}

/**
 * 🔌 GONZALO: "Requiere acción" = unión de `Orders` con envío pendiente + `Quotes`
 * en estado "nuevo". Traé ambas colecciones, mapealas a ItemAccion (título/detalle
 * legibles, `cuando` relativo formateado, `href` a la vista que resuelve la acción)
 * y ordená por urgencia/fecha.
 */
export async function getAcciones(): Promise<ItemAccion[]> {
  return [
    { id: "acc-1", tipo: "orden", titulo: "Orden #0001 lista para despachar", detalle: "Pago aprobado · falta preparar", cuando: "Hace 2 h", href: "/panel/ventas" },
    { id: "acc-2", tipo: "lead", titulo: "Consulta a medida sin responder", detalle: "Arco floral para casamiento", cuando: "Hace 5 h", href: "/panel/consultas" },
    { id: "acc-3", tipo: "inscripcion", titulo: "Nueva inscripción al Summit", detalle: "Llegó del formulario del sitio", cuando: "Ayer", href: "/panel/contactos" },
  ];
}

/**
 * 🔌 GONZALO: feed "Actividad reciente" = últimas altas unificadas de `Contacts`,
 * `EventRegistrations`, `Orders` y `Quotes`, ordenadas por createdAt descendente.
 * Traé cada colección con `limit` chico + `sort: "-createdAt"`, mapealas a
 * ItemActividad (texto + tipo + `cuando` formateado) y hacé merge por fecha.
 */
export async function getActividad(): Promise<ItemActividad[]> {
  return [
    { id: "act-1", cuando: "Hace 2 h", texto: "Nuevo contacto desde el formulario del sitio", tipo: "Contacto" },
    { id: "act-2", cuando: "Hace 5 h", texto: "Inscripción al Summit con opt-in", tipo: "Inscripción" },
    { id: "act-3", cuando: "Ayer", texto: "Orden #0002 marcada como enviada", tipo: "Orden" },
    { id: "act-4", cuando: "Ayer", texto: "Consulta a medida sin responder", tipo: "Consulta" },
  ];
}

// ---------------------------------------------------------------------------
// Catálogo → Productos
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `Products`. Campos: title→titulo, material, priceARS→precio,
 * stock, isCustomOrder→aMedida, status→estado. Aplicá búsqueda/filtro por material
 * del lado del server (parámetro `where`).
 * Ej: const { docs } = await payload.find({ collection: "products", depth: 1 });
 *     return docs.map(mapProducto);
 * mapProducto(doc): Producto → traduce priceARS a `precio`, el flag a `aMedida`, etc.
 */
export async function getProductos(): Promise<Producto[]> {
  return MOCK_PRODUCTOS;
}

/**
 * 🔌 GONZALO: un producto por id. Ej:
 *   const doc = await payload.findByID({ collection: "products", id });
 *   return doc ? mapProducto(doc) : undefined;
 */
export async function getProductoPorId(id: string): Promise<Producto | undefined> {
  return MOCK_PRODUCTOS.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Contenido (Eventos / Testimonios / Textos del sitio)
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `Events`. Campos: name→nombre, date→fecha (formateá es-AR),
 * edition→edicion, location→lugar. Ordená por fecha desc.
 *   const { docs } = await payload.find({ collection: "events", sort: "-date" });
 *   return docs.map(mapEvento);
 */
export async function getEventos(): Promise<Evento[]> {
  return MOCK_EVENTOS;
}

/**
 * 🔌 GONZALO: colección `Testimonials`. Campos: quote→cita, authorName→autor,
 * city→ciudad.
 *   const { docs } = await payload.find({ collection: "testimonials" });
 *   return docs.map(mapTestimonio);
 */
export async function getTestimonios(): Promise<Testimonio[]> {
  return MOCK_TESTIMONIOS;
}

/**
 * 🔌 GONZALO: bloques de acceso a contenido. Cada card enchufa a su colección y
 * muestra un conteo real. Reemplazá los conteos hardcodeados por:
 *   - Eventos → `(await payload.count({ collection: "events" })).totalDocs`
 *   - Testimonios → count de `Testimonials`
 *   - Textos del sitio → global `Site` (no lleva conteo, es "Global")
 * Este cuerpo YA deriva los conteos de getEventos()/getTestimonios() para que veas
 * el patrón: cuando enchufes Payload, esas dos funciones cambian y esto sigue igual.
 */
export async function getBloquesContenido(): Promise<BloqueContenido[]> {
  const [eventos, testimonios] = await Promise.all([getEventos(), getTestimonios()]);
  return [
    {
      id: "cont-eventos",
      titulo: "Eventos / Ediciones",
      descripcion: "Ediciones del Summit con disertantes, sponsors y galería.",
      coleccion: "Events",
      conteo: `${eventos.length} ${eventos.length === 1 ? "edición" : "ediciones"}`,
      href: "/panel/contenido",
    },
    {
      id: "cont-testimonios",
      titulo: "Testimonios",
      descripcion: "Citas de alumnas: autora, ciudad y avatar.",
      coleccion: "Testimonials",
      conteo: `${testimonios.length} cargados`,
      href: "/panel/contenido",
    },
    {
      id: "cont-textos",
      titulo: "Textos del sitio",
      descripcion: "Home, contacto y redes — para que Flor los edite sin tocar código.",
      coleccion: "Site (global)",
      conteo: "Global",
      href: "/panel/contenido",
    },
  ];
}

// ---------------------------------------------------------------------------
// Ventas → Órdenes
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `Orders` (cuelga de un `Contact` vía `buyer`). Campos:
 * total, estadoPago (SOLO LECTURA — lo fija el webhook de Mercado Pago), estadoEnvio
 * (editable), buyer→comprador (resolvé el nombre del Contact relacionado con depth),
 * createdAt→fecha (formateá es-AR).
 *   const { docs } = await payload.find({ collection: "orders", depth: 1, sort: "-createdAt" });
 *   return docs.map(mapOrden); // mapOrden lee doc.buyer.nombre, formatea la fecha, etc.
 */
export async function getOrdenes(): Promise<Orden[]> {
  return MOCK_ORDENES;
}

/**
 * 🔌 GONZALO: las últimas N órdenes por fecha para la mini-lista del dashboard.
 *   const { docs } = await payload.find({ collection: "orders", depth: 1,
 *     sort: "-createdAt", limit: n });
 *   return docs.map(mapOrden);
 */
export async function getUltimasOrdenes(n = 3): Promise<Orden[]> {
  const ordenes = await getOrdenes();
  return ordenes.slice(0, n);
}

// ---------------------------------------------------------------------------
// Comunidad / CRM → Contactos (el CENTRO), Miembros, Inscripciones
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `Contacts` — el CENTRO del CRM (ADR-014). Campos:
 * name→nombre, email, tags, source→origen, consentEmail→optIn (bool), createdAt→creado.
 * Órdenes/inscripciones/membresías/leads se RELACIONAN a un Contact; no guardan el
 * email suelto. El `optIn` es requisito legal (Ley 25.326) para campañas.
 *   const { docs } = await payload.find({ collection: "contacts", sort: "-createdAt" });
 *   return docs.map(mapContacto);
 */
export async function getContactos(): Promise<Contacto[]> {
  return MOCK_CONTACTOS;
}

/**
 * 🔌 GONZALO: un contacto por id — base de la FICHA 360°. Cruzá este Contact con sus
 * `Orders`/`EventRegistrations`/`Memberships`/`Quotes` (por contactId) para el historial.
 *   const doc = await payload.findByID({ collection: "contacts", id });
 *   return doc ? mapContacto(doc) : undefined;
 */
export async function getContactoPorId(id: string): Promise<Contacto | undefined> {
  const contactos = await getContactos();
  return contactos.find((c) => c.id === id);
}

/**
 * 🔌 GONZALO: colección `Memberships` (cuelga de un `Contact`). Campos:
 * contact→contacto (resolvé el nombre con depth), plan, status→estado,
 * startedAt→desde (formateá es-AR). El cobro recurrente está PENDIENTE (ADR-014).
 *   const { docs } = await payload.find({ collection: "memberships", depth: 1 });
 *   return docs.map(mapMiembro);
 */
export async function getMiembros(): Promise<Miembro[]> {
  return MOCK_MIEMBROS;
}

/**
 * 🔌 GONZALO: colección `EventRegistrations` (llega del formulario del sitio). Campos:
 * contact→contacto, event→edicion, status→estado, createdAt→fecha (es-AR). Cada
 * inscripción crea/actualiza un `Contact` con opt-in.
 *   const { docs } = await payload.find({ collection: "event-registrations", depth: 1 });
 *   return docs.map(mapInscripcion);
 */
export async function getInscripciones(): Promise<Inscripcion[]> {
  return MOCK_INSCRIPCIONES;
}

// ---------------------------------------------------------------------------
// Campañas → Email
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `EmailCampaigns`. Campos: subject→asunto, segment→segmento,
 * status→estado, stats.enviados→enviados, sentAt→fecha ("—" si borrador). El envío
 * real es por la API de Resend y SOLO a contactos con opt-in del segmento (legal).
 *   const { docs } = await payload.find({ collection: "email-campaigns", sort: "-sentAt" });
 *   return docs.map(mapCampana);
 */
export async function getCampanas(): Promise<Campana[]> {
  return MOCK_CAMPANAS;
}

// ---------------------------------------------------------------------------
// Consultas → Presupuestos "a medida" (Leads)
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `Quotes`/`Leads` (cuelga de un `Contact`). Campos:
 * contact→contacto, detalle, producto (relación a `Products`)→producto, estado,
 * createdAt→fecha (es-AR). Cada consulta a medida del sitio entra acá: no se pierde ninguna.
 *   const { docs } = await payload.find({ collection: "quotes", depth: 1, sort: "-createdAt" });
 *   return docs.map(mapLead);
 */
export async function getLeads(): Promise<Lead[]> {
  return MOCK_LEADS;
}

// ---------------------------------------------------------------------------
// Ajustes → Usuarios y sesión
// ---------------------------------------------------------------------------

/**
 * 🔌 GONZALO: colección `Users` (auth nativa de Payload). Campos: email, rol.
 * Esta vista es SOLO para admin: protegela por rol (ver skill auth-review).
 *   const { docs } = await payload.find({ collection: "users" });
 *   return docs.map(mapUsuario);
 */
export async function getUsuarios(): Promise<Usuario[]> {
  return MOCK_USUARIOS;
}

/**
 * 🔌 GONZALO: usuario de la sesión activa (para topbar/sidebar). Reemplazá por
 * `payload.auth({ headers })` y devolvé el user logueado mapeado a UsuarioSesion.
 *   const { user } = await payload.auth({ headers: await headers() });
 *   return { nombre: user.name, rol: user.rol, email: user.email };
 */
export async function getUsuarioSesion(): Promise<UsuarioSesion> {
  return {
    nombre: "Flor",
    rol: "admin",
    email: "TODO(contenido): flor@sweetflowers.test",
  };
}
