import "server-only";
import { supabaseAdmin } from "./supabase";

const TOSS_API = "https://api.tosspayments.com/v1/payments/confirm";

export type ConfirmResult =
  | { ok: true; order_number: string; already?: boolean }
  | { ok: false; error: string; code?: string };

export async function confirmPayment(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<ConfirmResult> {
  const { paymentKey, orderId, amount } = params;

  if (!paymentKey || !orderId || typeof amount !== "number") {
    return { ok: false, error: "잘못된 결제 요청입니다." };
  }

  const { data: order } = await supabaseAdmin()
    .from("orders")
    .select("id, order_number, total, payment_status")
    .eq("order_number", orderId)
    .maybeSingle();

  if (!order) return { ok: false, error: "주문 정보를 찾을 수 없습니다." };
  if (order.total !== amount) {
    return { ok: false, error: "결제 금액이 일치하지 않습니다." };
  }
  if (order.payment_status === "paid") {
    return { ok: true, order_number: order.order_number, already: true };
  }

  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) return { ok: false, error: "TOSS_SECRET_KEY 미설정" };

  const auth = Buffer.from(`${secret}:`).toString("base64");
  const tossRes = await fetch(TOSS_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const tossData = await tossRes.json().catch(() => ({}));

  if (!tossRes.ok) {
    await supabaseAdmin()
      .from("orders")
      .update({
        payment_status: "failed",
        toss_payment_key: paymentKey,
        toss_order_id: orderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return {
      ok: false,
      error: tossData?.message || "결제 승인에 실패했습니다.",
      code: tossData?.code,
    };
  }

  // Decrement product stock for each item
  const { data: full } = await supabaseAdmin()
    .from("orders")
    .select("items")
    .eq("id", order.id)
    .maybeSingle();

  if (full?.items && Array.isArray(full.items)) {
    for (const it of full.items as any[]) {
      const { data: prod } = await supabaseAdmin()
        .from("products")
        .select("stock")
        .eq("id", it.product_id)
        .maybeSingle();
      if (prod) {
        await supabaseAdmin()
          .from("products")
          .update({
            stock: Math.max(0, (prod.stock ?? 0) - it.quantity),
            updated_at: new Date().toISOString(),
          })
          .eq("id", it.product_id);
      }
    }
  }

  await supabaseAdmin()
    .from("orders")
    .update({
      payment_status: "paid",
      toss_payment_key: paymentKey,
      toss_order_id: orderId,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  return { ok: true, order_number: order.order_number };
}
