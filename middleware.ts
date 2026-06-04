import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userType = request.cookies.get("userType")?.value;
  const { pathname } = request.nextUrl;

  console.log("Middleware checking path:", pathname, "Token exists:", !!token);

  // 1. Logic for /login route
  if (pathname === "/login") {
    if (token) {
      const redirectUrl = userType === "ADMIN" ? "/dashboard" : "/user/dashboard";
      console.log("Logged in user tried to access /login, redirecting to:", redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 2. Logic for protected dashboard routes
  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/user/dashboard");

  if (isProtectedPath && !token) {
    console.log("Unauthenticated user tried to access protected path:", pathname, "- Redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Ensure the middleware runs for these specific paths
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/user/dashboard/:path*",
  ],
};
