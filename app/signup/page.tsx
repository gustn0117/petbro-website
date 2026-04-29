import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";
import { getUserIdFromCookie } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "회원가입 | PAT BRO 펫브로",
};

export const dynamic = "force-dynamic";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  if (getUserIdFromCookie()) {
    redirect(searchParams.redirect || "/");
  }
  return <SignupForm redirectTo={searchParams.redirect || "/"} />;
}
