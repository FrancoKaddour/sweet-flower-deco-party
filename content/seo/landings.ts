// LANDINGS SEO — páginas por intención de búsqueda ("arcos para eventos",
// "estanterías para mesa dulce"…) y por zona ("estructuras para eventos en
// Córdoba"). Cada una se publica en /<slug> (app/(site)/[landing]/page.tsx),
// entra sola al sitemap, al llms.txt y al bloque de links del footer.
//
// REGLAS (para no caer en "doorway pages", que Google castiga):
//  · Cada landing tiene texto PROPIO y útil (no copiar y cambiar una palabra).
//  · Solo datos reales del negocio (lib/site.ts, content/evento.ts, catálogo).
//  · Los productos se toman del catálogo real con un filtro (productos.re).
//
// CÓMO AGREGAR UNA: copiá un bloque, cambiá el slug (en español, con guiones,
// sin tildes) y escribí el contenido. Para una zona nueva: grupo "zonas" y
// contá algo concreto de esa zona (un workshop, cómo llega el envío, etc.).

export type GrupoLanding = "productos" | "ocasiones" | "formacion" | "zonas";

export type Landing = {
  slug: string;
  grupo: GrupoLanding;
  /** Texto del link (footer, relacionadas). Corto. */
  link: string;
  /** <title> sin la marca (la plantilla agrega "· Sweet Flowers Deco Party"). ≤ 55 caracteres. */
  title: string;
  /** Meta description: 130–155 caracteres, con la intención y un dato concreto. */
  description: string;
  eyebrow: string;
  h1: string;
  /** Bajada del hero: la respuesta directa a la búsqueda (la que citan las IAs). */
  lead: string;
  imagen: { src: string; alt: string };
  /** Bloques de contenido propio. */
  secciones: readonly { h2: string; p: readonly string[] }[];
  /** "Para qué sirve" — usos concretos. */
  usos?: readonly { titulo: string; desc: string }[];
  /** Productos reales del catálogo que se muestran (filtro por nombre/categoría). */
  productos?: { cats?: readonly string[]; re?: string; excluir?: string; max?: number; titulo: string };
  /** Link al listado completo. */
  verMas?: { href: string; label: string };
  faqs: readonly { q: string; a: string }[];
  relacionadas: readonly string[];
  /** Línea de WhatsApp: ventas (productos) o capacitaciones (Summit). */
  linea: "ventas" | "capacitaciones";
  /** Mensaje precargado de WhatsApp. */
  mensaje: string;
  /** Bloque especial con datos del Summit: pases y precios, o la trayectoria de workshops. */
  bloque?: "pases" | "trayectoria";
};

const COLORES = "blanco, negro, dorado, plateado o rosa gold";

export const LANDINGS: readonly Landing[] = [
  /* ───────────────────────────── PRODUCTOS ───────────────────────────── */
  {
    slug: "estructuras-de-hierro-para-eventos",
    grupo: "productos",
    link: "Estructuras de hierro",
    title: "Estructuras de hierro para eventos",
    description:
      "Estructuras de hierro para decorar eventos: arcos, arcadas, aros, columnas, mesas y sillones. Fabricación propia en Tortuguitas y envíos a todo el país.",
    eyebrow: "Fabricación propia · Hierro",
    h1: "Estructuras de hierro para eventos",
    lead:
      "Fabricamos estructuras de hierro para decoradores, ambientadores y organizadores de eventos: arcos extensibles, arcadas, aros, columnas, mesas y sillones. Se piden por encargo en " +
      COLORES +
      ", y las enviamos a todo el país.",
    imagen: { src: "/productos/arco-extensible-esencial.jpg", alt: "Arco extensible de hierro Esencial de Sweet Flowers" },
    secciones: [
      {
        h2: "Por qué hierro",
        p: [
          "El hierro es el material con el que hoy trabajamos casi toda la línea de ambientación: aguanta armado y desarmado evento tras evento, se pinta en el color que pide cada propuesta y no se deforma con el uso. Muchas piezas son desarmables, así entran en un auto y se arman en el salón.",
          "Cada estructura sale de nuestro taller en Tortuguitas. No revendemos: si necesitás una medida distinta, la cotizamos y la hacemos.",
        ],
      },
      {
        h2: "Cómo se pide",
        p: [
          "Elegís las piezas del catálogo (o nos contás la que imaginás), las sumás al pedido y nos lo mandás por WhatsApp. Te confirmamos precio, color y fecha. La producción es por encargo y lleva alrededor de 20 días; las piezas a medida pueden llevar más según la complejidad.",
        ],
      },
    ],
    usos: [
      { titulo: "Fondos y backdrops", desc: "Arcadas, aros y paneles con malla para vestir con telas, flores o globos." },
      { titulo: "Entradas", desc: "Arcos de bienvenida, entradas estrella y estructuras para cartel." },
      { titulo: "Mesas principales", desc: "Mesas de hierro, cilindros y combos para la mesa dulce o la torta." },
      { titulo: "Rincón de fotos", desc: "Sillones, lunas y cabinas para el espacio que todos quieren fotografiar." },
    ],
    productos: { cats: ["hierro"], max: 8, titulo: "Algunas estructuras del catálogo" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿En qué colores vienen las estructuras de hierro?",
        a: `Se piden en ${COLORES}. El color se elige al hacer el pedido.`,
      },
      {
        q: "¿Las estructuras son desarmables?",
        a: "Muchas sí (arcadas, aros, hexágonos, sillones y más): lo indicamos en la descripción de cada pieza. Si necesitás que una sea desarmable para transportarla, consultanos.",
      },
      {
        q: "¿Hacen estructuras de hierro a medida?",
        a: "Sí. Se cotizan por WhatsApp. La demora es la misma que la de un producto de catálogo (alrededor de 20 días), salvo que la pieza sea muy específica.",
      },
    ],
    relacionadas: ["arcos-para-eventos", "arcadas-para-eventos", "aros-de-hierro-para-decoracion", "sillones-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por estructuras de hierro para eventos.",
  },
  {
    slug: "arcos-para-eventos",
    grupo: "productos",
    link: "Arcos para eventos",
    title: "Arcos para eventos y decoración con globos",
    description:
      "Arcos de hierro extensibles para eventos: para globos, flores, telas o cortina de luces. Base pesada, soporte opcional y envíos a todo el país.",
    eyebrow: "Hierro · Lo más vendido",
    h1: "Arcos para eventos",
    lead:
      "Los arcos extensibles son de lo que más vendemos: estructuras de hierro con base pesada que se estiran en ancho (y en alto con soporte) para armar entradas, fondos y arcos de globos, flores o luces.",
    imagen: { src: "/productos/arco-extensible-esencial.jpg", alt: "Arco extensible de hierro para decoración de eventos" },
    secciones: [
      {
        h2: "Un arco que se adapta al salón",
        p: [
          "La ventaja de un arco extensible es que no tenés que tener uno por cada medida: el Esencial, por ejemplo, mide 2,10 m de alto por 1,50 m de ancho y se extiende hasta 3 m. Con el soporte opcional le sumás altura, hasta 3 o 4 metros.",
          "También hay versiones de doble barral, con soporte y base pesada de 3×4, y un arco pensado para colgar cortina de luces.",
        ],
      },
      {
        h2: "Qué podés armar",
        p: [
          "Arcos de globos orgánicos, guirnaldas de flores, telas drapeadas o cortinas de luces para una entrada. Como son de hierro, aguantan el peso y vuelven a usarse en el próximo evento.",
        ],
      },
    ],
    usos: [
      { titulo: "Arco de globos", desc: "La base pesada mantiene el arco firme con la carga de globos." },
      { titulo: "Entrada de salón", desc: "Extendido al ancho de la puerta, enmarca la llegada." },
      { titulo: "Cortina de luces", desc: "Un arco específico para colgar luces y armar el fondo." },
    ],
    productos: { re: "^arco\\b|extensible", max: 8, titulo: "Arcos del catálogo" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Cuánto mide un arco extensible?",
        a: "Depende del modelo. El arco extensible Esencial mide 2,10 m de alto por 1,50 m de ancho y se extiende hasta 3 m; con soporte opcional se le agrega altura hasta 3 o 4 m. Cada modelo tiene sus medidas en el catálogo.",
      },
      {
        q: "¿Sirven para arcos de globos?",
        a: "Sí, es uno de sus usos más comunes. Tienen base pesada para que el arco quede firme con los globos, las flores o las telas.",
      },
      {
        q: "¿En qué colores vienen?",
        a: `En ${COLORES}, según el modelo.`,
      },
    ],
    relacionadas: ["aros-de-hierro-para-decoracion", "arcadas-para-eventos", "estructuras-para-bodas", "estructuras-de-hierro-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por los arcos extensibles.",
  },
  {
    slug: "arcadas-para-eventos",
    grupo: "productos",
    link: "Arcadas y paneles",
    title: "Arcadas y paneles para decoración de eventos",
    description:
      "Arcadas de hierro, semiarcadas, arcadas romanas y paneles para fondos de eventos. Con fundas sublimadas a medida y envíos a todo el país.",
    eyebrow: "Hierro · Fondos",
    h1: "Arcadas y paneles para eventos",
    lead:
      "Las arcadas son la base de casi cualquier fondo de mesa: paneles de hierro con forma de arco que se visten con fundas sublimadas, telas o flores. Las hacemos lisas, rectas, en combo de tres y en versiones grandes como la Arcada Romana.",
    imagen: { src: "/productos/arcada-romana.jpg", alt: "Arcada Romana de hierro para fondos de eventos" },
    secciones: [
      {
        h2: "Arcada, semiarcada y combo",
        p: [
          "El combo clásico es una arcada al centro y dos semiarcadas a los costados: arma un fondo con profundidad sin ocupar demasiado. Muchas son desarmables y tienen su funda con elástico hecha a medida, así cambiás el estilo del evento sin cambiar la estructura.",
        ],
      },
      {
        h2: "Fundas que calzan justo",
        p: [
          "Para cada arcada de hierro hay una funda sublimada con elástico que entra justa (95×2 m, semiarcadas, arcadas rectas). Se piden juntas o por separado.",
        ],
      },
    ],
    productos: { re: "arcada|panel con malla", max: 8, titulo: "Arcadas del catálogo" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Qué es una semiarcada?",
        a: "Es un panel con media curva que se usa al costado de una arcada para armar el fondo en tres planos. Se vende sola o en combo.",
      },
      {
        q: "¿Las arcadas tienen funda?",
        a: "Sí: hay fundas sublimadas con elástico para arcadas y semiarcadas de hierro (y de pino). Se piden aparte o junto con la estructura.",
      },
      {
        q: "¿Hacen arcadas de otras medidas?",
        a: "Sí, las piezas a medida se cotizan por WhatsApp.",
      },
    ],
    relacionadas: ["fundas-y-telas-sublimadas", "estructuras-de-hierro-para-eventos", "arcos-para-eventos", "mesas-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por arcadas y paneles.",
  },
  {
    slug: "aros-de-hierro-para-decoracion",
    grupo: "productos",
    link: "Aros de hierro",
    title: "Aros de hierro para decoración y globos",
    description:
      "Aros de hierro de 2 m de alto en 1,20, 1,50 o 2 m de diámetro, color a elección, con fundas sublimadas a medida. Envíos a todo el país.",
    eyebrow: "Hierro · Fondos circulares",
    h1: "Aros de hierro para decoración",
    lead:
      "El aro es el fondo circular más pedido para mesas dulces, cumpleaños y bodas. Lo hacemos de 2 m de alto y en tres diámetros (1,20, 1,50 y 2 m), en el color que elijas, y también a la medida que necesites.",
    imagen: { src: "/productos/aro-de-hierro-1-20-1-50-2-00.jpg", alt: "Aro de hierro para decoración de eventos" },
    secciones: [
      {
        h2: "Desnudo, con funda o con globos",
        p: [
          "El mismo aro sirve para tres estilos: desnudo con flores o follaje, vestido con una funda sublimada con elástico (hay para 1,20, 1,50 y 2 m) o como base para un arco de globos.",
          "Para cumpleaños temáticos está el Aro Mickey, con las orejas incluidas.",
        ],
      },
    ],
    productos: { re: "\\baro\\b", max: 8, titulo: "Aros y fundas" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Qué medidas tienen los aros?",
        a: "Son de 2 m de alto; lo que cambia es el diámetro: 1,20, 1,50 o 2 m. También se hacen a medida.",
      },
      {
        q: "¿Venden la funda del aro?",
        a: "Sí, hay fundas sublimadas con elástico para aros de 1,20, 1,50 y 2 m de diámetro.",
      },
    ],
    relacionadas: ["fundas-y-telas-sublimadas", "arcos-para-eventos", "decoracion-de-cumpleanos-infantiles", "estructuras-para-15-anos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por aros de hierro.",
  },
  {
    slug: "exhibidores-para-catering",
    grupo: "productos",
    link: "Exhibidores para catering",
    title: "Exhibidores para catering y mesas dulces",
    description:
      "Exhibidores de hierro para catering: estanterías, alzadas, torres de cupcakes y bandejas para mesas dulces, finger food y coffee breaks. Envíos a todo el país.",
    eyebrow: "Catering · Lo que más sale",
    h1: "Exhibidores para catering",
    lead:
      "Fabricamos exhibidores para presentar comida en eventos: estanterías, alzadas, torres de cupcakes, bases y bandejas para mesas dulces, finger food, coffee breaks y estaciones gourmet. Es la línea que más se mueve hoy.",
    imagen: { src: "/productos/estanteria-eclipse.jpg", alt: "Estantería Eclipse de hierro, exhibidor para catering" },
    secciones: [
      {
        h2: "Para pasteleras, caterings y decoradoras",
        p: [
          "Un buen exhibidor ordena la mesa, le da alturas y hace que la comida se vea como merece. Los nuestros son de hierro (algunos con bandejas o estantes de madera) y se piden en el color de la propuesta.",
          "Las más elegidas son la Estantería Eclipse y la Arcoíris, pero hay estanterías, alzadas y torres para cada tamaño de mesa.",
        ],
      },
      {
        h2: "Con o sin madera",
        p: [
          "Muchos modelos se venden solo con el armazón o con las maderas incluidas: si ya tenés bandejas o tapas, pedís el armazón y ahorrás. Lo aclaramos en cada producto.",
        ],
      },
    ],
    usos: [
      { titulo: "Mesa dulce", desc: "Estanterías y alzadas para tortas, cookies y shots." },
      { titulo: "Finger food", desc: "Torres y exhibidores con bandejas para bocados salados." },
      { titulo: "Coffee break", desc: "Estaciones compactas para eventos corporativos." },
    ],
    productos: { cats: ["catering"], max: 8, titulo: "Exhibidores del catálogo" },
    verMas: { href: "/productos/catering", label: "Ver todo el catering" },
    faqs: [
      {
        q: "¿Los exhibidores vienen con las bandejas de madera?",
        a: "Depende del modelo: muchos se venden solo armazón o con maderas, con precios distintos. Cada producto lo detalla.",
      },
      {
        q: "¿Qué exhibidor conviene para una mesa dulce chica?",
        a: "Para mesas chicas funcionan las alzadas y las estanterías de 45 a 60 cm (como la Eclipse o la Star). Escribinos con la medida de tu mesa y te recomendamos.",
      },
      {
        q: "¿Se pueden pedir en color?",
        a: `Sí, en ${COLORES}.`,
      },
    ],
    relacionadas: ["estanterias-para-mesa-dulce", "alzadas-para-tortas", "torres-de-cupcakes", "mesas-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por exhibidores para catering.",
  },
  {
    slug: "estanterias-para-mesa-dulce",
    grupo: "productos",
    link: "Estanterías para mesa dulce",
    title: "Estanterías para mesa dulce y catering",
    description:
      "Estanterías de hierro para mesa dulce: Eclipse, Star, Sweet, Cápsula y S, de 45 cm a XL, con o sin estantes de madera. Envíos a todo el país.",
    eyebrow: "Catering · Estanterías",
    h1: "Estanterías para mesa dulce",
    lead:
      "Una estantería le da altura a la mesa dulce y deja ver todo de un vistazo. Las nuestras son de hierro, con forma propia (Eclipse, Star, Sweet, Cápsula, S) y se piden solo con el armazón o con los estantes de madera.",
    imagen: { src: "/productos/estanteria-eclipse.jpg", alt: "Estantería Eclipse para mesa dulce" },
    secciones: [
      {
        h2: "Una forma para cada propuesta",
        p: [
          "La Eclipse es circular (45 o 60 cm de diámetro) y es de las más vendidas. La Star y la Sweet miden alrededor de 60 cm; la Cápsula y la S tienen versión de 60 cm y XL para mesas grandes.",
          "Todas se piden en el color del evento, así la estantería acompaña la paleta en vez de competir con ella.",
        ],
      },
    ],
    productos: { re: "estanteria|eclipse", max: 8, titulo: "Estanterías del catálogo" },
    verMas: { href: "/productos/catering", label: "Ver todo el catering" },
    faqs: [
      {
        q: "¿Qué medidas tienen las estanterías?",
        a: "La Eclipse viene de 45 y 60 cm de diámetro (y XL de 1 m × 58 cm); Star, Sweet, Cápsula y S rondan los 60 cm, y Cápsula y S tienen versión XL.",
      },
      {
        q: "¿Incluyen los estantes?",
        a: "Se pueden pedir solo armazón o con estantes de madera. El precio de cada opción figura en el producto.",
      },
    ],
    relacionadas: ["exhibidores-para-catering", "alzadas-para-tortas", "torres-de-cupcakes", "proveedor-para-decoradores"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por estanterías para mesa dulce.",
  },
  {
    slug: "alzadas-para-tortas",
    grupo: "productos",
    link: "Alzadas para tortas",
    title: "Alzadas para tortas y bases de mesa dulce",
    description:
      "Alzadas para tortas de hierro y MDF, posa tortas, separadores y bases de 3 o 4 pisos. Colores a elección y envíos a todo el país.",
    eyebrow: "Catering · Alzadas",
    h1: "Alzadas para tortas",
    lead:
      "Las alzadas levantan la torta y los dulces para que la mesa tenga distintas alturas. Hacemos alzadas de hierro (con o sin tapa de madera), de MDF en varios diámetros, posa tortas, separadores de torta y bases de varios pisos.",
    imagen: { src: "/productos/alzada-corona.jpg", alt: "Alzada Corona de hierro para tortas" },
    secciones: [
      {
        h2: "Hierro o MDF",
        p: [
          "Las de hierro (Corona, 16 lazos, con pie para un plato, combo de 3) son las que dan más presencia y vienen en " +
            COLORES +
            ". Las de MDF son una opción económica: se piden por diámetro, de 10 a 25 cm, en el color que elijas.",
        ],
      },
      {
        h2: "Armá la escalera de la mesa",
        p: [
          "Un truco de las decoradoras: combinar tres alturas (un combo de alzadas o una torre que se separa) para que la vista recorra la mesa de punta a punta.",
        ],
      },
    ],
    productos: { re: "alzada|posa torta|separador|bases de 3", max: 8, titulo: "Alzadas del catálogo" },
    verMas: { href: "/productos/catering", label: "Ver todo el catering" },
    faqs: [
      {
        q: "¿Qué diámetros tienen las alzadas de MDF?",
        a: "Se hacen de 10, 15, 20 y 25 cm de diámetro, en el color que elijas.",
      },
      {
        q: "¿Venden alzadas en combo?",
        a: "Sí: hay combo de 3 alzadas de hierro (16, 13 y 10 cm de alto) y combo de alzadas Escandinavas.",
      },
    ],
    relacionadas: ["torres-de-cupcakes", "estanterias-para-mesa-dulce", "exhibidores-para-catering", "mesas-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por alzadas para tortas.",
  },
  {
    slug: "torres-de-cupcakes",
    grupo: "productos",
    link: "Torres de cupcakes",
    title: "Torres de cupcakes y exhibidores altos",
    description:
      "Torres de cupcakes desarmables que también se usan como alzadas, torres hexagonales y exhibidores altos como la Torre Eiffel o la Verona. Envíos a todo el país.",
    eyebrow: "Catering · Torres",
    h1: "Torres de cupcakes",
    lead:
      "Una torre de cupcakes resuelve mucho en poco espacio. La más pedida es la 2 en 1: se usa como torre o se separa y quedan alzadas para tortas. Para mesas grandes hay torres altas de hierro, como la Torre Eiffel (de 1,50 a 2 m).",
    imagen: { src: "/productos/torre-cupcakes-o-alzadas-2-en-1.jpg", alt: "Torre de cupcakes desarmable 2 en 1" },
    secciones: [
      {
        h2: "Dos usos, una pieza",
        p: [
          "Las torres hexagonales y la 2 en 1 son desarmables: armadas son una torre de cupcakes; separadas, alzadas para tortas o dulces. Para quien decora seguido, es la pieza que más rinde.",
          "La Torre Nativa (60 cm, con bandejas de madera) está pensada para finger food, coffee breaks y estaciones gourmet.",
        ],
      },
    ],
    productos: { re: "torre|orbita|prisma", max: 8, titulo: "Torres del catálogo" },
    verMas: { href: "/productos/catering", label: "Ver todo el catering" },
    faqs: [
      {
        q: "¿La torre de cupcakes se desarma?",
        a: "Sí, la 2 en 1 y la hexagonal se desarman: las podés usar como torre o como alzadas sueltas.",
      },
      {
        q: "¿Tienen torres para salado?",
        a: "Sí, la Torre Nativa de 60 cm, con bandejas de madera, está pensada para finger food y coffee breaks.",
      },
    ],
    relacionadas: ["alzadas-para-tortas", "exhibidores-para-catering", "estanterias-para-mesa-dulce", "eventos-corporativos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por torres de cupcakes.",
  },
  {
    slug: "mesas-para-eventos",
    grupo: "productos",
    link: "Mesas y cilindros",
    title: "Mesas y cilindros para mesa dulce y eventos",
    description:
      "Mesas de hierro, cilindros encastrables, mesas cubo y combos para armar la mesa principal de un evento. Con fundas a medida y envíos a todo el país.",
    eyebrow: "Mobiliario · Mesas",
    h1: "Mesas y cilindros para eventos",
    lead:
      "La mesa principal se arma con alturas: combos de tres cilindros encastrables, mesas de hierro con formas (S, copa, diamante, octogonal, hexagonal) y mesas cubo. Muchas tienen su funda sublimada a medida.",
    imagen: { src: "/productos/combo-x-3-mesas-cilindro-con-varillas.jpg", alt: "Combo de tres mesas cilindro de hierro con varillas" },
    secciones: [
      {
        h2: "El combo de tres",
        p: [
          "El combo de cilindros en tres medidas (50×75, 40×65 y 30×55 cm) es la base de muchísimas mesas dulces: escalonado, ocupa poco y se viste con fundas. Hay versión tradicional encastrable, con malla y XL.",
        ],
      },
      {
        h2: "Hierro, pino o MDF",
        p: [
          "Además de las mesas de hierro, hay mesas de pino y de MDF con formas temáticas. Se piden solo armazón o con tapas de madera, según el modelo.",
        ],
      },
    ],
    productos: { re: "mesa|cilindro", excluir: "funda", max: 8, titulo: "Mesas del catálogo" },
    verMas: { href: "/productos", label: "Ver el catálogo" },
    faqs: [
      {
        q: "¿Qué medidas tiene el combo de cilindros?",
        a: "El tradicional viene en 50×75, 40×65 y 30×55 cm (diámetro × alto). El XL, en 60×100, 50×90 y 40×80 cm.",
      },
      {
        q: "¿Hay fundas para los cilindros?",
        a: "Sí, fundas sublimadas con elástico para el combo tradicional y para el XL.",
      },
    ],
    relacionadas: ["fundas-y-telas-sublimadas", "exhibidores-para-catering", "arcadas-para-eventos", "estructuras-de-hierro-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por mesas y cilindros.",
  },
  {
    slug: "fundas-y-telas-sublimadas",
    grupo: "productos",
    link: "Fundas y telas sublimadas",
    title: "Fundas y telas sublimadas para estructuras",
    description:
      "Fundas sublimadas con elástico para aros, arcadas, cilindros y mesas, telas rectangulares y pisos de cordura por metro. Envíos a todo el país.",
    eyebrow: "Textiles · Salen todas las semanas",
    h1: "Fundas y telas sublimadas",
    lead:
      "Las fundas cambian una estructura en minutos: son sublimadas, con elástico y hechas a la medida de cada aro, arcada, cilindro o mesa. También hacemos telas rectangulares y pisos de cordura sublimados por metro.",
    imagen: { src: "/productos/funda-aro-2m.jpg", alt: "Funda sublimada con elástico para aro de 2 metros" },
    secciones: [
      {
        h2: "Una estructura, muchos eventos",
        p: [
          "Con la misma arcada y tres fundas distintas tenés tres propuestas. Por eso las fundas y las telas salen todas las semanas: son la forma más rápida de renovar un fondo sin comprar estructura nueva.",
        ],
      },
      {
        h2: "Pisos de cordura",
        p: [
          "Los pisos sublimados se venden por metro, en 1×1,40 m y múltiplos, y se pueden pedir de la medida que necesites para el espacio de la mesa o del rincón de fotos.",
        ],
      },
    ],
    productos: { cats: ["fundas-y-telas"], max: 8, titulo: "Fundas y telas del catálogo" },
    verMas: { href: "/productos/fundas-y-telas", label: "Ver todas las fundas" },
    faqs: [
      {
        q: "¿Las fundas sirven para estructuras de otra marca?",
        a: "Las hacemos a la medida de nuestras estructuras. Si tu estructura tiene otra medida, pasanos las medidas exactas y lo consultamos.",
      },
      {
        q: "¿Cómo se venden los pisos de cordura?",
        a: "Por metro: 1×1,40 m, 2×1,40 m, 3×1,40 m y otras medidas a pedido.",
      },
    ],
    relacionadas: ["aros-de-hierro-para-decoracion", "arcadas-para-eventos", "mesas-para-eventos", "proveedor-para-decoradores"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por fundas y telas sublimadas.",
  },
  {
    slug: "sillones-para-eventos",
    grupo: "productos",
    link: "Sillones y rincón de fotos",
    title: "Sillones de hierro para eventos y rincón de fotos",
    description:
      "Sillones de hierro para eventos: Luna, Sweet y circular, más mesa hamaca y cabina espejada para el rincón de fotos. Color a elección y envíos al país.",
    eyebrow: "Hierro · Rincón de fotos",
    h1: "Sillones para eventos",
    lead:
      "El rincón de fotos es el lugar más visitado del evento. Hacemos sillones de hierro (Luna, Sweet y circular), mesa hamaca y estructuras como la cabina espejada, en " +
      COLORES +
      ".",
    imagen: { src: "/productos/sillon-sweet.jpg", alt: "Sillón Sweet de hierro para eventos" },
    secciones: [
      {
        h2: "Armazón para vestir",
        p: [
          "Los sillones se venden como armazón para que cada decoradora los vista a su manera: con flores, follaje, telas o globos. El Sillón Sweet mide 2×2 m y entran dos personas; el circular viene de 1,50 o 2 m de diámetro y es desarmable.",
        ],
      },
    ],
    productos: { re: "sillon|hamaca|cabina|luna", max: 8, titulo: "Del catálogo" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Los sillones vienen tapizados?",
        a: "No: se venden como armazón de hierro, listos para vestir con flores, telas o globos.",
      },
      {
        q: "¿Cuántas personas entran en el Sillón Sweet?",
        a: "Mide 2×2 m y entran dos personas.",
      },
    ],
    relacionadas: ["estructuras-para-15-anos", "estructuras-para-bodas", "estructuras-de-hierro-para-eventos", "arcos-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por sillones para eventos.",
  },
  {
    slug: "pies-para-flores-y-centros-de-mesa",
    grupo: "productos",
    link: "Pies para flores y centros de mesa",
    title: "Pies para flores y centros de mesa de hierro",
    description:
      "Pies para flores de organza, tallos de hierro, columnas centro de mesa y candelabros para ambientar salones y mesas. Envíos a todo el país.",
    eyebrow: "Hierro · Ambientación",
    h1: "Pies para flores y centros de mesa",
    lead:
      "Piezas para ambientar sin ocupar el piso: pies con base pesada para flores de organza, tallos de hierro que se acomodan como quieras, columnas para centros de mesa y candelabros de cinco velas.",
    imagen: { src: "/productos/pies-y-tallos-para-flores.jpg", alt: "Pies y tallos de hierro para flores de organza" },
    secciones: [
      {
        h2: "Flores gigantes, bien paradas",
        p: [
          "Los pies para flores tienen base pesada para sostener flores de organza de gran tamaño. El set de pies y tallos trae una base de 50 cm de diámetro con tres caños de hierro, desarmable, que se acomodan a gusto.",
        ],
      },
    ],
    productos: { re: "pies? (y tallos )?para flores|columnas centro|candelabro|atril", max: 8, titulo: "Del catálogo" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Los pies para flores incluyen las flores?",
        a: "No, se vende la estructura de hierro. Las flores de organza se colocan sobre los tallos.",
      },
      {
        q: "¿Se venden por unidad o por par?",
        a: "El pie con base pesada se vende por unidad o por par; el set de pies y tallos viene por tres.",
      },
    ],
    relacionadas: ["estructuras-para-bodas", "estructuras-de-hierro-para-eventos", "eventos-corporativos", "sillones-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por pies para flores.",
  },
  {
    slug: "proveedor-para-decoradores",
    grupo: "productos",
    link: "Proveedor para decoradores",
    title: "Proveedor de estructuras para decoradores",
    description:
      "Proveedor de estructuras, exhibidores y fundas para decoradores y ambientadores de eventos. Fábrica en Tortuguitas, envíos a todo el país y atención por WhatsApp.",
    eyebrow: "Para el rubro",
    h1: "Proveedor para decoradores de eventos",
    lead:
      "Sweet Flowers fabrica las piezas con las que trabajan decoradores, ambientadores, organizadores de eventos y salones: estructuras de hierro, exhibidores de catering, fundas y telas sublimadas. Vendemos a todo el país y te atendemos Flor o Tobías, en persona, por WhatsApp.",
    imagen: { src: "/img/summit/lg/sum-01.webp", alt: "Decoradoras en el Sweet Flowers Event Summit" },
    secciones: [
      {
        h2: "Hecho por gente del rubro",
        p: [
          "Además de fabricar, organizamos el Sweet Flowers Event Summit y siete workshops para decoradores en distintas provincias. Conocemos lo que se pide en un evento porque lo vemos de cerca: qué se arma rápido, qué entra en un auto, qué aguanta la temporada.",
        ],
      },
      {
        h2: "Cómo trabajamos",
        p: [
          "Trabajamos por encargo, con una demora de alrededor de 20 días. El precio de catálogo es para transferencia; con link de Mercado Pago se suma un recargo. Enviamos por Vía Cargo (con descuento en el envío) y, donde no llega, por Buspack, MD o FlechaBus.",
        ],
      },
    ],
    usos: [
      { titulo: "Decoradoras y ambientadoras", desc: "Estructuras para armar propuestas propias." },
      { titulo: "Pasteleras y caterings", desc: "Exhibidores para presentar mesas dulces y saladas." },
      { titulo: "Salones y organizadores", desc: "Mobiliario y fondos para tener siempre listos." },
    ],
    productos: { re: ".", max: 8, titulo: "Lo más pedido" },
    verMas: { href: "/productos", label: "Ver el catálogo completo" },
    faqs: [
      {
        q: "¿Venden solo a decoradores?",
        a: "No. Trabajamos mucho con decoradores, ambientadores y salones, pero también le vendemos a particulares que arman su propio evento.",
      },
      {
        q: "¿Hay beneficios para quienes van al Event Summit?",
        a: "Sí: el Pase VIP del Summit incluye ser Cliente VIP Sweet Flowers, con 15% de descuento en cualquier compra.",
      },
    ],
    relacionadas: ["estructuras-de-hierro-para-eventos", "exhibidores-para-catering", "capacitacion-para-decoradores-de-eventos", "envios-a-todo-el-pais"],
    linea: "ventas",
    mensaje: "¡Hola! Soy decorador/a y vengo de la web: quiero consultar por el catálogo.",
  },

  /* ───────────────────────────── OCASIONES ───────────────────────────── */
  {
    slug: "decoracion-de-cumpleanos-infantiles",
    grupo: "ocasiones",
    link: "Cumpleaños infantiles",
    title: "Estructuras para decorar cumpleaños infantiles",
    description:
      "Paneles y mesas temáticas de MDF y hierro para cumpleaños infantiles: Mickey, sirena, circo, Frozen, castillo y más. Pintados o sin pintar, con envíos al país.",
    eyebrow: "Ocasiones · Infantiles",
    h1: "Decoración de cumpleaños infantiles",
    lead:
      "Para los cumpleaños infantiles hacemos piezas temáticas: paneles, mesas y siluetas de Mickey, sirena, circo, castillo, Frozen, mariposas, playa y más. Se piden pintadas o sin pintar, para que cada decoradora les dé su estilo.",
    imagen: { src: "/productos/arcada-arcoiris.jpg", alt: "Arcada arcoíris de MDF para cumpleaños infantil" },
    secciones: [
      {
        h2: "La temática, en la estructura",
        p: [
          "Una mesa con forma de ola, un panel con orejas de Mickey o una carpa de circo hacen que la temática se entienda de lejos, antes de sumar globos o flores. Muchas piezas de MDF son desarmables y vienen sin pintar (más económicas) o pintadas.",
          "En hierro, el Aro Mickey y la Columna Mickey suman la temática sin perder el estilo de las estructuras metálicas.",
        ],
      },
    ],
    productos: {
      re: "mickey|barbie|frozen|sirena|circo|castillo|cohete|jeep|abejita|mariposa|playa|olas|algas|caracola|pelota|carroza|arcoiris",
      excluir: "funda",
      max: 8,
      titulo: "Piezas temáticas",
    },
    verMas: { href: "/productos/mdf", label: "Ver todo el MDF" },
    faqs: [
      {
        q: "¿Las piezas de MDF vienen pintadas?",
        a: "Se pueden pedir sin pintar o pintadas; cada producto tiene los dos precios.",
      },
      {
        q: "¿Hacen temáticas que no están en el catálogo?",
        a: "Consultanos por WhatsApp: las piezas a medida se cotizan según la complejidad.",
      },
    ],
    relacionadas: ["aros-de-hierro-para-decoracion", "mesas-para-eventos", "torres-de-cupcakes", "fundas-y-telas-sublimadas"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por piezas para un cumpleaños infantil.",
  },
  {
    slug: "estructuras-para-bodas",
    grupo: "ocasiones",
    link: "Bodas",
    title: "Estructuras para decorar bodas",
    description:
      "Estructuras de hierro para bodas: arcadas romanas, arcos para luces y flores, cartel de bienvenida, corazón de hierro, candelabros y pies para flores. Envíos al país.",
    eyebrow: "Ocasiones · Bodas",
    h1: "Estructuras para bodas",
    lead:
      "Para una boda, la estructura tiene que desaparecer debajo de las flores y sostener todo el día. Hacemos arcadas romanas, arcos para cortina de luces, estructura para cartel de bienvenida, corazón de hierro, candelabros y pies para flores.",
    imagen: { src: "/productos/arcada-romana-xl.jpg", alt: "Arcada Romana XL de hierro para bodas" },
    secciones: [
      {
        h2: "De la ceremonia a la fiesta",
        p: [
          "La misma arcada que enmarca la ceremonia puede pasar después a la mesa principal o al rincón de fotos. Por eso conviene elegir estructuras desarmables y en un color neutro (blanco, dorado o negro) que acompañe toda la noche.",
        ],
      },
    ],
    productos: { re: "arcada romana|doble arcada|para luces|cartel|corazon|candelabro|pies y tallos|telonera", max: 8, titulo: "Para bodas" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Qué estructura conviene para el altar?",
        a: "Las arcadas grandes (como la Romana o la Romana XL) y los arcos extensibles son los más usados para enmarcar la ceremonia con flores o telas.",
      },
      {
        q: "¿Hacen estructuras para cartel de bienvenida?",
        a: "Sí, la Estructura Cartel Bienvenida mide 1,60×0,95 m y se pide en el color que elijas.",
      },
    ],
    relacionadas: ["arcos-para-eventos", "pies-para-flores-y-centros-de-mesa", "sillones-para-eventos", "estructuras-para-15-anos"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por estructuras para una boda.",
  },
  {
    slug: "estructuras-para-15-anos",
    grupo: "ocasiones",
    link: "Fiestas de 15",
    title: "Estructuras para decorar fiestas de 15",
    description:
      "Estructuras para fiestas de 15: números de hierro 3D de 1,50 m, Sillón Luna, lunas, arcos para luces, hexágonos y cabina espejada. Envíos a todo el país.",
    eyebrow: "Ocasiones · 15 años",
    h1: "Estructuras para fiestas de 15",
    lead:
      "En un 15 hay dos protagonistas: la cumpleañera y la foto. Hacemos números de hierro 3D de 1,50 m de alto, el Sillón Luna, lunas de hierro, arcos para cortina de luces, hexágonos y una estructura de cabina espejada.",
    imagen: { src: "/productos/sillon-luna.jpg", alt: "Sillón Luna de hierro para fiestas de 15" },
    secciones: [
      {
        h2: "El rincón que sale en todas las fotos",
        p: [
          "El número 15 en hierro 3D (1,50 m de alto y 30 cm de profundidad), un sillón para sentarse y un fondo con luces arman en pocas piezas el espacio de fotos de la noche. Todo se pide en " +
            COLORES +
            ".",
        ],
      },
    ],
    productos: { re: "numero|luna|cabina|para luces|hexagono|corona|estrella", excluir: "nova", max: 8, titulo: "Para fiestas de 15" },
    verMas: { href: "/productos/hierro", label: "Ver todo el hierro" },
    faqs: [
      {
        q: "¿Cuánto miden los números de hierro?",
        a: "1,50 m de alto y 30 cm de profundidad. Se hacen del 1 al 9.",
      },
      {
        q: "¿El Sillón Luna viene tapizado?",
        a: "No, es un armazón de hierro de 2 m de alto para vestir con flores, telas o globos.",
      },
    ],
    relacionadas: ["sillones-para-eventos", "estructuras-para-bodas", "arcos-para-eventos", "aros-de-hierro-para-decoracion"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por estructuras para una fiesta de 15.",
  },
  {
    slug: "eventos-corporativos",
    grupo: "ocasiones",
    link: "Eventos corporativos",
    title: "Estructuras y exhibidores para eventos corporativos",
    description:
      "Estructuras para eventos corporativos: telonera, cartel de bienvenida, atril, paneles con malla y exhibidores para coffee break y finger food. Envíos al país.",
    eyebrow: "Ocasiones · Empresas",
    h1: "Estructuras para eventos corporativos",
    lead:
      "Para lanzamientos, ferias y eventos de empresa hacemos estructuras que ordenan el espacio y sostienen la marca: telonera en S, cartel de bienvenida, atril, paneles con malla, cubos, y exhibidores para coffee break y finger food.",
    imagen: { src: "/productos/estructura-telonera.jpg", alt: "Estructura telonera de hierro en forma de S" },
    secciones: [
      {
        h2: "Marca, recepción y catering",
        p: [
          "La Estructura Telonera (de 2×2 m o 2,40×4 m, desarmable) sirve como fondo de prensa o de escenario. El cartel de bienvenida y el atril resuelven la recepción, y la Torre Nativa con bandejas de madera arma una estación de coffee break en poco espacio.",
        ],
      },
    ],
    productos: { re: "telonera|cartel|atril|panel con malla|cubo estructura|nativa|cabina", max: 8, titulo: "Para empresas" },
    verMas: { href: "/productos", label: "Ver el catálogo" },
    faqs: [
      {
        q: "¿Hacen estructuras con medidas para un stand?",
        a: "Sí, las piezas a medida se cotizan por WhatsApp; la demora depende de la complejidad.",
      },
      {
        q: "¿Qué medidas tiene la telonera?",
        a: "Viene de 2 m de alto × 2 m de largo y de 2,40 m de alto × 4 m de largo, y es desarmable.",
      },
    ],
    relacionadas: ["torres-de-cupcakes", "exhibidores-para-catering", "estructuras-de-hierro-para-eventos", "pies-para-flores-y-centros-de-mesa"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por estructuras para un evento corporativo.",
  },

  /* ───────────────────────────── FORMACIÓN ───────────────────────────── */
  {
    slug: "capacitacion-para-decoradores-de-eventos",
    grupo: "formacion",
    link: "Capacitación para decoradores",
    title: "Capacitación para decoradores y organizadores",
    description:
      "Sweet Flowers Event Summit: la cumbre argentina para decoradores y organizadores de eventos. 9 de abril de 2027 en La Rural. Charlas, certificado y comunidad.",
    eyebrow: "Formación · Event Summit",
    h1: "Capacitación para decoradores de eventos",
    lead:
      "El Sweet Flowers Event Summit es nuestra jornada de formación para decoradores, ambientadores y organizadores de eventos: charlas de referentes del rubro, certificado de asistencia y una comunidad para seguir creciendo. La 2ª edición es el 9 de abril de 2027 en La Rural, Palermo.",
    imagen: { src: "/img/summit/lg/sum-28.webp", alt: "Primera edición del Sweet Flowers Event Summit en La Rural" },
    secciones: [
      {
        h2: "Qué te llevás",
        p: [
          "Una jornada entera de charlas (de 12:30 a 19 h), certificado de asistencia, coffee break, regalos y sorteos, ingreso a Expo Hobby y, con el Pase VIP, beneficios como 15% de descuento en Sweet Flowers, un grupo de WhatsApp exclusivo y descuentos con proveedores recomendados.",
        ],
      },
      {
        h2: "De dónde viene",
        p: [
          "Antes del Summit hicimos siete workshops presenciales para el rubro (en CABA, Puerto Madero, La Rioja y Río Cuarto, entre otras sedes) con temas como globología, redes sociales, contratos, presupuestos, iluminación y arte floral. La 1ª edición del Summit fue el 18 de septiembre de 2026 en La Rural.",
        ],
      },
    ],
    usos: [
      { titulo: "Decoradoras que arrancan", desc: "Para entender el oficio, los costos y cómo vender." },
      { titulo: "Ambientadoras con trayectoria", desc: "Tendencias, nuevas propuestas y red de contactos." },
      { titulo: "Organizadores y salones", desc: "Gestión, contratos y experiencia del cliente." },
    ],
    faqs: [
      {
        q: "¿Cuándo es el próximo Event Summit?",
        a: "La 2ª edición es el 9 de abril de 2027, de 12:30 a 19 h, en La Rural (Palermo, Buenos Aires). Las actividades extra del 7 y 8 de abril se abonan aparte.",
      },
      {
        q: "¿Cómo me inscribo?",
        a: "Desde la página del Event Summit: elegís el pase y lo pagás online con Mercado Pago (tarjeta de crédito en cuotas, débito o dinero en cuenta).",
      },
      {
        q: "¿Dan certificado?",
        a: "Sí, los dos pases (VIP y General) incluyen certificado de asistencia.",
      },
    ],
    relacionadas: ["workshops-de-decoracion-de-eventos", "proveedor-para-decoradores", "estructuras-para-eventos-en-caba", "exhibidores-para-catering"],
    linea: "capacitaciones",
    mensaje: "¡Hola! Vengo de la web y quiero info sobre el Sweet Flowers Event Summit.",
    bloque: "pases",
  },
  {
    slug: "workshops-de-decoracion-de-eventos",
    grupo: "formacion",
    link: "Workshops de decoración",
    title: "Workshops de decoración de eventos",
    description:
      "Siete workshops presenciales de decoración y organización de eventos en CABA, Puerto Madero, La Rioja y Río Cuarto. Temas, fotos y el próximo encuentro.",
    eyebrow: "Formación · Trayectoria",
    h1: "Workshops de decoración de eventos",
    lead:
      "Entre 2024 y 2026 hicimos siete workshops presenciales para decoradores y organizadores de eventos, en Buenos Aires y en el interior. Esa experiencia se transformó en el Sweet Flowers Event Summit, cuya 2ª edición es el 9 de abril de 2027.",
    imagen: { src: "/img/rio-cuarto/rc-03.webp", alt: "Workshop de decoración de eventos de Sweet Flowers en Río Cuarto" },
    secciones: [
      {
        h2: "Lo que se vio en cada encuentro",
        p: [
          "Globología, flores gigantes, redes sociales y creación de contenido, protocolo y ceremonial, seteo de mesa, pastelería, contratos para eventos, propuestas infantiles, bodas de destino, iluminación, arte floral, presupuestos que venden, inclusión, y seguridad e higiene. Cada edición fue distinta, por eso muchas asistentes repitieron.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Va a haber más workshops?",
        a: "La serie de workshops dio paso al Sweet Flowers Event Summit. La próxima cita es la 2ª edición, el 9 de abril de 2027 en La Rural.",
      },
      {
        q: "¿Dónde se hicieron los workshops?",
        a: "En el Centro Naval (CABA), Madero Tango (Puerto Madero), La Rioja Capital, Río Cuarto (Córdoba), el Palacio San Miguel (CABA) y La Rural (CABA), entre otras sedes.",
      },
    ],
    relacionadas: ["capacitacion-para-decoradores-de-eventos", "estructuras-para-eventos-en-cordoba", "estructuras-para-eventos-en-la-rioja", "estructuras-para-eventos-en-caba"],
    linea: "capacitaciones",
    mensaje: "¡Hola! Vengo de la web y quiero info sobre los encuentros para decoradores.",
    bloque: "trayectoria",
  },

  /* ─────────────────────────────── ZONAS ─────────────────────────────── */
  {
    slug: "envios-a-todo-el-pais",
    grupo: "zonas",
    link: "Envíos a todo el país",
    title: "Envíos de estructuras para eventos a todo el país",
    description:
      "Enviamos estructuras, exhibidores y fundas para eventos a todo el país por Vía Cargo (con descuento en el envío), Buspack, MD o FlechaBus. Cómo funciona.",
    eyebrow: "Envíos · Argentina",
    h1: "Envíos a todo el país",
    lead:
      "Sí, enviamos a toda la Argentina. Despachamos principalmente por Vía Cargo, con descuento en el valor del envío, y donde no llega usamos Buspack, MD o FlechaBus. Fabricamos en Tortuguitas (Buenos Aires) y el pedido sale cuando está listo, alrededor de 20 días después de confirmarlo.",
    imagen: { src: "/productos/combo-x-3-paneles-arcadas.jpg", alt: "Combo de arcadas de hierro desarmables, listas para enviar" },
    secciones: [
      {
        h2: "Cómo es el envío",
        p: [
          "Una vez que confirmás el pedido por WhatsApp, lo producimos y te avisamos cuando sale. Muchas piezas son desarmables, lo que facilita el despacho. El costo del envío lo cobra la transportista.",
        ],
      },
      {
        h2: "Seguro y reclamos",
        p: [
          "El seguro se le paga a la transportista. Con Buspack, MD o FlechaBus el reclamo lo gestiona el cliente con la empresa; con Vía Cargo tenemos llegada directa y te ayudamos a gestionarlo.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Hacen envíos a todo el país?",
        a: "Sí. Principalmente por Vía Cargo (con descuento en el valor del envío) y, donde no llega, por Buspack, MD o FlechaBus.",
      },
      {
        q: "¿Quién paga el seguro del envío?",
        a: "El seguro se abona a la transportista. Con Vía Cargo te ayudamos a gestionar cualquier reclamo.",
      },
      {
        q: "¿Cuánto tarda en llegar?",
        a: "Se produce por encargo (alrededor de 20 días) y después depende del tiempo de la transportista hasta tu ciudad.",
      },
    ],
    relacionadas: ["estructuras-para-eventos-en-cordoba", "estructuras-para-eventos-en-la-rioja", "estructuras-para-eventos-en-caba", "proveedor-para-decoradores"],
    linea: "ventas",
    mensaje: "¡Hola! Vengo de la web y quiero consultar por un envío.",
  },
  {
    slug: "estructuras-para-eventos-en-tortuguitas",
    grupo: "zonas",
    link: "Tortuguitas y zona norte",
    title: "Estructuras para eventos en Tortuguitas",
    description:
      "Taller de Sweet Flowers en Tortuguitas (Malvinas Argentinas): estructuras de hierro, exhibidores de catering y fundas para eventos. Zona norte del GBA y todo el país.",
    eyebrow: "Zonas · Tortuguitas",
    h1: "Estructuras para eventos en Tortuguitas",
    lead:
      "Nuestro taller está en Tortuguitas, partido de Malvinas Argentinas, en la zona norte del Gran Buenos Aires. Desde acá fabricamos y despachamos estructuras de hierro, exhibidores de catering, fundas y telas sublimadas para decoradores de todo el país.",
    imagen: { src: "/productos/hexagono.jpg", alt: "Hexágono de hierro fabricado en el taller de Tortuguitas" },
    secciones: [
      {
        h2: "Un taller familiar",
        p: [
          "Somos un equipo chico: producción, publicidad y atención. Cerramos la producción por semana, así que el tiempo de entrega (alrededor de 20 días) puede variar según el día en que confirmes. Te atienden Flor o Tobías por WhatsApp.",
        ],
      },
    ],
    productos: { re: ".", max: 4, titulo: "Lo que sale del taller" },
    verMas: { href: "/productos", label: "Ver el catálogo" },
    faqs: [
      {
        q: "¿Dónde está Sweet Flowers?",
        a: "En Tortuguitas, partido de Malvinas Argentinas, provincia de Buenos Aires. Desde ahí enviamos a todo el país.",
      },
      {
        q: "¿Atienden en zona norte?",
        a: "Sí. Escribinos por WhatsApp y coordinamos tu pedido.",
      },
    ],
    relacionadas: ["estructuras-para-eventos-en-caba", "envios-a-todo-el-pais", "proveedor-para-decoradores", "estructuras-de-hierro-para-eventos"],
    linea: "ventas",
    mensaje: "¡Hola! Estoy en zona norte y vengo de la web: quiero consultar por un pedido.",
  },
  {
    slug: "estructuras-para-eventos-en-caba",
    grupo: "zonas",
    link: "CABA",
    title: "Estructuras para eventos en CABA",
    description:
      "Estructuras de hierro, exhibidores y fundas para decoradores de eventos en CABA. Workshops en el Centro Naval y el Palacio San Miguel; Event Summit en La Rural.",
    eyebrow: "Zonas · Ciudad de Buenos Aires",
    h1: "Estructuras para eventos en CABA",
    lead:
      "Muchas decoradoras de la Ciudad de Buenos Aires nos conocen por los encuentros: hicimos workshops en el Centro Naval, Madero Tango (Puerto Madero), el Palacio San Miguel y La Rural, donde también se hace el Sweet Flowers Event Summit. Las piezas las fabricamos en nuestro taller de Tortuguitas, en la zona norte del Gran Buenos Aires.",
    imagen: { src: "/img/summit/lg/sum-08.webp", alt: "Sweet Flowers Event Summit en La Rural, Palermo" },
    secciones: [
      {
        h2: "Cerca de los salones porteños",
        p: [
          "Para quien arma eventos en CABA, tener el proveedor cerca acorta los tiempos de coordinación. Pedís por WhatsApp, te confirmamos precio y fecha, y coordinamos el envío.",
        ],
      },
    ],
    productos: { re: ".", max: 4, titulo: "Lo más pedido" },
    verMas: { href: "/productos", label: "Ver el catálogo" },
    faqs: [
      {
        q: "¿Dónde es el Event Summit?",
        a: "En La Rural, Palermo (CABA). La 2ª edición es el 9 de abril de 2027, de 12:30 a 19 h.",
      },
      {
        q: "¿Hacen envíos a CABA?",
        a: "Sí, como a todo el país. Coordinamos el envío por WhatsApp.",
      },
    ],
    relacionadas: ["capacitacion-para-decoradores-de-eventos", "estructuras-para-eventos-en-tortuguitas", "envios-a-todo-el-pais", "estructuras-para-bodas"],
    linea: "ventas",
    mensaje: "¡Hola! Estoy en CABA y vengo de la web: quiero consultar por un pedido.",
  },
  {
    slug: "estructuras-para-eventos-en-cordoba",
    grupo: "zonas",
    link: "Córdoba",
    title: "Estructuras para eventos en Córdoba",
    description:
      "Estructuras de hierro, exhibidores y fundas para decoradores de Córdoba, con envío por Vía Cargo. En 2025 hicimos un workshop para el rubro en Río Cuarto.",
    eyebrow: "Zonas · Córdoba",
    h1: "Estructuras para eventos en Córdoba",
    lead:
      "Enviamos estructuras de hierro, exhibidores de catering y fundas a Córdoba por Vía Cargo, con descuento en el valor del envío. Y conocemos al rubro cordobés de cerca: el 2 de julio de 2025 hicimos un workshop para decoradores en Río Cuarto, con 40 participantes.",
    imagen: { src: "/img/rio-cuarto/rc-05.webp", alt: "Workshop de Sweet Flowers en Río Cuarto, Córdoba" },
    secciones: [
      {
        h2: "El workshop de Río Cuarto",
        p: [
          "Fue el cuarto de la serie: tendencias e inspiración, redes sociales, pastelería, contratos, tendencias en barras y el armado en vivo de un salón. Las fotos del encuentro están en su página.",
        ],
      },
      {
        h2: "Pedidos desde Córdoba",
        p: [
          "Elegís las piezas, nos mandás el pedido por WhatsApp y lo despachamos cuando está listo (alrededor de 20 días). Las piezas desarmables viajan mejor y abaratan el envío.",
        ],
      },
    ],
    productos: { re: ".", max: 4, titulo: "Lo más pedido" },
    verMas: { href: "/event-summit/trayectoria/rio-cuarto", label: "Ver el workshop de Río Cuarto" },
    faqs: [
      {
        q: "¿Envían a Córdoba capital y al interior de la provincia?",
        a: "Sí, por Vía Cargo y, donde no llega, por Buspack, MD o FlechaBus.",
      },
      {
        q: "¿Van a volver a hacer un encuentro en Córdoba?",
        a: "Por ahora la próxima cita es el Event Summit en Buenos Aires (9 de abril de 2027). Seguinos en Instagram para enterarte de nuevas fechas.",
      },
    ],
    relacionadas: ["envios-a-todo-el-pais", "workshops-de-decoracion-de-eventos", "estructuras-para-eventos-en-la-rioja", "exhibidores-para-catering"],
    linea: "ventas",
    mensaje: "¡Hola! Estoy en Córdoba y vengo de la web: quiero consultar por un pedido con envío.",
  },
  {
    slug: "estructuras-para-eventos-en-la-rioja",
    grupo: "zonas",
    link: "La Rioja",
    title: "Estructuras para eventos en La Rioja",
    description:
      "Estructuras, exhibidores y fundas para decoradores de La Rioja, con envío a todo el país. En abril de 2025 hicimos un workshop para el rubro en La Rioja Capital.",
    eyebrow: "Zonas · La Rioja",
    h1: "Estructuras para eventos en La Rioja",
    lead:
      "Enviamos estructuras de hierro, exhibidores de catering y fundas a La Rioja. El 11 de abril de 2025 hicimos en La Rioja Capital el tercer workshop para decoradores y organizadores, con 40 participantes.",
    imagen: { src: "/productos/estanteria-star.jpg", alt: "Estantería Star de hierro para mesa dulce" },
    secciones: [
      {
        h2: "El workshop de La Rioja",
        p: [
          "Fue el primer encuentro fuera de Buenos Aires: globología, redes sociales y organización de eventos, en un centro cultural de la capital riojana.",
        ],
      },
      {
        h2: "Pedidos desde La Rioja",
        p: [
          "Pedís por WhatsApp, te confirmamos precio y fecha, y despachamos por Vía Cargo o, si no llega a tu localidad, por Buspack, MD o FlechaBus.",
        ],
      },
    ],
    productos: { re: ".", max: 4, titulo: "Lo más pedido" },
    verMas: { href: "/event-summit/trayectoria/la-rioja", label: "Ver el workshop de La Rioja" },
    faqs: [
      {
        q: "¿Envían a La Rioja?",
        a: "Sí, enviamos a todo el país por Vía Cargo, Buspack, MD o FlechaBus.",
      },
    ],
    relacionadas: ["envios-a-todo-el-pais", "workshops-de-decoracion-de-eventos", "estructuras-para-eventos-en-cordoba", "proveedor-para-decoradores"],
    linea: "ventas",
    mensaje: "¡Hola! Estoy en La Rioja y vengo de la web: quiero consultar por un pedido con envío.",
  },
];

export const landingDe = (slug: string) => LANDINGS.find((l) => l.slug === slug);

export const GRUPOS: readonly { id: GrupoLanding; titulo: string }[] = [
  { id: "productos", titulo: "Productos" },
  { id: "ocasiones", titulo: "Ocasiones" },
  { id: "formacion", titulo: "Formación" },
  { id: "zonas", titulo: "Envíos y zonas" },
];
