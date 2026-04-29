import Link from "next/link";
import Hero from "@/components/Hero";

const SECTIONS = [
  {
    no: "01",
    en: "ABOUT",
    kr: "회사소개",
    href: "/about",
    img: "/images/building.jpg",
    title: "사람과 반려견이 함께 쉬어가는 건강한 공장.",
    desc: "2021년 설립, 특허받은 제조 기술과 부산시 유망업종 선정까지. 펫브로의 발걸음을 만나보세요.",
  },
  {
    no: "02",
    en: "PROCESS",
    kr: "제조공정",
    href: "/process",
    img: "/images/process-1.jpg",
    title: "제품 관리의 1순위는 위생.",
    desc: "공판장 직거래부터 저온 이송, 선별, 특허 제조까지. 한 사람 한 사람의 손길이 닿는 4단계 제조공정.",
  },
  {
    no: "03",
    en: "PRODUCTS",
    kr: "제품",
    href: "/products",
    img: "/images/product-1-small.jpg",
    title: "7가지 시그니처 우스틱.",
    desc: "초소형부터 대형견까지, 우리 아이의 크기와 취향에 꼭 맞는 100% 한우 수제 간식.",
  },
  {
    no: "04",
    en: "NEWS",
    kr: "언론보도",
    href: "/news",
    img: "/images/award-plaque.jpg",
    title: "언론이 주목한 펫브로의 발걸음.",
    desc: "2022년 부산시 유망업종 선정, 동물사랑 천사기업 선정. 펫브로의 언론 보도와 인증서.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Section Index */}
      <section className="relative overflow-hidden bg-cream py-24 md:py-32 lg:py-40">
        <div className="pointer-events-none absolute -right-10 top-12 select-none text-[180px] font-extrabold leading-none tracking-tightest text-black/[0.03] md:text-[280px] lg:text-[360px]">
          INDEX
        </div>
        <div className="container-x relative">
          <div className="reveal max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand">
              <span className="block h-px w-8 bg-brand" />
              EXPLORE PAT BRO
            </p>
            <h2 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[56px]">
              펫브로의 모든 것을
              <br />
              <span className="text-brand">한 페이지씩 천천히.</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-px bg-ink/10 md:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className={`reveal group relative flex flex-col bg-cream p-8 transition-colors duration-500 hover:bg-ink hover:text-white md:p-10 lg:p-12 reveal-delay-${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl font-extrabold tracking-tightest text-brand transition-colors group-hover:text-brand-200">
                    {s.no}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-ink/40 transition-colors group-hover:text-white/50">
                    {s.en}
                  </span>
                </div>

                <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-white">
                  <img
                    src={s.img}
                    alt={s.kr}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-7 text-xl font-extrabold leading-tight text-ink transition-colors group-hover:text-white md:text-2xl lg:text-[26px]">
                  {s.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/70 transition-colors group-hover:text-white/70">
                  {s.desc}
                </p>

                <span className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-ink transition-colors group-hover:text-brand-200">
                  {s.kr} 자세히 보기
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>

                <span className="mt-8 block h-px w-10 bg-ink/30 transition-all duration-500 group-hover:w-20 group-hover:bg-brand-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="container-x relative">
          <div className="reveal flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand-200">
                <span className="block h-px w-8 bg-brand-200" />
                GET IN TOUCH
              </p>
              <h2 className="heading-kr text-3xl md:text-5xl lg:text-[56px]">
                건강한 간식,
                <br />
                <span className="text-brand-200">함께 만들어요.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
                도매 / OEM / 입점 문의는 언제든 환영합니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-[0.14em] text-ink transition-colors hover:bg-brand hover:text-white"
              >
                문의하기 →
              </Link>
              <a
                href="tel:010-2466-2313"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-semibold tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white/10"
              >
                010-2466-2313
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
