import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin, type Product } from "@/lib/supabase";
import ProductForm, { type ProductFormValues } from "@/components/admin/ProductForm";

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Product) || null;
}

async function updateProduct(values: ProductFormValues) {
  "use server";
  if (!isAdmin()) return { ok: false, error: "권한이 없습니다." };
  if (!values.id) return { ok: false, error: "상품 ID가 없습니다." };

  const slug = values.slug.trim();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { ok: false, error: "slug은 영문 소문자, 숫자, 하이픈만 사용 가능합니다." };
  }

  // Slug uniqueness (other rows)
  const { data: existing } = await supabaseAdmin()
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", values.id)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "이미 사용 중인 slug입니다." };
  }

  const { error } = await supabaseAdmin()
    .from("products")
    .update({
      slug,
      name: values.name.trim(),
      en: values.en.trim() || null,
      spec: values.spec.trim() || null,
      description: values.description.trim() || null,
      tags: values.tags,
      price: values.price,
      stock: values.stock,
      images: values.images,
      detail_images: values.detail_images,
      status: values.status,
      display_order: values.display_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", values.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const initial: ProductFormValues = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    en: product.en || "",
    spec: product.spec || "",
    description: product.description || "",
    tags: product.tags || [],
    price: product.price,
    stock: product.stock,
    images: product.images || [],
    detail_images: product.detail_images || [],
    status: product.status,
    display_order: product.display_order,
  };

  return (
    <ProductForm initial={initial} action={updateProduct} submitLabel="변경사항 저장" />
  );
}

export const dynamic = "force-dynamic";
