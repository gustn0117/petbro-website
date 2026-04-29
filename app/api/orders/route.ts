import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserIdFromCookie } from "@/lib/customer-auth";

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_OVER = 50000;

type Body = {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  postcode?: string;
  address?: string;
  address_detail?: string;
  memo?: string;
  items?: { product_id: string; quantity: number }[];
};

function genOrderNumber() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PB${yyyy}${mm}${dd}${rand}`;
}

export async function POST(req: Request) {
  const userId = getUserIdFromCookie();
  if (!userId) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.customer_name?.trim()) {
    return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  }
  if (!body.customer_phone?.trim()) {
    return NextResponse.json({ error: "연락처를 입력해주세요." }, { status: 400 });
  }
  if (!body.address?.trim()) {
    return NextResponse.json({ error: "주소를 입력해주세요." }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "주문할 상품이 없습니다." }, { status: 400 });
  }

  const ids = body.items.map((i) => i.product_id);
  const { data: products, error: queryError } = await supabaseAdmin()
    .from("products")
    .select("id, slug, name, price, stock, status, images")
    .in("id", ids);

  if (queryError) {
    return NextResponse.json({ error: "상품 조회 실패" }, { status: 500 });
  }

  let validatedItems: {
    product_id: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }[];

  try {
    validatedItems = body.items.map((line) => {
      const p = products?.find((x: any) => x.id === line.product_id);
      if (!p) throw new Error("상품을 찾을 수 없습니다.");
      if (p.status !== "active") {
        throw new Error(`'${p.name}'은 현재 판매중이 아닙니다.`);
      }
      if (line.quantity <= 0) throw new Error("수량이 올바르지 않습니다.");
      if ((p.stock ?? 0) < line.quantity) {
        throw new Error(`'${p.name}'의 재고가 부족합니다.`);
      }
      return {
        product_id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        quantity: line.quantity,
        image:
          Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      };
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "주문 생성 실패" },
      { status: 400 },
    );
  }

  const subtotal = validatedItems.reduce(
    (s, it) => s + it.price * it.quantity,
    0,
  );
  const shipping_fee = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping_fee;
  const order_number = genOrderNumber();

  const { data: created, error: insertError } = await supabaseAdmin()
    .from("orders")
    .insert({
      order_number,
      user_id: userId,
      customer_name: body.customer_name.trim(),
      customer_phone: body.customer_phone.trim(),
      customer_email: body.customer_email?.trim() || null,
      postcode: body.postcode?.trim() || null,
      address: body.address.trim(),
      address_detail: body.address_detail?.trim() || null,
      items: validatedItems,
      subtotal,
      shipping_fee,
      total,
      payment_status: "pending",
      memo: body.memo?.trim() || null,
    })
    .select("id, order_number, total")
    .single();

  if (insertError || !created) {
    return NextResponse.json(
      { error: insertError?.message || "주문 생성 실패" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    order_id: created.id,
    order_number: created.order_number,
    total: created.total,
  });
}
