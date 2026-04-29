import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic, type Product } from "@/lib/supabase";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { getCurrentUser } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error(error);
    return null;
  }
  return (data as Product) || null;
}

async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  const { data } = await supabasePublic
    .from("products")
    .select("*")
    .neq("slug", slug)
    .eq("status", "active")
    .order("display_order")
    .limit(limit);
  return (data || []) as Product[];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "상품을 찾을 수 없습니다 | PAT BRO" };
  return {
    title: `${product.name} | PAT BRO 펫브로`,
    description: product.description || undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, user] = await Promise.all([
    getProduct(params.slug),
    getCurrentUser(),
  ]);
  if (!product || product.status !== "active") notFound();
  const approved = !!user && user.status === "approved";

  const related = await getRelated(params.slug);

  return (
    <section className="relative bg-white pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-ink/50">
          <Link href="/" className="transition hover:text-ink">
            HOME
          </Link>
          <span>·</span>
          <Link href="/products" className="transition hover:text-ink">
            SHOP
          </Link>
          <span>·</span>
          <span className="text-ink">{product.en || product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-3xl bg-cream shadow-soft">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-xl bg-cream ring-1 ring-black/5"
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {product.en && (
              <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
                {product.en}
              </p>
            )}
            <h1 className="mt-3 text-[28px] font-extrabold leading-[1.18] text-ink md:text-[36px]">
              {product.name}
            </h1>
            {product.spec && (
              <p className="mt-3 text-sm text-ink/60">{product.spec}</p>
            )}

            {approved ? (
              <div className="mt-8 flex items-baseline gap-3">
                <p className="font-display text-4xl font-extrabold tracking-tightest text-ink md:text-5xl">
                  {product.price.toLocaleString()}
                </p>
                <span className="text-2xl font-semibold text-ink/70">원</span>
              </div>
            ) : (
              <div className="mt-8">
                <Link
                  href={`/login?redirect=/products/${product.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink/[0.04] px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
                >
                  로그인 후 가격 확인
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="mt-2 text-xs text-ink/50">
                  PAT BRO 회원 전용으로 가격이 안내됩니다.
                </p>
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {product.description && (
              <p className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
                {product.description}
              </p>
            )}

            <div className="mt-10 space-y-3">
              <AddToCartButton
                product={{
                  product_id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.images[0] || null,
                }}
                disabled={product.stock <= 0}
                showQuantity
                variant="primary"
                authed={approved}
                redirectFrom={`/products/${product.slug}`}
              />

              <p className="text-center text-xs text-ink/50">
                {product.stock > 0
                  ? `재고 ${product.stock}개 · 영업일 기준 1-2일 이내 발송`
                  : "현재 품절된 상품입니다"}
              </p>
            </div>

            {/* Spec details */}
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black/10 pt-10 text-sm">
              <Spec label="제조국" value="대한민국 (부산)" />
              <Spec label="원료" value="100% 국내산 한우" />
              <Spec label="조단백" value="65% 이상" />
              <Spec label="수분" value="10% 이하" />
              <Spec label="제조사" value="펫브로" />
              <Spec label="유통" value="언니도그" />
            </dl>
          </div>
        </div>

        {/* Product detail images (long scroll description) */}
        {product.detail_images && product.detail_images.length > 0 && (
          <div className="mt-24 border-t border-black/10 pt-16 md:mt-32 md:pt-24">
            <div className="mb-10 text-center">
              <p className="eyebrow justify-center text-brand">PRODUCT DETAIL</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tightest text-ink md:text-3xl">
                상세 정보
              </h2>
            </div>
            <div className="mx-auto max-w-3xl space-y-1.5">
              {product.detail_images.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${product.name} 상세 이미지 ${i + 1}`}
                  loading="lazy"
                  className="block w-full"
                />
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-black/10 pt-16 md:mt-32 md:pt-24">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow text-brand">RELATED PRODUCTS</p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tightest text-ink md:text-3xl">
                  이런 상품은 어떠세요?
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-semibold tracking-[0.2em] text-ink/60 transition hover:text-ink"
              >
                전체 상품 →
              </Link>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group block"
                >
                  <div className="aspect-square overflow-hidden rounded-2xl bg-cream lift">
                    {p.images[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    )}
                  </div>
                  <p className="mt-4 truncate text-sm font-semibold text-ink group-hover:text-brand">
                    {p.name}
                  </p>
                  {approved ? (
                    <p className="mt-1 text-sm font-bold text-ink">
                      {p.price.toLocaleString()}원
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-semibold text-ink/55">
                      로그인 후 확인 →
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
