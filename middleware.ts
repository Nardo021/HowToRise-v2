import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["/zh", "/en"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const header = req.headers.get("accept-language")?.toLowerCase() ?? "";
    const locale = header.includes("zh") ? "zh" : "en";
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("htr_admin_session");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const hasLocalePrefix = locales.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!hasLocalePrefix && !pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next") && pathname !== "/favicon.ico") {
    return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
