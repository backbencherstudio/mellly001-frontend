import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userType = request.cookies.get("userType")?.value;
  const { pathname } = request.nextUrl;

  // 1. Login / Home
  if (pathname === "/login" || pathname === "/") {
    if (token) {
      const redirectUrl =
        userType === "ADMIN" ? "/dashboard" : "/user/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (pathname === "/" && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // 2. Protected routes - no token
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/user/dashboard");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (isProtected && token && !userType) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }

  // 4. Role-based
  if (pathname.startsWith("/dashboard") && userType !== "ADMIN") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (pathname.startsWith("/user/dashboard") && userType === "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/user/dashboard/:path*"],
};


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const userType = request.cookies.get("userType")?.value;
//   const { pathname } = request.nextUrl;

//   console.log("Middleware checking path:", pathname, "Token exists:", !!token, "UserType:", userType);

//   // 1. If trying to access /login or / while already logged in
//   if (pathname === "/login" || pathname === "/") {
//     if (token) {
//       const redirectUrl = userType === "ADMIN" ? "/dashboard" : "/user/dashboard";
//       console.log(`Authenticated user on ${pathname}, redirecting to:`, redirectUrl);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
    
//     // If not logged in and trying to access /, redirect to /login
//     if (pathname === "/" && !token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
    
//     return NextResponse.next();
//   }

//   // 2. Logic for protected dashboard routes
//   const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/user/dashboard");

//   if (isProtectedPath && !token) {
//     console.log("Unauthenticated user tried to access protected path:", pathname, "- Redirecting to /login");
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 3. Role-based protection: Prevent ADMIN from accessing /user/dashboard and vice versa
//   if (pathname.startsWith("/dashboard") && userType !== "ADMIN") {
//     console.log("Non-admin tried to access /dashboard, redirecting to /user/dashboard");
//     return NextResponse.redirect(new URL("/user/dashboard", request.url));
//   }

//   if (pathname.startsWith("/user/dashboard") && userType === "ADMIN") {
//     console.log("Admin tried to access /user/dashboard, redirecting to /dashboard");
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// // Ensure the middleware runs for these specific paths
// export const config = {
//   matcher: [
//     "/",
//     "/login",
//     "/dashboard/:path*",
//     "/user/dashboard/:path*",
//   ],
// };
