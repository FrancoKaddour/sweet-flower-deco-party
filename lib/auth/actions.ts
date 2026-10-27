"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { ipCliente, limitar } from "@/lib/rate-limit";
import { CAMPO_CAPTCHA, verificarCaptcha } from "@/lib/captcha";
import { rutaSegura } from "@/lib/reglas";

/** Ingreso con Google. `volver` = a dónde redirigir después (solo rutas internas, S-10). */
export async function ingresarConGoogle(volver: string) {
  await signIn("google", { redirectTo: rutaSegura(volver, "/") });
}

/**
 * Ingreso con link por email (solo si el proveedor está habilitado).
 * Rate limit (S-11): 5 por hora por IP y 3 por hora por email destino. Si se
 * pasa, la respuesta es la misma ("te enviamos un link") para no revelar nada.
 */
export async function ingresarConEmail(volver: string, formData: FormData) {
  const destino = rutaSegura(volver, "/");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return;
  const ip = await ipCliente();
  const okIp = await limitar(`login:ip:${ip}`, 5, 3600);
  const okEmail = okIp && (await limitar(`login:email:${email}`, 3, 3600));
  if (!okIp || !okEmail) redirect("/ingresar?enviado=1");
  // Captcha (si está configurado): sin token válido no sale el mail.
  if (!(await verificarCaptcha(formData.get(CAMPO_CAPTCHA), ip))) redirect(`/ingresar?error=captcha&volver=${encodeURIComponent(destino)}`);
  await signIn("resend", { email, redirectTo: destino });
}

export async function salir(destino = "/") {
  await signOut({ redirectTo: rutaSegura(destino, "/") });
}

export const emailHabilitado = async () => Boolean(process.env.AUTH_RESEND_KEY);
