import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-ink text-white"
    >
      {/* Background image */}
      <div className="absolute inset-0 animate-slow-zoom">
        <img
          src="/images/cover-bg.jpg"
          alt=""
          className="h-full w-full object-cover object-center opacity-70"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      {/* Vertical text rail */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 origin-right text-[11px] font-semibold tracking-[0.4em] text-white/60 md:block">
        SINCE 2021 · BUSAN, KOREA
      </div>

      {/* Side label */}
      <div className="absolute left-6 top-32 hidden flex-col items-center gap-3 md:flex md:left-10 lg:left-16">
        <span className="block h-16 w-px bg-white/30" />
        <span className="origin-center -rotate-90 whitespace-nowrap text-[10px] font-semibold tracking-[0.4em] text-white/60">
          NATURAL PET FOOD
        </span>
      </div>

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-20 pt-32 md:pb-28">
        <div className="max-w-5xl">
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand-200 animate-fade-in">
            <span className="block h-px w-10 bg-brand-200" />
            HYGIENE FIRST · HANDMADE · SINCE 2021
          </p>

          <h1 className="heading-display text-5xl text-white md:text-7xl lg:text-[104px] xl:text-[120px]">
            <span className="block animate-fade-up">PERFECT.</span>
            <span className="block animate-fade-up [animation-delay:120ms]">
              AMAZING.
            </span>
            <span
              className="block bg-gradient-to-r from-brand-200 via-brand-300 to-brand-100 bg-clip-text text-transparent animate-fade-up [animation-delay:240ms]"
            >
              TECHNICIAN BRO.
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-balance text-base font-medium leading-relaxed text-white/80 md:text-lg lg:text-xl animate-fade-up [animation-delay:480ms]">
            위생을 최우선시 하는 애견간식 제조업체.
            <br className="hidden md:block" />
            100% 국내산 한우만을 사용해 사람도 먹을 수 있는 수제 우스틱을 만듭니다.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:600ms]">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-[0.14em] text-ink transition-all hover:bg-brand hover:text-white"
            >
              제품 보기
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 rounded-full border border-white/40 px-7 py-4 text-sm font-semibold tracking-[0.14em] text-white transition-all hover:border-white hover:bg-white/10"
            >
              브랜드 스토리
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-white/10 bg-ink/40 py-4 backdrop-blur-sm">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex shrink-0 items-center gap-12 px-6 text-xs font-semibold tracking-[0.3em] text-white/70">
              <span>100% 국내산 한우</span>
              <span className="text-brand-300">●</span>
              <span>특허 제조 기술</span>
              <span className="text-brand-300">●</span>
              <span>국내 최대 축산물 공판장 직거래</span>
              <span className="text-brand-300">●</span>
              <span>2022 부산시 유망업종 선정</span>
              <span className="text-brand-300">●</span>
              <span>동물사랑 천사기업</span>
              <span className="text-brand-300">●</span>
              <span>HANDMADE WITH LOVE</span>
              <span className="text-brand-300">●</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] font-semibold tracking-[0.3em] text-white/60">
          SCROLL
        </span>
        <span className="block h-12 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
