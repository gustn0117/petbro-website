import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import ProductForm, {
  EMPTY_PRODUCT,
  type ProductFormValues,
} from "@/components/admin/ProductForm";

async function createProduct(values: ProductFormValues) {
  "use server";
  if (!isAdmin()) return { ok: false, error: "권한이 없습니다." };

  const slug = values.slug.trim();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { ok: false, error: "slug은 영문 소문자, 숫자, 하이픈만 사용 가능합니다." };
  }

  const { data: existing } = await supabaseAdmin()
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "이미 사용 중인 slug입니다." };
  }

  const { data, error } = await supabaseAdmin()
    .from("products")
    .insert({
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
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "저장에 실패했습니다." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export default function NewProductPage() {
  return (
    <ProductForm
      initial={EMPTY_PRODUCT}
      action={createProduct}
      submitLabel="상품 추가"
    />
  );
}

export const dynamic = "force-dynamic";
