"use client";

import { useEffect, useState } from "react";

/**
 * Puntitos de paginación para un carrusel horizontal de mobile (scroll-snap).
 * Escucha el scroll del contenedor con id `forId`, marca la página activa y
 * al tocar un punto desliza hasta esa página. Solo se ve en mobile (md:hidden).
 */
export function SwipeDots({ forId, count, label }: { forId: string; count: number; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = document.getElementById(forId);
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setActive(Math.round(p * (count - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [forId, count]);

  const go = (i: number) => {
    const el = document.getElementById(forId);
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (max * i) / Math.max(1, count - 1), behavior: "smooth" });
  };

  return (
    <div className="mt-6 flex justify-center gap-1 md:hidden" role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => go(i)}
          aria-label={`Ir a la página ${i + 1}`}
          aria-current={active === i ? "true" : undefined}
          className="grid h-8 w-8 place-items-center"
        >
          <span
            className={`block h-1.5 rounded-full bg-ink transition-all duration-500 ease-(--ease-out-quart) ${
              active === i ? "w-6 opacity-100" : "w-1.5 opacity-25"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
