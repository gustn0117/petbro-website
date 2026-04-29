import type { PricingTier } from "./supabase";

const VOLUME_THRESHOLD = 1_000_000; // KRW
const VOLUME_DISCOUNT_PER = 50_000; // KRW per threshold

/**
 * Sort tiers by min_qty ascending. Defensive for arbitrary admin input.
 */
function sorted(tiers: PricingTier[]): PricingTier[] {
  return [...(tiers || [])].sort((a, b) => a.min_qty - b.min_qty);
}

/**
 * Resolve the unit price for a given quantity.
 * If no tier applies (e.g. quantity below the lowest tier's min_qty)
 * or tiers are empty, return the fallback price.
 */
export function resolveUnitPrice(
  tiers: PricingTier[] | null | undefined,
  quantity: number,
  fallbackPrice: number,
): { price: number; tier: PricingTier | null } {
  const list = sorted(tiers || []);
  if (list.length === 0) return { price: fallbackPrice, tier: null };

  // Pick the highest tier whose min_qty <= quantity AND (max_qty == null || quantity <= max_qty)
  let active: PricingTier | null = null;
  for (const t of list) {
    if (quantity >= t.min_qty && (t.max_qty == null || quantity <= t.max_qty)) {
      active = t;
    }
  }
  if (!active) return { price: fallbackPrice, tier: null };
  return { price: active.price, tier: active };
}

/**
 * Lowest unit price across all tiers — used as the "starting at" price
 * shown on shop list cards.
 */
export function startingPrice(
  tiers: PricingTier[] | null | undefined,
  fallbackPrice: number,
): { price: number; tier: PricingTier | null } {
  const list = sorted(tiers || []);
  if (list.length === 0) return { price: fallbackPrice, tier: null };
  let cheapest = list[0];
  for (const t of list) if (t.price < cheapest.price) cheapest = t;
  return { price: cheapest.price, tier: cheapest };
}

/**
 * Find the next-better tier (lower price) that the customer would
 * unlock if they add more units. Returns null if already on best tier.
 */
export function nextTier(
  tiers: PricingTier[] | null | undefined,
  quantity: number,
): { tier: PricingTier; needed: number } | null {
  const list = sorted(tiers || []);
  if (list.length === 0) return null;
  // Tiers above current quantity, sorted by min_qty asc
  const upcoming = list.filter((t) => t.min_qty > quantity);
  if (upcoming.length === 0) return null;
  const next = upcoming[0];
  return { tier: next, needed: next.min_qty - quantity };
}

/**
 * Volume discount: 50,000 KRW deducted for every full 1,000,000 KRW of subtotal.
 * (e.g. 1,500,000 → 50,000; 2,000,000 → 100,000; 3,200,000 → 150,000)
 */
export function volumeDiscount(subtotal: number): number {
  if (subtotal < VOLUME_THRESHOLD) return 0;
  return Math.floor(subtotal / VOLUME_THRESHOLD) * VOLUME_DISCOUNT_PER;
}

export const PRICING_CONSTANTS = {
  VOLUME_THRESHOLD,
  VOLUME_DISCOUNT_PER,
};

/**
 * Validate tier payload from admin form. Returns null if OK, else error string.
 */
export function validateTiers(tiers: PricingTier[]): string | null {
  if (!tiers || tiers.length === 0) return null;
  const list = sorted(tiers);
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    if (!Number.isFinite(t.min_qty) || t.min_qty < 1)
      return "최소 수량은 1 이상이어야 합니다.";
    if (t.max_qty != null && t.max_qty < t.min_qty)
      return "최대 수량은 최소 수량 이상이어야 합니다.";
    if (!Number.isFinite(t.price) || t.price < 0)
      return "단가는 0 이상이어야 합니다.";
    if (i > 0) {
      const prev = list[i - 1];
      const prevMax = prev.max_qty == null ? Infinity : prev.max_qty;
      if (t.min_qty <= prevMax)
        return "구간이 겹칩니다. 이전 구간의 최대 수량보다 큰 값을 시작으로 설정해주세요.";
    }
  }
  return null;
}
