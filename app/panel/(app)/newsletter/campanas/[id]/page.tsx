import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/PageHeader";
import { CampanaEditor } from "@/components/panel/newsletter/CampanaEditor";
import { RetomarEnvio } from "@/components/panel/newsletter/AccionesCampana";
import { puede } from "@/modules/ventas/estados";
import { AvisoEnvio } from "@/components/panel/newsletter/Comunes";
import { requireStaff } from "@/lib/dal";
import { SITE_URL } from "@/lib/site";
import { fechaLarga } from "@/lib/panel/formato";
import { campanaTrabada, conteoSegmentos, obtenerCampana } from "@/modules/newsletter/admin";
import { type Segmento } from "@/content/newsletter";

export const metadata: Metadata = { title: "Campaña" };

export default async function CampanaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creada?: string }>;
}) {
  const user = await requireStaff();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [c, conteos] = await Promise.all([obtenerCampana(id), conteoSegmentos()]);
  if (!c) notFound();
  const borrador = c.estado === "borrador";

  return (
    <div className="flex flex-col gap-8">
      <Link href="/panel/newsletter" className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink">← Newsletter</Link>
      <PageHeader
        seccion={borrador ? "Borrador" : c.estado === "enviada" ? "Enviada" : "Enviando"}
        titulo={c.asunto}
        descripcion={
          c.enviadaAt
            ? `Enviada el ${fechaLarga(c.enviadaAt)} a ${c.enviados} personas${c.fallidos ? ` (${c.fallidos} fallidos)` : ""}.`
            : "Revisá la vista previa, mandate una prueba y cuando esté lista, enviala (los botones están debajo del texto)."
        }
      />
      {sp.creada && borrador && (
        <p role="status" className="rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-muted">
          Borrador guardado. Mandate una prueba para verla en tu correo.
        </p>
      )}
      {borrador && <AvisoEnvio />}
      {c.estado === "enviando" && puede(user.role, "campanaEnviar") && campanaTrabada(c) && <RetomarEnvio id={c.id} />}
      <CampanaEditor
        id={c.id}
        bloqueada={!borrador}
        base={SITE_URL}
        conteos={conteos}
        acciones={{ esAdmin: puede(user.role, "campanaEnviar") }}
        inicial={{
          asunto: c.asunto,
          preheader: c.preheader ?? "",
          titulo: c.titulo,
          cuerpo: c.cuerpo,
          imagen: c.imagen ?? "",
          ctaTexto: c.ctaTexto ?? "",
          ctaUrl: c.ctaUrl ?? "",
          segmento: c.segmento as Segmento,
        }}
      />
    </div>
  );
}
