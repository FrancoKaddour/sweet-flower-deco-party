import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { PaginaLegal, type SeccionLegal } from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/content/site";

// Envíos y cambios PROVISORIO: envíos y seguro confirmados (CONTENIDO_FLOR §5).
// TODO(contenido): política de cambios y devoluciones de Flor (plazos, estado de
// la pieza, quién paga el envío de vuelta).

export const metadata: Metadata = pageMetadata({
  title: "Envíos y cambios",
  description:
    "Envíos a todo el país por Vía Cargo (con 50% de descuento en el envío), Buspack, MD o FlechaBus; seguro, reclamos y cambios.",
  path: "/cambios",
});

const waVentas = `https://wa.me/${WHATSAPP_NUMBER}`;

const SECCIONES: readonly SeccionLegal[] = [
  {
    id: "envios",
    titulo: "Envíos",
    contenido: (
      <>
        <p>
          Enviamos a todo el país. La empresa principal es <strong>Vía Cargo</strong>, con <strong>50% de descuento en el
          valor del envío</strong>. Donde Vía Cargo no llega, despachamos por Buspack, MD o FlechaBus.
        </p>
        <p>
          Más detalle en <Link href="/envios-a-todo-el-pais">envíos a todo el país</Link>.
        </p>
      </>
    ),
  },
  {
    id: "seguro",
    titulo: "Seguro y reclamos a la transportista",
    contenido: (
      <ul>
        <li>El seguro del envío se abona a la transportista.</li>
        <li>Con Vía Cargo tenemos llegada directa: si hay un problema, te ayudamos a gestionar el reclamo.</li>
        <li>Con Buspack, MD o FlechaBus, el reclamo lo gestiona quien recibe, directamente con la transportista.</li>
      </ul>
    ),
  },
  {
    id: "danos",
    titulo: "Si algo llega dañado",
    contenido: (
      <p>
        Escribinos por <a href={waVentas} target="_blank" rel="noopener noreferrer">WhatsApp (11 5106-4010)</a> con fotos
        de la pieza y del embalaje, y vemos con vos cómo seguir.
      </p>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios y devoluciones",
    contenido: (
      <>
        <p>
          Como fabricamos por encargo, cada cambio lo vemos caso por caso. Escribinos por{" "}
          <a href={waVentas} target="_blank" rel="noopener noreferrer">WhatsApp</a> con tu código de pedido y te
          respondemos.
        </p>
        <p>
          Además, en las compras a distancia tenés el derecho de arrepentimiento que prevé la ley: mirá los{" "}
          <Link href="/terminos#arrepentimiento">términos y condiciones</Link>.
        </p>
      </>
    ),
  },
];

export default function CambiosPage() {
  return (
    <PaginaLegal
      path="/cambios"
      titulo="Envíos y cambios"
      actualizado="26/10/2026"
      bajada={<p>Cómo llegan los pedidos, quién se ocupa del seguro y qué hacer si necesitás un cambio.</p>}
      secciones={SECCIONES}
    />
  );
}
