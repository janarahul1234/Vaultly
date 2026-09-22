// Next.js 16 Proxy (formerly `middleware.ts`). Runs on the edge before a
// request completes. Responsibilities:
//   1. Refresh the Supabase auth token and write it back to the request +
//      response cookies so Server Components see a valid session.
//   2. Enforce the public/protected route split.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";

// Routes that require a valid session, and routes that authenticated users
// should be bounced away from.
const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Prevent CDNs from caching a response that carries a session cookie.
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // getClaims() verifies the JWT signature (and refreshes a near-expiry
  // token), so the result is safe to use for authorization. Never trust
  // getSession() here — it reads the cookie without revalidating it.
  const {
    data,
  } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname } = request.nextUrl;

  // Guard protected routes.
  if (
    !isAuthenticated &&
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.search = "";
    return copyCookies(NextResponse.redirect(redirectUrl), response);
  }

  // Bounce signed-in users out of the auth pages.
  if (
    isAuthenticated &&
    AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return copyCookies(NextResponse.redirect(redirectUrl), response);
  }

  return response;
}

// A redirect response must carry the refreshed cookies, otherwise the user is
// signed out on the next request.
function copyCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }
  return target;
}

export const config = {
  matcher: [
    // Run on every request except static assets, images, and Next internals.
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
