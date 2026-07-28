"use client";

import { useId, useRef, useState } from "react";

// Tabs accesibles (patrón WAI-ARIA): role="tablist" + tabs con role="tab" y
// paneles con role="tabpanel". Navegación con flechas ←/→ (y Home/End). Sólo se
// monta en el cliente porque maneja estado de selección; el contenido de cada
// panel puede venir de Server Components (se pasa como children).

export type TabDef = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export function Tabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Vistas de la sección"
        className="flex flex-wrap gap-1 border-b border-line"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`-mb-px min-h-11 border-b-2 px-4 py-2.5 text-[length:var(--text-step-0)] font-medium transition-colors ${
                selected
                  ? "border-champagne text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={i !== active}
          tabIndex={i === active ? 0 : undefined}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
