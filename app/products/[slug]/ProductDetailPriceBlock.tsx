"use client";

import { useState } from "react";
import type { PricingTier } from "@/lib/supabase";
import { nextTier, resolveUnitPrice, startingPrice } from "@/lib/pricing";

export default function ProductDetailPriceBlock({
  consumerPrice,
  basePrice,
  pricingTiers,
  minOrderQuantity,
}: {
  consumerPrice: number | null;
  basePrice: number;
  pricingTiers: PricingTier[];
  minOrderQuantity: number;
}) {
  const hasTiers = pricingTiers && pricingTiers.length > 0;
  const [qty, setQty] = useState(minOrderQuantity);

  const sp = startingPrice(pricingTiers, basePrice);
  const current = resolveUnitPrice(pricingTiers, qty, basePrice);
  const next = nextTier(pricingTiers, qty);
  const subtotal = current.price * qty;

  return (
    <div className="mt-8 space-y-5">
      {/* Headline price (starting at) */}
      <div>
        {consumerPrice && consumerPrice > sp.price && (
          <p className="text-sm font-semibold text-ink/40 line-through">
            소비자가 {consumerPrice.toLocaleString()}원
          </p>
        )}
        <div className="mt-1 flex items-baseline gap-3">
          <p className="font-display text-4xl font-extrabold tracking-tightest text-ink md:text-5xl">
            {sp.price.toLocaleString()}
          </p>
          <span className="text-2xl font-semibold text-ink/70">
            원{hasTiers ? "~" : ""}
          </span>
          {hasTiers && sp.tier && (
            <span className="ml-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-800">
              {sp.tier.min_qty}ea+ 기준
            </span>
          )}
        </div>
        {hasTiers && (
          <p className="mt-1 text-xs text-ink/55">
            수량에 따라 단가가 자동 적용됩니다 (VAT 별도)
          </p>
        )}
      </div>

      {/* Tier table */}
      {hasTiers && (
        <div className="overflow-hidden rounded-xl ring-1 ring-black/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                <th className="px-4 py-2.5 text-left">구간</th>
                <th className="px-4 py-2.5 text-right">단가</th>
              </tr>
            </thead>
            <tbody>
              {pricingTiers.map((t, i) => {
                const isActive = current.tier === t;
                return (
                  <tr
                    key={i}
                    className={`border-t border-black/5 ${
                      isActive ? "bg-brand-50/60" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 text-ink">
                      {t.min_qty}ea
                      {t.max_qty == null
                        ? "+"
                        : t.max_qty === t.min_qty
                          ? ""
                          : ` ~ ${t.max_qty}ea`}
                      {isActive && (
                        <span className="ml-2 inline-flex rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                          현재
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-ink">
                      {t.price.toLocaleString()}원
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quantity selector + live unit price preview */}
      <div className="rounded-xl bg-cream px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-ink/55">
              주문 수량
            </p>
            <p className="mt-1 text-xs text-ink/50">
              최소 {minOrderQuantity}개부터 주문 가능
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-ink/12 bg-white">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(minOrderQuantity, q - 1))}
              className="px-4 py-2.5 text-base text-ink/70 hover:text-ink"
              aria-label="수량 줄이기"
            >
              −
            </button>
            <span className="min-w-[3rem] text-center text-base font-semibold">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-4 py-2.5 text-base text-ink/70 hover:text-ink"
              aria-label="수량 늘리기"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-ink/10 pt-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-ink/55">
              적용 단가
            </p>
            <p className="mt-1 font-display text-xl font-extrabold tracking-tightest text-ink">
              {current.price.toLocaleString()}원
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-ink/55">
              합계
            </p>
            <p className="mt-1 font-display text-xl font-extrabold tracking-tightest text-ink">
              {subtotal.toLocaleString()}원
            </p>
          </div>
        </div>

        {next && (
          <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand">
            +{next.needed}개 더 담으면 {next.tier.price.toLocaleString()}원 단가
            적용
          </p>
        )}
      </div>
    </div>
  );
}
