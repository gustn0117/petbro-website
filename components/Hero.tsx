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
          className="h-full w-full object-cover object-center opacity-65"
        />
      </div>

      {/* Cinematic gradient overlays — softer, more refined */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.35)_100%)]" />

      {/* Vertical rails — refined typography */}
      <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-90 origin-right text-[10px] font-semibold tracking-[0.5em] text-white/50 md:block">
        SINCE 2021 · BUSAN
      </div>

      <div className="absolute left-6 top-36 hidden flex-col items-center gap-3 md:flex md:left-10 lg:left-16">
        <span className="block h-20 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        <span className="origin-center -rotate-90 whitespace-nowrap text-[10px] font-semibold tracking-[0.5em] text-white/50">
          NATURAL PET FOOD
        </span>
      </div>

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-24 pt-32 md:pb-32">
        <div className="max-w-5xl">
          <p className="eyebrow mb-7 text-brand-200 animate-fade-in">
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

          <p className="mt-10 max-w-2xl text-balance text-base font-medium leading-relaxed text-white/85 md:text-lg lg:text-xl animate-fade-up [animation-delay:480ms]">
            위생을 최우선시 하는 애견간식 제조업체.
            <br className="hidden md:block" />
            100% 국내산 한우만을 사용해 사람도 먹을 수 있는 수제 우스틱을 만듭니다.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:600ms]">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-[0.14em] text-ink transition-all duration-500 hover:bg-brand hover:text-white hover:shadow-card-lg"
            >
              제품 보기
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 rounded-full border border-white/35 px-7 py-4 text-sm font-semibold tracking-[0.14em] text-white transition-all duration-500 hover:border-white hover:bg-white/10"
            >
              브랜드 스토리
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="text-[10px] font-semibold tracking-[0.4em] text-white/55">
          SCROLL
        </span>
        <span className="block h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
