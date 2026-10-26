import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { CLUB } from "@/content/newsletter";
import { NewsletterForm } from "./NewsletterForm";

/** Prueba social: solo se muestra cuando el número ya impresiona. */
async function totalClub(): Promise<number> {
  if (!db) return 0;
  try {
    const [r] = await db.select({ n: count() }).from(subscribers).where(eq(subscribers.estado, "activo"));
    return r?.n ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Newsletter "Club Sweet Flowers" — banda a sangre arriba del footer, en todas
 * las páginas del sitio. Estrategia: un beneficio concreto e inmediato (código
 * de descuento en pantalla + por mail), pocos campos, intereses opcionales para
 * segmentar y prueba social cuando el club ya es grande.
 */
export async function Newsletter() {
  const total = await totalClub();
  return (
    <section
      aria-labelledby="club-titulo"
      data-theme="dark"
      className="relative overflow-hidden bg-bordeaux px-6 py-16 text-bone sm:py-20 md:px-10 md:py-28"
    >
      {/* Arco decorativo (identidad El Arco) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full border border-champagne/25 md:-right-10 md:h-[36rem] md:w-[36rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-[20rem] w-[20rem] rounded-full border border-champagne/15 md:right-6 md:h-[28rem] md:w-[28rem]"
      />

      <div className="relative mx-auto grid max-w-[87.5rem] items-center gap-10 md:gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="mb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">✧ {CLUB.nombre}</p>
          <h2
            id="club-titulo"
            className="max-w-[14ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-6)]"
          >
            {CLUB.titulo}
          </h2>
          <p className="mt-6 max-w-[44ch] text-[length:var(--text-step-0)] leading-relaxed text-bone/80">{CLUB.bajada}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {CLUB.beneficios.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-bone/90">
                <span aria-hidden="true" className="text-champagne">✧</span>
                {b}
              </li>
            ))}
          </ul>
          {total >= 50 && (
            <p className="mt-8 text-[length:var(--text-step--1)] text-bone/60">
              Ya somos <span className="font-semibold text-champagne">+{Math.floor(total / 10) * 10}</span> en el club.
            </p>
          )}
        </div>

        <div className="w-full max-w-xl lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
