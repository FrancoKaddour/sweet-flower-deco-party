"use client";

import { useEffect, useRef, useState } from "react";
import { EVENT_CTA_HREF, hastaCorto, preventaVigente, tarifaVigente } from "@/content/evento";
import { useOcultaFlotantes } from "@/components/site/useOcultaFlotantes";

const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;

/**
 * Barra fija de compra en celular (E-13): aparece cuando el hero sale de
 * pantalla y se va cuando los pases, el formulario o el footer están a la
 * vista. Respeta el safe-area de iOS. Mientras se ve, publica su alto en
 * --sf-barra-compra para que el botón de WhatsApp se acomode arriba.
 */
export function BarraCompraMovil({ heroId = "summit-hero" }: { heroId?: string }) {
  const [pasoHero, setPasoHero] = useState(false);
  const oculta = useOcultaFlotantes();
  const ref = useRef<HTMLDivElement>(null);
  const t = tarifaVigente();
  const pv = preventaVigente();
  const visible = pasoHero && !oculta;

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPasoHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(min-width: 768px)");
    const aplicar = () => {
      const h = visible && !mq.matches ? (ref.current?.offsetHeight ?? 0) : 0;
      root.style.setProperty("--sf-barra-compra", `${h}px`);
    };
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => {
      mq.removeEventListener("change", aplicar);
      root.style.removeProperty("--sf-barra-compra");
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      aria-hidden={!visible || undefined}
      inert={!visible || undefined}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-bone/15 bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-bone backdrop-blur-md transition-[translate,opacity] duration-500 ease-(--ease-out-quart) motion-reduce:transition-none md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[40rem] items-center justify-between gap-3">
        <p className="min-w-0 text-[0.8rem] leading-tight">
          <span className="block font-display text-[1.15rem] font-bold tabular-nums">General {ars(t.precios.general)}</span>
          <span className="block text-bone/60">{pv ? `${pv.nombre} hasta ${hastaCorto(pv)}` : t.nombre}</span>
        </p>
        <a
          href={EVENT_CTA_HREF}
          className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-bone px-5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-champagne"
        >
          Quiero mi lugar
        </a>
      </div>
    </div>
  );
}
