import type { Metadata } from "next";
import Process from "@/components/Process";

export const metadata: Metadata = {
  title: "제조공정 · PROCESS | PAT BRO 펫브로",
  description:
    "공판장 직거래부터 저온 이송, 선별, 특허 제조까지. 펫브로 우스틱이 만들어지는 4단계 제조공정.",
};

export default function ProcessPage() {
  return <Process />;
}
