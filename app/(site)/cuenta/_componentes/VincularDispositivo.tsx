"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { vincularPedidosDelDispositivo } from "@/modules/cuenta/actions";

/** Pedidos que este navegador mandó sin sesión → pasan a la cuenta (una vez). */
export function VincularDispositivo() {
  const router = useRouter();
  useEffect(() => {
    let codigos: string[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem("sf_pedidos_sin_cuenta") ?? "[]");
      codigos = Array.isArray(raw) ? raw.filter((c): c is string => typeof c === "string").slice(0, 10) : [];
    } catch {
      return;
    }
    if (!codigos.length) return;
    vincularPedidosDelDispositivo(codigos)
      .then((n) => {
        try {
          localStorage.removeItem("sf_pedidos_sin_cuenta");
        } catch {
          /* noop */
        }
        if (n > 0) router.refresh();
      })
      .catch(() => {});
  }, [router]);
  return null;
}
