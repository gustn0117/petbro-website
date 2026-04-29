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
  return (
    <CheckoutClient
      defaultName={user.name}
      defaultEmail={user.email}
      defaultPhone={user.phone || ""}
    />
  );
}
