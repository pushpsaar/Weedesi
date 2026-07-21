import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "wedesi_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/login");
  const isProtectedProductWrite =
    pathname.startsWith("/api/products") && req.method !== "GET";
  const isProtectedOrderApi = pathname.startsWith("/api/orders");

  if (isAdminRoute || isAdminApi || isProtectedProductWrite || isProtectedOrderApi) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Full signature verification happens in the route/server-component itself
    // (crypto isn't available in the Edge middleware runtime by default).
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/products/:path*", "/api/orders/:path*"],
};
