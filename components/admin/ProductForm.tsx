"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import ImageUploader from "./ImageUploader";
import type { PricingTier } from "@/lib/supabase";

export type ProductFormValues = {
  id?: string;
  slug: string;
  name: string;
  en: string;
  spec: string;
  description: string;
  tags: string[];
  price: number;
  consumer_price: number | null;
  pricing_tiers: PricingTier[];
  min_order_quantity: number;
  stock: number;
  images: string[];
  detail_images: string[];
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
  consumer_price: null,
  pricing_tiers: [
    { min_qty: 10, max_qty: 29, price: 0 },
    { min_qty: 30, max_qty: 49, price: 0 },
    { min_qty: 50, max_qty: null, price: 0 },
  ],
  min_order_quantity: 10,
  stock: 100,
  images: [],
  detail_images: [],
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!v.slug.trim()) return setError("URL slug을 입력해주세요.");
    if (!v.name.trim()) return setError("상품명을 입력해주세요.");
    if (v.price < 0) return setError("가격은 0 이상이어야 합니다.");
    if (v.stock < 0) return setError("재고는 0 이상이어야 합니다.");

    startTransition(async () => {
      try {
        const res = await action(v);
        // Successful actions call redirect() and never return; this only
        // hits when the action explicitly returned a {ok:false} payload.
        if (res && !res.ok) setError(res.error || "저장에 실패했습니다.");
      } catch (e: any) {
        // redirect() throws NEXT_REDIRECT — the framework handles it.
        // Anything else is a real error worth surfacing.
        if (e?.digest?.startsWith?.("NEXT_REDIRECT")) return;
        setError(e?.message || "저장 중 오류가 발생했습니다.");
      }
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
          <Field label="기본 단가 (원)" required hint="구간 단가가 비어있을 때 사용">
            <input
              type="number"
              min={0}
              step={50}
              value={v.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className={inputCls}
              required
            />
          </Field>
          <Field label="소비자가 (원)" hint="공개 페이지에는 비노출, 정가 표기용">
            <input
              type="number"
              min={0}
              step={50}
              value={v.consumer_price ?? ""}
              onChange={(e) =>
                update(
                  "consumer_price",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={inputCls}
            />
          </Field>
          <Field label="최소 주문 수량" hint="장바구니에서 클램핑됩니다">
            <input
              type="number"
              min={1}
              value={v.min_order_quantity}
              onChange={(e) =>
                update("min_order_quantity", Math.max(1, Number(e.target.value)))
              }
              className={inputCls}
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

      {/* Tier pricing */}
      <Card
        title="수량별 단가 (도매 차등 적용)"
        subtitle="장바구니 수량에 따라 자동 적용됩니다. 마지막 구간의 '최대'는 비워두면 무제한입니다. 비어있으면 위의 '기본 단가'가 모든 수량에 적용됩니다."
      >
        <TierEditor
          tiers={v.pricing_tiers}
          onChange={(next) => update("pricing_tiers", next)}
        />
      </Card>

      {/* Gallery images */}
      <Card
        title="대표 이미지 (썸네일·갤러리)"
        subtitle="상품 목록과 상세 페이지 상단 갤러리에 표시됩니다."
      >
        <ImageUploader
          value={v.images}
          onChange={(next) => update("images", next)}
          layout="grid"
          showPrimary
          emptyHint="상품 이미지를 추가해주세요. 첫 번째 이미지가 대표 이미지로 사용됩니다."
        />
      </Card>

      {/* Detail images (description page) */}
      <Card
        title="상세페이지 이미지"
        subtitle="상품 상세 페이지 하단에 위에서 아래로 순서대로 표시됩니다. 긴 상세 이미지를 여러 장 분할 업로드해도 됩니다."
      >
        <ImageUploader
          value={v.detail_images}
          onChange={(next) => update("detail_images", next)}
          layout="stack"
          emptyHint="아직 등록된 상세 이미지가 없습니다."
          hint="JPG · PNG · WebP · GIF · 장당 최대 5MB"
        />
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
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
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
      {subtitle && (
        <p className="mt-1 text-xs leading-relaxed text-ink/55">{subtitle}</p>
      )}
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

function TierEditor({
  tiers,
  onChange,
}: {
  tiers: PricingTier[];
  onChange: (next: PricingTier[]) => void;
}) {
  function update(i: number, patch: Partial<PricingTier>) {
    onChange(tiers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }
  function remove(i: number) {
    onChange(tiers.filter((_, idx) => idx !== i));
  }
  function add() {
    const last = tiers[tiers.length - 1];
    const nextMin = last ? (last.max_qty ?? last.min_qty) + 1 : 10;
    onChange([...tiers, { min_qty: nextMin, max_qty: null, price: 0 }]);
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl ring-1 ring-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
              <th className="px-4 py-3 text-left">구간 시작 (개)</th>
              <th className="px-4 py-3 text-left">구간 끝 (개, 비우면 무제한)</th>
              <th className="px-4 py-3 text-left">단가 (원)</th>
              <th className="px-2 py-3 text-right" aria-label="작업"></th>
            </tr>
          </thead>
          <tbody>
            {tiers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-xs text-ink/50">
                  구간이 비어 있습니다. '구간 추가'로 시작해주세요.
                </td>
              </tr>
            ) : (
              tiers.map((t, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min={1}
                      value={t.min_qty}
                      onChange={(e) =>
                        update(i, { min_qty: Math.max(1, Number(e.target.value)) })
                      }
                      className="w-24 rounded-lg border border-ink/12 px-3 py-2 text-sm outline-none focus:border-ink"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      value={t.max_qty ?? ""}
                      placeholder="무제한"
                      onChange={(e) =>
                        update(i, {
                          max_qty:
                            e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      className="w-32 rounded-lg border border-ink/12 px-3 py-2 text-sm outline-none focus:border-ink"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={t.price}
                      onChange={(e) =>
                        update(i, { price: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-32 rounded-lg border border-ink/12 px-3 py-2 text-sm outline-none focus:border-ink"
                    />
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink/80 transition hover:border-ink hover:text-ink"
      >
        + 구간 추가
      </button>
    </div>
  );
}
