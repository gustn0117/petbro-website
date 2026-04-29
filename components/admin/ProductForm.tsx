"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

export type ProductFormValues = {
  id?: string;
  slug: string;
  name: string;
  en: string;
  spec: string;
  description: string;
  tags: string[];
  price: number;
  stock: number;
  images: string[];
  status: "active" | "draft" | "archived";
  display_order: number;
};

export const EMPTY_PRODUCT: ProductFormValues = {
  slug: "",
  name: "",
  en: "",
  spec: "",
  description: "",
  tags: [],
  price: 0,
  stock: 100,
  images: [],
  status: "active",
  display_order: 100,
};

export default function ProductForm({
  initial,
  action,
  submitLabel = "저장",
}: {
  initial: ProductFormValues;
  action: (values: ProductFormValues) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const [v, setV] = useState<ProductFormValues>(initial);
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t || v.tags.includes(t)) return;
    update("tags", [...v.tags, t]);
    setTagInput("");
  }
  function removeTag(t: string) {
    update("tags", v.tags.filter((x) => x !== t));
  }
  function addImage() {
    const u = imageInput.trim();
    if (!u || v.images.includes(u)) return;
    update("images", [...v.images, u]);
    setImageInput("");
  }
  function removeImage(u: string) {
    update("images", v.images.filter((x) => x !== u));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!v.slug.trim()) return setError("URL slug을 입력해주세요.");
    if (!v.name.trim()) return setError("상품명을 입력해주세요.");
    if (v.price < 0) return setError("가격은 0 이상이어야 합니다.");
    if (v.stock < 0) return setError("재고는 0 이상이어야 합니다.");

    startTransition(async () => {
      const res = await action(v);
      if (!res.ok) setError(res.error || "저장에 실패했습니다.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold tracking-[0.2em] text-ink/50 transition hover:text-ink"
          >
            ← 목록으로
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
            {initial.id ? "상품 수정" : "새 상품 추가"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
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
        {/* Basics */}
        <Card title="기본 정보" className="lg:col-span-2">
          <Field label="상품명" required>
            <input
              value={v.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputCls}
              placeholder="언니우스틱 소형견용"
              required
            />
          </Field>
          <Field
            label="URL slug"
            hint="영문 소문자·숫자·하이픈만 (예: unni-ustick-small)"
            required
          >
            <input
              value={v.slug}
              onChange={(e) =>
                update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              className={inputCls}
              placeholder="unni-ustick-small"
              required
            />
          </Field>
          <Field label="영문 라벨">
            <input
              value={v.en}
              onChange={(e) => update("en", e.target.value)}
              className={inputCls}
              placeholder="Small Breed"
            />
          </Field>
          <Field label="규격" hint="예: S: 15cm (2 pcs / 10 pcs)">
            <input
              value={v.spec}
              onChange={(e) => update("spec", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="상세 설명">
            <textarea
              value={v.description}
              onChange={(e) => update("description", e.target.value)}
              className={`${inputCls} min-h-[180px] resize-y`}
              placeholder="상품의 특징, 효과, 급여 방법 등을 자세히 작성해주세요."
            />
          </Field>
        </Card>

        {/* Sales */}
        <Card title="판매 정보">
          <Field label="가격 (원)" required>
            <input
              type="number"
              min={0}
              step={100}
              value={v.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className={inputCls}
              required
            />
          </Field>
          <Field label="재고">
            <input
              type="number"
              min={0}
              value={v.stock}
              onChange={(e) => update("stock", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="진열 순서" hint="작을수록 위에 노출">
            <input
              type="number"
              value={v.display_order}
              onChange={(e) => update("display_order", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="상태">
            <select
              value={v.status}
              onChange={(e) =>
                update("status", e.target.value as ProductFormValues["status"])
              }
              className={inputCls}
            >
              <option value="active">활성 (공개)</option>
              <option value="draft">임시저장 (비공개)</option>
              <option value="archived">보관</option>
            </select>
          </Field>
        </Card>
      </div>

      {/* Images */}
      <Card title="이미지">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="/images/product-1-small.jpg 또는 외부 URL"
              className={inputCls}
            />
            <button
              type="button"
              onClick={addImage}
              className="shrink-0 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-brand"
            >
              추가
            </button>
          </div>
          {v.images.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {v.images.map((img, i) => (
                <li
                  key={img}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-cream ring-1 ring-black/10"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      대표
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute right-1 top-1 h-6 w-6 rounded-full bg-ink/80 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="이미지 삭제"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink/50">
              이미지를 추가해주세요. 첫 번째 이미지가 대표 이미지로 사용됩니다.
            </p>
          )}
        </div>
      </Card>

      {/* Tags */}
      <Card title="태그">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="100% 한우, 냄새 zero! 등"
              className={inputCls}
            />
            <button
              type="button"
              onClick={addTag}
              className="shrink-0 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-brand"
            >
              추가
            </button>
          </div>
          {v.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {v.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-brand-700/60 hover:text-brand-800"
                    aria-label={`${t} 삭제`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10";

function Card({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}
    >
      <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
        {title}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
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
