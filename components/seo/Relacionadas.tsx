import Link from "next/link";
import { landingDe } from "@/content/seo/landings";

/** "También te puede interesar": enlazado interno entre landings hermanas. */
export function Relacionadas({
  slugs,
  extra = [],
  titulo = "También te puede interesar",
}: {
  slugs: readonly string[];
  /** Links fijos además de las landings (ej. una categoría o el Summit). */
  extra?: readonly { href: string; label: string; bajada?: string }[];
  titulo?: string;
}) {
  const items = [
    ...slugs
      .map(landingDe)
      .filter((l) => l !== undefined)
      .map((l) => ({ href: `/${l.slug}`, label: l.h1, bajada: l.eyebrow })),
    ...extra,
  ];
  if (!items.length) return null;
  return (
    <section data-theme="light" className="bg-bone px-6 py-20 text-ink md:px-10 md:py-28">
      <div className="mx-auto max-w-[87.5rem]">
        <h2 className="font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] md:text-[length:var(--text-step-4)]">
          {titulo}
        </h2>
        <ul className="mt-10 border-b border-line md:mt-14">
          {items.map((it) => (
            <li key={it.href} className="border-t border-line">
              <Link
                href={it.href}
                className="group grid min-h-11 grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)_auto] md:py-7"
              >
                <span className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[1.05] transition-colors group-hover:text-bordeaux md:text-[length:var(--text-step-2)] [overflow-wrap:break-word]">
                  {it.label}
                </span>
                {it.bajada && (
                  <span className="col-start-1 row-start-2 text-[length:var(--text-step--1)] text-ink/55 md:col-start-2 md:row-start-1">
                    {it.bajada}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="col-start-2 row-span-2 text-[length:var(--text-step-2)] text-champagne transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 md:col-start-3 md:row-span-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
