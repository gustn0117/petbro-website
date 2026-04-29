const PRODUCTS = [
  {
    no: "01",
    name: "언니우스틱 소형견용",
    en: "Small Breed",
    spec: "S: 15cm (2 pcs / 10 pcs)",
    img: "/images/product-1-small.jpg",
    tags: ["100% 한우", "냄새 zero!", "이갈이·스트레스 해소", "천연재료"],
    desc: "탁월한 길이감으로 우리 아이들이 오래오래 먹고 즐길 수 있는 간식. 단백질이 함유되어 면역력 증강에 도움이 되고 비타민 B군 함유로 피부건강과 스트레스 회복에 도움을 줍니다.",
  },
  {
    no: "02",
    name: "언니우스틱 중·대형견용",
    en: "Medium / Large Breed",
    spec: "M: 20cm (1·5 pcs) · L: 30cm (1 pcs) · 무컷팅: 70cm 이상",
    img: "/images/product-2-medium.jpg",
    tags: ["100% 한우", "두꺼운 부분", "롱사이즈", "천연재료"],
    desc: "두꺼운 부분으로 만든 중·대형견 전용. 몇 시간은 먹을 수 있는 롱사이즈 간식으로 씹고 뜯으며 스트레스를 풀고 치석 관리도 함께 할 수 있습니다.",
  },
  {
    no: "03",
    name: "언니우스틱 초소형견용",
    en: "Tiny Breed",
    spec: "XS: 10cm (10 pcs)",
    img: "/images/product-3-tiny.jpg",
    tags: ["100% 한우", "냄새 zero!", "초소형견 전용", "천연재료"],
    desc: "탁월한 길이감으로 초소형견이 오래오래 먹을 수 있는 간식. 따뜻한 성질로 원기회복과 식욕증진에 효과적입니다.",
  },
  {
    no: "04",
    name: "트위스트 언니우스틱",
    en: "Twist",
    spec: "1 size 50cm 이상 (1 pcs)",
    img: "/images/product-4-twist.jpg",
    tags: ["100% 한우", "3줄로 꼬아 더 오래", "치석 제거", "천연재료"],
    desc: "대형견 전용 간식으로 더 오래 급여가 가능하도록 3줄로 꼬아 더 맛있게 만들었습니다. 치석 제거 및 스트레스 해소에 특화된 간식입니다.",
  },
  {
    no: "05",
    name: "한우말이 언니우스틱 소형견용",
    en: "Hanwoo Roll · Small",
    spec: "S: 13cm (1 pcs)",
    img: "/images/product-5-hanwoo-s.jpg",
    tags: ["100% 한우", "한우살×우신 콜라보", "냄새 zero!", "천연재료"],
    desc: "한우살을 우신과 함께 꼬아 조금 더 맛있게 급여가 가능하며, 우스틱을 처음 이용하는 반려견에게 추천드리는 제품입니다.",
  },
  {
    no: "06",
    name: "한우말이 언니우스틱 중대형견용",
    en: "Hanwoo Roll · Medium / Large",
    spec: "M: 20cm (1 pcs) · L: 40cm (1 pcs)",
    img: "/images/product-6-hanwoo-m.jpg",
    tags: ["100% 한우", "한우살×우신 콜라보", "롱사이즈", "천연재료"],
    desc: "한우살과 우신의 콜라보레이션. 우스틱을 처음 이용하는 반려견에게도, 익숙한 반려견에게도 좋은 한 끼.",
  },
  {
    no: "07",
    name: "토네이도 언니우스틱",
    en: "Tornado",
    spec: "1 size 33cm 이상 (1 pcs)",
    img: "/images/product-7-tornado.jpg",
    tags: ["100% 한우", "회오리 모양", "중·대형견 전용", "천연재료"],
    desc: "중·대형견 전용 간식으로 오래 급여가 가능하도록 회오리 모양으로 꼬아 더 오래 더 맛있게 만들었습니다. 70cm 이상의 우신을 이용해 회오리 모양으로 꼬았습니다.",
  },
];

export default function Products() {
  return (
    <section
      id="products"
      className="relative overflow-hidden bg-white py-24 md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute -left-10 top-12 select-none text-[180px] font-extrabold leading-none tracking-tightest text-ink/[0.04] md:text-[280px] lg:text-[360px]">
        PRODUCTS
      </div>

      <div className="container-x relative">
        <div className="reveal flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand">
              <span className="block h-px w-8 bg-brand" />
              UNNI USTICK · 7 SIGNATURES
            </p>
            <h2 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[56px]">
              우리 아이의 크기와 취향에 꼭 맞는,
              <br />
              <span className="text-brand">7가지 시그니처 우스틱.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-unnidog.png"
                alt="UNNI DOG"
                className="h-10 w-auto"
              />
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/60">
                  BRAND PARTNER
                </p>
                <p className="text-base font-semibold text-ink">
                  UNNI DOG · 언니도그
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink/60 lg:text-right">
              우스틱 유통 전문 브랜드 언니도그와 함께
              <br />
              사랑하는 반려견을 위한 믿을 수 있는 수제간식.
            </p>
          </div>
        </div>

        {/* Brand banner */}
        <div className="reveal mt-14 overflow-hidden bg-[#f5f1eb]">
          <img
            src="/images/unni-ustick-banner.jpg"
            alt="언니우스틱 — 100% 국내산 한우와 국내 최초 특허 기술로 완성한 프리미엄 수제개껌"
            className="block w-full"
          />
        </div>

        {/* Wordmark + Romance feature */}
        <div className="reveal mt-12 grid gap-px overflow-hidden bg-ink/10 md:grid-cols-12">
          <div className="bg-white p-8 md:col-span-5 md:p-12 lg:p-14">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
              BRANDMARK · UNNI USTICK
            </p>
            <div className="mt-6 flex items-center justify-center bg-cream p-6 md:p-8">
              <img
                src="/images/unni-ustick-wordmark.jpg"
                alt="언니우스틱 워드마크"
                className="h-auto w-full max-w-xs object-contain"
              />
            </div>
            <h3 className="mt-8 text-2xl font-extrabold leading-tight text-ink md:text-[26px]">
              개껌이라면 역시,
              <span className="text-brand"> 언니우스틱.</span>
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              펫브로가 만들고 언니도그가 유통하는 시그니처 라인. 국내 최초 특허
              기술로 완성한 100% 국내산 한우 프리미엄 수제 개껌입니다.
            </p>
          </div>

          <div className="relative aspect-[3/4] overflow-hidden bg-ink md:col-span-7 md:aspect-auto">
            <img
              src="/images/unni-ustick-romance.jpg"
              alt="낭만을 씹는다 — 언니우스틱"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white md:bottom-8 md:left-8">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
                EDITORIAL · 2025
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold tracking-tightest md:text-3xl">
                난 오늘 낭만을 씹는다.
              </p>
            </div>
          </div>
        </div>

        {/* SPEC card */}
        <div className="reveal mt-px grid items-center gap-px overflow-hidden bg-ink/10 md:grid-cols-2">
          <div className="relative aspect-[16/9] bg-cream md:aspect-auto md:h-full">
            <img
              src="/images/dogs-hero.jpg"
              alt="강아지들"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="bg-cream p-8 md:p-12 lg:p-16">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
              SPEC
            </p>
            <h3 className="mt-4 text-2xl font-extrabold leading-tight text-ink md:text-3xl">
              조단백 65% 이상 / 조지방 10% 이하
              <br />
              조회분 0.9% 이하 / 수분 10% 이하
            </h3>
            <ul className="mt-6 space-y-2 text-[15px] text-ink/70">
              <li>• 생후 3개월 미만의 강아지에게는 급여하지 마십시오.</li>
              <li>• 애견의 크기와 운동량에 따라 급여량을 조절해 주십시오.</li>
              <li>
                • 성격이 급한 반려견이 씹지 않고 삼킬 경우 가급적 지켜봐
                주십시오.
              </li>
            </ul>
          </div>
        </div>

        {/* Products grid */}
        <div className="mt-16 grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <article
              key={p.no}
              className={`reveal group relative flex flex-col bg-white p-7 transition-colors duration-500 hover:bg-cream md:p-8 reveal-delay-${(i % 4) + 1}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl font-extrabold tracking-tightest text-brand">
                  {p.no}
                </span>
                <span className="text-[10px] font-semibold tracking-[0.3em] text-ink/40">
                  {p.en}
                </span>
              </div>

              <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden bg-cream">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-6 text-lg font-extrabold leading-tight text-ink md:text-xl">
                {p.name}
              </h3>
              <p className="mt-1 text-xs font-semibold text-ink/50">{p.spec}</p>

              <p className="mt-4 text-[14px] leading-relaxed text-ink/70">
                {p.desc}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-800"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <span className="mt-6 block h-px w-8 bg-ink/20 transition-all duration-500 group-hover:w-16 group-hover:bg-brand" />
            </article>
          ))}
        </div>

        {/* Video clip */}
        <div className="reveal mt-16 grid gap-px overflow-hidden bg-ink/10 md:grid-cols-12">
          <div className="relative bg-ink md:col-span-8">
            <video
              src="/images/unni-ustick.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="block aspect-video w-full object-cover"
            />
          </div>
          <div className="bg-cream p-8 md:col-span-4 md:p-10">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
              IN ACTION
            </p>
            <h3 className="mt-4 text-xl font-extrabold leading-tight text-ink md:text-2xl">
              씹는 재미가 다른
              <br />
              언니우스틱.
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-ink/70">
              한우 100%로 만들어 자연스러운 향과 식감. 우리 아이가 오래오래
              집중해서 씹을 수 있는, 펫브로의 시그니처 우스틱입니다.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-16 flex flex-col items-center justify-between gap-6 bg-ink p-8 text-white md:flex-row md:p-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
              WHOLESALE INQUIRY
            </p>
            <p className="mt-3 text-2xl font-extrabold tracking-tightest md:text-3xl">
              도매 문의 · 010-2466-2313
            </p>
            <p className="mt-2 text-sm text-white/60">
              NAVER 검색: 언니도그 펫 슈퍼 · Instagram @unni_dog_2017
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:010-2466-2313"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold tracking-[0.14em] text-ink transition-colors hover:bg-brand hover:text-white"
            >
              전화 문의 →
            </a>
            <a
              href="https://www.instagram.com/unni_dog_2017"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              인스타그램 →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
