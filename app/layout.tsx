import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { CartProvider } from "@/components/cart/CartProvider";
import { getCurrentUser } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "PAT BRO 펫브로 — 위생을 최우선시 하는 애견간식 제조업체",
  description:
    "100% 국내산 한우만 사용하는 프리미엄 수제 우스틱. 특허받은 제조 기술과 국내 최대 축산물 공판장 직거래로 만드는 펫브로의 약속.",
  keywords: [
    "펫브로",
    "PAT BRO",
    "언니도그",
    "우스틱",
    "수제간식",
    "애견간식",
    "한우 우스틱",
    "부산 애견간식",
  ],
  openGraph: {
    title: "PAT BRO 펫브로",
    description:
      "위생을 최우선시 하는 애견간식 제조업체 — 100% 국내산 한우 수제 우스틱",
    type: "website",
    locale: "ko_KR",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="ko">
      <body className="bg-white text-ink antialiased">
        <CartProvider>
          <SiteChrome user={user}>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
