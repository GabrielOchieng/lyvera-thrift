import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Change the name from 'middleware' to 'proxy'
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // 1. If trying to reach checkout without a session, redirect to login
  // if (!sessionCookie && request.nextUrl.pathname.startsWith("/checkout")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // 2. Admin Protection
  // Note: For deep role validation (is user actually an 'admin'?),
  // we do that inside the /admin page's Server Component using getSession()
  return NextResponse.next();
}

export const config = {
  // These are the routes that will trigger this function
  matcher: ["/checkout/:path*", "/dashboard/:path*", "/admin/:path*"],
};
