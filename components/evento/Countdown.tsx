"use client";

import { useEffect, useState } from "react";
import { EVENT_DATE_ISO } from "@/content/evento";

type Parts = { d: number; h: number; m: number; s: number };

function partsUntil(target: number): Parts {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Cuenta regresiva en vivo hasta `target` (por defecto, el evento). En el hero
 * del Summit apunta al fin de la preventa vigente. Client-only para evitar
 * mismatch de hidratación: hasta montar muestra "—". Actualiza cada segundo.
 * Los números no "animan" (es info, no decoración) → sirve con reduced-motion.
 */
export function Countdown({
  className = "",
  target = EVENT_DATE_ISO,
  label = "Cuenta regresiva hasta el evento",
}: {
  className?: string;
  /** Fecha ISO a la que cuenta. */
  target?: string | null;
  label?: string;
}) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    if (!target) return;
    const t = new Date(target).getTime();
    const tick = () => setParts(partsUntil(t));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  // Sin fecha confirmada (o ya pasada) no hay cuenta regresiva. El "ya pasó"
  // se evalúa con el estado del efecto (Date.now en render rompe la pureza).
  const vencido = parts !== null && parts.d + parts.h + parts.m + parts.s === 0;
  if (!target || vencido) return null;

  const units: { value: number | null; label: string }[] = [
    { value: parts?.d ?? null, label: "Días" },
    { value: parts?.h ?? null, label: "Horas" },
    { value: parts?.m ?? null, label: "Min" },
    { value: parts?.s ?? null, label: "Seg" },
  ];

  return (
    <div
      className={`flex items-start gap-2.5 min-[360px]:gap-3.5 sm:gap-6 ${className}`}
      role="timer"
      aria-label={label}
    >
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start gap-2.5 min-[360px]:gap-3.5 sm:gap-6">
          <div className="flex flex-col items-center">
            <span className="font-display text-[length:min(var(--text-step-4),10vw,6.5svh)] font-extrabold leading-none tabular-nums text-bone md:text-[length:min(var(--text-step-5),6svh)]">
              {u.value === null ? "—" : pad(u.value)}
            </span>
            <span className="mt-[clamp(0.2rem,0.8svh,0.5rem)] text-[0.7rem] uppercase tracking-[0.1em] text-bone/55 sm:text-[length:var(--text-step--1)] sm:tracking-[0.16em]">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              aria-hidden="true"
              className="font-display text-[length:min(var(--text-step-4),10vw,6.5svh)] font-extrabold leading-none text-champagne/60 md:text-[length:min(var(--text-step-5),6svh)]"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
