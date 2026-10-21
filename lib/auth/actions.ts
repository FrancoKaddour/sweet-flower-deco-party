"use server";

import { signIn, signOut } from "@/auth";

/** Ingreso con Google. `volver` = a dónde redirigir después (ruta interna). */
export async function ingresarConGoogle(volver: string) {
  const destino = volver.startsWith("/") && !volver.startsWith("//") ? volver : "/";
  await signIn("google", { redirectTo: destino });
}

/** Ingreso con link por email (solo si el proveedor está habilitado). */
export async function ingresarConEmail(volver: string, formData: FormData) {
  const destino = volver.startsWith("/") && !volver.startsWith("//") ? volver : "/";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
  await signIn("resend", { email, redirectTo: destino });
}

export async function salir(destino = "/") {
  await signOut({ redirectTo: destino });
}

export const emailHabilitado = async () => Boolean(process.env.AUTH_RESEND_KEY);
