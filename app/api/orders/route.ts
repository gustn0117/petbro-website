import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserIdFromCookie } from "@/lib/customer-auth";
import { resolveUnitPrice, volumeDiscount } from "@/lib/pricing";
import { renderNewOrderNotification, sendNotification } from "@/lib/email";

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_OVER = 100000;

type Body = {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  postcode?: string;
  address?: string;
  address_detail?: string;
  memo?: string;
  issue_tax_invoice?: boolean;
  add_vat?: boolean;
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

  // Check approval + load tax info
  const { data: userRow } = await supabaseAdmin()
    .from("users")
    .select(
      "status, business_name, business_number, tax_email, is_simplified_tax",
    )
    .eq("id", userId)
    .maybeSingle();

  if (!userRow) {
    return NextResponse.json(
      { error: "회원 정보를 찾을 수 없습니다." },
      { status: 401 },
    );
  }
  if (userRow.status !== "approved") {
    return NextResponse.json(
      { error: "관리자 승인 후 주문이 가능합니다." },
      { status: 403 },
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
    .select(
      "id, slug, name, price, stock, status, images, pricing_tiers, min_order_quantity",
    )
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
      const minQty = p.min_order_quantity ?? 1;
      if (line.quantity < minQty) {
        throw new Error(
          `'${p.name}'의 최소 주문 수량은 ${minQty}개입니다.`,
        );
      }
      if ((p.stock ?? 0) < line.quantity) {
        throw new Error(`'${p.name}'의 재고가 부족합니다.`);
      }
      // Authoritative: resolve unit price from server-side tiers
      const unit = resolveUnitPrice(
        p.pricing_tiers || [],
        line.quantity,
        p.price,
      ).price;
      return {
        product_id: p.id,
        slug: p.slug,
        name: p.name,
        price: unit,
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
  const discount = volumeDiscount(subtotal);
  const shipping_fee = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const supply_amount = subtotal - discount + shipping_fee;
  const vat_amount = body.add_vat ? Math.round(supply_amount * 0.1) : 0;
  const total = supply_amount + vat_amount;
  const order_number = genOrderNumber();

  // Tax invoice: never issue for simplified-tax users; otherwise honor request flag
  const issueTaxInvoice = userRow.is_simplified_tax
    ? false
    : body.issue_tax_invoice !== false;

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
      discount_amount: discount,
      vat_amount,
      total,
      payment_status: "pending",
      memo: body.memo?.trim() || null,
      issue_tax_invoice: issueTaxInvoice,
      tax_email: issueTaxInvoice ? userRow.tax_email : null,
      business_name: issueTaxInvoice ? userRow.business_name : null,
      business_number: issueTaxInvoice ? userRow.business_number : null,
    })
    .select("id, order_number, total")
    .single();

  if (insertError || !created) {
    return NextResponse.json(
      { error: insertError?.message || "주문 생성 실패" },
      { status: 500 },
    );
  }

  // Fire off the operator notification email. Don't await — don't block
  // the customer's redirect on email infrastructure availability.
  const notification = renderNewOrderNotification({
    order_number,
    customer_name: body.customer_name.trim(),
    customer_phone: body.customer_phone.trim(),
    customer_email: body.customer_email?.trim() || null,
    business_name: userRow.business_name,
    postcode: body.postcode?.trim() || null,
    address: body.address.trim(),
    address_detail: body.address_detail?.trim() || null,
    memo: body.memo?.trim() || null,
    items: validatedItems.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    subtotal,
    discount_amount: discount,
    shipping_fee,
    vat_amount,
    total,
    issue_tax_invoice: issueTaxInvoice,
    tax_email: issueTaxInvoice ? userRow.tax_email : null,
  });
  sendNotification(notification).then((r) => {
    if (!r.ok) console.warn("[email] order notification failed:", r.error);
  });

  return NextResponse.json({
    order_id: created.id,
    order_number: created.order_number,
    total: created.total,
  });
}
