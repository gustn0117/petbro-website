import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { getCurrentUser } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "주문/결제 | PAT BRO 펫브로",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/checkout");
  }
  if (user.status !== "approved") {
    redirect("/?pending=1");
  }
  return (
    <CheckoutClient
      defaultName={user.name}
      defaultEmail={user.email}
      defaultPhone={user.phone || ""}
      taxInfo={{
        business_name: user.business_name || "",
        business_number: user.business_number || "",
        business_owner: user.business_owner || "",
        tax_email: user.tax_email || "",
        is_simplified_tax: user.is_simplified_tax,
      }}
    />
  );
}
