import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/auth";

// Routes requiring specific roles
const roleProtectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/dashboard": ["admin", "public"],
  "/profile": ["public", "admin"],
};

// Routes that require any authenticated user (no specific role)
const authRequiredPaths = ["/", "/report"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const user = token ? await verifyToken(token) : null;

  // Redirect logged-in users away from /login or /register
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block unauthenticated access to protected auth paths (e.g. "/", "/report")
  if (!user && authRequiredPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection
  for (const route in roleProtectedRoutes) {
    if (pathname.startsWith(route)) {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const allowedRoles = roleProtectedRoutes[route];
      const userRole = (user as any).role;

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/dashboard/:path*",
    "/report",
    "/report/:path*",
    "/login",
    "/register",
  ],
};
