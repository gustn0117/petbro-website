"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import ImageUploader from "./ImageUploader";

export type PartnerFormValues = {
  id?: string;
  name: string;
  description: string;
  logo_url: string | null;
  website_url: string;
  display_order: number;
  status: "active" | "draft";
};

export const EMPTY_PARTNER: PartnerFormValues = {
  name: "",
  description: "",
  logo_url: null,
  website_url: "",
  display_order: 100,
  status: "active",
};

export default function PartnerForm({
  initial,
  action,
  submitLabel = "저장",
}: {
  initial: PartnerFormValues;
  action: (values: PartnerFormValues) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const [v, setV] = useState<PartnerFormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof PartnerFormValues>(
    k: K,
    val: PartnerFormValues[K],
  ) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!v.name.trim()) return setError("파트너사명을 입력해주세요.");
    startTransition(async () => {
      try {
        const res = await action(v);
        if (res?.ok) {
          window.location.assign("/admin/partners");
          return;
        }
        if (res && !res.ok) setError(res.error || "저장에 실패했습니다.");
      } catch (e: any) {
        if (e?.digest?.startsWith?.("NEXT_REDIRECT")) return;
        setError(e?.message || "저장 중 오류가 발생했습니다.");
      }
    });
  }

  const logos = v.logo_url ? [v.logo_url] : [];

  return (
    <form onSubmit={onSubmit} className="space-y-8 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/partners"
            className="text-xs font-semibold tracking-[0.2em] text-ink/50 transition hover:text-ink"
          >
            ← 목록으로
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
            {initial.id ? "파트너사 수정" : "새 파트너사 추가"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/partners"
            className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/70 transition hover:border-ink hover:text-ink"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand disabled:opacity-50"
          >
            {pending ? "저장 중..." : submitLabel}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
            기본 정보
          </h2>
          <div className="mt-5 space-y-5">
            <Field label="파트너사명" required>
              <input
                value={v.name}
                onChange={(e) => update("name", e.target.value)}
                className="field-input"
                required
              />
            </Field>
            <Field label="홈페이지 URL (선택)" hint="https:// 로 시작">
              <input
                type="url"
                value={v.website_url}
                onChange={(e) => update("website_url", e.target.value)}
                className="field-input"
                placeholder="https://example.com"
              />
            </Field>
            <Field label="간단 소개" hint="로고 하단에 표시됩니다 (여러 줄 가능)">
              <textarea
                value={v.description}
                onChange={(e) => update("description", e.target.value)}
                className="field-input min-h-[140px] resize-y"
                placeholder="파트너사에 대한 한두 문단의 짧은 소개"
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
            노출 설정
          </h2>
          <div className="mt-5 space-y-5">
            <Field label="진열 순서" hint="작을수록 위에 노출">
              <input
                type="number"
                value={v.display_order}
                onChange={(e) => update("display_order", Number(e.target.value))}
                className="field-input"
              />
            </Field>
            <Field label="상태">
              <select
                value={v.status}
                onChange={(e) => update("status", e.target.value as "active" | "draft")}
                className="field-input"
              >
                <option value="active">활성 (공개)</option>
                <option value="draft">임시저장 (비공개)</option>
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
          로고 이미지
        </h2>
        <p className="mt-1 text-xs text-ink/55">
          PNG (배경 투명) 권장 · 가로 400-600px · 단일 이미지만 등록됩니다.
        </p>
        <div className="mt-5">
          <ImageUploader
            value={logos}
            onChange={(next) => update("logo_url", next[0] || null)}
            layout="grid"
            multiple={false}
            emptyHint="로고 이미지를 등록해주세요."
          />
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-ink/40">{hint}</p>}
    </label>
  );
}
