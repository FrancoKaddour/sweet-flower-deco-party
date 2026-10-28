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
  "absolute rounded-[1.1cqw] bg-bone text-ink shadow-[0_2.4cqw_5cqw_-1.6cqw_rgb(0_0_0/0.55)] tc-flota";

export function TelefonoClub({ variante }: { variante: Variante }) {
  const pv = preventaVigente();
  const sig = siguientePreventa();

  return (
    <div aria-hidden="true" className="tc relative mx-auto aspect-[1/1.02] w-full max-w-[34rem] [container-type:inline-size] select-none">
      <style>{`
        .tc-flota{animation:tc-flota 6s ease-in-out infinite}
        .tc-flota.tc-b{animation-delay:-2s}.tc-flota.tc-c{animation-delay:-4s}
        @keyframes tc-flota{0%,100%{translate:0 0}50%{translate:0 -1.4cqw}}
        @media (prefers-reduced-motion:reduce){.tc-flota{animation:none}}
      `}</style>

      {/* Fondo: "pista" en damero vino/tinta (la pista de baile del evento) */}
      <div
        className="absolute inset-y-[3%] right-0 left-[16%] rounded-[3cqw] opacity-90"
        style={{
          backgroundImage:
            "conic-gradient(var(--color-wine,#7A1218) 25%, color-mix(in oklab, var(--color-ink) 70%, var(--color-wine,#7A1218)) 0 50%, var(--color-wine,#7A1218) 0 75%, color-mix(in oklab, var(--color-ink) 70%, var(--color-wine,#7A1218)) 0)",
          backgroundSize: "9cqw 9cqw",
        }}
      />

      {/* Carta inclinada detrás del teléfono (arco / ticket) */}
      <div className="absolute left-[18%] top-[22%] h-[60%] w-[26%] -rotate-[14deg] overflow-hidden rounded-t-full rounded-b-[2cqw] border-[0.5cqw] border-ink bg-champagne">
        <div
          className="absolute inset-[10%] rounded-t-full"
          style={{ backgroundImage: "repeating-linear-gradient(180deg, var(--color-ink) 0 3cqw, transparent 3cqw 6cqw)", opacity: 0.85 }}
        />
      </div>

      {/* El teléfono */}
      <div className="absolute left-1/2 top-[6%] h-[88%] w-[47%] -translate-x-1/2 rounded-[6.5cqw] border-[1.4cqw] border-ink bg-ink p-[0.6cqw] shadow-[0_4cqw_8cqw_-3cqw_rgb(0_0_0/0.6)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[5.2cqw] bg-bone text-ink">
          {/* Barra de estado + notch */}
          <div className="flex items-center justify-between px-[4.5cqw] pt-[2.6cqw] font-sans text-[2.1cqw] font-semibold">
            <span>10:42</span>
            <span className="absolute left-1/2 top-[1.4cqw] h-[4.2cqw] w-[17cqw] -translate-x-1/2 rounded-full bg-ink" />
            <span className="tracking-[0.2em]">•••</span>
          </div>

          {variante === "perfil" ? (
            <div className="flex flex-1 flex-col gap-[2.4cqw] px-[3.6cqw] pb-[3.6cqw] pt-[4cqw]">
              <div className="flex items-center justify-between">
                <p className="font-display text-[3.8cqw] font-bold leading-none">Mi cuenta</p>
                <span className="rounded-full bg-champagne px-[1.8cqw] py-[0.7cqw] text-[1.6cqw] font-semibold uppercase tracking-[0.14em]">Club</span>
              </div>
              {/* Tarjeta del Club */}
              <div className="rounded-[2.4cqw] bg-bordeaux p-[3cqw] text-bone">
                <p className="text-[1.6cqw] uppercase tracking-[0.18em] text-champagne">Tu código</p>
                <p className="mt-[0.8cqw] font-mono text-[3.6cqw] font-bold tracking-[0.08em]">CLUB-XXXXX</p>
                <p className="mt-[0.6cqw] text-[1.8cqw] text-bone/80">{DESCUENTO_BIENVENIDA}% off en tu primer pedido</p>
              </div>
              <p className="text-[1.7cqw] font-semibold uppercase tracking-[0.16em] text-ink/60">Mis pedidos</p>
              <ul className="flex flex-col gap-[1.4cqw] text-[1.9cqw]">
                {[
                  ["Estantería Eclipse", "Confirmado"],
                  ["Arco extensible", "En producción"],
                  ["Funda para aro", "Enviado"],
                ].map(([p, e]) => (
                  <li key={p} className="flex items-center justify-between rounded-[1.6cqw] bg-white px-[2.2cqw] py-[1.8cqw] shadow-[0_0.4cqw_1.2cqw_rgb(0_0_0/0.06)]">
                    <span>
                      <span className="block font-semibold leading-tight">{p}</span>
                      <span className="text-[1.6cqw] text-ink/55">SF-XXXXX</span>
                    </span>
                    <span className="rounded-full bg-sand px-[1.4cqw] py-[0.5cqw] text-[1.5cqw] font-semibold">{e}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-auto rounded-full bg-ink py-[2cqw] text-center text-[1.8cqw] font-semibold uppercase tracking-[0.14em] text-bone">
                Repetir pedido
              </span>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-[2.4cqw] px-[3.6cqw] pb-[3.6cqw] pt-[4cqw]">
              <div className="flex items-center justify-between">
                <p className="font-display text-[3.8cqw] font-bold leading-none">Tu entrada</p>
                <span className="rounded-full bg-champagne px-[1.8cqw] py-[0.7cqw] text-[1.6cqw] font-semibold uppercase tracking-[0.14em]">Pase VIP</span>
              </div>
              {/* Ticket */}
              <div className="relative flex-1 overflow-hidden rounded-[2.4cqw] bg-ink p-[3cqw] text-bone">
                <p className="text-[1.5cqw] uppercase tracking-[0.2em] text-champagne">Sweet Flowers</p>
                <p className="font-display text-[3.6cqw] font-extrabold uppercase leading-[0.95]">Event Summit</p>
                <p className="mt-[1cqw] text-[1.8cqw] text-bone/80">9 de abril de 2027 · 12:30 h</p>
                <p className="text-[1.8cqw] text-bone/60">La Rural · Palermo</p>
                <div className="mx-auto mt-[2.2cqw] aspect-square w-[62%] rounded-[1.2cqw] bg-bone p-[1.6cqw] text-ink">
                  <QrFalso />
                </div>
                <p className="mt-[1.4cqw] text-center font-mono text-[2cqw] tracking-[0.14em] text-bone/80">SUM-XXXXX</p>
              </div>
              <div className="grid grid-cols-2 gap-[1.4cqw] text-[1.6cqw] font-semibold uppercase tracking-[0.1em]">
                <span className="rounded-full border border-ink/25 py-[1.6cqw] text-center">Calendario</span>
                <span className="rounded-full bg-ink py-[1.6cqw] text-center text-bone">Cómo llegar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas flotantes que explican cómo funciona */}
      {variante === "perfil" ? (
        <>
          <div className={`${flotante} left-0 top-[14%] w-[38%] p-[2.6cqw]`}>
            <p className="font-mono text-[1.6cqw] uppercase tracking-[0.14em] text-ink/55">Al sumarte · por mail</p>
            <p className="font-display text-[6cqw] font-extrabold leading-none">{DESCUENTO_BIENVENIDA}% OFF</p>
            <p className="mt-[1cqw] flex flex-wrap items-center gap-[1cqw] text-[1.9cqw]">
              <span className="rounded-full bg-champagne px-[1.4cqw] py-[0.4cqw] font-mono text-[1.6cqw] font-semibold">1er pedido</span>
              con tu código
            </p>
          </div>
          <div className={`${flotante} tc-b right-[2%] top-[6%] bg-ink p-[2.2cqw] text-bone`}>
            <p className="text-[1.6cqw] uppercase tracking-[0.14em] text-champagne">Pedido por WhatsApp</p>
            <p className="font-display text-[3cqw] font-bold leading-tight">Te responde Flor</p>
            <p className="text-[1.7cqw] text-bone/65">sin bots, en persona</p>
          </div>
          <div className={`${flotante} tc-c bottom-[12%] right-0 flex items-center gap-[2cqw] p-[2.2cqw]`}>
            <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-[1.6cqw] bg-ink text-bone">
              <Casita className="h-[5.6cqw] w-auto" />
            </span>
            <span>
              <span className="block font-semibold text-[2.3cqw] leading-tight">Tus pedidos, guardados</span>
              <span className="text-[1.7cqw] text-ink/60">estado y repetir en un toque</span>
            </span>
          </div>
          <div className={`${flotante} tc-b bottom-[20%] left-[6%] grid h-[11cqw] w-[11cqw] place-items-center rounded-[2cqw] bg-champagne`}>
            <Casita className="h-[7.4cqw] w-auto text-ink" />
          </div>
        </>
      ) : (
        <>
          <div className={`${flotante} left-0 top-[14%] w-[40%] p-[2.6cqw]`}>
            <p className="font-mono text-[1.6cqw] uppercase tracking-[0.14em] text-ink/55">
              {pv ? `${pv.nombre} · hasta ${hastaCorto(pv)}` : "Pase General"}
            </p>
            <p className="font-display text-[5.6cqw] font-extrabold leading-none">{pv ? ars(pv.precios.general) : "Inscripción"}</p>
            {sig && (
              <p className="mt-[1cqw] flex flex-wrap items-center gap-[1cqw] text-[1.8cqw]">
                <span className="rounded-full bg-champagne px-[1.4cqw] py-[0.4cqw] font-mono text-[1.6cqw] font-semibold">Después {ars(sig.precios.general)}</span>
                pase general
              </p>
            )}
          </div>
          <div className={`${flotante} tc-b right-[2%] top-[6%] bg-ink p-[2.2cqw] text-bone`}>
            <p className="text-[1.6cqw] uppercase tracking-[0.14em] text-champagne">Cupo limitado</p>
            <p className="font-display text-[4.4cqw] font-extrabold leading-none">{EVENT_CUPO} lugares</p>
            <p className="text-[1.7cqw] text-bone/65">te avisamos antes de que suba</p>
          </div>
          <div className={`${flotante} tc-c bottom-[12%] right-0 flex items-center gap-[2cqw] p-[2.2cqw]`}>
            <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-[1.6cqw] bg-ink p-[1.4cqw] text-bone">
              <QrFalso />
            </span>
            <span>
              <span className="block font-semibold text-[2.3cqw] leading-tight">Entrada con QR</span>
              <span className="text-[1.7cqw] text-ink/60">te llega por mail al pagar</span>
            </span>
          </div>
          <div className={`${flotante} tc-b bottom-[20%] left-[6%] grid h-[11cqw] w-[11cqw] place-items-center rounded-[2cqw] bg-champagne`}>
            <Casita className="h-[7.4cqw] w-auto text-ink" />
          </div>
        </>
      )}
    </div>
  );
}
