"use client";

import { useEffect } from "react";
import { guardarOrigen } from "@/lib/analytics";

/** Guarda la primera fuente de llegada (utm/referrer) al montar. No renderiza nada. */
export function Medicion() {
  useEffect(() => {
    guardarOrigen();
  }, []);
  return null;
}
