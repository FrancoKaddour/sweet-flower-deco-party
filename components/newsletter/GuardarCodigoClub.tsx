"use client";

import { useEffect } from "react";

/**
 * Guarda el código del Club en este navegador para que el carrito lo cargue
 * solo (misma clave que components/cart/CartDrawer.tsx → CLAVE_CODIGO_CLUB).
 */
export function GuardarCodigoClub({ codigo }: { codigo: string }) {
  useEffect(() => {
    try {
      if (/^[A-Z0-9-]{3,24}$/.test(codigo)) localStorage.setItem("sf_club_codigo", codigo);
    } catch {
      /* sin storage */
    }
  }, [codigo]);
  return null;
}
