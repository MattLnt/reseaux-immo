import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production" 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token"
  });
  
  const { pathname } = req.nextUrl;

  // Protection dashboard agence
  if (pathname.startsWith("/dashboard/agence")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "AGENCE") return NextResponse.redirect(new URL("/", req.url));
  }

  // Protection dashboard admin
  if (pathname.startsWith("/dashboard/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  // Protection dashboard général (fallback)
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    
    // Redirige vers le bon dashboard selon le rôle
    if (token.role === "AGENCE") {
      return NextResponse.redirect(new URL("/dashboard/agence", req.url));
    }
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};