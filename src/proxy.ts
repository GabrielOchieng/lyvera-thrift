import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
// Change the type import to get the full session shape
import type { auth } from "@/lib/auth";

type SessionData = typeof auth.$Infer.Session;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await betterFetch<SessionData>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // FIX: Better-Auth returns { session: {...}, user: {...} }
    // Access 'user' directly from the session object returned by betterFetch
    if (pathname.startsWith("/admin")) {
      if (session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/dashboard/:path*", "/admin/:path*"],
};
