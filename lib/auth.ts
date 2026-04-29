import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "petbro_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is required");
  return s;
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "1234";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function makeToken() {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + COOKIE_MAX_AGE * 1000;
  const payload = `${issuedAt}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, expiresAt, given] = parts;
  const expected = sign(`${issuedAt}.${expiresAt}`);
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

export function setAdminSession() {
  cookies().set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export function isAdmin(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
