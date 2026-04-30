import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin, type Order } from "@/lib/supabase";
import { getUserIdFromCookie } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "입금 안내 | PAT BRO 펫브로",
};

export const dynamic = "force-dynamic";

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || "NH농협은행";
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || "301-0295-4839-21";
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER || "임정현";

async function getOrder(orderNumber: string, userId: string): Promise<Order | null> {
  const { data } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Order) || null;
}

export default async function OrderAwaitingPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const userId = getUserIdFromCookie();
  if (!userId) redirect("/login");
  const orderNumber = searchParams.order;
  if (!orderNumber) redirect("/products");

  const order = await getOrder(orderNumber, userId);
  if (!order) redirect("/products");

  const isPaid = order.payment_status === "paid";

  return (
    <section className="bg-cream pb-24 pt-32 md:pt-40">
      <div className="container-x">
        <div className="mx-auto max-w-2xl">
          {isPaid ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-700">
                ✓
              </div>
              <p className="mt-6 text-[11px] font-semibold tracking-[0.3em] text-emerald-700">
                PAYMENT CONFIRMED
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink md:text-4xl">
                입금이 확인되었습니다.
              </h1>
              <p className="mt-3 text-sm text-ink/65">
                준비 후 영업일 기준 1-2일 이내 발송됩니다. 송장 번호는 입력하신
                연락처로 안내됩니다.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700">
                ◔
              </div>
              <p className="mt-6 text-[11px] font-semibold tracking-[0.3em] text-amber-700">
                AWAITING TRANSFER
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink md:text-4xl">
                주문이 접수되었습니다.
              </h1>
              <p className="mt-3 text-sm text-ink/65">
                아래 계좌로 입금해주시면 확인 후 발송이 진행됩니다.
              </p>
            </div>
          )}

          {/* Bank info card */}
          {!isPaid && (
            <div className="mt-10 overflow-hidden rounded-2xl bg-ink text-white shadow-soft">
              <div className="px-7 py-7 md:px-10">
                <p className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
                  입금 계좌
                </p>
                <p className="mt-3 font-display text-2xl font-extrabold tracking-tightest md:text-3xl">
                  {BANK_NAME}
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold tracking-tightest md:text-3xl">
                  {BANK_ACCOUNT}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/80">
                  예금주 · {BANK_HOLDER}
                </p>
              </div>
              <div className="grid grid-cols-2 border-t border-white/10">
                <div className="px-7 py-5 md:px-10">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-200">
                    입금 금액
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold tracking-tightest text-white md:text-2xl">
                    {order.total.toLocaleString()}원
                  </p>
                </div>
                <div className="border-l border-white/10 px-7 py-5 md:px-10">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-200">
                    입금자명 (권장)
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {order.customer_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order info */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/55">
              ORDER
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-ink/55">
                  주문번호
                </dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-ink">
                  {order.order_number}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-ink/55">
                  결제금액
                </dt>
                <dd className="mt-1 font-bold text-ink">
                  {order.total.toLocaleString()}원
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-ink/55">
                  배송지
                </dt>
                <dd className="mt-1 text-sm text-ink">
                  {order.address}
                  {order.address_detail ? ` ${order.address_detail}` : ""}
                </dd>
              </div>
            </div>
            <ul className="mt-5 space-y-2 border-t border-ink/8 pt-4 text-xs text-ink/60">
              <li>• 입금 확인 후 발송이 진행됩니다 (영업일 기준 1-2일).</li>
              <li>• 입금이 늦어지는 경우 010-7721-4150 으로 연락해주세요.</li>
              <li>• 세금계산서는 회원가입 시 등록하신 이메일로 자동 발행됩니다.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-2 md:flex-row md:justify-center">
            <Link
              href="/products"
              className="rounded-full border border-ink/15 px-6 py-3 text-center text-sm font-semibold text-ink transition hover:border-ink"
            >
              쇼핑 계속하기
            </Link>
            <Link
              href="/"
              className="rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
