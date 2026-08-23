import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/supabase/admin";

/**
 * Fase 3: protege /admin/*.
 * - Sin sesión → redirige a /admin/login (conservando destino en ?next=).
 * - Autenticado pero no admin → /admin/login?error=no-admin.
 * - Admin autenticado visitando /admin/login → lo lleva a /admin.
 * También refresca las cookies de sesión de Supabase en cada request.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!url || !key) {
    return isLogin
      ? response
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isLogin) {
    if (user && isAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=no-admin", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
