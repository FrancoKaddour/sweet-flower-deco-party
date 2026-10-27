// Tests mínimos de las reglas de pagos y seguridad (S-28).
// Correr: npm test   (node --test con --experimental-strip-types, sin paquetes extra)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { celdaCsv, chequearMonto, enmascararDni, esModoPrueba, rutaSegura, verificarFirmaMP } from "../lib/reglas.ts";
import { rolEfectivo } from "../lib/auth/roles.ts";
import { PREVENTAS, tarifaVigente } from "../content/evento.ts";

const SECRETO = "secreto-de-prueba";
const firmar = (dataId, requestId, ts) =>
  `ts=${ts},v1=${createHmac("sha256", SECRETO).update(`id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`).digest("hex")}`;

test("firma MP: válida, alterada, vieja y sin datos", () => {
  const ahora = 1_800_000_000_000;
  const ts = String(ahora / 1000);
  const ok = firmar("123456", "req-1", ts);
  assert.equal(verificarFirmaMP({ firma: ok, requestId: "req-1", dataId: "123456", secreto: SECRETO, ahora }), true);
  // ts en milisegundos también
  const okMs = firmar("123456", "req-1", String(ahora));
  assert.equal(verificarFirmaMP({ firma: okMs, requestId: "req-1", dataId: "123456", secreto: SECRETO, ahora }), true);
  // otro pago
  assert.equal(verificarFirmaMP({ firma: ok, requestId: "req-1", dataId: "999", secreto: SECRETO, ahora }), false);
  // otro secreto
  assert.equal(verificarFirmaMP({ firma: ok, requestId: "req-1", dataId: "123456", secreto: "otro", ahora }), false);
  // replay de hace 1 hora
  assert.equal(verificarFirmaMP({ firma: ok, requestId: "req-1", dataId: "123456", secreto: SECRETO, ahora: ahora + 3600_000 }), false);
  assert.equal(verificarFirmaMP({ firma: null, requestId: "req-1", dataId: "123456", secreto: SECRETO, ahora }), false);
  assert.equal(verificarFirmaMP({ firma: "ts=1,v1=zz", requestId: null, dataId: "1", secreto: SECRETO, ahora }), false);
});

test("monto y moneda del pago aprobado", () => {
  assert.deepEqual(chequearMonto(180000, { transaction_amount: 180000, currency_id: "ARS" }), { ok: true });
  assert.deepEqual(chequearMonto(180000, { transaction_amount: 190000, currency_id: "ARS" }), { ok: true });
  assert.deepEqual(chequearMonto(180000, { transaction_amount: 179000, currency_id: "ARS" }), { ok: false, motivo: "monto" });
  assert.deepEqual(chequearMonto(180000, { transaction_amount: 180000, currency_id: "USD" }), { ok: false, motivo: "moneda" });
  assert.deepEqual(chequearMonto(180000, { transaction_amount: 180000 }), { ok: false, motivo: "moneda" });
  assert.deepEqual(chequearMonto(null, { transaction_amount: 180000, currency_id: "ARS" }), { ok: false, motivo: "sin_precio" });
});

test("modo prueba de MP", () => {
  assert.equal(esModoPrueba("prueba", "APP_USR-1"), true);
  assert.equal(esModoPrueba("produccion", "TEST-1"), false);
  assert.equal(esModoPrueba(undefined, "TEST-1"), true);
  assert.equal(esModoPrueba(undefined, "APP_USR-1"), false);
});

test("rutaSegura (open redirect)", () => {
  assert.equal(rutaSegura("/cuenta"), "/cuenta");
  assert.equal(rutaSegura("/panel?x=1#a"), "/panel?x=1#a");
  for (const malo of ["//evil.com", "/\\evil.com", "https://evil.com", "javascript:alert(1)", "/\tevil", "", null, "cuenta"]) {
    assert.equal(rutaSegura(malo, "/x"), "/x", String(malo));
  }
});

test("DNI enmascarado", () => {
  assert.equal(enmascararDni("30.123.456"), "***.456");
  assert.equal(enmascararDni(null), "");
});

test("celda CSV: comillas, fórmulas y fechas AR", () => {
  assert.equal(celdaCsv('a"b'), '"a""b"');
  for (const f of ["=1+1", "+1", "-1", "@SUM(A1)", "\t=1", " =1", "\r=1"]) assert.ok(celdaCsv(f).startsWith(`"'`), f);
  assert.equal(celdaCsv(new Date("2026-10-26T15:30:00Z")), '"26/10/2026 12:30"');
  assert.equal(celdaCsv(["a", "b"]), '"a b"');
  assert.equal(celdaCsv(null), '""');
});

test("rol efectivo: gana el menor entre sesión y env", () => {
  process.env.PANEL_SUPERADMINS = "fran@x.com";
  process.env.PANEL_ADMINS = "flor@x.com";
  process.env.PANEL_EDITORS = "";
  assert.equal(rolEfectivo("superadmin", "fran@x.com"), "superadmin");
  assert.equal(rolEfectivo("admin", "ex@x.com"), "customer"); // lo sacaron de PANEL_ADMINS
  assert.equal(rolEfectivo("admin", "fran@x.com"), "admin"); // la sesión todavía no se actualizó
  assert.equal(rolEfectivo(undefined, "flor@x.com"), "customer");
});

test("tarifa vigente: borde de fecha en hora argentina", () => {
  const p0 = PREVENTAS[0];
  const ultimoMinuto = new Date(`${p0.hasta}T23:59:00-03:00`);
  const alOtroDia = new Date(new Date(`${p0.hasta}T23:59:00-03:00`).getTime() + 2 * 60_000);
  assert.equal(tarifaVigente(ultimoMinuto).id, p0.id);
  assert.notEqual(tarifaVigente(alOtroDia).id, p0.id);
  assert.equal(tarifaVigente(new Date("2030-01-01T12:00:00-03:00")).id, "actual");
});
