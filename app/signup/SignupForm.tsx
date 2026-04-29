"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Form = {
  email: string;
  password: string;
  name: string;
  phone: string;
  business_name: string;
  business_number: string;
  business_owner: string;
  business_address: string;
  business_type: string;
  business_item: string;
  tax_email: string;
  is_simplified_tax: boolean;
};

const EMPTY: Form = {
  email: "",
  password: "",
  name: "",
  phone: "",
  business_name: "",
  business_number: "",
  business_owner: "",
  business_address: "",
  business_type: "",
  business_item: "",
  tax_email: "",
  is_simplified_tax: false,
};

export default function SignupForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [v, setV] = useState<Form>(EMPTY);
  const [cert, setCert] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof Form>(k: K, val: Form[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!cert) {
      setError("사업자등록증 사본을 첨부해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(v).forEach(([k, val]) => {
        fd.append(k, String(val));
      });
      fd.append("business_cert", cert);

      const res = await fetch("/api/signup", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "회원가입 실패");

      // Logged in but pending — go to home (or original redirect)
      router.replace(redirectTo);
      router.refresh();
    } catch (e: any) {
      setError(e.message || "회원가입에 실패했습니다.");
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-cream px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-2xl">
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
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/65">
            도매 거래 전용 사이트입니다. 사업자등록증 확인 후 승인이
            완료되면 가격 확인과 주문이 가능해집니다. 평일 기준 1영업일
            이내 처리됩니다.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl bg-white p-7 shadow-soft md:p-9"
        >
          <Card title="계정 정보">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="이메일" required>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="field-input"
                  placeholder="example@petbro.com"
                  value={v.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="비밀번호" required hint="8자 이상">
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="field-input"
                  value={v.password}
                  onChange={(e) => update("password", e.target.value)}
                />
              </Field>
              <Field label="담당자 이름" required>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  className="field-input"
                  value={v.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
              <Field label="담당자 연락처">
                <input
                  type="tel"
                  autoComplete="tel"
                  className="field-input"
                  placeholder="010-0000-0000"
                  value={v.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          <Card title="사업자 정보 · 세금계산서">
            <p className="mb-4 text-xs leading-relaxed text-ink/55">
              여기 입력해두시면 이후 주문 시 세금계산서가 자동으로 발행됩니다.
              간이과세자는 발행되지 않습니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="상호 (업체명)" required>
                <input
                  type="text"
                  required
                  className="field-input"
                  value={v.business_name}
                  onChange={(e) => update("business_name", e.target.value)}
                />
              </Field>
              <Field label="사업자등록번호" required hint="123-45-67890">
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="123-45-67890"
                  value={v.business_number}
                  onChange={(e) => update("business_number", e.target.value)}
                />
              </Field>
              <Field label="대표자" required>
                <input
                  type="text"
                  required
                  className="field-input"
                  value={v.business_owner}
                  onChange={(e) => update("business_owner", e.target.value)}
                />
              </Field>
              <Field label="세금계산서 받을 이메일" required>
                <input
                  type="email"
                  required
                  className="field-input"
                  value={v.tax_email}
                  onChange={(e) => update("tax_email", e.target.value)}
                />
              </Field>
              <Field label="사업장 주소" required className="sm:col-span-2">
                <input
                  type="text"
                  required
                  className="field-input"
                  value={v.business_address}
                  onChange={(e) => update("business_address", e.target.value)}
                />
              </Field>
              <Field label="업태 (선택)">
                <input
                  type="text"
                  className="field-input"
                  placeholder="도매·소매"
                  value={v.business_type}
                  onChange={(e) => update("business_type", e.target.value)}
                />
              </Field>
              <Field label="종목 (선택)">
                <input
                  type="text"
                  className="field-input"
                  placeholder="반려동물용품"
                  value={v.business_item}
                  onChange={(e) => update("business_item", e.target.value)}
                />
              </Field>
              <label className="mt-1 flex cursor-pointer items-start gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-ink"
                  checked={v.is_simplified_tax}
                  onChange={(e) =>
                    update("is_simplified_tax", e.target.checked)
                  }
                />
                <span className="text-sm leading-relaxed text-ink/80">
                  <strong className="text-ink">간이과세자</strong>입니다 — 체크
                  시 세금계산서를 발행하지 않습니다.
                </span>
              </label>
            </div>
          </Card>

          <Card title="사업자등록증 첨부">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.2em] text-ink/60">
                파일 업로드 <span className="ml-1 text-red-600">*</span>
              </span>
              <input
                type="file"
                required
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setCert(e.target.files?.[0] || null)}
                className="block w-full text-sm text-ink/80 file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition file:hover:bg-brand"
              />
              <p className="mt-2 text-xs text-ink/50">
                JPG · PNG · WebP · PDF · 최대 10MB. 업로드된 파일은 운영자만
                확인하며 외부 노출되지 않습니다.
              </p>
              {cert && (
                <p className="mt-2 text-xs font-semibold text-brand">
                  ✓ {cert.name} ({(cert.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </label>
          </Card>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-ink py-4 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand disabled:opacity-50"
          >
            {submitting ? "가입 신청 중..." : "가입 신청 (승인 후 이용 가능)"}
          </button>

          <p className="text-center text-xs text-ink/50">
            이미 회원이신가요?{" "}
            <Link
              href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="font-semibold text-ink underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#fafafa] p-5 ring-1 ring-black/5">
      <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </label>
  );
}
