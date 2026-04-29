"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { items, isOpen, close, setQuantity, remove, subtotal, hydrated } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!isOpen}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="장바구니"
      >
        <header className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-display text-lg font-extrabold tracking-tightest">
            CART · 장바구니
          </h2>
          <button
            onClick={close}
            aria-label="장바구니 닫기"
            className="text-ink/60 transition hover:text-ink"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!hydrated ? null : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-5xl">🛒</div>
              <p className="mt-6 text-base font-semibold text-ink">
                장바구니가 비어 있습니다.
              </p>
              <p className="mt-2 text-sm text-ink/60">
                상품을 둘러보고 담아보세요.
              </p>
              <Link
                href="/products"
                onClick={close}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
              >
                상품 보러 가기 →
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.product_id}
                  className="flex gap-4 border-b border-black/5 pb-5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={close}
                      className="text-sm font-semibold leading-snug text-ink transition hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-ink/15">
                        <button
                          onClick={() =>
                            setQuantity(item.product_id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-sm text-ink/70 hover:text-ink"
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
                          className="px-3 py-1 text-sm text-ink/70 hover:text-ink"
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

        {hydrated && items.length > 0 && (
          <footer className="border-t border-black/10 bg-cream px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/70">상품 합계</span>
              <span className="text-xl font-extrabold tracking-tightest text-ink">
                {subtotal.toLocaleString()}원
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/50">
              배송비는 결제 단계에서 안내됩니다.
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
