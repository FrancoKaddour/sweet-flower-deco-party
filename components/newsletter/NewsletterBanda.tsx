"use client";

import { usePathname } from "next/navigation";
import { CLUB, CLUB_SUMMIT } from "@/content/newsletter";
import { NewsletterForm } from "./NewsletterForm";
import { TelefonoClub } from "./TelefonoClub";

/** Banda del Club (markup). Elige el mensaje según la página (E-20). */
export function NewsletterBanda({ total, variante }: { total: number; variante?: "general" | "summit" }) {
  const path = usePathname() ?? "";
  const summit = variante ? variante === "summit" : path.startsWith("/event-summit");
  const copy = summit ? { ...CLUB, ...CLUB_SUMMIT } : CLUB;
  return (
    <section
      aria-labelledby="club-titulo"
      data-theme="dark"
      className="relative overflow-hidden bg-bordeaux px-6 py-14 text-bone sm:py-16 md:px-10 md:py-20"
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
        <div className="lg:col-span-5">
          {/* Texto + formulario a la izquierda; el celular que explica el club, a la derecha */}
          <p className="mb-4 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">✧ {CLUB.nombre}</p>
          <h2
            id="club-titulo"
            className="max-w-[16ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] text-bone xl:text-[length:var(--text-step-5)]"
          >
            {copy.titulo}
          </h2>
          <p className="mt-4 max-w-[44ch] text-[length:var(--text-step--1)] leading-relaxed text-bone/80 md:text-[length:var(--text-step-0)]">{copy.bajada}</p>
          <ul className="mt-5 flex flex-col gap-2">
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
          <div className="mt-8 w-full max-w-xl">
            {summit ? <NewsletterForm key="summit" interes="summit" cta="Avisame" /> : <NewsletterForm key="general" />}
          </div>
        </div>

        <div className="lg:col-span-7">
          <TelefonoClub variante={summit ? "summit" : "perfil"} />
        </div>
      </div>
    </section>
  );
}
