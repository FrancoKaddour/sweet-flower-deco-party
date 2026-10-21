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
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens, type Role } from "@/db/schema";

const lista = (v?: string) =>
  (v ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

/** Rol de staff que corresponde a un email según las env vars (o null). */
export function rolDeStaff(email: string): Role | null {
  const e = email.toLowerCase();
  if (lista(process.env.PANEL_SUPERADMINS).includes(e)) return "superadmin";
  if (lista(process.env.PANEL_ADMINS).includes(e)) return "admin";
  if (lista(process.env.PANEL_EDITORS).includes(e)) return "editor";
  return null;
}

const providers = [
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
    // Sincroniza el rol de staff en cada ingreso (alta, baja o cambio por env).
    async signIn({ user }) {
      if (!db || !user.id || !user.email) return;
      const staff = rolDeStaff(user.email);
      const actual = (user as { role?: Role }).role;
      const nuevo: Role = staff ?? (actual && actual !== "customer" ? "customer" : actual ?? "customer");
      if (nuevo !== actual) await db.update(users).set({ role: nuevo }).where(eq(users.id, user.id));
    },
  },
});
