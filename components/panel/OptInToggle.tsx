"use client";

import { useState } from "react";

// Toggle de opt-in de email para un contacto. UI mock (estado local): refleja y
// alterna el consentimiento. El opt-in es requisito LEGAL (Ley 25.326) para que
// un contacto entre a campañas — por eso es visible y editable, con etiqueta clara.
//
// 🔌 GONZALO: al cambiar, persistí consent.optIn en el Contact (con fecha y
// origen del consentimiento). No dejes que se envíe campaña a quien lo tenga en
// false.
export function OptInToggle({
  defaultOn,
  contactoLabel,
}: {
  defaultOn: boolean;
  contactoLabel: string;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Opt-in de email de ${contactoLabel}`}
      onClick={() => setOn((v) => !v)}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center"
    >
      {/* Track visual (44px de hit area alrededor, sin agrandarlo). */}
      <span
        className={`inline-flex h-6 w-11 items-center rounded-[var(--radius-pill)] border transition-colors ${
          on ? "border-botanical/40 bg-botanical/25" : "border-line bg-bone"
        }`}
        aria-hidden="true"
      >
        <span
          className={`h-4 w-4 rounded-full transition-transform duration-200 ease-[var(--ease-out-expo)] ${
            on ? "translate-x-6 bg-botanical" : "translate-x-1 bg-muted"
          }`}
        />
      </span>
    </button>
  );
}
