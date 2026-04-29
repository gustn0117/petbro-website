"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import RevealOnScroll from "./RevealOnScroll";
import CartDrawer from "./cart/CartDrawer";

export type ChromeUser = {
  id: string;
  email: string;
  name: string;
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

  return (
    <>
      <Header user={user} />
      <main className="relative">{children}</main>
      <Footer />
      <RevealOnScroll />
      <CartDrawer authed={!!user} />
    </>
  );
}
