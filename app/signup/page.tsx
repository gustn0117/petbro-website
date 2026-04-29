import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getUserIdFromCookie,
  hashPassword,
  normalizeEmail,
  setUserSession,
  validateSignup,
} from "@/lib/customer-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "회원가입 | PAT BRO 펫브로",
};

export const dynamic = "force-dynamic";

async function signup(formData: FormData) {
  "use server";
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const redirectTo = String(formData.get("redirect") || "/");

  const validationError = validateSignup({ email, password, name });
  if (validationError) {
    redirect(
      `/signup?error=${encodeURIComponent(validationError)}&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  const { data: existing } = await supabaseAdmin()
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    redirect(
      `/signup?error=duplicate&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  const password_hash = await hashPassword(password);

  const { data: created, error } = await supabaseAdmin()
    .from("users")
    .insert({
      email,
      password_hash,
      name,
      phone: phone || null,
    })
    .select("id")
    .single();

  if (error || !created) {
    redirect(
      `/signup?error=server&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  setUserSession(created.id);
  redirect(redirectTo || "/");
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  if (getUserIdFromCookie()) {
    redirect(searchParams.redirect || "/");
  }

  const redirectTo = searchParams.redirect || "";
  let errorText: string | null = null;
  if (searchParams.error === "duplicate") {
    errorText = "이미 가입된 이메일입니다.";
  } else if (searchParams.error === "server") {
    errorText = "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } else if (searchParams.error) {
    errorText = decodeURIComponent(searchParams.error);
  }

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
            CREATE ACCOUNT
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tightest text-ink">
            회원가입
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            가입하시면 가격 확인 및 주문이 가능합니다.
          </p>
        </div>

        <form
          action={signup}
          className="space-y-4 rounded-2xl bg-white p-7 shadow-soft"
        >
          <input type="hidden" name="redirect" defaultValue={redirectTo} />
          <Field label="이메일" htmlFor="email" required>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="field-input"
              placeholder="example@petbro.com"
            />
          </Field>
          <Field label="이름" htmlFor="name" required>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="field-input"
              placeholder="홍길동"
            />
          </Field>
          <Field label="연락처 (선택)" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="field-input"
              placeholder="010-0000-0000"
            />
          </Field>
          <Field
            label="비밀번호"
            htmlFor="password"
            required
            hint="영문·숫자 조합 8자 이상 권장"
          >
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="field-input"
              placeholder="8자 이상"
            />
          </Field>

          {errorText && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {errorText}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-ink py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
          >
            가입하기
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          이미 회원이신가요?{" "}
          <Link
            href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-ink underline-offset-4 transition hover:text-brand hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </label>
  );
}
