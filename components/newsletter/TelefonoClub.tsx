import { house, balloonRed, balloonRed2, balloonBlack, balloonBlack2 } from "@/content/brandShapes";
import { preventaVigente, siguientePreventa, hastaCorto, EVENT_CUPO } from "@/content/evento";
import { DESCUENTO_BIENVENIDA } from "@/content/newsletter";

/**
 * Celular ilustrativo del Club con tarjetas flotantes alrededor que explican
 * cómo funciona (referencia que mandó Fran: app de viajes con chips flotantes).
 *  · "perfil": lo que ve la clienta en su cuenta — código del Club, pedidos y
 *    "repetir pedido". Va en la banda general del newsletter.
 *  · "summit": la entrada del Event Summit — pase, QR, fecha y precio de la
 *    preventa vigente (de content/evento.ts, no inventado).
 * Todo es decorativo (aria-hidden): los datos de ejemplo están marcados como
 * tales; los precios y fechas reales salen del contenido del sitio.
 * Escala con el contenedor (container queries, unidades cqw).
 */
type Variante = "perfil" | "summit";

const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;

function Casita({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="130 120 380 370" className={className} aria-hidden="true">
      <path d={house.d} fill="currentColor" fillRule="evenodd" />
      <path d={balloonBlack.d} fill="currentColor" fillRule="evenodd" />
      <path d={balloonBlack2.d} fill="currentColor" fillRule="evenodd" />
      <path d={balloonRed.d} fill="var(--color-brand-red)" fillRule="evenodd" />
      <path d={balloonRed2.d} fill="var(--color-brand-red)" fillRule="evenodd" />
    </svg>
  );
}

/** QR decorativo determinístico (no codifica nada). */
function QrFalso() {
  const n = 21;
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const celdas: [number, number][] = [];
  const enOjo = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!enOjo(x, y) && rnd() > 0.52) celdas.push([x, y]);
  const ojo = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="var(--color-bone)" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="h-full w-full" shapeRendering="crispEdges" aria-hidden="true">
      {celdas.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
      {ojo(0, 0)}
      {ojo(n - 7, 0)}
      {ojo(0, n - 7)}
    </svg>
  );
}

const flotante =
  "absolute rounded-[calc(var(--u)*1.1)] bg-bone text-ink shadow-[0_calc(var(--u)*2.4)_calc(var(--u)*5)_calc(var(--u)*-1.6)_rgb(0_0_0/0.55)] tc-flota";

export function TelefonoClub({ variante }: { variante: Variante }) {
  const pv = preventaVigente();
  const sig = siguientePreventa();

  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[38rem] select-none [container-name:tc] [container-type:inline-size]">
    <div className="tc relative aspect-[1/0.98] w-full">
      <style>{`
        .tc{--u:1cqw}
        @container tc (max-width:32rem){
          .tc{--u:1.45cqw}
          .tc-tel{width:76%!important}
          .tc-ancha{width:52%!important}
        }
        .tc-flota{animation:tc-flota 6s ease-in-out infinite}
        .tc-flota.tc-b{animation-delay:-2s}.tc-flota.tc-c{animation-delay:-4s}
        @keyframes tc-flota{0%,100%{translate:0 0}50%{translate:0 calc(var(--u)*-1.4)}}
        @media (prefers-reduced-motion:reduce){.tc-flota{animation:none}}
      `}</style>

      {/* El teléfono */}
      <div className="tc-tel absolute left-1/2 top-[2%] h-[96%] w-[50%] -translate-x-1/2 rounded-[calc(var(--u)*6.5)] border-[length:calc(var(--u)*1.4)] border-ink bg-ink p-[calc(var(--u)*0.6)] shadow-[0_calc(var(--u)*4)_calc(var(--u)*8)_calc(var(--u)*-3)_rgb(0_0_0/0.6)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--u)*5.2)] bg-bone text-ink">
          {/* Barra de estado + notch */}
          <div className="flex items-center justify-between px-[calc(var(--u)*4.5)] pt-[calc(var(--u)*2.6)] font-sans text-[length:calc(var(--u)*2.1)] font-semibold">
            <span>10:42</span>
            <span className="absolute left-1/2 top-[calc(var(--u)*1.4)] h-[calc(var(--u)*4.2)] w-[calc(var(--u)*17)] -translate-x-1/2 rounded-full bg-ink" />
            <span className="tracking-[0.2em]">•••</span>
          </div>

          {variante === "perfil" ? (
            <div className="flex flex-1 flex-col gap-[calc(var(--u)*2.4)] px-[calc(var(--u)*3.6)] pb-[calc(var(--u)*3.6)] pt-[calc(var(--u)*4)]">
              <div className="flex items-center justify-between">
                <p className="font-display text-[length:calc(var(--u)*3.8)] font-bold leading-none">Mi cuenta</p>
                <span className="rounded-full bg-champagne px-[calc(var(--u)*1.8)] py-[calc(var(--u)*0.7)] text-[length:calc(var(--u)*1.6)] font-semibold uppercase tracking-[0.14em]">Club</span>
              </div>
              {/* Tarjeta del Club */}
              <div className="rounded-[calc(var(--u)*2.4)] bg-bordeaux p-[calc(var(--u)*3)] text-bone">
                <p className="text-[length:calc(var(--u)*1.6)] uppercase tracking-[0.18em] text-champagne">Tu código</p>
                <p className="mt-[calc(var(--u)*0.8)] font-mono text-[length:calc(var(--u)*3.6)] font-bold tracking-[0.08em]">CLUB-XXXXX</p>
                <p className="mt-[calc(var(--u)*0.6)] text-[length:calc(var(--u)*1.8)] text-bone/80">{DESCUENTO_BIENVENIDA}% off en tu primer pedido</p>
              </div>
              <p className="text-[length:calc(var(--u)*1.7)] font-semibold uppercase tracking-[0.16em] text-ink/60">Mis pedidos</p>
              <ul className="flex flex-col gap-[calc(var(--u)*1.4)] text-[length:calc(var(--u)*1.9)]">
                {[
                  ["Estantería Eclipse", "Confirmado"],
                  ["Arco extensible", "En producción"],
                  ["Funda para aro", "Enviado"],
                ].map(([p, e]) => (
                  <li key={p} className="flex items-center justify-between rounded-[calc(var(--u)*1.6)] bg-white px-[calc(var(--u)*2.2)] py-[calc(var(--u)*1.8)] shadow-[0_calc(var(--u)*0.4)_calc(var(--u)*1.2)_rgb(0_0_0/0.06)]">
                    <span>
                      <span className="block font-semibold leading-tight">{p}</span>
                      <span className="text-[length:calc(var(--u)*1.6)] text-ink/55">SF-XXXXX</span>
                    </span>
                    <span className="rounded-full bg-sand px-[calc(var(--u)*1.4)] py-[calc(var(--u)*0.5)] text-[length:calc(var(--u)*1.5)] font-semibold">{e}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-auto rounded-full bg-ink py-[calc(var(--u)*2)] text-center text-[length:calc(var(--u)*1.8)] font-semibold uppercase tracking-[0.14em] text-bone">
                Repetir pedido
              </span>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-[calc(var(--u)*2.4)] px-[calc(var(--u)*3.6)] pb-[calc(var(--u)*3.6)] pt-[calc(var(--u)*4)]">
              <div className="flex items-center justify-between">
                <p className="font-display text-[length:calc(var(--u)*3.8)] font-bold leading-none">Tu entrada</p>
                <span className="rounded-full bg-champagne px-[calc(var(--u)*1.8)] py-[calc(var(--u)*0.7)] text-[length:calc(var(--u)*1.6)] font-semibold uppercase tracking-[0.14em]">Pase VIP</span>
              </div>
              {/* Ticket */}
              <div className="relative flex-1 overflow-hidden rounded-[calc(var(--u)*2.4)] bg-ink p-[calc(var(--u)*3)] text-bone">
                <p className="text-[length:calc(var(--u)*1.5)] uppercase tracking-[0.2em] text-champagne">Sweet Flowers</p>
                <p className="font-display text-[length:calc(var(--u)*3.6)] font-extrabold uppercase leading-[0.95]">Event Summit</p>
                <p className="mt-[calc(var(--u)*1)] text-[length:calc(var(--u)*1.8)] text-bone/80">9 de abril de 2027 · 12:30 h</p>
                <p className="text-[length:calc(var(--u)*1.8)] text-bone/60">La Rural · Palermo</p>
                <div className="mx-auto mt-[calc(var(--u)*2.2)] aspect-square w-[62%] rounded-[calc(var(--u)*1.2)] bg-bone p-[calc(var(--u)*1.6)] text-ink">
                  <QrFalso />
                </div>
                <p className="mt-[calc(var(--u)*1.4)] text-center font-mono text-[length:calc(var(--u)*2)] tracking-[0.14em] text-bone/80">SUM-XXXXX</p>
              </div>
              <div className="grid grid-cols-2 gap-[calc(var(--u)*1.4)] text-[length:calc(var(--u)*1.6)] font-semibold uppercase tracking-[0.1em]">
                <span className="rounded-full border border-ink/25 py-[calc(var(--u)*1.6)] text-center">Calendario</span>
                <span className="rounded-full bg-ink py-[calc(var(--u)*1.6)] text-center text-bone">Cómo llegar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas flotantes que explican cómo funciona */}
      {variante === "perfil" ? (
        <>
          <div className={`${flotante} tc-ancha -left-[5%] top-[14%] w-[38%] p-[calc(var(--u)*2.6)]`}>
            <p className="font-mono text-[length:calc(var(--u)*1.6)] uppercase tracking-[0.14em] text-ink/55">Al sumarte · por mail</p>
            <p className="font-display text-[length:calc(var(--u)*6)] font-extrabold leading-none">{DESCUENTO_BIENVENIDA}% OFF</p>
            <p className="mt-[calc(var(--u)*1)] flex flex-wrap items-center gap-[calc(var(--u)*1)] text-[length:calc(var(--u)*1.9)]">
              <span className="rounded-full bg-champagne px-[calc(var(--u)*1.4)] py-[calc(var(--u)*0.4)] font-mono text-[length:calc(var(--u)*1.6)] font-semibold">1er pedido</span>
              con tu código
            </p>
          </div>
          <div className={`${flotante} tc-b right-[2%] top-[6%] bg-ink p-[calc(var(--u)*2.2)] text-bone`}>
            <p className="text-[length:calc(var(--u)*1.6)] uppercase tracking-[0.14em] text-champagne">Pedido por WhatsApp</p>
            <p className="font-display text-[length:calc(var(--u)*3)] font-bold leading-tight">Te responde Flor</p>
            <p className="text-[length:calc(var(--u)*1.7)] text-bone/65">sin bots, en persona</p>
          </div>
          <div className={`${flotante} tc-c bottom-[12%] -right-[7%] flex items-center gap-[calc(var(--u)*2)] p-[calc(var(--u)*2.2)]`}>
            <span className="grid h-[calc(var(--u)*8)] w-[calc(var(--u)*8)] place-items-center rounded-[calc(var(--u)*1.6)] bg-ink text-bone">
              <Casita className="h-[calc(var(--u)*5.6)] w-auto" />
            </span>
            <span>
              <span className="block font-semibold text-[length:calc(var(--u)*2.3)] leading-tight">Tus pedidos, guardados</span>
              <span className="text-[length:calc(var(--u)*1.7)] text-ink/60">estado y repetir en un toque</span>
            </span>
          </div>
          <div className={`${flotante} tc-b bottom-[20%] left-[6%] grid h-[calc(var(--u)*11)] w-[calc(var(--u)*11)] place-items-center rounded-[calc(var(--u)*2)] bg-bone`}>
            <Casita className="h-[calc(var(--u)*7.4)] w-auto text-ink" />
          </div>
        </>
      ) : (
        <>
          <div className={`${flotante} tc-ancha -left-[5%] top-[14%] w-[40%] p-[calc(var(--u)*2.6)]`}>
            <p className="font-mono text-[length:calc(var(--u)*1.6)] uppercase tracking-[0.14em] text-ink/55">
              {pv ? `${pv.nombre} · hasta ${hastaCorto(pv)}` : "Pase General"}
            </p>
            <p className="font-display text-[length:calc(var(--u)*5.6)] font-extrabold leading-none">{pv ? ars(pv.precios.general) : "Inscripción"}</p>
            {sig && (
              <p className="mt-[calc(var(--u)*1)] flex flex-wrap items-center gap-[calc(var(--u)*1)] text-[length:calc(var(--u)*1.8)]">
                <span className="rounded-full bg-champagne px-[calc(var(--u)*1.4)] py-[calc(var(--u)*0.4)] font-mono text-[length:calc(var(--u)*1.6)] font-semibold">Después {ars(sig.precios.general)}</span>
                pase general
              </p>
            )}
          </div>
          <div className={`${flotante} tc-b right-[2%] top-[6%] bg-ink p-[calc(var(--u)*2.2)] text-bone`}>
            <p className="text-[length:calc(var(--u)*1.6)] uppercase tracking-[0.14em] text-champagne">Cupo limitado</p>
            <p className="font-display text-[length:calc(var(--u)*4.4)] font-extrabold leading-none">{EVENT_CUPO} lugares</p>
            <p className="text-[length:calc(var(--u)*1.7)] text-bone/65">te avisamos antes de que suba</p>
          </div>
          <div className={`${flotante} tc-c bottom-[12%] -right-[7%] flex items-center gap-[calc(var(--u)*2)] p-[calc(var(--u)*2.2)]`}>
            <span className="grid h-[calc(var(--u)*8)] w-[calc(var(--u)*8)] place-items-center rounded-[calc(var(--u)*1.6)] bg-ink p-[calc(var(--u)*1.4)] text-bone">
              <QrFalso />
            </span>
            <span>
              <span className="block font-semibold text-[length:calc(var(--u)*2.3)] leading-tight">Entrada con QR</span>
              <span className="text-[length:calc(var(--u)*1.7)] text-ink/60">te llega por mail al pagar</span>
            </span>
          </div>
          <div className={`${flotante} tc-b bottom-[20%] left-[6%] grid h-[calc(var(--u)*11)] w-[calc(var(--u)*11)] place-items-center rounded-[calc(var(--u)*2)] bg-bone`}>
            <Casita className="h-[calc(var(--u)*7.4)] w-auto text-ink" />
          </div>
        </>
      )}
    </div>
    </div>
  );
}
