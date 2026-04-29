import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin, type Product } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as Product[];
}

async function deleteProduct(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  if (!id) return;
  await supabaseAdmin().from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

async function toggleStatus(formData: FormData) {
  "use server";
  if (!isAdmin()) redirect("/admin");
  const id = String(formData.get("id"));
  const current = String(formData.get("current"));
  const next = current === "active" ? "draft" : "active";
  await supabaseAdmin()
    .from("products")
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
            PRODUCTS
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tightest text-ink">
            상품 관리
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            총 {products.length}개 — 활성{" "}
            {products.filter((p) => p.status === "active").length}개
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand"
        >
          + 새 상품 추가
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="grid grid-cols-[80px_1fr_120px_100px_100px_140px] items-center gap-4 border-b border-black/5 bg-[#fafafa] px-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-ink/60">
          <span>이미지</span>
          <span>상품명</span>
          <span className="text-right">가격</span>
          <span className="text-right">재고</span>
          <span className="text-center">상태</span>
          <span className="text-right">작업</span>
        </div>
        {products.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-ink/50">
            등록된 상품이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-black/5">
            {products.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[80px_1fr_120px_100px_100px_140px] items-center gap-4 px-5 py-4 transition hover:bg-[#fafafa]"
              >
                <div className="h-14 w-14 overflow-hidden rounded-lg bg-cream">
                  {p.images[0] && (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {p.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink/50">/{p.slug}</p>
                </div>
                <p className="text-right text-sm font-semibold text-ink">
                  {p.price.toLocaleString()}원
                </p>
                <p
                  className={`text-right text-sm font-semibold ${p.stock > 0 ? "text-ink" : "text-red-600"}`}
                >
                  {p.stock}
                </p>
                <div className="flex justify-center">
                  <form action={toggleStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="current" value={p.status} />
                    <button
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                        p.status === "active"
                          ? "bg-brand-50 text-brand-800 hover:bg-brand-100"
                          : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                      }`}
                    >
                      {p.status === "active" ? "● 활성" : "○ 임시저장"}
                    </button>
                  </form>
                </div>
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/80 transition hover:border-ink hover:text-ink"
                  >
                    수정
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} action={deleteProduct} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
