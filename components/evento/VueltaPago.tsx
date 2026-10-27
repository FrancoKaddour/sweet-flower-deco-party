"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Estado = "ok" | "pendiente" | "error";
const EVENTO = { ok: "summit_purchase", pendiente: "summit_payment_pending", error: "summit_payment_failed" } as const;

/** Mide el resultado del pago UNA sola vez por código y estado (recargar no duplica). */
export function TrackVuelta({ estado, codigo, pase, monto }: { estado: Estado; codigo: string; pase: string; monto: number | null }) {
  useEffect(() => {
    const clave = `sf_summit_${codigo}_${estado}`;
    try {
      if (localStorage.getItem(clave)) return;
      localStorage.setItem(clave, "1");
    } catch {
      /* sin storage: se mide igual */
    }
    track(EVENTO[estado], { codigo, pase, monto: monto ?? undefined, estado });
  }, [estado, codigo, pase, monto]);
  return null;
}

/** "Contale a una colega": hoja de compartir del sistema o, si no hay, WhatsApp. */
export function CompartirSummit({ url, texto, className = "" }: { url: string; texto: string; className?: string }) {
  const wa = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`;
  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (typeof navigator.share !== "function") return;
        e.preventDefault();
        navigator.share({ title: texto, text: texto, url }).catch(() => {});
      }}
      className={className}
    >
      Contale a una colega
    </a>
  );
}
