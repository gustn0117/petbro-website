import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase";

const COOKIE_NAME = "petbro_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret() {
  // Reuse the same secret as admin sessions; both are HMAC tokens but
  // signed in disjoint payload formats so they can't be cross-used.
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is required");
  return s;
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
};

function sign(payload: string) {
  return createHmac("sha256", `user:${secret()}`).update(payload).digest("hex");
}

function makeToken(userId: string) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + COOKIE_MAX_AGE * 1000;
  const payload = `${userId}.${issuedAt}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [userId, issuedAt, expiresAt, given] = parts;
  const expected = sign(`${userId}.${issuedAt}.${expiresAt}`);
  try {
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  if (Date.now() > Number(expiresAt)) return null;
  return userId;
}

export function setUserSession(userId: string) {
  cookies().set(COOKIE_NAME, makeToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearUserSession() {
  cookies().delete(COOKIE_NAME);
}

export function getUserIdFromCookie(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = getUserIdFromCookie();
  if (!userId) return null;

  const { data, error } = await supabaseAdmin()
    .from("users")
    .select("id, email, name, phone")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as SessionUser;
}

// ---------- Password / lookup ----------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ---------- Validation ----------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(input: {
  email: string;
  password: string;
  name: string;
}): string | null {
  if (!input.email || !EMAIL_RE.test(input.email)) {
    return "올바른 이메일 형식이 아닙니다.";
  }
  if (!input.password || input.password.length < 8) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }
  if (!input.name?.trim()) {
    return "이름을 입력해주세요.";
  }
  return null;
}
