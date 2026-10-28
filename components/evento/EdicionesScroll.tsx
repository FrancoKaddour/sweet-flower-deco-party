"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TRAYECTORIA, WORKSHOPS_REALIZADOS, EDICION_LABEL } from "@/content/evento";
import { portadaDe } from "@/content/galerias";

/**
 * TRAYECTORIA — "baraja semiabierta" (pedido de Fran): 7 workshops → 1ª
 * edición del Summit → 2ª edición, como cartas en abanico.
 *
 *  · Entra SIEMPRE en una pantalla (h-svh): el tamaño de las cartas sale del
 *    alto disponible y el abanico nunca pasa del ancho de la pantalla.
 *  · Mouse: al entrar al mazo el abanico se abre; la carta bajo el cursor
 *    sube y corre a sus vecinas; click → entra al encuentro.
 *  · Táctil (sin hover): primer toque levanta la carta (se ve entera), el
 *    segundo toque entra. Teclado: Tab recorre las cartas (la enfocada sube).
 *  · Sin scroll horizontal ni pin: es una sola pantalla.
 *  · Fotos a color natural (se sacó el duotono violeta).
 */
const N = TRAYECTORIA.length;
const MEDIO = (N - 1) / 2;

const CSS = `
.dk{--w:min(16.5rem,21vw,calc(56svh/1.42));--h:calc(var(--w)*1.42);
  --paso-cerrado:calc(var(--w)*0.2);--paso-abierto:min(calc(var(--w)*0.46),calc((min(90vw,64rem) - var(--w))/${N - 1}));
  --giro-cerrado:2.2deg;--giro-abierto:3.2deg;--curva:cubic-bezier(.22,1,.36,1)}
@media (max-width:767px){.dk{--w:min(42vw,calc(46svh/1.42));--paso-cerrado:calc((76vw - var(--w))/${N - 1});--paso-abierto:var(--paso-cerrado);--giro-cerrado:1.6deg;--giro-abierto:1.6deg}}
@media (max-height:520px){.dk{--w:min(10rem,calc(58svh/1.42))}}
.dk-card{position:absolute;left:50%;bottom:0;width:var(--w);height:var(--h);margin-left:calc(var(--w)/-2);
  transform-origin:50% 135%;
  transform:translateX(calc(var(--o)*var(--paso-cerrado))) rotate(calc(var(--o)*var(--giro-cerrado)));
  transition:transform 1.1s var(--curva),box-shadow .8s var(--curva);transition-delay:calc(var(--d,0) * 1ms);will-change:transform}
.dk[data-abierto="true"] .dk-card{transform:translateX(calc(var(--o)*var(--paso-abierto) + var(--empuje,0px))) rotate(calc(var(--o)*var(--giro-abierto)))}
.dk .dk-card[data-activa="true"]{transition-delay:0ms;transform:translateX(calc(var(--o)*var(--paso-abierto))) translateY(-6%) rotate(0deg) scale(1.04);
  box-shadow:0 30px 60px -20px rgb(0 0 0/.7)}
@media (max-width:767px){
  .dk .dk-card[data-activa="true"]{transform:translateX(calc(var(--o)*var(--paso-cerrado)*0.35)) translateY(-6%) rotate(0deg) scale(1.08)}
}
@media (prefers-reduced-motion:reduce){.dk-card{transition:none}}
`;

function Intro({ titleId }: { titleId?: string }) {
  return (
    <div className="mx-auto max-w-[44rem] text-center">
      <Eyebrow className="mb-[clamp(0.5rem,2svh,1.5rem)]">La trayectoria</Eyebrow>
      <h2
        id={titleId}
        className="font-display text-[length:min(var(--text-step-5),7svh)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [text-wrap:balance]"
      >
        El camino hasta acá
      </h2>
      <p className="mx-auto mt-[clamp(0.5rem,2svh,1.5rem)] max-w-[44ch] font-sans text-[length:var(--text-step--1)] leading-relaxed text-bone/70 md:text-[length:var(--text-step-0)]">
        {WORKSHOPS_REALIZADOS} workshops, una primera edición del Summit y
        ahora vamos por la {EDICION_LABEL}.{" "}
        <span className="hidden [@media(hover:hover)]:inline">Pasá por las cartas y entrá a cada encuentro.</span>
        <span className="[@media(hover:hover)]:hidden">Tocá una carta para verla y otra vez para entrar.</span>
      </p>
    </div>
  );
}

export function EdicionesScroll() {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState<number | null>(null);
  const [tactil, setTactil] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const set = () => setTactil(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Empuje: las vecinas de la carta activa se corren para dejarla ver entera.
  const empuje = (i: number) => {
    if (activa === null || i === activa || tactil) return "0px";
    const dir = i < activa ? -1 : 1;
    const dist = Math.abs(i - activa);
    return `calc(var(--w) * ${(dir * 0.22) / dist})`;
  };

  // Táctil: 1er toque levanta la carta, 2º toque entra. Mientras la carta no
  // está levantada lleva data-no-transition (PageTransition la ignora) y acá
  // se cancela el click; ya levantada, el link navega normal con la cortina.
  const onTap = (e: React.MouseEvent, i: number) => {
    if (!tactil || activa === i) return;
    e.preventDefault();
    setActiva(i);
    setAbierto(true);
  };

  return (
    <section
      id="trayectoria"
      data-theme="dark"
      aria-labelledby="trayectoria-h"
      className="relative flex h-svh min-h-[30rem] scroll-mt-0 flex-col overflow-hidden bg-ink px-6 pb-[clamp(1.5rem,6svh,4rem)] pt-[max(5.5rem,13svh)] text-bone md:px-10 [@media(max-height:520px)]:min-h-0 [@media(max-height:520px)]:pt-[4.5rem]"
    >
      <style>{CSS}</style>
      <Intro titleId="trayectoria-h" />

      {/* El mazo */}
      <ul
        className="dk relative mx-auto mt-auto w-full"
        style={{ height: "calc(var(--h) * 1.12)" }}
        data-abierto={abierto || activa !== null ? "true" : "false"}
        onPointerEnter={(e) => e.pointerType === "mouse" && setAbierto(true)}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          setAbierto(false);
          setActiva(null);
        }}
        aria-label="Encuentros de la trayectoria"
      >
        {TRAYECTORIA.map((t, i) => {
          const o = i - MEDIO;
          const href = t.proxima
            ? "#inscripcion"
            : t.slug
              ? `/event-summit/trayectoria/${t.slug}`
              : "/event-summit#trayectoria";
          const style = {
            "--o": o,
            "--empuje": empuje(i),
            // Escalonado desde el centro: el abanico se abre como una ola, no de golpe.
            "--d": Math.round(Math.abs(o) * 35),
            zIndex: activa === i ? 50 : i + 1,
          } as CSSProperties;
          const comunes = {
            href,
            "data-activa": activa === i ? "true" : "false",
            onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setActiva(i),
            onFocus: () => {
              setAbierto(true);
              setActiva(i);
            },
            onClick: (e: React.MouseEvent) => onTap(e, i),
            "data-no-transition": tactil && activa !== i ? "" : undefined,
            className:
              "dk-card group block overflow-hidden rounded-[var(--radius-lg)] outline-none ring-champagne focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
          };

          return (
            <li key={t.etapa} className="contents">
              {t.proxima ? (
                <a {...comunes} style={style} aria-label={`${t.etapa}: ${t.titulo}. Reservá tu lugar`}
                   className={`${comunes.className} flex flex-col justify-between border border-champagne/40 bg-bordeaux p-[clamp(0.75rem,1.6vw,1.5rem)]`}>
                  <div className="evt-grain pointer-events-none absolute inset-0" />
                  <span className="relative text-[0.62rem] uppercase tracking-[0.18em] text-champagne md:text-[length:var(--text-step--1)]">
                    {t.etapa}
                  </span>
                  <div className="relative">
                    <h3 className="font-display text-[length:min(var(--text-step-3),calc(var(--w)*0.14))] font-bold uppercase leading-[0.92] text-bone">
                      {t.titulo}
                    </h3>
                    {t.detalle && (
                      <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-bone/75 md:text-[length:var(--text-step--1)]">
                        {t.detalle}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 border-b border-bone pb-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-bone md:text-[0.72rem]">
                      Reservá tu lugar <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ) : (
                <Link {...comunes} style={style} aria-label={`Ver ${t.etapa}: ${t.titulo}`}>
                  <Image
                    src={t.foto ?? portadaDe(t.slug ?? "", t.foto).src}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 46vw, 16rem"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-[clamp(0.75rem,1.4vw,1.25rem)]">
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-champagne md:text-[0.68rem]">
                      {t.etapa}
                    </span>
                    <h3 className="mt-1 font-display text-[length:min(var(--text-step-2),calc(var(--w)*0.12))] font-bold uppercase leading-[0.95] text-bone">
                      {t.titulo}
                    </h3>
                    {(t.lugar || t.fecha) && (
                      <p className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-bone/70 md:text-[0.68rem]">
                        {[t.lugar, t.fecha].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 border-b border-bone/60 pb-0.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[activa=true]:opacity-100 md:text-[0.66rem]">
                      Ver el encuentro <span aria-hidden="true">→</span>
                    </span>
                  </div>
                  {t.numero && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 top-2 font-display text-[length:calc(var(--w)*0.3)] font-extrabold leading-none text-transparent opacity-80 [-webkit-text-stroke:1px_rgb(198_161_91/0.8)]"
                    >
                      {t.numero}
                    </span>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
