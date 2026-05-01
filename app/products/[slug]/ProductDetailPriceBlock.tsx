"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PricingTier } from "@/lib/supabase";
import { nextTier, resolveUnitPrice, startingPrice } from "@/lib/pricing";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  consumerPrice: number | null;
  basePrice: number;
  pricingTiers: PricingTier[];
  minOrderQuantity: number;
  stock: number;
  authed: boolean;
};

export default function ProductDetailPriceBlock({
  productId,
  slug,
  name,
  image,
  consumerPrice,
  basePrice,
  pricingTiers,
  minOrderQuantity,
  stock,
  authed,
}: Props) {
  const router = useRouter();
  const { add } = useCart();
  const hasTiers = pricingTiers && pricingTiers.length > 0;
  const sorted = [...(pricingTiers || [])].sort(
    (a, b) => a.min_qty - b.min_qty,
  );
  const [qty, setQty] = useState(minOrderQuantity);
  const [added, setAdded] = useState(false);

  const sp = startingPrice(pricingTiers, basePrice);
  const current = resolveUnitPrice(pricingTiers, qty, basePrice);
  const next = nextTier(pricingTiers, qty);
  const subtotal = current.price * qty;
  const disabled = stock <= 0;

  function handleAdd() {
    if (disabled) return;
    if (!authed) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }
    add(
      {
        product_id: productId,
        slug,
        name,
        price: basePrice,
        image,
        pricing_tiers: pricingTiers || [],
        min_order_quantity: minOrderQuantity,
      },
      Math.max(qty, minOrderQuantity),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-8 space-y-5">
      {/* Headline price (starting at) */}
      <div>
        <div className="flex items-baseline gap-3">
          <p className="font-display text-4xl font-extrabold tracking-tightest text-ink md:text-5xl">
            {sp.price.toLocaleString()}
          </p>
          <span className="text-2xl font-semibold text-ink/70">
            원{hasTiers ? "~" : ""}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink/55">VAT 별도 · 수량에 따라 단가 차등 적용</p>
      </div>

      {/* Price breakdown — 정찰제 / 파트너 / 구간별 */}
      <dl className="overflow-hidden rounded-xl bg-cream">
        {consumerPrice && (
          <PriceRow label="정찰제 판매가" value={consumerPrice} muted />
        )}
        <PriceRow
          label="파트너 공급가"
          value={basePrice}
          marginPct={marginFor(consumerPrice, basePrice)}
          divider={hasTiers}
        />
        {sorted.map((t, i) => {
          const isActive = current.tier === t;
          return (
            <PriceRow
              key={i}
              label={`${t.min_qty}개 이상 ${t.max_qty == null ? "" : `(${t.max_qty}개까지)`}`}
              value={t.price}
              marginPct={marginFor(consumerPrice, t.price)}
              active={isActive}
              divider={i < sorted.length - 1}
            />
          );
        })}
      </dl>

      {/* Quantity + add to cart */}
      <div className="rounded-xl bg-white ring-1 ring-black/8 px-5 py-4">
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
          <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-xs font-semibold text-brand">
            +{next.needed}개 더 담으면 {next.tier.price.toLocaleString()}원 단가
            적용
          </p>
        )}
      </div>

      {/* Add to cart button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full rounded-full bg-ink py-4 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
      >
        {disabled
          ? "품절"
          : !authed
            ? "로그인 후 구매"
            : added
              ? "✓ 장바구니에 담았습니다"
              : "장바구니 담기"}
      </button>
    </div>
  );
}

function marginFor(
  consumer: number | null | undefined,
  supply: number,
): number | null {
  if (!consumer || consumer <= 0 || supply <= 0 || supply >= consumer) return null;
  // Profit margin when reselling at the consumer price.
  return Math.round(((consumer - supply) / consumer) * 100);
}

function PriceRow({
  label,
  value,
  muted,
  active,
  divider = true,
  marginPct,
}: {
  label: string;
  value: number;
  muted?: boolean;
  active?: boolean;
  divider?: boolean;
  marginPct?: number | null;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 px-5 py-3 ${
        divider ? "border-b border-ink/8" : ""
      } ${active ? "bg-brand-50/70" : ""}`}
    >
      <dt
        className={`flex flex-wrap items-center gap-2 text-sm ${
          active ? "font-semibold text-brand-800" : muted ? "text-ink/55" : "text-ink/70"
        }`}
      >
        <span>{label}</span>
        {active && (
          <span className="inline-flex rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
            현재
          </span>
        )}
      </dt>
      <dd className="flex items-baseline gap-2">
        {marginPct != null && !muted && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              active
                ? "bg-brand text-white"
                : "bg-brand/10 text-brand"
            }`}
          >
            마진 {marginPct}%
          </span>
        )}
        <span
          className={`font-mono ${
            muted
              ? "text-sm text-ink/45 line-through"
              : active
                ? "text-base font-bold text-brand-800"
                : "text-base font-semibold text-ink"
          }`}
        >
          {value.toLocaleString()}원
        </span>
      </dd>
    </div>
  );
}
