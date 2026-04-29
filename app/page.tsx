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
    span: "lg:col-span-7",
  },
  {
    no: "02",
    en: "PROCESS",
    kr: "제조공정",
    href: "/process",
    img: "/images/process-1.jpg",
    title: "제품 관리의 1순위는 위생.",
    desc: "공판장 직거래부터 저온 이송, 선별, 특허 제조까지. 한 사람 한 사람의 손길이 닿는 4단계 제조공정.",
    span: "lg:col-span-5",
  },
  {
    no: "03",
    en: "SHOP",
    kr: "제품 구매",
    href: "/products",
    img: "/images/product-1-small.jpg",
    title: "7가지 시그니처 우스틱.",
    desc: "초소형부터 대형견까지, 우리 아이의 크기와 취향에 꼭 맞는 100% 한우 수제 간식.",
    span: "lg:col-span-5",
  },
  {
    no: "04",
    en: "NEWS",
    kr: "언론보도",
    href: "/news",
    img: "/images/award-plaque.jpg",
    title: "언론이 주목한 펫브로의 발걸음.",
    desc: "2022년 부산시 유망업종 선정, 동물사랑 천사기업 선정. 펫브로의 언론 보도와 인증서.",
    span: "lg:col-span-7",
  },
];

const STATS = [
  { value: "2021", label: "공장 설립" },
  { value: "100%", label: "국내산 한우" },
  { value: "2건", label: "특허등록", sub: "30% 에너지 절감" },
  { value: "70%↑", label: "재구매율" },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Stat strip */}
      <section className="border-b border-black/5 bg-white">
        <div className="container-x grid grid-cols-2 gap-px md:grid-cols-4 md:gap-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center py-8 md:py-10 ${i > 0 ? "md:border-l md:border-black/5" : ""} ${i === 1 ? "border-l border-black/5" : ""} ${i >= 2 ? "border-t border-black/5 md:border-t-0" : ""}`}
            >
              <p className="font-display text-3xl font-extrabold tracking-tightest text-ink md:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-[11px] font-semibold tracking-[0.25em] text-ink/55">
                {s.label}
              </p>
              {s.sub && (
                <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-brand">
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section Index */}
      <section className="relative overflow-hidden bg-cream py-24 md:py-32 lg:py-40">
        <div className="pointer-events-none absolute -right-10 top-12 select-none text-[180px] font-extrabold leading-none tracking-tightest text-black/[0.025] md:text-[280px] lg:text-[360px]">
          INDEX
        </div>
        <div className="container-x relative">
          <div className="reveal flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-3xl">
              <p className="eyebrow mb-7 text-brand">EXPLORE PAT BRO</p>
              <h2 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[56px]">
                펫브로의 모든 것을
                <br />
                <span className="text-brand">한 페이지씩 천천히.</span>
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-ink/55 md:block md:text-right">
              브랜드 스토리부터 제조공정, 제품 라인업, 최신 소식까지.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:gap-8 lg:grid-cols-12">
            {SECTIONS.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className={`reveal group relative flex flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-card lift md:p-8 lg:p-10 ${s.span} reveal-delay-${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-2xl font-extrabold tracking-tightest text-brand">
                    {s.no}
                  </span>
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-ink/60">
                    {s.en}
                  </span>
                </div>

                <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cream lg:aspect-[16/8]">
                  <img
                    src={s.img}
                    alt={s.kr}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <h3 className="mt-7 text-xl font-extrabold leading-[1.25] text-ink md:text-2xl lg:text-[26px]">
                  {s.title}
                </h3>
                <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink/65">
                  {s.desc}
                </p>

                <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-ink transition-colors group-hover:text-brand">
                  {s.kr} 자세히
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <div className="absolute inset-0 dot-grid opacity-[0.05]" />
        <div className="container-x relative">
          <div className="reveal grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-7 text-brand-200">GET IN TOUCH</p>
              <h2 className="heading-kr text-3xl md:text-5xl lg:text-[60px]">
                건강한 간식,
                <br />
                <span className="text-brand-200">함께 만들어요.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
                도매 · OEM · 입점 문의는 언제든 환영합니다.
                <br />
                평일 09:00 — 18:00 운영.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:col-span-5 md:items-end">
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-between rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-[0.14em] text-ink transition-all hover:bg-brand hover:text-white md:w-auto md:min-w-[280px]"
              >
                <span>문의하기</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="tel:010-7721-4150"
                className="group inline-flex w-full items-center justify-between rounded-full border border-white/35 px-7 py-4 text-sm font-semibold tracking-[0.14em] text-white transition-all hover:border-white hover:bg-white/10 md:w-auto md:min-w-[280px]"
              >
                <span>010-7721-4150</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
