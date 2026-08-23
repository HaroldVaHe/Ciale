import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — CIALÉ",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-2">
              CIALÉ
            </p>
            <h1 className="font-serif text-3xl font-semibold text-coffee">
              Hola de nuevo
            </h1>
            <p className="text-sm text-charcoal/60 mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full border border-border bg-white text-charcoal text-xs tracking-widest uppercase font-medium hover:border-coral hover:text-coral transition-colors duration-300"
            >
              Ver tienda
            </Link>
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-serif text-xl font-semibold text-coffee mb-2">
              Productos
            </h2>
            <p className="text-sm text-charcoal/60">
              Gestión del catálogo — disponible en la Fase 4.
            </p>
          </article>
          <article className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-serif text-xl font-semibold text-coffee mb-2">
              Categorías
            </h2>
            <p className="text-sm text-charcoal/60">
              Organización y tags — disponible en la Fase 5.
            </p>
          </article>
          <article className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-serif text-xl font-semibold text-coffee mb-2">
              Pedidos
            </h2>
            <p className="text-sm text-charcoal/60">
              Pedidos de WhatsApp — disponible en la Fase 6.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
