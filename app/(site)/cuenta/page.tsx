import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { salir } from "@/lib/auth/actions";
import { fechaCorta } from "@/lib/panel/formato";
import { esHierro, formatARS, normalizarVariantes, type Producto } from "@/modules/catalog/types";
import { getTodosLosProductos } from "@/modules/catalog/repository";
import { ESTADOS_PEDIDO, infoEstado, type Tono } from "@/modules/ventas/estados";
import { bajaDesdeCuenta, suscribirDesdeCuenta } from "@/modules/newsletter/publico";
import { clubDe, inscripcionesDe, pedidosDe, perfilDe } from "@/modules/cuenta/datos";
import { CLUB, DESCUENTO_BIENVENIDA } from "@/content/newsletter";
import { PASES } from "@/content/evento";
import type { CartItem } from "@/components/cart/CartProvider";
import type { ItemPedido } from "@/db/schema";
import { PerfilForm, type PerfilInicial } from "./_componentes/PerfilForm";
import { RepetirPedido } from "./_componentes/RepetirPedido";
import { VincularDispositivo } from "./_componentes/VincularDispositivo";
import { BajaCuenta } from "./_componentes/BajaCuenta";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

const SECCIONES = [
  { id: "datos", l: "Mis datos" },
  { id: "envio", l: "Dirección de envío" },
  { id: "pedidos", l: "Mis pedidos" },
  { id: "summit", l: "Event Summit" },
  { id: "club", l: "Club" },
  { id: "privacidad", l: "Privacidad" },
] as const;

const TONO: Record<Tono, string> = {
  neutral: "border-ink/20 text-ink/75",
  warning: "border-champagne-ink/40 bg-sand text-champagne-ink",
  info: "border-ink/20 bg-cloud text-ink",
  success: "border-ink bg-ink text-bone",
  danger: "border-bordeaux/40 text-bordeaux",
};

/** Estado del pago de una inscripción, en palabras de la persona. */
function estadoInscripcion(r: { estado: string; pagoEstado: string | null; reservaHasta: Date | null }): { l: string; tono: Tono } {
  if (r.estado === "asistio") return { l: "Asististe", tono: "success" };
  if (r.estado === "cancelado") return { l: "Cancelada", tono: "danger" };
  switch (r.pagoEstado) {
    case "aprobado":
      return { l: "Pagada · lugar confirmado", tono: "success" };
    case "en_proceso":
      return { l: "Pago en revisión", tono: "info" };
    case "rechazado":
      return { l: "Pago rechazado", tono: "danger" };
    case "devuelto":
      return { l: "Pago devuelto", tono: "neutral" };
    case "sobrecupo":
    case "monto_invalido":
      return { l: "La está revisando el equipo", tono: "warning" };
    case "pendiente":
      return r.reservaHasta && r.reservaHasta.getTime() < Date.now()
        ? { l: "Reserva vencida sin pagar", tono: "neutral" }
        : { l: "Pago pendiente", tono: "warning" };
    default:
      return r.estado === "pago" ? { l: "Pagada", tono: "success" } : { l: "Sin pago", tono: "neutral" };
  }
}

/** Líneas para "Repetir pedido" con el catálogo y los precios de hoy. */
function paraRepetir(items: ItemPedido[], catalogo: Map<string, Producto>) {
  const out: CartItem[] = [];
  let faltan = 0;
  for (const i of items) {
    const p = catalogo.get(i.slug);
    if (!p) {
      faltan += 1;
      continue;
    }
    const variante = i.variante ?? null;
    const precio = variante ? (normalizarVariantes(p.variantes).find((v) => v.etiqueta === variante)?.precio ?? null) : p.precio;
    out.push({ slug: p.slug, nombre: p.nombre, variante, precio, img: p.img, href: `/productos/${p.categoria}/${p.slug}`, hierro: esHierro(p), qty: i.qty });
  }
  return { items: out, faltan };
}

const resumenItems = (items: ItemPedido[]) => {
  const txt = items.map((i) => `${i.qty} × ${i.nombre}${i.variante ? ` (${i.variante})` : ""}`);
  return txt.length > 3 ? `${txt.slice(0, 3).join(" · ")} y ${txt.length - 3} más` : txt.join(" · ");
};

const Pill = ({ l, tono }: { l: string; tono: Tono }) => (
  <span className={`inline-flex min-h-7 items-center rounded-full border px-3 text-[0.72rem] font-medium tracking-[0.02em] ${TONO[tono]}`}>{l}</span>
);

export default async function CuentaPage() {
  const user = await requireUser("/cuenta");
  const [perfil, pedidos, inscripciones, club, catalogo] = await Promise.all([
    perfilDe(user.id),
    pedidosDe(user.id),
    inscripcionesDe(user.id, user.email),
    clubDe(user.email),
    getTodosLosProductos().catch(() => [] as Producto[]),
  ]);
  const porSlug = new Map(catalogo.map((p) => [p.slug, p]));
  // Sin confirmar (doble opt-in pendiente) no cuenta como "en el club": el botón
  // "Sumarme" lo confirma directo, porque el email de la sesión ya está verificado.
  const enClub = club?.estado === "activo" && club.confirmadoAt != null;
  const nombreGoogle = (user.name ?? "").trim();
  const nombre = perfil?.nombre ?? nombreGoogle.split(" ")[0] ?? "";
  const inicial = (nombre || user.email || "S").charAt(0).toUpperCase();

  const datos: PerfilInicial = {
    nombre: perfil?.nombre ?? nombreGoogle.split(" ")[0] ?? "",
    apellido: perfil?.apellido ?? (perfil ? "" : nombreGoogle.split(" ").slice(1).join(" ")),
    telefono: perfil?.telefono ?? "",
    dni: perfil?.dni ?? "",
    tipoCliente: perfil?.tipoCliente ?? "",
    emprendimiento: perfil?.emprendimiento ?? "",
    instagram: perfil?.instagram ?? "",
    calle: perfil?.calle ?? "",
    numero: perfil?.numero ?? "",
    pisoDepto: perfil?.pisoDepto ?? "",
    localidad: perfil?.localidad ?? "",
    provincia: perfil?.provincia ?? "",
    codigoPostal: perfil?.codigoPostal ?? "",
    transporte: perfil?.transporte ?? "",
    contactoWhatsapp: perfil?.contactoWhatsapp ?? true,
    contactoEmail: perfil?.contactoEmail ?? true,
  };
  // Qué le falta a la ficha para que un pedido salga completo.
  const claves = [
    ["Nombre y apellido", Boolean(datos.nombre && datos.apellido)],
    ["Celular", Boolean(datos.telefono)],
    ["Dirección", Boolean(datos.calle && datos.numero)],
    ["Localidad y provincia", Boolean(datos.localidad && datos.provincia)],
    ["Código postal", Boolean(datos.codigoPostal)],
  ] as const;
  const completos = claves.filter(([, ok]) => ok).length;
  const faltan = claves.filter(([, ok]) => !ok).map(([l]) => l);

  const h2 = "font-display text-[length:var(--text-step-3)] font-bold leading-none text-ink";
  const bloque = "mt-20 scroll-mt-28 border-t border-ink/10 pt-14";

  return (
    <main id="main" data-theme="light" className="bg-bone px-6 pb-24 pt-32 text-ink md:px-10 md:pt-40">
      <VincularDispositivo />
      <div className="mx-auto w-full max-w-6xl">
        {/* Encabezado: la "casita" con tu inicial y el estado de tu ficha */}
        <header className="grid grid-cols-[auto_1fr] items-end gap-x-5 gap-y-6 md:gap-x-10">
          <div
            aria-hidden="true"
            className="grid h-28 w-20 place-items-center rounded-t-full bg-bordeaux pt-4 font-display text-[2.6rem] font-bold leading-none text-bone shadow-[inset_0_0_0_6px_var(--color-bordeaux),inset_0_0_0_7px_rgb(247_243_236/0.35)] md:h-44 md:w-32 md:text-[4rem]"
          >
            {inicial}
          </div>
          <div className="min-w-0">
            <p className="text-[length:var(--text-step--1)] text-ink/65">Mi cuenta</p>
            <h1 className="mt-1 font-display text-[length:var(--text-step-6)] font-extrabold leading-[0.88] text-ink [overflow-wrap:anywhere]">
              Hola{nombre ? `, ${nombre}` : ""}
            </h1>
            <p className="mt-3 text-ink/70 [overflow-wrap:anywhere]">{user.email}</p>
          </div>
          <div className="col-span-2 flex flex-col gap-3 border-y border-ink/10 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex shrink-0 gap-1" role="img" aria-label={`Tu ficha tiene ${completos} de ${claves.length} datos para envíos`}>
                {claves.map(([l, ok]) => (
                  <span key={l} className={`h-1.5 w-7 rounded-full ${ok ? "bg-ink" : "bg-ink/15"}`} />
                ))}
              </div>
              <p className="text-[length:var(--text-step--1)] text-ink/75">
                {faltan.length === 0 ? "Tu ficha está completa: tus pedidos salen con todo cargado." : `Para que tu pedido salga completo, falta: ${faltan.join(", ").toLowerCase()}.`}
              </p>
            </div>
            <p className="text-[length:var(--text-step--1)] tabular-nums text-ink/65">
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"} · {inscripciones.length} {inscripciones.length === 1 ? "inscripción" : "inscripciones"}
            </p>
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-16">
          <nav aria-label="Secciones de tu cuenta" className="md:sticky md:top-28 md:self-start">
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0">
              {SECCIONES.map((s) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-4 text-[length:var(--text-step--1)] text-ink/80 hover:border-ink hover:text-ink md:w-full md:rounded-none md:border-0 md:border-l md:border-ink/15 md:px-4 md:hover:border-bordeaux"
                  >
                    {s.l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 max-w-3xl">
            <PerfilForm inicial={datos} aceptoPrivacidad={Boolean(perfil?.privacidadAt)} />

            <section id="pedidos" aria-labelledby="pedidos-h" className={bloque}>
              <h2 id="pedidos-h" className={h2}>
                Mis pedidos
              </h2>
              {pedidos.length === 0 ? (
                <p className="mt-5 text-ink/70">
                  Todavía no hay pedidos en tu cuenta. Los que mandes por WhatsApp con la sesión abierta aparecen acá.{" "}
                  <Link href="/productos" className="underline underline-offset-4 hover:text-bordeaux">
                    Ver productos
                  </Link>
                </p>
              ) : (
                <ol className="mt-8 border-t border-ink/10">
                  {pedidos.map((p) => {
                    const est = infoEstado(ESTADOS_PEDIDO, p.estado);
                    const rep = paraRepetir(p.items, porSlug);
                    return (
                      <li key={p.id} className="grid grid-cols-1 gap-4 border-b border-ink/10 py-6 sm:grid-cols-[1fr_auto] sm:gap-x-8">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <p className="font-display text-[length:var(--text-step-1)] font-bold tracking-[0.04em] tabular-nums">{p.codigo}</p>
                            <Pill l={p.estado === "iniciado" ? "Enviado por WhatsApp" : est.l} tono={p.estado === "iniciado" ? "neutral" : est.tono} />
                          </div>
                          <p className="mt-1 text-[length:var(--text-step--1)] text-ink/65">{fechaCorta(p.createdAt)}</p>
                          <p className="mt-3 text-ink/85 [overflow-wrap:anywhere]">{resumenItems(p.items)}</p>
                        </div>
                        <div className="flex flex-row items-end justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                          <p className="font-display text-[length:var(--text-step-2)] font-bold tabular-nums">
                            {p.total > 0 ? formatARS(p.total) : "A cotizar"}
                          </p>
                          <RepetirPedido codigo={p.codigo} items={rep.items} faltan={rep.faltan} />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
              {pedidos.some((p) => p.hayConsultar && p.total > 0) && (
                <p className="mt-4 text-[length:var(--text-step--1)] text-ink/60">Los totales no incluyen las piezas a cotizar ni el envío.</p>
              )}
            </section>

            <section id="summit" aria-labelledby="summit-h" className={bloque}>
              <h2 id="summit-h" className={h2}>
                Mis inscripciones al Summit
              </h2>
              {inscripciones.length === 0 ? (
                <p className="mt-5 text-ink/70">
                  Todavía no te inscribiste.{" "}
                  <Link href="/event-summit#inscripcion" className="underline underline-offset-4 hover:text-bordeaux">
                    Ver el Event Summit
                  </Link>
                </p>
              ) : (
                <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {inscripciones.map((r) => {
                    const e = estadoInscripcion(r);
                    const pase = PASES.find((x) => x.id === r.pase)?.nombre ?? r.pase;
                    return (
                      <li key={r.id} className="flex flex-col rounded-t-[999px] rounded-b-[var(--radius-lg)] border border-ink/15 bg-cloud px-6 pb-6 pt-14 text-center">
                        <p className="text-[length:var(--text-step--1)] text-ink/65">{r.edicion}</p>
                        <p className="mt-1 font-display text-[length:var(--text-step-2)] font-bold leading-tight">{pase}</p>
                        <p className="mt-3 font-display text-[length:var(--text-step-1)] tracking-[0.08em] tabular-nums text-bordeaux">{r.codigo}</p>
                        <div className="mt-4 flex justify-center">
                          <Pill l={e.l} tono={e.tono} />
                        </div>
                        {r.precio != null && <p className="mt-3 text-[length:var(--text-step--1)] tabular-nums text-ink/65">{formatARS(r.precio)}</p>}
                        <Link
                          href={`/event-summit/inscripcion?r=${r.id}`}
                          className="mt-5 inline-flex min-h-11 items-center justify-center self-center rounded-full border border-ink/25 px-5 text-[0.75rem] font-medium uppercase tracking-[0.12em] hover:border-ink hover:bg-ink hover:text-bone"
                        >
                          {r.pagoEstado === "aprobado" ? "Ver mi entrada" : "Ver la inscripción"}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section id="club" aria-labelledby="club-h" data-theme="dark" className="mt-20 scroll-mt-28 rounded-[var(--radius-lg)] bg-bordeaux p-7 text-bone md:p-9">
              <p className="text-[length:var(--text-step--1)] text-champagne">✧ {CLUB.nombre}</p>
              <h2 id="club-h" className="mt-3 font-display text-[length:var(--text-step-3)] font-bold leading-tight">
                {enClub ? "Sos parte del club" : CLUB.titulo}
              </h2>
              {enClub ? (
                <>
                  <p className="mt-3 text-bone/85">
                    {club?.usado ? (
                      "Ya usaste tu código de bienvenida. Igual vas a recibir primero las preventas y promos."
                    ) : (
                      <>
                        Tu código de {DESCUENTO_BIENVENIDA}%: <span className="font-bold tracking-[0.1em] text-champagne">{club?.codigo}</span>. Se carga solo en tu pedido.
                      </>
                    )}
                  </p>
                  <form action={bajaDesdeCuenta} className="mt-5">
                    <button type="submit" className="min-h-11 text-[length:var(--text-step--1)] text-bone/70 underline-offset-4 hover:text-bone hover:underline">
                      Dejar de recibir novedades
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="mt-3 max-w-[48ch] text-bone/85">{CLUB.bajada}</p>
                  <form action={suscribirDesdeCuenta} className="mt-6">
                    <button type="submit" className="min-h-12 max-w-full rounded-full bg-bone px-7 py-3 text-[0.75rem] font-semibold uppercase leading-snug tracking-[0.14em] text-ink [overflow-wrap:anywhere] hover:bg-champagne">
                      Sumarme con {user.email}
                    </button>
                  </form>
                </>
              )}
            </section>

            <section id="privacidad" aria-labelledby="privacidad-h" className={bloque}>
              <h2 id="privacidad-h" className={h2}>
                Privacidad
              </h2>
              <p className="mt-3 max-w-[56ch] text-ink/70">
                Tus datos son tuyos. Podés llevarte una copia o pedirnos que borremos tu cuenta cuando quieras (Ley 25.326).{" "}
                <Link href="/privacidad" className="underline underline-offset-4 hover:text-bordeaux">
                  Política de privacidad
                </Link>
              </p>
              <div className="mt-8 flex flex-col items-start gap-6">
                <a
                  href="/cuenta/mis-datos"
                  download
                  className="inline-flex min-h-12 items-center rounded-full border border-ink/25 px-6 text-[0.75rem] font-medium uppercase tracking-[0.12em] hover:border-ink hover:bg-ink hover:text-bone"
                >
                  Descargar mis datos (JSON)
                </a>
                <BajaCuenta />
              </div>
            </section>

            <form action={salir.bind(null, "/")} className="mt-16 border-t border-ink/10 pt-8">
              <button type="submit" className="min-h-11 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-ink/65 underline-offset-4 hover:text-ink hover:underline">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
