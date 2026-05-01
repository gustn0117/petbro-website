import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin, type Announcement } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function listAll(): Promise<Announcement[]> {
  const { data } = await supabaseAdmin()
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as Announcement[];
}

async function createOne(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await supabaseAdmin().from("announcements").insert({
    title,
    body: String(formData.get("body") || "").trim() || null,
    link_label: String(formData.get("link_label") || "").trim() || null,
    link_url: String(formData.get("link_url") || "").trim() || null,
    status: "active",
    starts_at: String(formData.get("starts_at") || "") || null,
    ends_at: String(formData.get("ends_at") || "") || null,
  });
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

async function updateOne(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  if (!id) return;
  await supabaseAdmin()
    .from("announcements")
    .update({
      title: String(formData.get("title") || "").trim() || "(제목 없음)",
      body: String(formData.get("body") || "").trim() || null,
      link_label: String(formData.get("link_label") || "").trim() || null,
      link_url: String(formData.get("link_url") || "").trim() || null,
      starts_at: String(formData.get("starts_at") || "") || null,
      ends_at: String(formData.get("ends_at") || "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

async function toggleStatus(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  const current = String(formData.get("current"));
  await supabaseAdmin()
    .from("announcements")
    .update({
      status: current === "active" ? "draft" : "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

async function deleteOne(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  await supabaseAdmin().from("announcements").delete().eq("id", id);
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

function dt(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function dtInput(d: string | null) {
  // datetime-local needs YYYY-MM-DDTHH:MM (no seconds, local time)
  if (!d) return "";
  const dt = new Date(d);
  const tz = dt.getTimezoneOffset();
  const local = new Date(dt.getTime() - tz * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function AdminAnnouncementsPage() {
  const list = await listAll();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
            ANNOUNCEMENTS
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
            공지사항 팝업
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            활성 상태인 공지가 사이트 첫 방문 시 팝업으로 노출됩니다. 닫기를
            누르면 같은 세션에서 다시 안 뜨고, '다시 보지 않기'는 영구 적용됩니다.
          </p>
        </div>
      </div>

      {/* Create form */}
      <form
        action={createOne}
        className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      >
        <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
          + 새 공지 추가
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="제목" required>
            <input
              name="title"
              required
              className="field-input"
              placeholder="예: 4/30(금) 출고 일정 안내"
            />
          </Field>
          <Field label="버튼 라벨 (선택)">
            <input
              name="link_label"
              className="field-input"
              placeholder="예: 자세히 보기"
            />
          </Field>
          <Field label="본문" className="md:col-span-2">
            <textarea
              name="body"
              className="field-input min-h-[100px] resize-y"
              placeholder="줄바꿈으로 단락을 구분합니다."
            />
          </Field>
          <Field label="버튼 링크 (선택)">
            <input
              name="link_url"
              type="url"
              className="field-input"
              placeholder="https://..."
            />
          </Field>
          <Field label="노출 시작 (선택)" className="md:col-span-1">
            <input name="starts_at" type="datetime-local" className="field-input" />
          </Field>
          <Field label="노출 종료 (선택)" className="md:col-span-1">
            <input name="ends_at" type="datetime-local" className="field-input" />
          </Field>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
        >
          공지 추가
        </button>
      </form>

      {/* List */}
      <div className="mt-8 space-y-4">
        {list.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-ink/50 ring-1 ring-black/5">
            등록된 공지가 없습니다.
          </div>
        ) : (
          list.map((a) => (
            <article
              key={a.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-[#fafafa] px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      a.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-ink/10 text-ink/55"
                    }`}
                  >
                    {a.status === "active" ? "활성" : "임시저장"}
                  </span>
                  <span className="text-xs text-ink/50">
                    생성 {dt(a.created_at)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <form action={toggleStatus}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="current" value={a.status} />
                    <button
                      type="submit"
                      className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink/80 hover:border-ink hover:text-ink"
                    >
                      {a.status === "active" ? "비활성" : "활성화"}
                    </button>
                  </form>
                  <form action={deleteOne}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:border-red-300 hover:bg-red-100"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </header>

              <form action={updateOne} className="px-5 py-4">
                <input type="hidden" name="id" value={a.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="제목" required>
                    <input
                      name="title"
                      defaultValue={a.title}
                      required
                      className="field-input"
                    />
                  </Field>
                  <Field label="버튼 라벨 (선택)">
                    <input
                      name="link_label"
                      defaultValue={a.link_label || ""}
                      className="field-input"
                    />
                  </Field>
                  <Field label="본문" className="md:col-span-2">
                    <textarea
                      name="body"
                      defaultValue={a.body || ""}
                      className="field-input min-h-[80px] resize-y"
                    />
                  </Field>
                  <Field label="버튼 링크">
                    <input
                      name="link_url"
                      type="url"
                      defaultValue={a.link_url || ""}
                      className="field-input"
                    />
                  </Field>
                  <Field label="노출 시작">
                    <input
                      name="starts_at"
                      type="datetime-local"
                      defaultValue={dtInput(a.starts_at)}
                      className="field-input"
                    />
                  </Field>
                  <Field label="노출 종료">
                    <input
                      name="ends_at"
                      type="datetime-local"
                      defaultValue={dtInput(a.ends_at)}
                      className="field-input"
                    />
                  </Field>
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-full bg-ink px-5 py-2 text-xs font-semibold text-white transition hover:bg-brand"
                >
                  변경 저장
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
