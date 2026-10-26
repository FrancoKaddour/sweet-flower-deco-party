import { FaqJsonLd } from "@/components/site/JsonLd";

/**
 * Lista de preguntas (acordeón nativo <details>, sin JS) + FAQPage JSON-LD con
 * EXACTAMENTE las mismas preguntas que se ven. `conSchema={false}` cuando la
 * página ya emite su propio FAQPage (p. ej. varias listas en /preguntas-frecuentes).
 */
export function FaqLista({
  faqs,
  nombre = "faq",
  conSchema = true,
}: {
  faqs: readonly { q: string; a: string }[];
  /** Agrupa los <details> (abrir uno cierra los otros). */
  nombre?: string;
  conSchema?: boolean;
}) {
  return (
    <>
      {conSchema && <FaqJsonLd faqs={faqs} />}
      <div className="border-b border-ink/15">
        {faqs.map((faq) => (
          <details key={faq.q} name={nombre} className="group border-t border-ink/15">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[1.1] text-ink md:text-[length:var(--text-step-2)] [&::-webkit-details-marker]:hidden">
              <h3 className="[overflow-wrap:break-word]">{faq.q}</h3>
              <span
                aria-hidden="true"
                className="shrink-0 text-[length:var(--text-step-2)] text-champagne transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="max-w-[62ch] pb-6 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/75">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </>
  );
}
