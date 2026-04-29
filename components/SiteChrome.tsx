"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import RevealOnScroll from "./RevealOnScroll";
import CartDrawer from "./cart/CartDrawer";
import PendingBanner from "./PendingBanner";

export type ChromeUser = {
  id: string;
  email: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  reject_reason?: string | null;
} | null;

export default function SiteChrome({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ChromeUser;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  const showBanner = !!user && user.status !== "approved";

  return (
    <>
      <Header user={user} />
      {showBanner && (
        <PendingBanner
          status={user!.status as "pending" | "rejected"}
          reason={user!.reject_reason || null}
        />
      )}
      <main className="relative">{children}</main>
      <Footer />
      <RevealOnScroll />
      <CartDrawer authed={!!user && user.status === "approved"} />
    </>
  );
}
