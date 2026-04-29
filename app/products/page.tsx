import type { Metadata } from "next";
import Link from "next/link";
import { supabasePublic, type Product } from "@/lib/supabase";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const metadata: Metadata = {
  title: "제품 · SHOP | PAT BRO 펫브로",
  description:
    "100% 국내산 한우만 사용하는 프리미엄 수제 우스틱. 7가지 시그니처 라인업.",
};

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as Product[];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-32 md:pb-32 md:pt-40 lg:pb-40 lg:pt-48">
      <div className="pointer-events-none absolute -left-10 top-20 select-none text-[180px] font-extrabold leading-none tracking-tightest text-ink/[0.04] md:text-[280px] lg:text-[360px]">
        SHOP
      </div>

      <div className="container-x relative">
        <div className="reveal flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand">
              <span className="block h-px w-8 bg-brand" />
              UNNI USTICK · SHOP
            </p>
            <h1 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[56px]">
              우리 아이의 크기와 취향에 꼭 맞는,
              <br />
              <span className="text-brand">시그니처 우스틱.</span>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/60">
              100% 한우 · 국내 최초 특허 기술
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-ink/60 lg:text-right">
              사람이 먹을 수 있는 식재료로만 만드는,
              <br />
              위생을 최우선시 하는 수제간식.
            </p>
          </div>
        </div>

        {/* Brand banner */}
        <div className="reveal mt-14 overflow-hidden bg-[#f5f1eb]">
          <img
            src="/images/unni-ustick-banner.jpg"
            alt="언니우스틱 — 100% 국내산 한우와 국내 최초 특허 기술로 완성한 프리미엄 수제개껌"
            className="block w-full"
          />
        </div>

        {/* Shop grid */}
        {products.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-cream p-16 text-center">
            <p className="text-base font-semibold text-ink">
              등록된 상품이 없습니다.
            </p>
            <p className="mt-2 text-sm text-ink/60">
              곧 새로운 상품으로 찾아뵙겠습니다.
            </p>
          </div>
        ) : (
          <div className="reveal mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.id} className="group">
                <Link
                  href={`/products/${p.slug}`}
                  className="block overflow-hidden rounded-xl bg-cream"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {p.images[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    {p.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold tracking-[0.2em] text-white">
                        SOLD OUT
                      </div>
                    )}
                  </div>
                </Link>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${p.slug}`}
                      className="block truncate text-base font-semibold text-ink transition hover:text-brand md:text-lg"
                    >
                      {p.name}
                    </Link>
                    {p.en && (
                      <p className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-ink/50">
                        {p.en}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-base font-extrabold tracking-tightest text-ink md:text-lg">
                    {p.price.toLocaleString()}원
                  </p>
                </div>

                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <AddToCartButton
                    product={{
                      product_id: p.id,
                      slug: p.slug,
                      name: p.name,
                      price: p.price,
                      image: p.images[0] || null,
                    }}
                    disabled={p.stock <= 0}
                    variant="compact"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
