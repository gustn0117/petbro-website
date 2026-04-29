import Link from "next/link";
import { confirmPayment } from "@/lib/payments";
import OrderClearCart from "./OrderClearCart";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { paymentKey?: string; orderId?: string; amount?: string };
}) {
  const paymentKey = searchParams.paymentKey;
  const orderId = searchParams.orderId;
  const amount = Number(searchParams.amount);

  if (!paymentKey || !orderId || !amount) {
    return (
      <ResultLayout type="fail" title="잘못된 접근입니다.">
        <p>필요한 결제 정보가 없습니다.</p>
      </ResultLayout>
    );
  }

  const result = await confirmPayment({ paymentKey, orderId, amount });

  if (!result.ok) {
    return (
      <ResultLayout type="fail" title="결제 승인에 실패했습니다.">
        <p>{result.error}</p>
        {result.code && (
          <p className="mt-2 font-mono text-xs text-ink/40">{result.code}</p>
        )}
      </ResultLayout>
    );
  }

  return (
    <ResultLayout type="success" title="결제가 완료되었습니다.">
      <OrderClearCart />
      <div className="mx-auto max-w-xs space-y-2 rounded-xl bg-cream p-5 text-left text-sm">
        <Row label="주문번호" value={result.order_number} mono />
        <Row label="결제금액" value={`${amount.toLocaleString()}원`} bold />
      </div>
      <p className="mt-6 text-sm text-ink/60">
        주문 내역과 배송 정보는 입력하신 연락처로 안내됩니다.
        <br />
        도매·기타 문의는 010-2466-2313로 연락주세요.
      </p>
    </ResultLayout>
  );
}

function Row({
  label,
  value,
  mono,
  bold,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold tracking-[0.18em] text-ink/60">
        {label}
      </span>
      <span
        className={`${mono ? "font-mono" : ""} ${bold ? "font-extrabold" : "font-semibold"} text-ink`}
      >
        {value}
      </span>
    </div>
  );
}

function ResultLayout({
  type,
  title,
  children,
}: {
  type: "success" | "fail";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream px-6 pt-24">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${type === "success" ? "bg-brand-50 text-brand" : "bg-red-50 text-red-600"}`}
        >
          {type === "success" ? "✓" : "!"}
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tightest text-ink md:text-3xl">
          {title}
        </h1>
        <div className="mt-6 text-sm text-ink/70">{children}</div>
        <div className="mt-10 flex flex-col gap-2">
          <Link
            href="/"
            className="rounded-full bg-ink py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
          >
            홈으로
          </Link>
          <Link
            href="/products"
            className="text-xs font-semibold text-ink/60 transition hover:text-ink"
          >
            쇼핑 계속하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

export const dynamic = "force-dynamic";
