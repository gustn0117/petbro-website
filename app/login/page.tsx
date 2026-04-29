import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getUserIdFromCookie,
  normalizeEmail,
  setUserSession,
  verifyPassword,
} from "@/lib/customer-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "로그인 | PAT BRO 펫브로",
};

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "/");

  if (!email || !password) {
    redirect(
      `/login?error=missing&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  const { data: user } = await supabaseAdmin()
    .from("users")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (!user) {
    redirect(
      `/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    redirect(
      `/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  setUserSession(user.id);
  redirect(redirectTo || "/");
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  if (getUserIdFromCookie()) {
    redirect(searchParams.redirect || "/");
  }

  const redirectTo = searchParams.redirect || "";

  return (
    <section className="flex min-h-screen items-center justify-center bg-cream px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" aria-label="홈으로">
            <img
              src="/images/patbro-mark.png"
              alt=""
              className="mx-auto h-14 w-14"
            />
          </Link>
          <p className="mt-6 text-[11px] font-semibold tracking-[0.4em] text-brand">
            SIGN IN
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tightest text-ink">
            로그인
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            PAT BRO 회원으로 로그인하세요.
          </p>
        </div>

        <form
          action={login}
          className="space-y-4 rounded-2xl bg-white p-7 shadow-soft"
        >
          <input type="hidden" name="redirect" defaultValue={redirectTo} />
          <Field label="이메일" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              className="field-input"
              placeholder="example@petbro.com"
            />
          </Field>
          <Field label="비밀번호" htmlFor="password">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="field-input"
              placeholder="8자 이상"
            />
          </Field>

          {searchParams.error === "invalid" && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              이메일 또는 비밀번호가 올바르지 않습니다.
            </p>
          )}
          {searchParams.error === "missing" && (
            <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
              이메일과 비밀번호를 모두 입력해주세요.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-ink py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
          >
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          아직 회원이 아니신가요?{" "}
          <Link
            href={`/signup${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-ink underline-offset-4 transition hover:text-brand hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
      </span>
      {children}
    </label>
  );
}
