import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "문의 · CONTACT | PAT BRO 펫브로",
  description:
    "도매 / OEM / 입점 문의. 부산광역시 사상구 펫브로 본사 — 사람과 반려견이 함께 쉬어가는 카페 공간.",
};

export default function ContactPage() {
  return <Contact />;
}
