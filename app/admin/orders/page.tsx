import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin, type Order } from "@/lib/supabase";

async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as Order[];
}

async function updateFulfillment(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const tracking = String(formData.get("tracking") || "").trim();
  const allowed = ["pending", "preparing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return;
  await supabaseAdmin()
    .from("orders")
    .update({
      fulfillment_status: status,
      tracking_number: tracking || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/orders");
}

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
  const dt = new Date(d);
  return dt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const paidCount = orders.filter((o) => o.payment_status === "paid").length;
  const pendingCount = orders.filter((o) => o.payment_status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="px-6 py-8 lg:px-10">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
          ORDERS
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
          주문 관리
        </h1>
      </div>

      {/* KPI */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="전체 주문" value={`${orders.length}건`} />
        <Stat label="결제 완료" value={`${paidCount}건`} accent />
        <Stat label="누적 매출" value={`${totalRevenue.toLocaleString()}원`} />
      </div>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-ink/50 ring-1 ring-black/5">
            아직 주문이 없습니다.
          </div>
        ) : (
          orders.map((o) => (
            <article
              key={o.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-[#fafafa] px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink">
                    #{o.order_number}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${PAYMENT_BADGE[o.payment_status]}`}
                  >
                    {PAYMENT_KO[o.payment_status]}
                  </span>
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink/70">
                    {FULFILLMENT_KO[o.fulfillment_status]}
                  </span>
                  <span className="text-xs text-ink/50">{fmtDate(o.created_at)}</span>
                </div>
                <p className="text-base font-extrabold tracking-tightest text-ink">
                  {o.total.toLocaleString()}원
                </p>
              </header>

              <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_300px]">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-ink/50">
                    주문 상품
                  </p>
                  <ul className="mt-2 space-y-2">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-cream">
                          {it.image && (
                            <img
                              src={it.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <span className="flex-1 truncate text-ink">
                          {it.name}{" "}
                          <span className="text-ink/50">× {it.quantity}</span>
                        </span>
                        <span className="font-semibold text-ink">
                          {(it.price * it.quantity).toLocaleString()}원
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-black/5 pt-4 text-sm">
                    <Info label="이름" value={o.customer_name} />
                    <Info label="연락처" value={o.customer_phone} />
                    <Info label="이메일" value={o.customer_email || "-"} />
                    <Info label="우편번호" value={o.postcode || "-"} />
                    <Info
                      label="배송지"
                      value={`${o.address}${o.address_detail ? ` ${o.address_detail}` : ""}`}
                      span
                    />
                    {o.memo && <Info label="배송 요청" value={o.memo} span />}
                  </div>
                </div>

                {/* Fulfillment */}
                <form
                  action={updateFulfillment}
                  className="space-y-3 rounded-xl bg-[#fafafa] p-4"
                >
                  <input type="hidden" name="id" value={o.id} />
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-ink/50">
                    배송 처리
                  </p>
                  <select
                    name="status"
                    defaultValue={o.fulfillment_status}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                  >
                    <option value="pending">주문 접수</option>
                    <option value="preparing">준비 중</option>
                    <option value="shipped">배송 중</option>
                    <option value="delivered">배송 완료</option>
                    <option value="cancelled">주문 취소</option>
                  </select>
                  <input
                    name="tracking"
                    defaultValue={o.tracking_number || ""}
                    placeholder="송장 번호 (선택)"
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
                  >
                    저장
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ring-1 ring-black/5 ${accent ? "bg-ink text-white" : "bg-white text-ink"}`}
    >
      <p
        className={`text-[11px] font-semibold tracking-[0.2em] ${accent ? "text-brand-200" : "text-ink/50"}`}
      >
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold tracking-tightest">{value}</p>
    </div>
  );
}

function Info({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <dt className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

export const dynamic = "force-dynamic";
