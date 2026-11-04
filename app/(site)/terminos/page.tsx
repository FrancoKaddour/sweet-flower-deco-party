import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, LEGAL, RECARGO_MP_TEXTO } from "@/lib/site";
import { PaginaLegal, Pendiente, type SeccionLegal } from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/content/site";
import {
  EVENT_HORARIO,
  EVENT_NAME,
  EVENT_SEDE,
  EVENT_WHATSAPP,
  EVENT_WHEN,
} from "@/content/evento";

// Términos y condiciones — documento revisado por el abogado (04/11/2026).
// Fuente: T&C que armaron Flor y Tobías. Datos que faltan (WhatsApp y email
// oficiales, localidad del local) → LEGAL.* en null → se muestran como
// "(a confirmar)" hasta que Fran los pase.

export const metadata: Metadata = pageMetadata({
  title: "Términos y condiciones",
  description: `Condiciones de compra de productos de ${SITE_NAME} e inscripción al ${EVENT_NAME}.`,
  path: "/terminos",
});

const waVentas = `https://wa.me/${WHATSAPP_NUMBER}`;
const waSummit = `https://wa.me/${EVENT_WHATSAPP}`;

const localidadLocal = LEGAL.localLocalidad ? (
  <>, {LEGAL.localLocalidad}</>
) : (
  <> (<Pendiente>localidad</Pendiente>)</>
);

const whatsappOficialNode = LEGAL.whatsappOficial ? (
  <a href={waVentas} target="_blank" rel="noopener noreferrer">{LEGAL.whatsappOficial}</a>
) : (
  <Pendiente>WhatsApp</Pendiente>
);

const SECCIONES: readonly SeccionLegal[] = [
  {
    id: "comercio",
    titulo: "Identificación del comercio",
    contenido: (
      <>
        <p>
          {SITE_NAME} es un emprendimiento dedicado a la fabricación y comercialización de productos para decoración,
          ambientación de eventos, catering, pastelería y exhibición comercial, y a la organización de encuentros
          profesionales de la industria de los eventos.
        </p>
        <ul>
          <li><strong>Titular:</strong> {LEGAL.razonSocial}.</li>
          <li><strong>Condición fiscal:</strong> {LEGAL.condicionFiscal}.</li>
          <li><strong>CUIT:</strong> {LEGAL.cuit}.</li>
          <li><strong>Domicilio fiscal:</strong> {LEGAL.domicilioFiscal}, Argentina.</li>
          <li><strong>Local comercial:</strong> {LEGAL.localCalle}{localidadLocal}.</li>
          <li><strong>WhatsApp oficial:</strong> {whatsappOficialNode}.</li>
          <li><strong>Correo electrónico:</strong> <Pendiente>email</Pendiente>.</li>
        </ul>
        <p>
          <strong>Horarios de atención:</strong> {LEGAL.horarios.join(" · ")}.
        </p>
        <p>
          Estos Términos y Condiciones regulan las operaciones realizadas por el sitio web oficial, por WhatsApp y de
          manera presencial, en cuanto resulten aplicables a cada modalidad.
        </p>
      </>
    ),
  },
  {
    id: "productos",
    titulo: "Productos comercializados",
    contenido: (
      <>
        <p>
          Fabricamos y comercializamos productos para decoración, ambientación de eventos, catering, pastelería,
          cafeterías, bares, salones y establecimientos comerciales. Trabajamos principalmente con estructuras de hierro,
          madera de pino, MDF, telas sublimadas y otros materiales, según cada producto.
        </p>
        <p>
          Los artículos pueden ofrecerse en modelos estándar, con variantes predeterminadas, o fabricarse a pedido según
          necesidades específicas. Las características, materiales, medidas, colores y demás especificaciones están en las
          publicaciones correspondientes o se informan mediante asesoramiento personalizado.
        </p>
      </>
    ),
  },
  {
    id: "compra",
    titulo: "Modalidades de compra",
    contenido: (
      <>
        <ul>
          <li>
            <strong>Compra online:</strong> a través del catálogo y el carrito del sitio, eligiendo productos y variantes
            disponibles.
          </li>
          <li>
            <strong>Compra por WhatsApp:</strong> especialmente para productos personalizados, diseños especiales,
            modificaciones de medidas, colores o estructuras y solicitudes que requieran asesoramiento.
          </li>
          <li>
            <strong>Compra presencial:</strong> directamente en nuestro local comercial, dentro de los horarios de
            atención.
          </li>
        </ul>
        <p>
          Los productos personalizados o las modificaciones especiales están sujetos a evaluación de viabilidad,
          presupuesto y confirmación expresa de {SITE_NAME}. Para esos pedidos, las especificaciones acordadas quedan
          registradas por el canal de atención utilizado.
        </p>
      </>
    ),
  },
  {
    id: "precios",
    titulo: "Precios y medios de pago",
    contenido: (
      <>
        <p>
          Todos los precios se expresan en pesos argentinos (ARS), con los impuestos correspondientes incluidos. Los
          medios de pago habilitados son:
        </p>
        <ul>
          <li>Mercado Pago, a través de la página web (se suma un recargo del {RECARGO_MP_TEXTO}).</li>
          <li>Transferencia bancaria.</li>
          <li>Efectivo en el local comercial.</li>
        </ul>
        <p>
          Las condiciones de pago, cargos adicionales, promociones y opciones de financiación se informan antes de
          confirmar la compra. Podemos actualizar los precios cuando sea necesario; las modificaciones no afectan compras
          ya confirmadas. En productos personalizados, el presupuesto debe aprobarse antes de iniciar la fabricación.
        </p>
      </>
    ),
  },
  {
    id: "fabricacion",
    titulo: "Disponibilidad, fabricación y preparación",
    contenido: (
      <>
        <p>
          La mayoría de los productos se fabrica a pedido, por lo que no siempre hay entrega inmediata. El tiempo
          estimado de producción es de <strong>dos a tres semanas</strong>, según el tipo de producto, la cantidad y la
          complejidad. El plazo específico se informa al confirmar el pedido.
        </p>
        <p>
          Los productos en stock pueden tener tiempos de entrega menores; los pedidos especiales o personalizados pueden
          requerir tiempos adicionales, que se comunican previamente. Cualquier modificación de las especificaciones
          confirmadas debe ser evaluada y aceptada por {SITE_NAME}. Si surge un inconveniente que afecte el pedido, lo
          comunicamos y ofrecemos las soluciones correspondientes.
        </p>
      </>
    ),
  },
  {
    id: "envios",
    titulo: "Envíos y entregas",
    contenido: (
      <>
        <p>Hacemos envíos a todo el país mediante la empresa de transporte Vía Cargo.</p>
        <p>
          <strong>Descuento en envíos.</strong> Los envíos gestionados por {SITE_NAME} mediante Vía Cargo cuentan con una
          bonificación comercial del 50 % sobre la tarifa de transporte aplicable, según las condiciones vigentes
          acordadas con esa empresa. El costo se calcula según el peso, el volumen y el destino; podemos informarte un
          valor estimado, pero el importe definitivo lo determina la transportista. El envío se abona directamente a Vía
          Cargo al retirar la mercadería en destino.
        </p>
        <p>
          <strong>Costo de embalaje.</strong> Para los pedidos con envío por transporte aplicamos un cargo de embalaje de
          $7.000 por unidad comercial o combo adquirido: un producto individual, $7.000; un combo de tres o de cuatro
          productos vendido como conjunto, $7.000 por el combo completo. Cuando una compra tiene varios artículos o
          combos independientes, el embalaje se calcula sobre cada uno. El total de embalaje se informa y detalla antes de
          confirmar la compra.
        </p>
        <p>
          <strong>Retiro por el local.</strong> Podés retirar tu pedido en nuestro local de {LEGAL.localCalle}
          {localidadLocal}, con coordinación previa. Los retiros presenciales no tienen cargo de embalaje ni de
          transporte.
        </p>
      </>
    ),
  },
  {
    id: "reclamos",
    titulo: "Reclamos por daños, faltantes o errores",
    contenido: (
      <>
        <p>
          Nos comprometemos a entregar los productos conforme a las características, cantidades y condiciones confirmadas al
          momento de la compra.
        </p>
        <p>
          <strong>Daños durante el transporte.</strong> Si el pedido llega con roturas o daños, te recomendamos conservar
          el embalaje original, tomar fotos del estado en que lo recibiste, comunicarte con nosotros e iniciar, cuando
          corresponda, el reclamo ante Vía Cargo y pasarnos el número de gestión. Usamos esa información para gestionar el
          caso con la transportista. Según el inconveniente, se evalúa la reparación, reposición o solución que
          corresponda legalmente, sin trasladarte los gastos que la ley pone en cabeza del proveedor. El procedimiento
          ante Vía Cargo no limita tus derechos frente a {SITE_NAME}.
        </p>
        <p>
          <strong>Errores nuestros.</strong> Si entregamos un artículo incorrecto, con un color distinto del solicitado,
          con faltantes o con defectos de fabricación, nos hacemos cargo de la solución: enviar lo que falta, reparar,
          reemplazar o aplicar el remedio que corresponda. Cuando el error es atribuible a {SITE_NAME}, los gastos no
          quedan a tu cargo.
        </p>
      </>
    ),
  },
  {
    id: "arrepentimiento",
    titulo: "Cambios, devoluciones y garantías",
    contenido: (
      <>
        <p>
          Atendemos los cambios, devoluciones y garantías conforme a la legislación argentina. En las compras a distancia
          podés ejercer el derecho de arrepentimiento dentro del plazo legal (10 días corridos, art. 34 de la Ley 24.240),
          salvo las excepciones previstas en la normativa.
        </p>
        <p>
          Los productos fabricados según especificaciones particulares o claramente personalizados pueden quedar
          comprendidos en esas excepciones. Elegir variantes estándar de nuestro catálogo no se considera, por sí solo,
          una personalización a estos efectos. Las excepciones al arrepentimiento no eliminan las garantías legales por
          defectos de fabricación ni tus derechos ante incumplimientos.
        </p>
        <p>
          Podés gestionar tu solicitud por nuestros canales oficiales o con el Botón de Arrepentimiento disponible en el
          sitio, según corresponda.
        </p>
      </>
    ),
  },
  {
    id: "summit",
    titulo: "Sweet Flowers Event Summit",
    contenido: (
      <>
        <p>
          Organizamos el {EVENT_NAME}, un encuentro para profesionales, emprendedores, ambientadores, proveedores y
          personas interesadas en la industria de los eventos. Para participar hace falta adquirir un pase válido para la
          edición correspondiente. El evento tiene cupos limitados y está sujeto a la capacidad habilitada del
          establecimiento.
        </p>
        <p>
          La próxima edición está prevista para el {EVENT_WHEN}
          {EVENT_SEDE ? `, en ${EVENT_SEDE}` : ""}, de {EVENT_HORARIO}, en conjunto con Expo Hobby, e incluye el acceso a
          esa exposición según las condiciones informadas. Antes de habilitar la venta se informan la fecha, el lugar, los
          horarios, el precio y las características de los pases disponibles.
        </p>
      </>
    ),
  },
  {
    id: "pases",
    titulo: "Categorías de pases y beneficios",
    contenido: (
      <>
        <p>
          <strong>Pase General.</strong> Incluye ingreso al predio y al auditorio del Event Summit, acceso a las charlas
          de referentes y disertantes, participación en los sorteos habilitados (según sus bases), coffee break,
          certificado de asistencia, obsequio de bienvenida de la categoría, ingreso a Expo Hobby en la edición conjunta y
          acceso a la información organizativa del evento.
        </p>
        <p>
          <strong>Pase VIP.</strong> Incluye todo lo del Pase General y, además: ubicación preferencial en el auditorio,
          obsequio de bienvenida diferencial, acceso a un grupo exclusivo de WhatsApp con beneficios y novedades, un
          descuento especial del 15 % en compras de productos {SITE_NAME} (sujeto a las condiciones y vigencia del
          programa VIP) y acceso a promociones y descuentos de proveedores participantes o recomendados, según la
          disponibilidad de cada uno.
        </p>
        <p>
          <strong>Vigencia del descuento VIP.</strong> El 15 % se ofrece como beneficio del programa VIP, con vigencia
          abierta y sin una fecha fija de finalización inicial. {SITE_NAME} puede dar por finalizado el programa
          comunicándolo previamente por sus canales oficiales y respetando los derechos ya adquiridos: la finalización
          rige solo para operaciones futuras y no modifica descuentos ya aplicados ni compras confirmadas.
        </p>
      </>
    ),
  },
  {
    id: "acreditacion",
    titulo: "Compra, registro y acreditación de pases",
    contenido: (
      <>
        <p>
          La compra de un pase habilita a su titular a asistir a la edición para la cual fue adquirido. Para la
          acreditación pedimos nombre, apellido, DNI, correo electrónico y teléfono de contacto. Esa información se
          incorpora a la lista de asistentes que gestionamos junto con la organización.
        </p>
        <p>
          Cuando la edición se realiza en conjunto con Expo Hobby en La Rural, el asistente debe presentarse en la
          boletería o el sector de acreditación indicado, informar que integra la lista de {SITE_NAME} y acreditar su
          identidad con DNI. La organización verifica los datos y habilita el ingreso. Los horarios, acreditaciones y
          novedades se comunican por los canales oficiales, y los asistentes pueden sumarse a los grupos informativos de
          WhatsApp de cada edición.
        </p>
      </>
    ),
  },
  {
    id: "transferencia",
    titulo: "Transferencia de pases",
    contenido: (
      <p>
        Los pases pueden transferirse a otra persona siempre que la solicitud se haga con más de diez días corridos de
        anticipación a la fecha del evento. Para gestionarla, el titular debe comunicarse con {SITE_NAME} y dar los datos
        de quien recibirá el pase. Durante los últimos diez días corridos antes del evento no se admiten transferencias
        voluntarias, por el cierre administrativo de las listas de acreditación. Esta limitación no afecta los derechos
        reconocidos por la normativa aplicable.
      </p>
    ),
  },
  {
    id: "cancelaciones",
    titulo: "Cancelaciones, reprogramaciones y devoluciones",
    contenido: (
      <>
        <p>
          <strong>Por decisión del asistente.</strong> Fuera de los casos en que la ley reconozca el arrepentimiento, la
          devolución u otro remedio obligatorio, no ofrecemos reembolsos voluntarios por la decisión personal de no
          asistir. Como alternativa, el titular puede transferir el pase a otra persona dentro del plazo indicado arriba.
        </p>
        <p>
          <strong>Por parte de la organización.</strong> Si {SITE_NAME} debe cancelar o reprogramar el evento por motivos
          organizativos, técnicos, de fuerza mayor u otras circunstancias, lo informa por los canales oficiales y comunica
          las alternativas disponibles, incluida la utilización del pase para una nueva fecha o la devolución del importe
          cuando corresponda. En todos los casos se respetan los derechos previstos en la legislación aplicable.
        </p>
      </>
    ),
  },
  {
    id: "asistencia",
    titulo: "Condiciones de asistencia y comportamiento",
    contenido: (
      <p>
        Los participantes deben respetar los horarios de ingreso, las indicaciones de acreditación y las normas de
        seguridad del establecimiento, y se espera un comportamiento respetuoso hacia asistentes, disertantes, proveedores
        y personal. Está permitido tomar fotos y grabar videos mientras no se interrumpa el desarrollo de las actividades
        ni se vulneren derechos de terceros. {SITE_NAME} puede realizar registros audiovisuales del evento para su
        documentación y promoción, respetando los derechos de imagen y las normas sobre datos personales.
      </p>
    ),
  },
  {
    id: "datos",
    titulo: "Tratamiento y protección de datos personales",
    contenido: (
      <p>
        Recopilamos los datos necesarios para gestionar compras, facturación, fabricación, envíos, atención al cliente y
        acreditaciones (nombre, apellido, DNI, correo, teléfono y dirección de entrega o facturación). Cuando hace falta
        para el ingreso al Event Summit, algunos datos se comparten con Expo Hobby y los responsables operativos. El
        tratamiento se realiza conforme a la Ley 25.326; podés conocer el detalle, y ejercer el acceso, rectificación o
        supresión de tus datos, en la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    ),
  },
  {
    id: "contacto",
    titulo: "Atención al cliente",
    contenido: (
      <>
        <p>
          Podés hacer consultas, pedir información sobre tus pedidos o gestionar reclamos por nuestros canales oficiales.
        </p>
        <ul>
          <li><strong>Local comercial:</strong> {LEGAL.localCalle}{localidadLocal}.</li>
          <li><strong>WhatsApp oficial:</strong> {whatsappOficialNode}.</li>
          <li><strong>Correo electrónico:</strong> <Pendiente>email</Pendiente>.</li>
          <li><strong>Horarios:</strong> {LEGAL.horarios.join(" · ")}.</li>
        </ul>
        <p>
          Para consultas del Event Summit también podés escribir a la línea de capacitaciones:{" "}
          <a href={waSummit} target="_blank" rel="noopener noreferrer">11 5512-7508</a>.
        </p>
      </>
    ),
  },
  {
    id: "propiedad",
    titulo: "Propiedad intelectual",
    contenido: (
      <p>
        Las fotografías, diseños, imágenes comerciales, catálogos, textos, identidad visual y demás contenidos originales
        publicados por {SITE_NAME} están protegidos por las normas de propiedad intelectual aplicables. No se autoriza su
        reproducción, explotación comercial ni utilización sin consentimiento, salvo los usos permitidos por la ley.
      </p>
    ),
  },
  {
    id: "modificacion",
    titulo: "Modificación de los términos",
    contenido: (
      <p>
        Podemos actualizar estos Términos y Condiciones cuando haya cambios comerciales, operativos o normativos. Las
        actualizaciones se publican en el sitio con la fecha de la última modificación. Las nuevas condiciones no alteran
        retroactivamente los derechos adquiridos ni los compromisos ya asumidos en operaciones anteriores.
      </p>
    ),
  },
  {
    id: "ley",
    titulo: "Legislación aplicable y aceptación",
    contenido: (
      <p>
        Estos Términos y Condiciones se interpretan conforme a la legislación vigente de la República Argentina. Antes de
        finalizar una compra online tenés acceso a las condiciones correspondientes y la posibilidad de aceptarlas
        expresamente. La aceptación no implica renuncia a los derechos reconocidos por la normativa de defensa del
        consumidor.
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <PaginaLegal
      path="/terminos"
      titulo="Términos y condiciones"
      actualizado="04/11/2026"
      nota={<>Última actualización: 4 de noviembre de 2026. Si tu caso no aparece, escribinos y lo vemos con vos.</>}
      bajada={<p>Condiciones de compra de nuestros productos y de inscripción al {EVENT_NAME}.</p>}
      secciones={SECCIONES}
    />
  );
}
