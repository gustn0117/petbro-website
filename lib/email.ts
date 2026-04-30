import { Resend } from "resend";

/**
 * Centralised email helper. Uses Resend (https://resend.com) which has
 * a free tier (3,000/month) and lets you send from `onboarding@resend.dev`
 * without verifying a custom domain — sufficient for internal order
 * notifications that go to a single inbox.
 *
 * Required env:
 *   RESEND_API_KEY      — re_xxx... from resend.com dashboard
 *   NOTIFICATION_EMAIL  — destination address (defaults to patbrokorea@gmail.com)
 *   NOTIFICATION_FROM   — From: header (defaults to onboarding@resend.dev)
 *
 * Behaviour:
 * - If RESEND_API_KEY is missing, sendEmail no-ops with a warning so
 *   order creation never fails because of email config.
 * - Throws are caught at the call site (Orders API runs sendEmail
 *   asynchronously without awaiting in critical paths).
 */
const FROM_DEFAULT = "PAT BRO <onboarding@resend.dev>";
const TO_DEFAULT = "patbrokorea@gmail.com";

let _client: Resend | null | undefined;
function client(): Resend | null {
  if (_client !== undefined) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(
      "[email] RESEND_API_KEY missing — email notifications are disabled.",
    );
    _client = null;
    return null;
  }
  _client = new Resend(key);
  return _client;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to?: string | string[];
  subject: string;
  html?: string;
  text?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const r = client();
  if (!r) return { ok: false, error: "RESEND_API_KEY not configured" };

  const from = process.env.NOTIFICATION_FROM || FROM_DEFAULT;
  const toAddr = to || process.env.NOTIFICATION_EMAIL || TO_DEFAULT;

  try {
    // Resend's overloaded type requires either html or text to be present.
    // Construct the payload conditionally so TS picks the right variant.
    const payload: any = { from, to: toAddr, subject };
    if (html) payload.html = html;
    if (text) payload.text = text;
    const res = await r.emails.send(payload);
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data?.id };
  } catch (e: any) {
    return { ok: false, error: e?.message || "send failed" };
  }
}

// ---------- Templates ----------

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export function renderNewOrderEmail(input: {
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
  const itemsHtml = input.items
    .map(
      (it) => `
        <tr>
          <td style="padding:6px 0;color:#1a1a1a;">${escapeHtml(it.name)}</td>
          <td style="padding:6px 0;color:#666;text-align:right;">${it.quantity}개</td>
          <td style="padding:6px 0;color:#1a1a1a;text-align:right;font-weight:600;">${w(
            it.price * it.quantity,
          )}</td>
        </tr>`,
    )
    .join("");

  const html = `
<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><title>주문 접수 — ${escapeHtml(input.order_number)}</title></head>
<body style="margin:0;background:#f5f1ea;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Pretendard','Segoe UI',sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <div style="background:#1a1a1a;padding:20px 24px;color:#fff;">
        <p style="margin:0;font-size:11px;letter-spacing:.3em;color:#9fcece;">PAT BRO · NEW ORDER</p>
        <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;letter-spacing:-.02em;">새 주문이 접수되었습니다</h1>
      </div>

      <div style="padding:20px 24px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr>
            <td style="padding:6px 0;color:#666;width:32%;">주문번호</td>
            <td style="padding:6px 0;font-family:'SF Mono',ui-monospace,monospace;font-weight:600;">${escapeHtml(input.order_number)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#666;">${input.business_name ? "상호" : "주문자"}</td>
            <td style="padding:6px 0;font-weight:600;">${escapeHtml(input.business_name || input.customer_name)}</td>
          </tr>
          ${
            input.business_name
              ? `<tr><td style="padding:6px 0;color:#666;">담당자</td><td style="padding:6px 0;">${escapeHtml(input.customer_name)}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding:6px 0;color:#666;">연락처</td>
            <td style="padding:6px 0;">${escapeHtml(input.customer_phone)}</td>
          </tr>
          ${
            input.customer_email
              ? `<tr><td style="padding:6px 0;color:#666;">이메일</td><td style="padding:6px 0;">${escapeHtml(input.customer_email)}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding:6px 0;color:#666;vertical-align:top;">배송지</td>
            <td style="padding:6px 0;">${input.postcode ? escapeHtml(input.postcode) + " " : ""}${escapeHtml(input.address)}${
              input.address_detail
                ? " " + escapeHtml(input.address_detail)
                : ""
            }</td>
          </tr>
          ${
            input.memo
              ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top;">배송 요청</td><td style="padding:6px 0;">${escapeHtml(input.memo)}</td></tr>`
              : ""
          }
        </table>

        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #ebebef;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.18em;color:#888;font-weight:600;">주문 상품</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            ${itemsHtml}
          </table>
        </div>

        <div style="margin-top:14px;padding-top:14px;border-top:1px solid #ebebef;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:3px 0;color:#666;">상품 합계</td><td style="padding:3px 0;text-align:right;">${w(input.subtotal)}</td></tr>
            ${input.discount_amount > 0 ? `<tr><td style="padding:3px 0;color:#0f6e6e;">대량 주문 할인</td><td style="padding:3px 0;text-align:right;color:#0f6e6e;">-${w(input.discount_amount)}</td></tr>` : ""}
            <tr><td style="padding:3px 0;color:#666;">배송비</td><td style="padding:3px 0;text-align:right;">${input.shipping_fee === 0 ? "무료" : w(input.shipping_fee)}</td></tr>
            ${input.vat_amount > 0 ? `<tr><td style="padding:3px 0;color:#0f6e6e;">부가세 (10%)</td><td style="padding:3px 0;text-align:right;color:#0f6e6e;">+${w(input.vat_amount)}</td></tr>` : ""}
            <tr style="border-top:1px solid #1a1a1a;"><td style="padding:8px 0 0;font-weight:700;">총 결제금액</td><td style="padding:8px 0 0;text-align:right;font-weight:800;font-size:16px;">${w(input.total)}</td></tr>
          </table>
        </div>

        ${
          input.issue_tax_invoice
            ? `<div style="margin-top:14px;padding:10px 12px;background:#f5f1ea;border-radius:8px;font-size:12px;color:#1a1a1a;"><strong>세금계산서 발행 요청</strong><br>${escapeHtml(input.tax_email || "")}</div>`
            : `<div style="margin-top:14px;padding:10px 12px;background:#fafafa;border-radius:8px;font-size:12px;color:#888;">세금계산서 발행 안 함</div>`
        }
      </div>

      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #ebebef;color:#888;font-size:11px;">
        입금 확인 후 어드민에서 '입금 확인' 버튼으로 처리해주세요.
        <br>https://petbro-website.hsweb.pics/admin/orders
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `[PAT BRO 새 주문]
주문번호: ${input.order_number}
${input.business_name ? `상호: ${input.business_name}\n담당자: ${input.customer_name}` : `주문자: ${input.customer_name}`}
연락처: ${input.customer_phone}
배송지: ${input.address}${input.address_detail ? " " + input.address_detail : ""}

상품:
${input.items.map((it) => `  · ${it.name} × ${it.quantity} = ${w(it.price * it.quantity)}`).join("\n")}

합계: ${w(input.total)}${input.vat_amount > 0 ? " (부가세 포함)" : ""}
세금계산서: ${input.issue_tax_invoice ? "발행 (" + (input.tax_email || "") + ")" : "발행 안 함"}

어드민: https://petbro-website.hsweb.pics/admin/orders`;

  return {
    subject: `[PAT BRO] 새 주문 ${input.order_number} · ${input.total.toLocaleString()}원`,
    html,
    text,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
