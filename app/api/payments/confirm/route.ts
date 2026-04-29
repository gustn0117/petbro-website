import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const TOSS_API = "https://api.tosspayments.com/v1/payments/confirm";

export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json().catch(() => ({}));

  if (!paymentKey || !orderId || typeof amount !== "number") {
    return NextResponse.json(
      { error: "잘못된 결제 요청입니다." },
      { status: 400 },
    );
  }

  // Look up the local order. orderId here is our order_number sent to Toss.
  const { data: order } = await supabaseAdmin()
    .from("orders")
    .select("id, order_number, total, payment_status")
    .eq("order_number", orderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.json(
      { error: "주문 정보를 찾을 수 없습니다." },
      { status: 404 },
    );
  }
  if (order.total !== amount) {
    return NextResponse.json(
      { error: "결제 금액이 일치하지 않습니다." },
      { status: 400 },
    );
  }
  if (order.payment_status === "paid") {
    return NextResponse.json({ ok: true, already: true });
  }

  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "TOSS_SECRET_KEY 미설정" },
      { status: 500 },
    );
  }

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

    return NextResponse.json(
      {
        error: tossData?.message || "결제 승인에 실패했습니다.",
        code: tossData?.code,
      },
      { status: 400 },
    );
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

  return NextResponse.json({
    ok: true,
    order_number: order.order_number,
  });
}
