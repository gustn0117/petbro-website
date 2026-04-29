import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "주문/결제 | PAT BRO 펫브로",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
