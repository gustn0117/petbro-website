import type { Metadata } from "next";
import Products from "@/components/Products";

export const metadata: Metadata = {
  title: "제품 · PRODUCTS | PAT BRO 펫브로",
  description:
    "초소형부터 대형견까지, 우리 아이의 크기와 취향에 꼭 맞는 7가지 시그니처 우스틱. 100% 국내산 한우만 사용.",
};

export default function ProductsPage() {
  return <Products />;
}
