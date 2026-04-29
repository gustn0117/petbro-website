"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_OVER = 50000;

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, hydrated, clear } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    postcode: "",
    address: "",
    address_detail: "",
    memo: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"카드" | "계좌이체">("카드");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = useMemo(
    () => (subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE),
    [subtotal],
  );
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/products");
    }
  }, [hydrated, items.length, router]);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.customer_name.trim()) return setError("이름을 입력해주세요.");
    if (!form.customer_phone.trim()) return setError("연락처를 입력해주세요.");
    if (!form.address.trim()) return setError("배송지 주소를 입력해주세요.");

    setLoading(true);

    try {
      // 1. Create order on server (validates stock + price authoritatively)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "주문 생성 실패");

      // 2. Launch Toss Payments
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const toss = await loadTossPayments(clientKey);

      const orderName =
        items.length === 1
          ? items[0].name
          : `${items[0].name} 외 ${items.length - 1}건`;

      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "";

      // requestPayment redirects on success/fail.
      await toss.requestPayment(paymentMethod, {
        amount: data.total,
        orderId: data.order_number,
        orderName,
        customerName: form.customer_name,
        customerEmail: form.customer_email || undefined,
        successUrl: `${origin}/order/success`,
        failUrl: `${origin}/order/fail`,
      });
    } catch (e: any) {
      setError(e.message || "결제 진행 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-cream pt-32" />
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-cream pb-24 pt-32 md:pt-40">
      <div className="container-x">
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
            CHECKOUT
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink md:text-4xl">
            주문/결제
          </h1>
        </div>

        <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card title="주문자 정보">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="이름" required>
                  <input
                    value={form.customer_name}
                    onChange={(e) => update("customer_name", e.target.value)}
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label="연락처" required>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={form.customer_phone}
                    onChange={(e) => update("customer_phone", e.target.value)}
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label="이메일 (선택)" className="sm:col-span-2">
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => update("customer_email", e.target.value)}
                    className={inputCls}
                    placeholder="영수증 발송용"
                  />
                </Field>
              </div>
            </Card>

            <Card title="배송지">
              <div className="space-y-4">
                <Field label="우편번호">
                  <input
                    value={form.postcode}
                    onChange={(e) => update("postcode", e.target.value)}
                    className={inputCls}
                    placeholder="00000"
                  />
                </Field>
                <Field label="주소" required>
                  <input
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={inputCls}
                    placeholder="도로명 주소"
                    required
                  />
                </Field>
                <Field label="상세주소">
                  <input
                    value={form.address_detail}
                    onChange={(e) => update("address_detail", e.target.value)}
                    className={inputCls}
                    placeholder="동/호수 등"
                  />
                </Field>
                <Field label="배송 요청사항">
                  <textarea
                    value={form.memo}
                    onChange={(e) => update("memo", e.target.value)}
                    className={`${inputCls} min-h-[80px] resize-y`}
                    placeholder="문 앞 보관, 부재시 연락처 등"
                  />
                </Field>
              </div>
            </Card>

            <Card title="결제 수단">
              <div className="grid grid-cols-2 gap-3">
                {(["카드", "계좌이체"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`rounded-xl border-2 px-4 py-4 text-sm font-semibold transition ${
                      paymentMethod === m
                        ? "border-ink bg-ink text-white"
                        : "border-ink/15 bg-white text-ink hover:border-ink/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/50">
                토스페이먼츠로 안전하게 결제됩니다.
              </p>
            </Card>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
                주문 상품
              </h2>
              <ul className="mt-4 space-y-3 border-b border-black/5 pb-4">
                {items.map((it) => (
                  <li key={it.product_id} className="flex items-center gap-3 text-sm">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {it.image && (
                        <img
                          src={it.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-ink">{it.name}</p>
                      <p className="text-xs text-ink/50">수량 {it.quantity}</p>
                    </div>
                    <p className="font-semibold text-ink">
                      {(it.price * it.quantity).toLocaleString()}원
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="상품 합계" value={`${subtotal.toLocaleString()}원`} />
                <Row
                  label="배송비"
                  value={shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
                />
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-black/10 pt-4">
                <span className="text-sm font-semibold text-ink">총 결제금액</span>
                <span className="font-display text-2xl font-extrabold tracking-tightest text-ink">
                  {total.toLocaleString()}원
                </span>
              </div>
              <p className="mt-2 text-xs text-ink/50">
                {subtotal >= FREE_SHIPPING_OVER
                  ? "5만원 이상 무료배송"
                  : `${(FREE_SHIPPING_OVER - subtotal).toLocaleString()}원 추가 시 무료배송`}
              </p>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-full bg-ink py-4 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand disabled:opacity-50"
              >
                {loading ? "처리 중..." : `${total.toLocaleString()}원 결제하기 →`}
              </button>
              <Link
                href="/products"
                className="mt-3 block text-center text-xs font-semibold text-ink/60 transition hover:text-ink"
              >
                ← 쇼핑 계속하기
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

const inputCls = "field-input";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink/70">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
