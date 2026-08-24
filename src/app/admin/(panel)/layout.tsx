import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/products"
              className="font-serif text-xl font-semibold text-coffee"
            >
              CIALÉ <span className="text-coral">· Admin</span>
            </Link>
            <nav className="flex items-center gap-5 text-[11px] tracking-[0.2em] uppercase font-medium">
              <Link
                href="/admin/products"
                className="text-charcoal hover:text-coral transition-colors duration-300"
              >
                Productos
              </Link>
              <Link
                href="/admin/categories"
                className="text-charcoal hover:text-coral transition-colors duration-300"
              >
                Categorías
              </Link>
              <Link
                href="/admin/reviews"
                className="text-charcoal hover:text-coral transition-colors duration-300"
              >
                Reseñas
              </Link>
              <span
                className="text-charcoal/30 cursor-not-allowed"
                title="Disponible en la Fase 6"
              >
                Pedidos
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden sm:inline text-xs text-charcoal/50">
                {user.email}
              </span>
            )}
            <Link
              href="/"
              className="px-4 py-2 rounded-full border border-border bg-white text-charcoal text-[11px] tracking-[0.2em] uppercase font-medium hover:border-coral hover:text-coral transition-colors duration-300"
            >
              Ver tienda
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
