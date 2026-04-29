import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "petbro_admin";

function hexToBuf(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(hex.substr(i * 2, 2), 16);
    if (Number.isNaN(b)) return null;
    out[i] = b;
  }
  return out;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifyToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, expiresAt, given] = parts;
  if (!hexToBuf(given)) return false;
  if (Date.now() > Number(expiresAt)) return false;
  const expected = await hmacHex(secret, `${issuedAt}.${expiresAt}`);
  return timingSafeEqualStr(expected, given);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/* (excluding /admin which is the login page itself).
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/admin", req.url));

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifyToken(token, secret);

  if (!ok) {
    const url = new URL("/admin", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
