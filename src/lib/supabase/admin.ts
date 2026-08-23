/**
 * Configuración del acceso administrativo (Fase 3).
 * Un único administrador: solo el correo definido en la variable de
 * entorno ADMIN_EMAIL puede usar /admin, aunque existieran otros
 * usuarios autenticados en el proyecto.
 *
 * Fail-closed: si ADMIN_EMAIL no está definida, isAdminEmail()
 * rechaza a todos (nadie alcanza el dashboard).
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export function isAdminEmail(email: string | null | undefined): boolean {
  return (
    Boolean(ADMIN_EMAIL) &&
    Boolean(email) &&
    email!.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
}
