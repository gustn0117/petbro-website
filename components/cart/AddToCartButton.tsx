"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type ProductInput = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
};

export default function AddToCartButton({
  product,
  disabled,
  variant = "primary",
  showQuantity = false,
}: {
  product: ProductInput;
  disabled?: boolean;
  variant?: "primary" | "compact";
  showQuantity?: boolean;
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (disabled) return;
    add(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleAdd}
        disabled={disabled}
        className="w-full rounded-full border border-ink/15 bg-white py-3 text-sm font-semibold tracking-[0.1em] text-ink transition hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-ink"
      >
        {disabled ? "품절" : added ? "✓ 담았습니다" : "장바구니 담기"}
      </button>
    );
  }

  return (
    <div className="flex items-stretch gap-3">
      {showQuantity && (
        <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-base text-ink/70 hover:text-ink"
            aria-label="수량 줄이기"
            type="button"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-base font-semibold">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-3 text-base text-ink/70 hover:text-ink"
            aria-label="수량 늘리기"
            type="button"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleAdd}
        disabled={disabled}
        className="flex-1 rounded-full bg-ink px-6 py-4 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
        type="button"
      >
        {disabled ? "품절" : added ? "✓ 장바구니에 담았습니다" : "장바구니 담기"}
      </button>
    </div>
  );
}
