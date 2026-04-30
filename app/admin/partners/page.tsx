import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin, type Partner } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabaseAdmin()
    .from("partners")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as Partner[];
}

async function deletePartner(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  if (!id) return;
  await supabaseAdmin().from("partners").delete().eq("id", id);
  revalidatePath("/admin/partners");
  revalidatePath("/partners");
}

async function toggleStatus(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  const current = String(formData.get("current"));
  const next = current === "active" ? "draft" : "active";
  await supabaseAdmin()
    .from("partners")
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/partners");
  revalidatePath("/partners");
}

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
            PARTNERS
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
            파트너사 관리
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            총 {partners.length}곳 — 활성{" "}
            {partners.filter((p) => p.status === "active").length}곳
          </p>
        </div>
        <Link
          href="/admin/partners/new"
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand"
        >
          + 새 파트너사
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {partners.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white px-6 py-16 text-center text-sm text-ink/50 ring-1 ring-black/5">
            등록된 파트너사가 없습니다.
          </div>
        ) : (
          partners.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="flex h-32 items-center justify-center border-b border-black/5 bg-cream p-4">
                {p.logo_url ? (
                  <img
                    src={p.logo_url}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-ink/40">로고 없음</span>
                )}
              </div>
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-ink">{p.name}</h2>
                  <form action={toggleStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="current" value={p.status} />
                    <button
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                        p.status === "active"
                          ? "bg-brand-50 text-brand-800 hover:bg-brand-100"
                          : "bg-ink/5 text-ink/55 hover:bg-ink/10"
                      }`}
                    >
                      {p.status === "active" ? "● 활성" : "○ 임시"}
                    </button>
                  </form>
                </div>
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-ink/55">
                    {p.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink/45">순서 · {p.display_order}</span>
                  <div className="flex gap-1.5">
                    <Link
                      href={`/admin/partners/${p.id}`}
                      className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink/80 transition hover:border-ink hover:text-ink"
                    >
                      수정
                    </Link>
                    <form action={deletePartner}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
