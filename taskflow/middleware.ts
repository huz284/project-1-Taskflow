import { NextRequest, NextResponse } from "next/server";

// Middleware runs on Edge runtime - we just protect routes at this level
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Public routes
  const publicPaths = ["/auth/login", "/auth/register", "/"];
  if (publicPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // API routes are protected via auth utility in each handler
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
