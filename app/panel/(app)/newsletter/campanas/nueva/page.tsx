import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { SinBase } from "@/components/panel/SinBase";
import { CampanaEditor } from "@/components/panel/newsletter/CampanaEditor";
import { AvisoEnvio } from "@/components/panel/newsletter/Comunes";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { SITE_URL } from "@/lib/site";
import { conteoSegmentos } from "@/modules/newsletter/admin";
import { PLANTILLAS } from "@/content/newsletter";

export const metadata: Metadata = { title: "Nueva campaña" };

export default async function NuevaCampanaPage() {
  await requireStaff();
  const header = (
    <PageHeader seccion="Newsletter" titulo="Nueva campaña" descripcion="Elegí una plantilla, escribí el mensaje y mirá la vista previa a la derecha." />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;
  const conteos = await conteoSegmentos();
  return (
    <div className="flex flex-col gap-8">
      <Link href="/panel/newsletter" className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink">← Newsletter</Link>
      {header}
      <AvisoEnvio />
      <CampanaEditor id={null} inicial={PLANTILLAS[0].datos} base={SITE_URL} conteos={conteos} />
    </div>
  );
}
