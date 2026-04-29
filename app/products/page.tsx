import type { Metadata } from "next";
import Link from "next/link";
import { supabasePublic, type Product } from "@/lib/supabase";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { getCurrentUser } from "@/lib/customer-auth";
import { startingPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "제품 · SHOP | PAT BRO 펫브로",
  description:
    "100% 국내산 한우만 사용하는 프리미엄 수제 우스틱. 7가지 시그니처 라인업.",
};

export const dynamic = "force-dynamic";

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
  const [products, user] = await Promise.all([getProducts(), getCurrentUser()]);
  const approved = !!user && user.status === "approved";

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-28 md:pb-32 md:pt-36 lg:pb-40 lg:pt-44">
      <div className="pointer-events-none absolute -left-10 top-20 select-none text-[180px] font-extrabold leading-none tracking-tightest text-ink/[0.035] md:text-[280px] lg:text-[360px]">
        SHOP
      </div>

      <div className="container-x relative">
        {/* Hero header */}
        <div className="reveal flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-7 text-brand">UNNI USTICK · SHOP</p>
            <h1 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[60px]">
              우리 아이의 크기와 취향에 꼭 맞는,
              <br />
              <span className="text-brand">시그니처 우스틱.</span>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip-dark">100% 한우</span>
              <span className="chip">국내 최초 특허 기술</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink/60 lg:text-right">
              사람이 먹을 수 있는 식재료로만 만드는,
              <br />
              위생을 최우선시 하는 수제간식.
            </p>
          </div>
        </div>

        {/* Brand banner */}
        <div className="reveal mt-14 overflow-hidden rounded-2xl bg-[#f5f1eb] shadow-soft">
          <img
            src="/images/unni-ustick-banner.jpg"
            alt="언니우스틱 — 100% 국내산 한우와 국내 최초 특허 기술로 완성한 프리미엄 수제개껌"
            className="block w-full"
          />
        </div>

        {/* Video showcase */}
        <div className="reveal mt-8 grid gap-px overflow-hidden rounded-2xl bg-ink/10 shadow-soft md:grid-cols-12">
          <div className="relative bg-ink md:col-span-8">
            <video
              src="/images/unni-ustick.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/unni-ustick-romance.jpg"
              className="block aspect-video w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-cream p-7 md:col-span-4 md:p-10">
            <p className="eyebrow text-brand">IN ACTION</p>
            <h3 className="mt-4 text-xl font-extrabold leading-[1.25] text-ink md:text-2xl">
              씹는 재미가 다른
              <br />
              <span className="text-brand">언니우스틱.</span>
            </h3>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink/65">
              한우 100%로 만들어 자연스러운 향과 식감.
              우리 아이가 오래오래 집중해서 씹을 수 있는, 펫브로의 시그니처 우스틱입니다.
            </p>
          </div>
        </div>

        {/* Filter strip — counter */}
        <div className="mt-16 flex items-end justify-between border-b border-ink/10 pb-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/50">
              ALL ITEMS
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tightest text-ink md:text-3xl">
              총{" "}
              <span className="text-brand">{products.length}</span>개의 상품
            </p>
          </div>
          <p className="hidden text-xs text-ink/50 md:block">
            5만원 이상 구매 시 무료배송
          </p>
        </div>

        {/* Shop grid */}
        {products.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-cream p-16 text-center shadow-soft">
            <p className="text-base font-semibold text-ink">
              등록된 상품이 없습니다.
            </p>
            <p className="mt-2 text-sm text-ink/60">
              곧 새로운 상품으로 찾아뵙겠습니다.
            </p>
          </div>
        ) : (
          <div className="reveal mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.id} className="group">
                <Link
                  href={`/products/${p.slug}`}
                  className="block overflow-hidden rounded-2xl bg-cream lift"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {p.images[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    )}
                    {p.stock <= 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/65 text-sm font-semibold tracking-[0.25em] text-white">
                        SOLD OUT
                      </div>
                    ) : p.stock <= 10 ? (
                      <span className="absolute left-3 top-3 rounded-full bg-accent-warm/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] text-white shadow-sm">
                        재고 임박
                      </span>
                    ) : null}
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
                      <p className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-ink/45">
                        {p.en}
                      </p>
                    )}
                  </div>
                  {approved ? (
                    (() => {
                      const sp = startingPrice(p.pricing_tiers, p.price);
                      const hasTiers = (p.pricing_tiers?.length ?? 0) > 0;
                      return (
                        <div className="shrink-0 text-right">
                          <p className="text-base font-extrabold tracking-tightest text-ink md:text-lg">
                            {sp.price.toLocaleString()}
                            <span className="ml-0.5 text-xs font-semibold text-ink/60">
                              원{hasTiers ? "~" : ""}
                            </span>
                          </p>
                          {hasTiers && sp.tier && (
                            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.12em] text-brand">
                              {sp.tier.min_qty}ea+ 기준
                            </p>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <Link
                      href={`/login?redirect=/products`}
                      className="shrink-0 rounded-full bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink/65 transition hover:bg-ink hover:text-white"
                    >
                      로그인 후 확인
                    </Link>
                  )}
                </div>

                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="chip">
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
                      pricing_tiers: p.pricing_tiers || [],
                      min_order_quantity: p.min_order_quantity ?? 10,
                    }}
                    disabled={p.stock <= 0}
                    variant="compact"
                    authed={approved}
                    redirectFrom="/products"
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
