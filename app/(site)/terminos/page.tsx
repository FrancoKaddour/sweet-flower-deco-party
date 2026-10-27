import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, BUSINESS, RECARGO_MP_TEXTO } from "@/lib/site";
import { PaginaLegal, type SeccionLegal } from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/content/site";
import {
  EVENT_HORARIO,
  EVENT_NAME,
  EVENT_SEDE,
  EVENT_WHATSAPP,
  EVENT_WHEN,
  EXTRAS_NOTA,
  PASES,
  PREVENTAS,
} from "@/content/evento";

// Términos y condiciones PROVISORIOS: solo lo confirmado (CONTENIDO_FLOR.md y
// content/evento.ts). Lo que Flor no definió → "escribinos".
// TODO(contenido): seña de pedidos, política de devolución/transferencia de la
// entrada del Summit, facturación, CUIT y domicilio legal; revisión de su contador.

export const metadata: Metadata = pageMetadata({
  title: "Términos y condiciones",
  description: `Condiciones de compra de productos por encargo y de inscripción al ${EVENT_NAME}.`,
  path: "/terminos",
});

const waVentas = `https://wa.me/${WHATSAPP_NUMBER}`;
const waSummit = `https://wa.me/${EVENT_WHATSAPP}`;
const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;

const SECCIONES: readonly SeccionLegal[] = [
  {
    id: "quienes",
    titulo: "Quiénes somos",
    contenido: (
      <p>
        {SITE_NAME} es un emprendimiento familiar con taller en {BUSINESS.locality}, {BUSINESS.region}. Fabricamos piezas
        para decorar eventos y organizamos el {EVENT_NAME}. Al hacer un pedido o inscribirte desde este sitio aceptás
        estas condiciones.
      </p>
    ),
  },
  {
    id: "pedidos",
    titulo: "Pedidos de productos",
    contenido: (
      <>
        <ul>
          <li>
            Los pedidos se arman en la web y se confirman por WhatsApp. No se cobra nada en el sitio: el pedido queda
            hecho cuando lo confirmamos con vos.
          </li>
          <li>
            Trabajamos por encargo: contá alrededor de 20 días desde que confirmás. Cerramos la producción por semana, así
            que puede variar según cuándo confirmes. Las piezas a medida se cotizan y, si son muy específicas, pueden
            llevar más tiempo; te lo aclaramos antes.
          </li>
          <li>
            El precio publicado es por transferencia. Con link de Mercado Pago se suma un {RECARGO_MP_TEXTO}. Los precios
            pueden cambiar: vale el que te confirmamos por WhatsApp.
          </li>
          <li>
            Las condiciones de pago de cada pedido (por ejemplo, si hace falta una seña) te las confirmamos por WhatsApp
            antes de empezar a producir.
          </li>
        </ul>
        <p>
          Envíos, seguro y cambios: mirá <Link href="/cambios">envíos y cambios</Link>.
        </p>
      </>
    ),
  },
  {
    id: "summit",
    titulo: `Inscripción al ${EVENT_NAME}`,
    contenido: (
      <>
        <ul>
          <li>
            Fecha y lugar: {EVENT_WHEN}, de {EVENT_HORARIO}, en {EVENT_SEDE}. {EXTRAS_NOTA}
          </li>
          <li>
            Hay dos pases: {PASES.map((p) => p.nombre).join(" y ")}. Lo que incluye cada uno está en la{" "}
            <Link href="/event-summit#pases">página del Summit</Link>.
          </li>
          <li>
            El precio depende de la etapa de venta en la que pagás:{" "}
            {PREVENTAS.map(
              (pv) => `${pv.nombre} (${pv.hastaLabel}): Pase VIP ${ars(pv.precios.vip)}, Pase General ${ars(pv.precios.general)}`,
            ).join("; ")}
            . Se cobra el precio vigente al momento de pagar.
          </li>
          <li>
            Se paga online con Mercado Pago (tarjeta de crédito en cuotas, débito o dinero en cuenta). Tu lugar queda
            confirmado cuando el pago se aprueba y te llega un mail con tu código de inscripción.
          </li>
          <li>
            La inscripción es personal: una por persona. Para entrar, presentá tu código y tu DNI en la acreditación.
          </li>
          <li>El cupo es limitado. Si se agotan los lugares, la inscripción se cierra.</li>
          <li>
            ¿No podés ir o necesitás factura? Escribinos por{" "}
            <a href={waSummit} target="_blank" rel="noopener noreferrer">WhatsApp de capacitaciones (11 5512-7508)</a> y lo
            vemos con vos.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "arrepentimiento",
    titulo: "Derecho de arrepentimiento",
    contenido: (
      <p>
        En las compras a distancia, tenés derecho a revocar la aceptación dentro de los 10 días corridos desde la compra o
        la entrega, sin costo, en los casos que prevé la ley (art. 34 de la Ley 24.240 de Defensa del Consumidor). Para
        hacerlo, escribinos por <a href={waVentas} target="_blank" rel="noopener noreferrer">WhatsApp</a> con tu código
        de pedido o de inscripción.
      </p>
    ),
  },
  {
    id: "datos",
    titulo: "Tus datos",
    contenido: (
      <p>
        Cómo usamos y cuidamos los datos que nos das está en la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    ),
  },
  {
    id: "contacto",
    titulo: "Contacto",
    contenido: (
      <p>
        Productos: <a href={waVentas} target="_blank" rel="noopener noreferrer">WhatsApp 11 5106-4010</a>. Event Summit:{" "}
        <a href={waSummit} target="_blank" rel="noopener noreferrer">WhatsApp 11 5512-7508</a>. Te responden Flor y Tobías.
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <PaginaLegal
      path="/terminos"
      titulo="Términos y condiciones"
      actualizado="26/10/2026"
      bajada={<p>Cómo funcionan los pedidos por encargo y la inscripción al Event Summit.</p>}
      secciones={SECCIONES}
    />
  );
}
