import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "plex_session";

export function proxy(request: NextRequest): NextResponse {
  const session = request.cookies.get(SESSION_COOKIE_NAME);
  const isWrappedRoute = request.nextUrl.pathname.startsWith("/wrapped");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  // Allow auth routes without session
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Protect /wrapped and /api routes
  if ((isWrappedRoute || isApiRoute) && !session) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wrapped/:path*", "/api/:path*", "/auth/:path*"],
};
