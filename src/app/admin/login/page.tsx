import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acceso admin — CIALÉ",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-3">
          CIALÉ
        </p>
        <h1 className="font-serif text-3xl font-semibold text-coffee mb-8">
          Panel de administración
        </h1>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 flex justify-center">
          <LoginForm next={params.next} unauthorized={params.error === "no-admin"} />
        </div>

        <Link
          href="/"
          className="inline-block mt-6 text-xs tracking-widest uppercase font-medium text-charcoal/50 hover:text-coral transition-colors duration-300"
        >
          ← Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
