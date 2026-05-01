/**
 * Order-notification email — FormSubmit (https://formsubmit.co)
 * No account, no API key. Just POST to /ajax/<email> and it forwards
 * to the target inbox.
 *
 * Activation:
 *  1) The very first POST to formsubmit.co for a given email triggers
 *     a one-off "Activate" verification email to that address.
 *  2) Owner clicks the link inside that email once. From then on every
 *     subsequent POST is delivered straight to the inbox.
 *
 * Optional FORMSUBMIT_TOKEN env: after activation FormSubmit gives an
 * obfuscated endpoint id. Setting FORMSUBMIT_TOKEN=<id> uses that
 * endpoint instead so the destination email isn't visible in the
 * source code on GitHub. Falls back to the plain email endpoint if
 * not set.
 */

const TARGET_DEFAULT = "patbrokorea@gmail.com";

function endpoint(): string {
  // FormSubmit's /ajax/ variant rejects server-to-server requests
  // ("Make sure you open this page through a web server"). The plain
  // endpoint accepts urlencoded form bodies fine, just returns an HTML
  // confirmation page instead of JSON — we ignore the response body.
  const token = process.env.FORMSUBMIT_TOKEN?.trim();
  if (token) return `https://formsubmit.co/${token}`;
  const target = process.env.NOTIFICATION_EMAIL || TARGET_DEFAULT;
  return `https://formsubmit.co/${encodeURIComponent(target)}`;
}

export async function sendNotification(input: {
  subject: string;
  fields: Record<string, string | number | null | undefined>;
}): Promise<{ ok: boolean; error?: string }> {
  // urlencoded form body (FormSubmit's standard expectation)
  const params = new URLSearchParams();
  params.set("_subject", input.subject);
  params.set("_template", "table");
  params.set("_captcha", "false");
  for (const [k, v] of Object.entries(input.fields)) {
    if (v == null || v === "") continue;
    params.set(k, String(v));
  }

  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Server-to-server fetch has no Origin header, but FormSubmit
        // is happy with a Referer pointing at our site.
        Referer:
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://patbro-website.hsweb.pics",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      return { ok: false, error: `${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "fetch failed" };
  }
}

// ---------- Order template ----------

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export function renderNewOrderNotification(input: {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  business_name?: string | null;
  postcode: string | null;
  address: string;
  address_detail: string | null;
  memo: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  vat_amount: number;
  total: number;
  issue_tax_invoice: boolean;
  tax_email: string | null;
}) {
  const w = (n: number) => `${n.toLocaleString()}원`;
  const itemsLine = input.items
    .map(
      (it) =>
        `${it.name} × ${it.quantity}개 = ${w(it.price * it.quantity)}`,
    )
    .join("\n");

  const fields: Record<string, string | number | null | undefined> = {
    "주문번호": input.order_number,
    "상호": input.business_name || undefined,
    "담당자": input.customer_name,
    "연락처": input.customer_phone,
    "이메일": input.customer_email || undefined,
    "우편번호": input.postcode || undefined,
    "배송지": `${input.address}${input.address_detail ? " " + input.address_detail : ""}`,
    "배송 요청": input.memo || undefined,
    "주문 상품": itemsLine,
    "상품 합계": w(input.subtotal),
    "대량 주문 할인":
      input.discount_amount > 0 ? `-${w(input.discount_amount)}` : undefined,
    "배송비":
      input.shipping_fee === 0 ? "무료" : w(input.shipping_fee),
    "부가세 (10%)":
      input.vat_amount > 0 ? `+${w(input.vat_amount)}` : undefined,
    "총 결제금액": w(input.total),
    "세금계산서": input.issue_tax_invoice
      ? `발행 (${input.tax_email || ""})`
      : "발행 안 함",
    "어드민": "https://patbro-website.hsweb.pics/admin/orders",
  };

  return {
    subject: `[PAT BRO] 새 주문 ${input.order_number} · ${input.total.toLocaleString()}원`,
    fields,
  };
}
