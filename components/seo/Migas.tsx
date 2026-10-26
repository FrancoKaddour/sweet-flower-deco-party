import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";

/**
 * Migas de pan VISIBLES + su BreadcrumbList (JSON-LD). Siempre empiezan en
 * "Inicio"; el último ítem es la página actual (sin link).
 */
export function Migas({
  items,
  className = "",
  tone = "dark",
}: {
  items: { name: string; path: string }[];
  className?: string;
  tone?: "dark" | "light";
}) {
  const todos = [{ name: "Inicio", path: "/" }, ...items];
  const color = tone === "light" ? "text-bone/60" : "text-ink/50";
  const activo = tone === "light" ? "text-bone" : "text-ink";
  const hover = tone === "light" ? "hover:text-bone" : "hover:text-ink";
  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Migas de pan" className={className}>
        <ol
          className={`flex flex-wrap items-center gap-x-1.5 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] ${color}`}
        >
          {todos.map((it, i) => {
            const ultimo = i === todos.length - 1;
            return (
              <li key={it.path} className="inline-flex items-center gap-x-1.5">
                {ultimo ? (
                  <span aria-current="page" className={`${activo} [overflow-wrap:anywhere]`}>
                    {it.name}
                  </span>
                ) : (
                  <>
                    <Link href={it.path} className={`inline-flex min-h-11 items-center transition-colors ${hover}`}>
                      {it.name}
                    </Link>
                    <span aria-hidden="true">›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
