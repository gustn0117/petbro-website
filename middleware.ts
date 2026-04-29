import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "petbro_admin";

function verify(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, expiresAt, given] = parts;
  const expected = createHmac("sha256", secret)
    .update(`${issuedAt}.${expiresAt}`)
    .digest("hex");
  try {
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  if (Date.now() > Number(expiresAt)) return false;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/* (excluding /admin which is the login page)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/admin", req.url));

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verify(token, secret)) {
    const url = new URL("/admin", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
