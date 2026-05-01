import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin, type Announcement } from "@/lib/supabase";
import PopupImageField from "@/components/admin/PopupImageField";

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
  const image_url = String(formData.get("image_url") || "").trim();
  if (!image_url) return; // image is required
  await supabaseAdmin().from("announcements").insert({
    image_url,
    link_url: String(formData.get("link_url") || "").trim() || null,
    status: "active",
    title: null,
    body: null,
    link_label: null,
    starts_at: null,
    ends_at: null,
  });
  revalidatePath("/admin/popups");
  revalidatePath("/", "layout");
}

async function updateOne(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  const image_url = String(formData.get("image_url") || "").trim();
  if (!id || !image_url) return;
  await supabaseAdmin()
    .from("announcements")
    .update({
      image_url,
      link_url: String(formData.get("link_url") || "").trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/popups");
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
  revalidatePath("/admin/popups");
  revalidatePath("/", "layout");
}

async function deleteOne(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  await supabaseAdmin().from("announcements").delete().eq("id", id);
  revalidatePath("/admin/popups");
  revalidatePath("/", "layout");
}

function dt(d: string) {
  return new Date(d).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminPopupsPage() {
  const list = await listAll();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
          POPUPS
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
          팝업 관리
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          이미지 1장과 연결 링크(선택)만 등록하면 사이트 첫 방문 시 팝업으로
          노출됩니다.
        </p>
      </div>

      {/* Create form */}
      <form
        action={createOne}
        className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      >
        <h2 className="text-sm font-semibold tracking-[0.18em] text-ink/70">
          + 새 팝업 추가
        </h2>
        <div className="mt-5 space-y-4">
          <Field label="팝업 이미지" required>
            <PopupImageField />
          </Field>
          <Field label="이미지 클릭 시 이동할 링크 (선택)">
            <input
              name="link_url"
              type="url"
              className="field-input"
              placeholder="https://..."
            />
          </Field>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
        >
          팝업 추가
        </button>
      </form>

      {/* List */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {list.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white px-6 py-16 text-center text-sm text-ink/50 ring-1 ring-black/5">
            등록된 팝업이 없습니다.
          </div>
        ) : (
          list.map((a) => (
            <article
              key={a.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-[#fafafa] px-5 py-3">
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
              </div>

              {a.image_url && (
                <div className="bg-cream">
                  <img
                    src={a.image_url}
                    alt=""
                    className="block max-h-72 w-full object-contain"
                  />
                </div>
              )}

              <form action={updateOne} className="space-y-3 px-5 py-4">
                <input type="hidden" name="id" value={a.id} />
                <Field label="팝업 이미지">
                  <PopupImageField defaultValue={a.image_url} />
                </Field>
                <Field label="이미지 클릭 시 이동할 링크">
                  <input
                    name="link_url"
                    type="url"
                    defaultValue={a.link_url || ""}
                    className="field-input"
                    placeholder="https://..."
                  />
                </Field>
                <button
                  type="submit"
                  className="rounded-full bg-ink px-5 py-2 text-xs font-semibold text-white transition hover:bg-brand"
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/60">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
