// ============================================================================
// CONTRATO DE DOMINIO DEL PANEL — Sweet Flowers Deco Party
// ----------------------------------------------------------------------------
// Este archivo es EL CONTRATO: la FORMA (shape) exacta que la UI del panel
// espera recibir. No tiene datos ni lógica — solo tipos + un puñado de
// constantes de presentación y un util de formato de moneda.
//
// 🔌 GONZALO: cuando enchufes Payload (en lib/panel/data.ts), tus queries tienen
// que DEVOLVER estos tipos. Si el shape de Payload difiere (ej: `priceARS` vs
// `precio`, o un relation `buyer` en vez de un string `comprador`), escribís una
// función `mapX(doc): X` que traduzca del doc de Payload a ESTOS tipos. Mientras
// la firma y la forma no cambien, la UI sigue andando igual (ADR-011 / ADR-014).
//
// Modelo de datos (ver ADR-014 en docs/16_DECISIONS.md y
// colaboracion/gonzalo/02_ARQUITECTURA_BACKEND.md §6):
//   - `Contacts` es el CENTRO. Toda persona es un Contact con tags + opt-in.
//   - `Orders`, `EventRegistrations`, `Memberships`, `Quotes` CUELGAN de un Contact.
//   - `EmailCampaigns` segmenta sobre Contacts (solo opt-in).
// ============================================================================

// ---------------------------------------------------------------------------
// Uniones de estado (vocabulario compartido por chips y tablas)
// ---------------------------------------------------------------------------

/** Estado de pago de una orden. SOLO LECTURA: lo fija el webhook de Mercado Pago. */
export type EstadoPedidoPago = "pendiente" | "aprobado" | "rechazado";
/** Estado de envío de una orden. Editable desde el panel. */
export type EstadoEnvio = "a-preparar" | "enviado" | "entregado";
/** Estado de publicación de un producto del catálogo. */
export type EstadoProducto = "publicado" | "borrador" | "agotado";
/** Estado de un presupuesto "a medida" (lead). */
export type EstadoLead = "nuevo" | "en-curso" | "cotizado" | "cerrado";
/** Estado de una campaña de email. */
export type EstadoCampana = "borrador" | "enviada" | "programada";
/** Estado de una membresía. */
export type EstadoMembresia = "activa" | "vencida" | "pendiente";
/** Rol del staff del panel (auth de Payload). */
export type RolStaff = "admin" | "editor";
/** Estado de una inscripción a una edición del evento. */
export type EstadoInscripcion = "anotado" | "confirmado" | "asistio";
/** De dónde entró un contacto al CRM (para segmentar y trazar el origen). */
export type OrigenContacto =
  | "compra"
  | "inscripcion"
  | "lead"
  | "miembro"
  | "newsletter";

// ---------------------------------------------------------------------------
// Inicio / Métricas del cockpit
// ---------------------------------------------------------------------------

/** Tarjeta de KPI secundario del dashboard (superficie cálida con glifo). */
export type Kpi = {
  id: string;
  label: string;
  /** Valor ya formateado para mostrar (ej: "$ 0", "3"). */
  valor: string;
  /** Variación vs. período anterior (texto ya formateado). Opcional. */
  delta?: string;
  /** Dirección de la variación para colorear el chip. */
  tendencia?: "sube" | "baja" | "neutral";
  ayuda: string;
};

/** Una de las 3 métricas destacadas del "momento oscuro" (franja botanical). */
export type MetricaClave = {
  id: string;
  label: string;
  /** Valor ya formateado para mostrar en display grande. */
  valor: string;
  ayuda: string;
};

/** Ítem de la lista "Requiere acción" (unión de órdenes pendientes + leads nuevos). */
export type ItemAccion = {
  id: string;
  tipo: "orden" | "lead" | "inscripcion";
  titulo: string;
  detalle: string;
  /** Fecha ya formateada (es-AR) o relativo (ej: "Hace 2 h"). */
  cuando: string;
  href: string;
};

/** Ítem del feed "Actividad reciente" (altas unificadas de varias colecciones). */
export type ItemActividad = {
  id: string;
  /** Marca de tiempo/relativo ya formateado (es-AR). */
  cuando: string;
  texto: string;
  /** Rótulo corto del tipo de evento (para el chip). */
  tipo: string;
};

// ---------------------------------------------------------------------------
// Catálogo → Productos
// ---------------------------------------------------------------------------

/** Pieza del catálogo. Colección Payload: `Products`. */
export type Producto = {
  id: string;
  titulo: string;
  material: string;
  /** Precio en ARS (entero). Se formatea con `formatARS` en la vista. */
  precio: number;
  stock: number;
  aMedida: boolean;
  estado: EstadoProducto;
};

// ---------------------------------------------------------------------------
// Contenido (Eventos / Testimonios / Textos del sitio)
// ---------------------------------------------------------------------------

/** Bloque de acceso a una colección de contenido editable por Flor. */
export type BloqueContenido = {
  id: string;
  titulo: string;
  descripcion: string;
  /** Colección de Payload a la que enchufa este bloque. */
  coleccion: string;
  /** Conteo ya formateado (ej: "8 ediciones", "0 cargados", "Global"). */
  conteo: string;
  href: string;
};

/** Edición del Summit. Colección Payload: `Events`. */
export type Evento = {
  id: string;
  nombre: string;
  /** Fecha ya formateada (es-AR). */
  fecha: string;
  edicion: string;
  lugar: string;
};

/** Cita de una alumna. Colección Payload: `Testimonials`. */
export type Testimonio = {
  id: string;
  cita: string;
  autor: string;
  ciudad: string;
};

// ---------------------------------------------------------------------------
// Ventas → Órdenes
// ---------------------------------------------------------------------------

/** Compra del storefront. Colección Payload: `Orders` (cuelga de un `Contact`). */
export type Orden = {
  id: string;
  comprador: string;
  /** Total en ARS (entero). */
  total: number;
  /** SOLO LECTURA: lo fija el webhook de Mercado Pago. */
  estadoPago: EstadoPedidoPago;
  /** Editable desde el panel. */
  estadoEnvio: EstadoEnvio;
  /** Fecha ya formateada (es-AR). */
  fecha: string;
};

// ---------------------------------------------------------------------------
// Comunidad / CRM → Contactos (el CENTRO), Miembros, Inscripciones
// ---------------------------------------------------------------------------

/** Persona del CRM — el CENTRO del modelo (ADR-014). Colección: `Contacts`. */
export type Contacto = {
  id: string;
  nombre: string;
  email: string;
  tags: string[];
  origen: OrigenContacto;
  /** Consentimiento de email (opt-in). Sin esto NO entra a campañas (legal). */
  optIn: boolean;
  /** Fecha de alta ya formateada (es-AR). */
  creado: string;
};

/** Membresía de un contacto. Colección Payload: `Memberships` (cuelga de `Contact`). */
export type Miembro = {
  id: string;
  contacto: string;
  plan: string;
  estado: EstadoMembresia;
  /** Fecha de alta/renovación ya formateada (es-AR). */
  desde: string;
};

/** Inscripción a una edición. Colección Payload: `EventRegistrations`. */
export type Inscripcion = {
  id: string;
  contacto: string;
  edicion: string;
  estado: EstadoInscripcion;
  /** Fecha ya formateada (es-AR). */
  fecha: string;
};

// ---------------------------------------------------------------------------
// Campañas → Email
// ---------------------------------------------------------------------------

/** Campaña de email. Colección Payload: `EmailCampaigns` (envío por Resend). */
export type Campana = {
  id: string;
  asunto: string;
  segmento: string;
  estado: EstadoCampana;
  enviados: number;
  /** Fecha ya formateada (es-AR) o "—" si es borrador. */
  fecha: string;
};

// ---------------------------------------------------------------------------
// Consultas → Presupuestos "a medida" (Leads)
// ---------------------------------------------------------------------------

/** Presupuesto "a medida". Colección Payload: `Quotes`/`Leads` (cuelga de `Contact`). */
export type Lead = {
  id: string;
  contacto: string;
  detalle: string;
  producto: string;
  estado: EstadoLead;
  /** Fecha ya formateada (es-AR). */
  fecha: string;
};

// ---------------------------------------------------------------------------
// Ajustes → Usuarios y roles del panel
// ---------------------------------------------------------------------------

/** Staff del panel. Colección Payload: `Users` (auth nativa). */
export type Usuario = {
  id: string;
  email: string;
  rol: RolStaff;
};

/** Usuario de la sesión activa (para la topbar/sidebar). */
export type UsuarioSesion = {
  nombre: string;
  rol: RolStaff;
  email: string;
};

// ---------------------------------------------------------------------------
// Constantes de presentación (opciones de filtros/selects de la UI)
// ---------------------------------------------------------------------------
// Nota: estas son opciones de UI, no datos de negocio. Cuando Gonzalo modele
// `Categories`/`Materials` como colección, puede reemplazar `MATERIALES` por una
// query; los `SEGMENTOS_CONTACTOS` derivarán de los tags/filtros de `Contacts`.

/** Materiales disponibles para el filtro del catálogo. */
export const MATERIALES = ["Hierro", "MDF", "Madera", "Telas"] as const;

/** Segmentos de contactos disponibles al crear una campaña. */
export const SEGMENTOS_CONTACTOS = [
  "Todos con opt-in",
  "Inscriptos al Summit",
  "Compradores del último mes",
  "Miembros activos",
] as const;

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
