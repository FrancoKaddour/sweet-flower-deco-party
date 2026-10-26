"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reel de Instagram embebido SIN barra de scroll: el embed de Instagram avisa
 * su alto real por postMessage ({ type: "MEASURE", details: { height } }) y el
 * iframe se ajusta a ese alto. Mientras no llega el aviso, usa una estimación
 * calculada del ancho (cabecera + video 4:5 + pie).
 */
export function InstagramReel({ id, titulo }: { id: string; titulo: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [alto, setAlto] = useState<number | null>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!/^https:\/\/(www\.)?instagram\.com$/.test(e.origin)) return;
      if (e.source !== ref.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const h = Number(data?.details?.height);
        if (data?.type === "MEASURE" && h > 100 && h < 3000) setAlto(Math.ceil(h));
      } catch {
        /* mensajes ajenos */
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <iframe
      ref={ref}
      src={`https://www.instagram.com/reel/${id}/embed/`}
      title={titulo}
      loading="lazy"
      scrolling="no"
      allow="encrypted-media; picture-in-picture; clipboard-write"
      style={alto ? { height: alto } : undefined}
      className="block h-[calc(125cqw+260px)] w-full overflow-hidden border-0 bg-cloud"
    />
  );
}
