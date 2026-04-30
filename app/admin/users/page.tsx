import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  business_name: string | null;
  business_number: string | null;
  business_owner: string | null;
  business_address: string | null;
  business_type: string | null;
  business_item: string | null;
  tax_email: string | null;
  is_simplified_tax: boolean;
  business_cert_path: string | null;
  reject_reason: string | null;
  approved_at: string | null;
  created_at: string;
};

async function getUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabaseAdmin()
    .from("users")
    .select(
      "id, email, name, phone, status, business_name, business_number, business_owner, business_address, business_type, business_item, tax_email, is_simplified_tax, business_cert_path, reject_reason, approved_at, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as AdminUser[];
}

async function approve(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  if (!id) return;
  await supabaseAdmin()
    .from("users")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      reject_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/users");
}

async function reject(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  const reason = String(formData.get("reason") || "").trim() || null;
  if (!id) return;
  await supabaseAdmin()
    .from("users")
    .update({
      status: "rejected",
      reject_reason: reason,
      approved_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/users");
}

async function updateUserInfo(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  if (!id) return;

  const patch: Record<string, string | boolean | null> = {
    name: String(formData.get("name") || "").trim() || "(미입력)",
    phone: String(formData.get("phone") || "").trim() || null,
    business_name: String(formData.get("business_name") || "").trim() || null,
    business_number:
      String(formData.get("business_number") || "").trim() || null,
    business_owner:
      String(formData.get("business_owner") || "").trim() || null,
    business_address:
      String(formData.get("business_address") || "").trim() || null,
    business_type: String(formData.get("business_type") || "").trim() || null,
    business_item: String(formData.get("business_item") || "").trim() || null,
    tax_email: String(formData.get("tax_email") || "").trim() || null,
    is_simplified_tax: formData.get("is_simplified_tax") === "on",
    updated_at: new Date().toISOString(),
  };

  await supabaseAdmin().from("users").update(patch).eq("id", id);
  revalidatePath("/admin/users");
}

const STATUS_BADGE: Record<AdminUser["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};
const STATUS_KO: Record<AdminUser["status"], string> = {
  pending: "승인 대기",
  approved: "승인 완료",
  rejected: "반려",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const approvedCount = users.filter((u) => u.status === "approved").length;

  return (
    <div className="px-6 py-8 lg:px-10">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
          USERS
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
          회원 관리
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          사업자등록증 확인 후 승인하면 회원이 가격 확인·주문 진행이 가능합니다.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="전체" value={`${users.length}명`} />
        <Stat label="승인 대기" value={`${pendingCount}명`} accent />
        <Stat label="승인 완료" value={`${approvedCount}명`} />
      </div>

      <div className="mt-8 space-y-4">
        {users.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-ink/50 ring-1 ring-black/5">
            가입된 회원이 없습니다.
          </div>
        ) : (
          users.map((u) => (
            <article
              key={u.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-[#fafafa] px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold text-ink">
                    {u.business_name || "(상호 미입력)"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_BADGE[u.status]}`}
                  >
                    {STATUS_KO[u.status]}
                  </span>
                  {u.is_simplified_tax && (
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink/60">
                      간이과세
                    </span>
                  )}
                  <span className="text-xs text-ink/50">
                    가입 {fmtDate(u.created_at)}
                  </span>
                </div>
              </header>

              <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_280px]">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <Info label="담당자" value={u.name} />
                  <Info label="이메일" value={u.email} />
                  <Info label="연락처" value={u.phone || "-"} />
                  <Info label="대표자" value={u.business_owner || "-"} />
                  <Info
                    label="사업자등록번호"
                    value={u.business_number || "-"}
                    mono
                  />
                  <Info label="세금계산서 이메일" value={u.tax_email || "-"} />
                  <Info
                    label="사업장 주소"
                    value={u.business_address || "-"}
                    span
                  />
                  <Info label="업태" value={u.business_type || "-"} />
                  <Info label="종목" value={u.business_item || "-"} />
                  {u.status === "rejected" && u.reject_reason && (
                    <div className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                      반려 사유 · {u.reject_reason}
                    </div>
                  )}

                  {/* Inline edit form (collapsible) */}
                  <details className="col-span-2 mt-2 rounded-lg border border-ink/10 bg-[#fafafa] open:bg-white">
                    <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-semibold text-ink/80 hover:text-ink">
                      ✎ 회원 정보 수정 (사업장 이전 등)
                    </summary>
                    <form
                      action={updateUserInfo}
                      className="space-y-3 border-t border-ink/8 px-4 py-4"
                    >
                      <input type="hidden" name="id" value={u.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <EditField
                          label="담당자"
                          name="name"
                          defaultValue={u.name}
                        />
                        <EditField
                          label="연락처"
                          name="phone"
                          defaultValue={u.phone || ""}
                        />
                        <EditField
                          label="상호"
                          name="business_name"
                          defaultValue={u.business_name || ""}
                        />
                        <EditField
                          label="사업자번호"
                          name="business_number"
                          defaultValue={u.business_number || ""}
                          placeholder="123-45-67890"
                        />
                        <EditField
                          label="대표자"
                          name="business_owner"
                          defaultValue={u.business_owner || ""}
                        />
                        <EditField
                          label="세금계산서 이메일"
                          name="tax_email"
                          type="email"
                          defaultValue={u.tax_email || ""}
                        />
                        <EditField
                          label="사업장 주소"
                          name="business_address"
                          defaultValue={u.business_address || ""}
                          span
                        />
                        <EditField
                          label="업태"
                          name="business_type"
                          defaultValue={u.business_type || ""}
                        />
                        <EditField
                          label="종목"
                          name="business_item"
                          defaultValue={u.business_item || ""}
                        />
                      </div>
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-ink/80">
                        <input
                          type="checkbox"
                          name="is_simplified_tax"
                          defaultChecked={u.is_simplified_tax}
                          className="h-3.5 w-3.5 accent-ink"
                        />
                        간이과세자 (체크 시 세금계산서 발행 안 함)
                      </label>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-ink py-2 text-xs font-semibold text-white transition hover:bg-brand"
                      >
                        변경사항 저장
                      </button>
                    </form>
                  </details>
                </div>

                <div className="space-y-3">
                  {u.business_cert_path ? (
                    <a
                      href={`/api/admin/users/cert?path=${encodeURIComponent(u.business_cert_path)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white"
                    >
                      <span>사업자등록증 보기</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <p className="rounded-xl bg-ink/5 px-4 py-3 text-xs text-ink/55">
                      사업자등록증 파일 없음
                    </p>
                  )}

                  {u.status !== "approved" && (
                    <form action={approve}>
                      <input type="hidden" name="id" value={u.id} />
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        승인하기
                      </button>
                    </form>
                  )}

                  {u.status !== "rejected" && (
                    <form action={reject} className="space-y-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input
                        type="text"
                        name="reason"
                        placeholder="반려 사유 (선택)"
                        className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink"
                      />
                      <button
                        type="submit"
                        className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                      >
                        반려 처리
                      </button>
                    </form>
                  )}
                </div>
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
  mono,
}: {
  label: string;
  value: string;
  span?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <dt className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
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

function EditField({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  span,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
  span?: boolean;
}) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] font-semibold tracking-[0.2em] text-ink/55">
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-ink/12 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}

export const dynamic = "force-dynamic";
