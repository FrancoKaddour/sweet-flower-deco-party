/**
 * Código corto y legible para identificar un pedido o reserva en WhatsApp
 * (ej. "SF-7KQ4M"). Sin 0/O/1/I para que no se confundan al dictarlo.
 */
const ALFABETO = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function nuevoCodigo(prefijo: string, largo = 5): string {
  const bytes = new Uint8Array(largo);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += ALFABETO[b % ALFABETO.length];
  return `${prefijo}-${s}`;
}
