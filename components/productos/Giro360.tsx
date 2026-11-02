"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/content/site";
import { FONDO_RENDER, cuadroSrc, type Giro } from "@/content/exhibidores360";

/**
 * GIRO 360° CON SCROLL — la sección queda fija (pin) y, mientras bajás, cada
 * exhibidor entra, se acomoda y da una vuelta completa; sus medidas aparecen
 * a medida que gira. Con varios, pasan de a uno.
 *
 *  · Los cuadros (webp) se dibujan en un <canvas>: más fluido que adelantar
 *    un video y funciona igual en iOS. Se descargan recién cuando la sección
 *    está por entrar en pantalla, y mientras falta alguno se usa el más
 *    cercano ya cargado.
 *  · prefers-reduced-motion: sin pin ni giro; cada exhibidor queda quieto,
 *    uno debajo del otro.
 */
type Props = {
  items: Giro[];
  eyebrow?: string;
  titulo?: string;
  /** En la ficha de producto: sin CTA (ya está la compra al lado). */
  conCta?: boolean;
  id?: string;
};

// Antes de hidratar, solo el primero se ve (los demás esperan su turno).
const oculto = (k: number) => (k > 0 ? "[[data-animado=true]_&]:invisible " : "");

const waHref = (nombre: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola! Me interesa el exhibidor ${nombre}.`)}`;

export function Giro360({ items, eyebrow = "Exhibidores a medida", titulo = "Mirá cada pieza girar", conCta = true, id }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const imgs = useRef<HTMLImageElement[][]>([]);
  const actual = useRef<number[]>(items.map(() => 0));

  // Dibuja el cuadro f del exhibidor k (o el más cercano ya descargado).
  const dibujar = (k: number, f: number) => {
    actual.current[k] = f;
    const c = canvases.current[k];
    const lista = imgs.current[k];
    if (!c || !lista) return;
    let img: HTMLImageElement | undefined;
    for (let d = 0; d < lista.length; d++) {
      const a = lista[(f + d) % lista.length];
      const b = lista[(f - d + lista.length) % lista.length];
      if (a?.complete && a.naturalWidth) { img = a; break; }
      if (b?.complete && b.naturalWidth) { img = b; break; }
    }
    if (!img) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const s = Math.min(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = FONDO_RENDER;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  };

  // Carga diferida de los cuadros + canvas nítido (devicePixelRatio, máx. 2).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ajustar = () =>
      canvases.current.forEach((c, k) => {
        if (!c) return;
        const r = c.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        c.width = Math.max(1, Math.round(r.width * dpr));
        c.height = Math.max(1, Math.round(r.height * dpr));
        dibujar(k, actual.current[k]);
      });
    const ro = new ResizeObserver(ajustar);
    canvases.current.forEach((c) => c && ro.observe(c));

    let cargado = false;
    const cargar = () => {
      if (cargado) return;
      cargado = true;
      // Celular / pantallas chicas: la versión de 640 px alcanza y pesa un tercio.
      const chico = window.innerWidth * Math.min(2, window.devicePixelRatio || 1) < 1100;
      items.forEach((g, k) => {
        imgs.current[k] = Array.from({ length: g.cuadros }, (_, i) => {
          const img = new Image();
          img.decoding = "async";
          // El primero (y el que se está viendo) apenas llegan, se dibujan.
          img.onload = () => {
            if (Math.abs(i - actual.current[k]) < 3) dibujar(k, actual.current[k]);
          };
          img.src = cuadroSrc(g.slug, i, chico);
          return img;
        });
      });
    };
    const io = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && (cargar(), io.disconnect()),
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    ajustar();
    return () => {
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      // Quieto: lista simple, sin pin.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.dataset.animado = "false";
        return () => {
          el.dataset.animado = "true";
        };
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const piezas = gsap.utils.toArray<HTMLElement>(".g3-pieza", el);
        const textos = gsap.utils.toArray<HTMLElement>(".g3-texto", el);
        const barra = el.querySelector<HTMLElement>(".g3-barra");
        const contador = el.querySelector<HTMLElement>(".g3-n");
        const desktop = window.matchMedia("(min-width: 1024px)").matches;

        gsap.set(piezas.slice(1), { autoAlpha: 0 });
        gsap.set(textos.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${items.length * 170}%`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((g, k) => {
          const t0 = k; // cada exhibidor ocupa 1 unidad del timeline
          const pieza = piezas[k];
          const texto = textos[k];
          const lineas = texto.querySelectorAll<HTMLElement>("[data-l]");
          const datos = texto.querySelectorAll<HTMLElement>("[data-d]");

          // Sale el anterior: sube, se achica y se desvanece.
          if (k > 0) {
            tl.to(piezas[k - 1], { autoAlpha: 0, yPercent: -12, scale: 0.86, duration: 0.14, ease: "power2.in" }, t0)
              .to(textos[k - 1], { autoAlpha: 0, y: -40, duration: 0.12, ease: "power2.in" }, t0);
          }

          // Entra y se acomoda: llega de costado, girado y chico.
          tl.fromTo(
            pieza,
            { autoAlpha: k === 0 ? 1 : 0, xPercent: desktop ? 22 : 0, yPercent: desktop ? 0 : 10, scale: 0.72, rotate: -7 },
            { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, rotate: 0, duration: 0.3, ease: "power3.out" },
            k === 0 ? 0 : t0 + 0.08,
          );

          // La vuelta completa, atada al scroll.
          const giro = { f: 0 };
          tl.to(
            giro,
            {
              f: g.cuadros - 1,
              duration: 0.92,
              onUpdate: () => dibujar(k, Math.round(giro.f)),
            },
            k === 0 ? 0 : t0 + 0.08,
          );

          // Texto: nombre y bajada, después las medidas de a una.
          // (El primero ya llega con el nombre a la vista.)
          tl.set(texto, { autoAlpha: 1 }, k === 0 ? 0 : t0 + 0.1);
          if (k > 0)
            tl.fromTo(lineas, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.04, ease: "power3.out" }, t0 + 0.12);
          tl.fromTo(datos, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.06, ease: "power2.out" }, (k === 0 ? 0 : t0) + 0.3);

        });
        if (barra) tl.fromTo(barra, { scaleX: 0 }, { scaleX: 1, duration: items.length, ease: "none" }, 0);
        // Un respiro al final con la última pieza quieta.
        tl.to({}, { duration: 0.15 });

        // Contador al volver para atrás: lo recalcula por progreso.
        tl.eventCallback("onUpdate", () => {
          if (!contador) return;
          const k = Math.min(items.length - 1, Math.max(0, Math.floor(tl.time())));
          contador.textContent = String(k + 1).padStart(2, "0");
        });

      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [items] },
  );

  return (
    <section
      ref={root}
      id={id}
      data-theme="light"
      data-animado="true"
      aria-label={titulo}
      className="g3 relative overflow-hidden text-ink data-[animado=true]:h-svh data-[animado=true]:min-h-[34rem]"
      style={{ backgroundColor: FONDO_RENDER }}
    >
      {/* Encabezado + avance */}
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-[87.5rem] items-end justify-between gap-6 px-6 pt-[max(5.5rem,12svh)] md:px-10 [@media(max-height:560px)]:pt-[4.5rem]">
        <div>
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne-ink">{eyebrow}</p>
          <h2 className="mt-2 font-display text-[length:min(var(--text-step-3),5svh)] font-extrabold uppercase leading-[0.95] text-ink">
            {titulo}
          </h2>
        </div>
        {items.length > 1 && (
          <div aria-hidden="true" className="hidden shrink-0 items-center gap-3 font-display text-[length:var(--text-step-1)] font-bold tabular-nums sm:flex">
            <span className="g3-n">01</span>
            <span className="relative h-px w-16 overflow-hidden bg-ink/15">
              <span className="g3-barra absolute inset-0 origin-left bg-ink" />
            </span>
            <span className="text-ink/40">{String(items.length).padStart(2, "0")}</span>
          </div>
        )}
      </div>

      {/* Escenario: en movimiento todo se apila en la misma pantalla; quieto, va en lista */}
      <div className="relative mx-auto max-w-[87.5rem] px-6 md:px-10 [[data-animado=true]_&]:absolute [[data-animado=true]_&]:inset-x-0 [[data-animado=true]_&]:bottom-0 [[data-animado=true]_&]:top-[max(9.5rem,22svh)] [@media(max-height:560px)]:[[data-animado=true]_&]:top-[7.5rem]">
        {items.map((g, k) => (
          <article
            key={g.slug}
            aria-labelledby={`g3-${g.slug}`}
            className={`grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-12 lg:gap-10 [[data-animado=true]_&]:absolute [[data-animado=true]_&]:inset-0 [[data-animado=true]_&]:grid-rows-[minmax(0,1fr)_auto] [[data-animado=true]_&]:px-6 [[data-animado=true]_&]:py-0 [[data-animado=true]_&]:pb-[max(1.5rem,5svh)] md:[[data-animado=true]_&]:px-10 lg:[[data-animado=true]_&]:grid-rows-1`}
          >
            {/* El exhibidor */}
            <div className={`${oculto(k)}g3-pieza relative h-[min(70vw,26rem)] w-full lg:order-2 lg:col-span-7 lg:h-[min(70svh,48rem)] [[data-animado=true]_&]:h-full [[data-animado=true]_&]:min-h-0 lg:[[data-animado=true]_&]:h-[min(72svh,50rem)]`}>
              <canvas
                ref={(c) => {
                  canvases.current[k] = c;
                }}
                role="img"
                aria-label={`${g.nombre}, exhibidor de hierro y madera, vista 360°`}
                className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_72%,transparent_100%)]"
              />
            </div>

            {/* Nombre + medidas */}
            <div className={`${oculto(k)}g3-texto text-center lg:order-1 lg:col-span-5 lg:text-left`}>
              <p data-l className="text-[0.7rem] uppercase tracking-[0.2em] text-ink/50">
                Exhibidor {String(k + 1).padStart(2, "0")}
              </p>
              <h3
                id={`g3-${g.slug}`}
                data-l
                className="mt-2 font-display text-[length:min(var(--text-step-6),9svh,calc((100vw-3rem)/6.2))] font-extrabold uppercase leading-[0.86] tracking-[-0.02em]"
              >
                {g.nombre}
              </h3>
              <p data-l className="mx-auto mt-4 max-w-[38ch] text-[length:var(--text-step-0)] leading-snug text-ink/70 lg:mx-0 [@media(max-height:700px)]:hidden">
                {g.bajada}
              </p>
              <dl className="mx-auto mt-5 grid max-w-[24rem] grid-cols-3 border-t border-ink/15 pt-4 lg:mx-0 lg:mt-8 lg:pt-6">
                {g.medidas.map((m) => (
                  <div key={m.k} data-d>
                    <dt className="text-[0.62rem] uppercase tracking-[0.16em] text-ink/50">{m.k}</dt>
                    <dd className="mt-1 font-display text-[length:var(--text-step-2)] font-bold leading-none">{m.v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-5 hidden space-y-1 text-[length:var(--text-step--1)] text-ink/60 lg:block [@media(max-height:760px)]:hidden">
                {g.detalle.map((d) => (
                  <li key={d} data-d>
                    {d}
                  </li>
                ))}
              </ul>
              {conCta && (
                <div data-d className="mt-6 flex justify-center lg:mt-9 lg:justify-start">
                  <Button href={waHref(g.nombre)} tone="dark">
                    Quiero uno así
                  </Button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
