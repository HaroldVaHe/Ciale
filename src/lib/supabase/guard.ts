import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/admin";

/**
 * Guardián compartido para Server Actions del admin.
 * Lanza si no hay sesión de admin; devuelve el cliente autenticado.
 * (El middleware protege páginas, no los POSTs de acciones — cada
 * mutación debe re-verificar por sí misma.)
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("No autorizado");
  }
  return supabase;
}
