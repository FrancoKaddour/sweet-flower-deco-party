// Tipos compartidos de la UI del panel.

/** Rol del staff del panel. */
export type RolStaff = "superadmin" | "admin" | "editor";

/** Usuario logueado que se muestra en Sidebar/Topbar. */
export type UsuarioSesion = {
  nombre: string;
  rol: RolStaff;
  email: string;
};

export const ROL_LABEL: Record<RolStaff, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  editor: "Editor",
};
