import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";

export type SeccionLegal = { id: string; titulo: string; contenido: React.ReactNode };

const LEGALES = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/cambios", label: "Envíos y cambios" },
] as const;

/**
 * Página legal editorial: título grande, índice fijo a la izquierda (desktop)
 * y cláusulas numeradas (en un texto legal el orden sí es información).
 */
export function PaginaLegal({
  path,
  titulo,
  bajada,
  actualizado,
  secciones,
}: {
  path: string;
  titulo: string;
  bajada: React.ReactNode;
  actualizado: string;
  secciones: readonly SeccionLegal[];
}) {
  return (
    <main id="main" data-theme="light" className="bg-bone px-6 pb-24 pt-32 text-ink md:px-10 md:pb-32 md:pt-44">
      <BreadcrumbJsonLd items={[{ name: titulo, path }]} />
      <div className="mx-auto max-w-[87.5rem]">
        <header className="border-b border-ink/15 pb-12 md:pb-16">
          <Eyebrow className="mb-6">Información legal</Eyebrow>
          <h1 className="max-w-[18ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] [overflow-wrap:break-word] [text-wrap:balance]">
            {titulo}
          </h1>
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            <div className="max-w-[52ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/75 md:col-span-7">
              {bajada}
            </div>
            <p className="text-[length:var(--text-step--1)] leading-relaxed text-ink/55 md:col-span-4 md:col-start-9 md:self-end">
              Versión provisoria, actualizada el {actualizado}. Si algo no está claro o tu caso no aparece,
              escribinos y lo vemos con vos.
            </p>
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="En esta página" className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="font-display text-[length:var(--text-step-1)] font-semibold italic">En esta página</p>
              <ol className="mt-4 flex flex-col gap-2 text-[length:var(--text-step--1)] text-ink/70">
                {secciones.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="inline-flex min-h-8 items-baseline gap-3 hover:text-ink">
                      <span className="tabular-nums text-bordeaux">{String(i + 1).padStart(2, "0")}</span>
                      {s.titulo}
                    </a>
                  </li>
                ))}
              </ol>
              <ul className="mt-10 hidden flex-col gap-2 border-t border-ink/15 pt-6 text-[length:var(--text-step--1)] lg:flex">
                {LEGALES.filter((l) => l.href !== path).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="underline underline-offset-4 hover:text-bordeaux">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="flex flex-col lg:col-span-8 lg:col-start-5">
            {secciones.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-ink/15 py-10 first:border-t-0 first:pt-0">
                <h2 className="flex items-baseline gap-4 font-display text-[length:var(--text-step-3)] font-bold leading-[1.05]">
                  <span className="text-[length:var(--text-step-1)] tabular-nums text-bordeaux">{String(i + 1).padStart(2, "0")}</span>
                  <span className="[text-wrap:balance]">{s.titulo}</span>
                </h2>
                <div className="mt-5 flex max-w-[64ch] flex-col gap-4 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/80 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-bordeaux [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
                  {s.contenido}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
