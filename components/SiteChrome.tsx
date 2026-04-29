"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import RevealOnScroll from "./RevealOnScroll";
import CartDrawer from "./cart/CartDrawer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="relative">{children}</main>
      <Footer />
      <RevealOnScroll />
      <CartDrawer />
    </>
  );
}
