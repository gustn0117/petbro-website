import type { Metadata } from "next";
import News from "@/components/News";

export const metadata: Metadata = {
  title: "언론보도 · NEWS | PAT BRO 펫브로",
  description:
    "2022년 부산시 유망업종 선정, 동물사랑 천사기업 선정. 언론이 주목한 펫브로의 발걸음과 인증서.",
};

export default function NewsPage() {
  return <News />;
}
