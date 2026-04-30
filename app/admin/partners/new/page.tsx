import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import PartnerForm, {
  EMPTY_PARTNER,
  type PartnerFormValues,
} from "@/components/admin/PartnerForm";

async function createPartner(values: PartnerFormValues) {
  "use server";
  if (!isAdmin()) return { ok: false, error: "권한이 없습니다." };

  const { error } = await supabaseAdmin()
    .from("partners")
    .insert({
      name: values.name.trim(),
      description: values.description.trim() || null,
      logo_url: values.logo_url || null,
      website_url: values.website_url.trim() || null,
      display_order: values.display_order,
      status: values.status,
    });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/partners");
  revalidatePath("/partners");
  redirect("/admin/partners");
}

export default function NewPartnerPage() {
  return (
    <PartnerForm
      initial={EMPTY_PARTNER}
      action={createPartner}
      submitLabel="파트너사 추가"
    />
  );
}

export const dynamic = "force-dynamic";
