import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/expenses",
  "/budgets",
  "/profile",
  "/settings",
];

// Define auth routes that should not be accessible when logged in
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  // Get isAdmin value from cookies
  const isAdmin = request.cookies.get("isAdmin")?.value === "true";

  // Check if the path is a protected route and there's no token
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Check if the path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Only redirect from auth routes to dashboard if user is logged in AND is an admin
  if (isAuthRoute && token && isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all protected routes
    "/dashboard/:path*",
    "/expenses/:path*",
    "/budgets/:path*",
    "/profile/:path*",
    "/settings/:path*",
    // Match all auth routes
    "/auth/:path*",
  ],
};
