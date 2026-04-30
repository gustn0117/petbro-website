import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/customer-auth";
import { supabaseAdmin, type Order } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "주문 내역 · 내 정보 | PAT BRO 펫브로",
};

export const dynamic = "force-dynamic";

const PAYMENT_BADGE: Record<Order["payment_status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-ink/10 text-ink/60",
  refunded: "bg-purple-100 text-purple-800",
};
const PAYMENT_KO: Record<Order["payment_status"], string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  failed: "결제 실패",
  cancelled: "결제 취소",
  refunded: "환불",
};
const FULFILLMENT_KO: Record<Order["fulfillment_status"], string> = {
  pending: "주문 접수",
  preparing: "준비 중",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account/orders");

  const { data: orders } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (orders || []) as Order[];

  return (
    <section className="bg-cream pb-24 pt-32 md:pt-40">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
              MY ACCOUNT
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink md:text-4xl">
              주문 내역
            </h1>
            <p className="mt-3 text-sm text-ink/65">
              {user.business_name ? `${user.business_name} · ` : ""}
              {user.name} 님의 주문 내역입니다.
            </p>
          </div>

          {/* Account summary */}
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-soft">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-ink/55">
              MY INFO
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3">
              <Info label="이메일" value={user.email} />
              <Info label="담당자" value={user.name} />
              <Info label="연락처" value={user.phone || "-"} />
              {user.business_name && (
                <Info label="상호" value={user.business_name} />
              )}
              {user.business_number && (
                <Info label="사업자번호" value={user.business_number} mono />
              )}
              {user.tax_email && (
                <Info label="세금계산서 이메일" value={user.tax_email} />
              )}
            </dl>
          </div>

          {/* Orders list */}
          {list.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-ink/55 shadow-soft">
              아직 주문 내역이 없습니다.
              <Link
                href="/products"
                className="ml-2 font-semibold text-brand underline-offset-2 hover:underline"
              >
                상품 보러가기 →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((o) => (
                <article
                  key={o.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-soft"
                >
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-[#fafafa] px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-ink">
                        #{o.order_number}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${PAYMENT_BADGE[o.payment_status]}`}
                      >
                        {PAYMENT_KO[o.payment_status]}
                      </span>
                      <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-semibold text-ink/65">
                        {FULFILLMENT_KO[o.fulfillment_status]}
                      </span>
                    </div>
                    <span className="text-xs text-ink/55">
                      {fmtDate(o.created_at)}
                    </span>
                  </header>

                  <div className="px-5 py-4">
                    <ul className="space-y-2.5">
                      {o.items.map((it, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm"
                        >
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
                            <p className="text-xs text-ink/55">
                              {it.price.toLocaleString()}원 × {it.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-ink">
                            {(it.price * it.quantity).toLocaleString()}원
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* Tracking + total */}
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-black/5 pt-4">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-ink/55">
                          송장 번호
                        </p>
                        <p className="mt-1 font-mono text-sm font-semibold text-ink">
                          {o.tracking_number || (
                            <span className="font-sans text-ink/45">
                              발송 후 등록됩니다
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-ink/55">
                          총 결제금액
                        </p>
                        <p className="mt-1 font-display text-xl font-extrabold tracking-tightest text-ink">
                          {o.total.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {o.payment_status === "pending" && (
                      <Link
                        href={`/order/awaiting?order=${encodeURIComponent(o.order_number)}`}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                      >
                        입금 안내 다시 보기 →
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-xs text-ink/50">
            주문·배송 관련 문의는 010-7721-4150 으로 부탁드립니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold tracking-[0.18em] text-ink/55">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-ink ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
