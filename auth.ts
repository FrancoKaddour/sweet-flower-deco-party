/**
 * Autenticación (Auth.js v5) — un solo sistema para STAFF (panel) y CLIENTES.
 * - Google siempre; link por email (Resend) solo si hay AUTH_RESEND_KEY y
 *   dominio verificado (ver docs/SETUP_BACKEND.md).
 * - Sesiones en base (adapter Drizzle): se pueden revocar desde el panel.
 * - Roles: el staff se define por env (PANEL_SUPERADMINS / PANEL_ADMINS /
 *   PANEL_EDITORS, emails separados por coma) y se sincroniza en cada login.
 *   Todo el resto entra como "customer". La autorización real se valida en el
 *   DAL (lib/dal.ts), nunca solo en la UI. Ver skill auth-review.
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { accounts, sessions, subscribers, summitRegistrations, users, verificationTokens, type Role } from "@/db/schema";
import { BASE_URL, enviarEmail } from "@/lib/email/enviar";
import { correoBienvenidaCuenta } from "@/lib/email/plantillas";
import { rolDeStaff } from "@/lib/auth/roles";

export { rolDeStaff };

const providers = [
  // Vinculación por email: Google verifica el email, así que entrar con Google
  // a una cuenta creada por link de email es seguro. OJO (S-11): si se suma OTRO
  // proveedor que no verifique emails, sacar esta opción (el rol de staff sale
  // del email).
  Google({ allowDangerousEmailAccountLinking: true }),
  ...(process.env.AUTH_RESEND_KEY
    ? [
        Resend({
          apiKey: process.env.AUTH_RESEND_KEY,
          from: process.env.AUTH_EMAIL_FROM ?? "Sweet Flowers <hola@sweetflowers.com.ar>",
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: db
    ? DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      })
    : undefined,
  // Clientes: 30 días. El staff queda en 7 días deslizantes (lo recorta lib/dal.ts).
  session: { strategy: db ? "database" : "jwt", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  providers,
  pages: { signIn: "/ingresar", verifyRequest: "/ingresar?enviado=1", error: "/ingresar" },
  callbacks: {
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: Role }).role ?? "customer";
      }
      return session;
    },
  },
  events: {
    // Cuenta nueva: mail de bienvenida y, si ya estaba en el club, se vinculan.
    async createUser({ user }) {
      if (!db || !user.id || !user.email) return;
      try {
        await db
          .update(subscribers)
          .set({ userId: user.id })
          .where(eq(subscribers.email, user.email.toLowerCase()));
        if (rolDeStaff(user.email)) return; // el staff no recibe el mail de clientes
        const c = correoBienvenidaCuenta({ base: BASE_URL, nombre: user.name });
        await enviarEmail({ to: user.email, subject: c.asunto, html: c.html, text: c.texto });
      } catch (e) {
        console.error("[auth] bienvenida", e);
      }
    },
    // Sincroniza el rol de staff en cada ingreso (alta, baja o cambio por env).
    async signIn({ user, account, profile }) {
      if (!db || !user.id || !user.email) return;
      const staff = rolDeStaff(user.email);
      const actual = (user as { role?: Role }).role;
      const nuevo: Role = staff ?? (actual && actual !== "customer" ? "customer" : actual ?? "customer");
      if (nuevo !== actual) await db.update(users).set({ role: nuevo }).where(eq(users.id, user.id));
      // Historial: las inscripciones al Summit hechas sin sesión con este email
      // pasan a la cuenta. SOLO con email verificado por el proveedor (link por
      // email = verificado; Google = `email_verified`). Los pedidos del carrito no
      // guardan email: se vinculan desde el dispositivo (modules/cuenta/actions.ts).
      const verificado = account?.type === "email" || (account?.provider === "google" && (profile as { email_verified?: boolean } | undefined)?.email_verified === true);
      if (!verificado) return;
      try {
        await db
          .update(summitRegistrations)
          .set({ userId: user.id })
          .where(and(eq(summitRegistrations.email, user.email.toLowerCase()), isNull(summitRegistrations.userId)));
      } catch (e) {
        console.error("[auth] vincular inscripciones", e instanceof Error ? e.message : e);
      }
    },
  },
});
