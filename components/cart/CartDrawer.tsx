"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart, unitPriceForItem } from "./CartProvider";
import { nextTier } from "@/lib/pricing";

export default function CartDrawer({ authed }: { authed: boolean }) {
  const { items, isOpen, close, setQuantity, remove, subtotal, hydrated } =
    useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!isOpen}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="장바구니"
        aria-modal={isOpen}
      >
        <header className="flex items-center justify-between border-b border-black/8 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-ink/50">
              CART
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tightest">
              장바구니
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="장바구니 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!authed ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink/40"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="mt-6 text-base font-semibold text-ink">
                로그인이 필요합니다.
              </p>
              <p className="mt-2 text-sm text-ink/55">
                회원 로그인 후 가격 확인 및 주문이 가능합니다.
              </p>
              <div className="mt-8 flex w-full flex-col gap-2">
                <Link
                  href="/login"
                  onClick={close}
                  className="w-full rounded-full bg-ink py-3.5 text-center text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className="w-full rounded-full border border-ink/15 py-3.5 text-center text-sm font-semibold text-ink transition hover:border-ink"
                >
                  회원가입
                </Link>
              </div>
            </div>
          ) : !hydrated ? null : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="text-ink/40"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="mt-6 text-base font-semibold text-ink">
                장바구니가 비어 있습니다.
              </p>
              <p className="mt-2 text-sm text-ink/55">
                상품을 둘러보고 담아보세요.
              </p>
              <Link
                href="/products"
                onClick={close}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
              >
                상품 보러 가기 →
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.product_id}
                  className="flex gap-4 border-b border-black/5 pb-5 last:border-b-0 last:pb-0"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={close}
                    className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={close}
                      className="text-sm font-semibold leading-snug text-ink transition hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    {(() => {
                      const unit = unitPriceForItem(item);
                      const next = nextTier(item.pricing_tiers, item.quantity);
                      return (
                        <>
                          <p className="mt-1 text-sm font-extrabold text-ink">
                            {(unit * item.quantity).toLocaleString()}원
                            <span className="ml-1.5 text-[11px] font-medium text-ink/55">
                              ({unit.toLocaleString()}원 × {item.quantity})
                            </span>
                          </p>
                          {next && (
                            <p className="mt-1 text-[11px] font-semibold text-brand">
                              +{next.needed}개 → {next.tier.price.toLocaleString()}원
                            </p>
                          )}
                        </>
                      );
                    })()}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-ink/12 bg-white">
                        <button
                          onClick={() =>
                            setQuantity(item.product_id, item.quantity - 1)
                          }
                          className="h-8 w-8 text-base text-ink/60 transition hover:text-ink"
                          aria-label="수량 줄이기"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(item.product_id, item.quantity + 1)
                          }
                          className="h-8 w-8 text-base text-ink/60 transition hover:text-ink"
                          aria-label="수량 늘리기"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.product_id)}
                        className="text-xs text-ink/50 underline-offset-2 transition hover:text-ink hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {authed && hydrated && items.length > 0 && (
          <footer className="border-t border-black/8 bg-cream px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink/65">상품 합계</span>
              <span className="font-display text-2xl font-extrabold tracking-tightest text-ink">
                {subtotal.toLocaleString()}원
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/50">
              {subtotal >= 50000
                ? "✓ 무료배송 적용"
                : `${(50000 - subtotal).toLocaleString()}원 추가 시 무료배송`}
            </p>
            <Link
              href="/checkout"
              onClick={close}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
            >
              주문하기 →
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
