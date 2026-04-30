import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin, type Partner } from "@/lib/supabase";
import PartnerForm, {
  type PartnerFormValues,
} from "@/components/admin/PartnerForm";

async function getPartner(id: string): Promise<Partner | null> {
  const { data } = await supabaseAdmin()
    .from("partners")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Partner) || null;
}

async function updatePartner(values: PartnerFormValues) {
  "use server";
  if (!isAdmin()) return { ok: false, error: "권한이 없습니다." };
  if (!values.id) return { ok: false, error: "ID 없음" };

  const { error } = await supabaseAdmin()
    .from("partners")
    .update({
      name: values.name.trim(),
      description: values.description.trim() || null,
      logo_url: values.logo_url || null,
      website_url: values.website_url.trim() || null,
      display_order: values.display_order,
      status: values.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", values.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/partners");
  revalidatePath("/partners");
  redirect("/admin/partners");
}

export default async function EditPartnerPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await getPartner(params.id);
  if (!p) notFound();

  const initial: PartnerFormValues = {
    id: p.id,
    name: p.name,
    description: p.description || "",
    logo_url: p.logo_url,
    website_url: p.website_url || "",
    display_order: p.display_order,
    status: p.status,
  };

  return (
    <PartnerForm initial={initial} action={updatePartner} submitLabel="변경사항 저장" />
  );
}

export const dynamic = "force-dynamic";
