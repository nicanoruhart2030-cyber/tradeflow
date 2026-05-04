import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function nextWithRequestHeaders(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl?.trim() || !supabaseAnonKey?.trim()) {
    return nextWithRequestHeaders(request);
  }

  try {
    let supabaseResponse = nextWithRequestHeaders(request);

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          supabaseResponse = nextWithRequestHeaders(request);
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const protectedPaths = [
      "/dashboard",
      "/new",
      "/invoices",
      "/invoice",
      "/settings",
    ];
    const isProtected = protectedPaths.some((p) =>
      request.nextUrl.pathname.startsWith(p)
    );

    if (!user && isProtected) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }

    if (
      user &&
      (request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/signup")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  } catch {
    return nextWithRequestHeaders(request);
  }
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
