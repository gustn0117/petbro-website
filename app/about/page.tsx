import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "회사소개 · ABOUT | PAT BRO 펫브로",
  description:
    "사람과 반려견이 함께 쉬어가는 건강한 공장. 2021년 자체 간식 제조 공장 설립부터 2022년 부산시 유망업종 선정까지, 펫브로의 발걸음.",
};

export default function AboutPage() {
  return <About />;
}
