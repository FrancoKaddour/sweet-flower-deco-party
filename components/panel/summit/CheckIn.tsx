"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { buscarCheckIn, marcarAsistio, type ResultadoCheckIn } from "@/modules/ventas/actions";
import { useAccion } from "@/components/panel/Toast";

/**
 * Modo puerta del Summit (P-05 / idea wow 1). Pensado para el celular en la
 * entrada: un campo grande (DNI, código SUM-… o nombre), el resultado en
 * grande y un botón "Marcó asistencia". Si el navegador tiene BarcodeDetector
 * (Chrome Android), lee el QR del mail con la cámara; si no, se tipea.
 */

const sinSuscripcion = () => () => {};

type Detector = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> };
type DetectorCtor = new (o: { formats: string[] }) => Detector;

const ESTADO: Record<string, { l: string; ok: boolean }> = {
  pago: { l: "Pagada · puede pasar", ok: true },
  asistio: { l: "Ya está adentro", ok: false },
  consulto: { l: "No pagó", ok: false },
  seno: { l: "Señó (manual): revisá el saldo", ok: false },
  cancelado: { l: "Cancelada", ok: false },
};

export function CheckIn({ adentroInicial, cupo }: { adentroInicial: number; cupo: number }) {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState<ResultadoCheckIn[] | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [ultimo, setUltimo] = useState<{ nombre: string; pase: string } | null>(null);
  const [adentro, setAdentro] = useState(adentroInicial);
  const [camara, setCamara] = useState(false);
  const hayDetector = useSyncExternalStore(
    sinSuscripcion,
    () => "BarcodeDetector" in window,
    () => false,
  );
  const [buscando, correrBusqueda] = useAccion();
  const [marcando, correr] = useAccion();
  const input = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const buscar = useCallback(
    (q: string) =>
      correrBusqueda(async () => {
        const r = await buscarCheckIn(q);
        setResultados(r.resultados);
        setMensaje(r.mensaje);
        setUltimo(null);
        return r.ok ? { ok: true } : r;
      }),
    [correrBusqueda],
  );

  const reiniciar = () => {
    setTexto("");
    setResultados(null);
    setMensaje("");
    input.current?.focus();
  };

  const marcar = (r: ResultadoCheckIn) =>
    correr(
      async () => {
        const x = await marcarAsistio(r.id, true);
        if (x.ok) {
          setUltimo({ nombre: r.nombre, pase: r.pase });
          if (x.adentro != null) setAdentro(x.adentro);
          setResultados(null);
          setTexto("");
          navigator.vibrate?.(60);
          input.current?.focus();
        }
        return x;
      },
      {
        deshacer: async () => {
          const y = await marcarAsistio(r.id, false);
          if (y.adentro != null) setAdentro(y.adentro);
          setUltimo(null);
        },
      },
    );

  // Cámara + BarcodeDetector.
  useEffect(() => {
    if (!camara) return;
    let stream: MediaStream | null = null;
    let vivo = true;
    let timer: ReturnType<typeof setTimeout>;
    const Ctor = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
    if (!Ctor) return;
    const det = new Ctor({ formats: ["qr_code", "code_128"] });
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (!vivo || !video.current) return;
        video.current.srcObject = stream;
        await video.current.play();
        const ciclo = async () => {
          if (!vivo || !video.current) return;
          try {
            const [c] = await det.detect(video.current);
            if (c?.rawValue) {
              const cod = c.rawValue.match(/SUM-[A-Z0-9]{4,}/i)?.[0]?.toUpperCase() ?? c.rawValue.trim().slice(0, 80);
              setTexto(cod);
              setCamara(false);
              navigator.vibrate?.(30);
              buscar(cod);
              return;
            }
          } catch {
            /* cuadro sin código */
          }
          timer = setTimeout(ciclo, 220);
        };
        ciclo();
      } catch {
        setCamara(false);
        setMensaje("No pudimos abrir la cámara. Tipeá el DNI o el código.");
      }
    })();
    return () => {
      vivo = false;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [camara, buscar]);

  const pct = Math.min(100, Math.round((adentro / Math.max(1, cupo)) * 100));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4 rounded-[var(--radius-lg)] bg-bordeaux px-5 py-4 text-bone">
        <div>
          <p className="text-[length:var(--text-step--1)] text-bone/85">Adentro</p>
          <p className="text-[length:var(--text-step-5)] font-semibold leading-none tabular-nums [font-family:var(--font-logo)] [font-variant-numeric:lining-nums]" aria-live="polite">
            {adentro}
            <span className="text-[length:var(--text-step-2)] text-bone/80">/{cupo}</span>
          </p>
        </div>
        <div className="h-2 w-1/2 overflow-hidden rounded-full bg-bone/20" aria-hidden="true">
          <div className="h-full rounded-full bg-champagne transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          buscar(texto);
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor="checkin-q" className="text-[length:var(--text-step-0)] font-medium text-ink">
          DNI, código de la entrada o nombre
        </label>
        <input
          id="checkin-q"
          ref={input}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          enterKeyHint="search"
          placeholder="Ej. 30123456 o SUM-4HXQ2"
          className="min-h-16 w-full rounded-[var(--radius-md)] border-2 border-ink/20 bg-cloud px-5 text-[1.5rem] tabular-nums text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none"
        />
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <button
            type="submit"
            disabled={buscando || texto.trim().length < 2}
            className="inline-flex min-h-14 items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 text-[length:var(--text-step-0)] font-medium uppercase tracking-[0.08em] text-bone disabled:opacity-50"
          >
            {buscando ? "Buscando…" : "Buscar"}
          </button>
          {hayDetector && (
            <button
              type="button"
              onClick={() => setCamara((c) => !c)}
              aria-pressed={camara}
              className="inline-flex min-h-14 items-center justify-center rounded-[var(--radius-pill)] border-2 border-ink/20 px-6 text-[length:var(--text-step-0)] font-medium uppercase tracking-[0.08em] text-ink"
            >
              {camara ? "Cerrar cámara" : "Escanear QR"}
            </button>
          )}
        </div>
      </form>

      {camara && (
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-ink">
          <video ref={video} playsInline muted className="aspect-square w-full object-cover" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-[18%] rounded-[var(--radius-md)] border-2 border-bone/80" />
          <p className="absolute inset-x-0 bottom-3 text-center text-[length:var(--text-step--1)] text-bone">Apuntá al QR del mail de la entrada</p>
        </div>
      )}

      {ultimo && (
        <div role="status" className="rounded-[var(--radius-lg)] border border-botanical/20 bg-sage px-6 py-8 text-center">
          <p aria-hidden="true" className="text-[2.5rem] leading-none text-botanical">✓</p>
          <p className="mt-3 text-[length:var(--text-step-3)] font-semibold leading-tight text-ink [font-family:var(--font-logo)]">{ultimo.nombre}</p>
          <p className="mt-1 text-[length:var(--text-step-0)] text-ink">{ultimo.pase} · acreditada</p>
          <button type="button" onClick={reiniciar} className="mt-5 inline-flex min-h-11 items-center text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted underline-offset-4 hover:underline">
            Siguiente persona
          </button>
        </div>
      )}

      {mensaje && !ultimo && (
        <p role="alert" className="rounded-[var(--radius-md)] border border-bordeaux/30 bg-bordeaux/5 px-4 py-3 text-ink">
          {mensaje}
        </p>
      )}

      {resultados && resultados.length > 0 && (
        <ul className="flex flex-col gap-3">
          {resultados.map((r) => {
            const e = ESTADO[r.estado] ?? { l: r.estado, ok: false };
            return (
              <li key={r.id} className={`rounded-[var(--radius-lg)] border-2 p-5 ${e.ok ? "border-ink/15 bg-cloud" : "border-bordeaux/30 bg-bordeaux/5"}`}>
                <p className="text-[length:var(--text-step-2)] font-semibold leading-tight text-ink [font-family:var(--font-logo)]">{r.nombre}</p>
                <p className="mt-1 text-ink">
                  <strong className="font-medium">{r.pase}</strong> · <span className="font-mono">{r.codigo}</span>
                  {r.dni ? ` · DNI ${r.dni}` : ""}
                </p>
                <p className={`mt-1 text-[length:var(--text-step--1)] ${e.ok ? "text-muted" : "font-medium text-bordeaux"}`}>{e.l}</p>
                {r.estado === "pago" && (
                  <button
                    type="button"
                    disabled={marcando}
                    onClick={() => marcar(r)}
                    className="mt-4 inline-flex min-h-16 w-full items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 text-[length:var(--text-step-1)] font-medium uppercase tracking-[0.06em] text-bone disabled:opacity-50"
                  >
                    {marcando ? "Marcando…" : "Marcó asistencia"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
