"use client";

import { usePathname } from "next/navigation";
import { CLUB, CLUB_SUMMIT } from "@/content/newsletter";
import { NewsletterForm } from "./NewsletterForm";

/** Banda del Club (markup). Elige el mensaje según la página (E-20). */
export function NewsletterBanda({ total, variante }: { total: number; variante?: "general" | "summit" }) {
  const path = usePathname() ?? "";
  const summit = variante ? variante === "summit" : path.startsWith("/event-summit");
  const copy = summit ? { ...CLUB, ...CLUB_SUMMIT } : CLUB;
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
            {copy.titulo}
          </h2>
          <p className="mt-6 max-w-[44ch] text-[length:var(--text-step-0)] leading-relaxed text-bone/80">{copy.bajada}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {copy.beneficios.map((b) => (
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
          {summit ? <NewsletterForm key="summit" interes="summit" cta="Avisame" /> : <NewsletterForm key="general" />}
        </div>
      </div>
    </section>
  );
}
