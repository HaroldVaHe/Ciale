"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface LoginFormProps {
  next?: string;
  unauthorized?: boolean;
}

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed": "Debes confirmar tu correo antes de ingresar.",
};

export default function LoginForm({ next, unauthorized }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    unauthorized ? "Esta cuenta no tiene acceso de administrador." : null
  );
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-center text-charcoal/70 max-w-xs">
        Supabase no está configurado en este entorno. Define{" "}
        <code className="text-coral">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
        <code className="text-coral">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para
        habilitar el acceso.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(ERROR_MESSAGES[signInError.message] ?? "No fue posible iniciar sesión. Inténtalo de nuevo.");
        return;
      }

      const target = next && next.startsWith("/admin") ? next : "/admin";
      router.replace(target);
      router.refresh();
    } catch {
      setError("No fue posible conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label htmlFor="admin-email" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
          Correo
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
          Contraseña
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all duration-300"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-coffee text-white text-xs tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
