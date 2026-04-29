const VALUES = [
  {
    no: "01",
    label: "PERFECT",
    kr: "완벽한 품질",
    desc: "100% 국내산 한우만 사용. 사람도 먹을 수 있는 식재료로만 만드는 수제 간식의 기준을 새로 씁니다.",
  },
  {
    no: "02",
    label: "AMAZING",
    kr: "놀라운 정성",
    desc: "원물 수급부터 가공 직전까지 체계화된 생산라인과 노하우로 최상의 원료육 컨디션을 유지합니다.",
  },
  {
    no: "03",
    label: "TECHNICIAN BRO",
    kr: "특허 제조 기술",
    desc: "특허받은 제조 공법으로 타사 대비 에너지 절감율 30% 이상 실현. 위생과 효율의 균형을 만듭니다.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-cream py-24 md:py-32 lg:py-40"
    >
      {/* Decorative background letters */}
      <div className="pointer-events-none absolute -left-10 top-10 select-none text-[180px] font-extrabold leading-none tracking-tightest text-black/[0.03] md:text-[280px] lg:text-[360px]">
        ABOUT
      </div>

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="reveal lg:col-span-5">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand">
              <span className="block h-px w-8 bg-brand" />
              ABOUT PAT BRO
            </p>
            <h2 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[56px]">
              사람과 반려견이
              <br />
              함께 쉬어가는
              <br />
              <span className="text-brand">건강한 공장.</span>
            </h2>

            <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/70 md:text-[17px]">
              <p>
                펫브로 임정현 대표는 2019년 언니도그와의 인연으로 Bully stick을 처음
                접했습니다. 80cm의 생소한 길이의 개껌은 국내 유일 언니도그에서
                유통되고 있었으나, 해외의 열악한 환경 속 비위생적인 방식으로
                제조되는 현실을 마주하며 깊은 고민이 시작되었습니다.
              </p>
              <p>
                2021년 4월 자체 간식 제조 공장을 설립하고, 다양한 연구 끝에
                <span className="font-semibold text-ink">
                  {" "}
                  특허받은 제조 방법
                </span>
                으로 타사 대비 에너지 절감율 30% 이상을 실현했습니다. 2022년
                9월에는 부산시·중소기업벤처부·기보의 지원을 받아 사상구로 확장
                이전했습니다.
              </p>
              <p>
                펫브로는 수익의 일부를 유기견과 어려운 애견이 있는 곳에
                기부하며, 동물 사랑에 적극적으로 활동하고 있습니다.{" "}
                <span className="font-semibold text-ink">
                  2022년 부산시 유망업종 ‘반려동물 수제간식 제조업체’
                </span>
                로 선정되며 꾸준한 발전을 이루고 있습니다.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-ink/10 pt-8 md:grid-cols-4">
              <Stat number="2021" label="공장 설립" />
              <Stat number="100%" label="국내산 한우" />
              <Stat number="2건" label="특허등록" />
              <Stat number="70%↑" label="재구매율" />
            </div>
          </div>

          <div className="relative reveal reveal-delay-2 lg:col-span-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink md:aspect-[16/12]">
              <img
                src="/images/building.jpg"
                alt="펫브로 사상구 공장"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-[11px] font-semibold tracking-[0.3em] text-white/70">
                  HEADQUARTERS
                </p>
                <p className="mt-1 text-lg font-semibold">
                  부산 사상구 괘감로 98-1
                </p>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-4 hidden w-[260px] bg-ink p-6 text-white shadow-2xl md:block lg:-left-12 lg:w-[300px]">
              <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-200">
                AWARDED 2022
              </p>
              <p className="mt-3 text-base font-semibold leading-snug">
                부산시 유망업종 반려동물 수제간식 제조업체 선정
              </p>
              <p className="mt-4 text-xs text-white/60">
                연합뉴스 / 부산경제진흥원
              </p>
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div className="reveal mt-24 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4 lg:col-span-4">
            <p className="eyebrow mb-6 text-brand">LOCATION</p>
            <h2 className="heading-kr text-3xl text-ink md:text-4xl lg:text-[44px]">
              부산 사상구
              <br />
              <span className="text-brand">펫브로 본사.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink/70">
              사람과 반려견이 함께 쉬어가는 카페 공간을 운영합니다.
              방문 전 전화로 문의 부탁드립니다.
            </p>
            <dl className="mt-8 space-y-4 border-t border-ink/10 pt-6">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.3em] text-ink/55">
                  ADDRESS
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink">
                  부산광역시 사상구 괘감로 98-1
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.3em] text-ink/55">
                  TEL
                </dt>
                <dd className="mt-1.5">
                  <a
                    href="tel:010-7721-4150"
                    className="text-sm font-semibold text-ink transition hover:text-brand"
                  >
                    010-7721-4150
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.3em] text-ink/55">
                  HOURS
                </dt>
                <dd className="mt-1.5 text-sm text-ink/80">
                  평일 09:00 — 18:00
                  <br />
                  주말 / 공휴일 휴무
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href="https://map.kakao.com/?q=부산광역시+사상구+괘감로+98-1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white"
              >
                카카오맵 →
              </a>
              <a
                href="https://map.naver.com/p/search/부산%20사상구%20괘감로%2098-1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white"
              >
                네이버지도 →
              </a>
            </div>
          </div>
          <div className="md:col-span-8 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl bg-cream shadow-soft">
              <iframe
                src="https://maps.google.com/maps?q=%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%82%AC%EC%83%81%EA%B5%AC%20%EA%B4%98%EA%B0%90%EB%A1%9C%2098-1&z=17&output=embed&hl=ko"
                title="펫브로 본사 위치 — 부산광역시 사상구 괘감로 98-1"
                className="block h-[360px] w-full md:h-[460px] lg:h-[520px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="mt-24 grid gap-px overflow-hidden bg-ink/10 md:mt-32 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div
              key={v.label}
              className={`reveal group relative bg-cream p-8 transition-colors duration-500 hover:bg-ink hover:text-white md:p-10 lg:p-12 reveal-delay-${i + 1}`}
            >
              <p className="text-[11px] font-semibold tracking-[0.3em] text-brand transition-colors group-hover:text-brand-200">
                {v.no}
              </p>
              <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tightest text-ink transition-colors group-hover:text-white md:text-4xl">
                {v.label}
              </h3>
              <p className="mt-2 text-sm font-semibold text-ink/70 transition-colors group-hover:text-white/70">
                {v.kr}
              </p>
              <p className="mt-6 text-[15px] leading-relaxed text-ink/70 transition-colors group-hover:text-white/80">
                {v.desc}
              </p>
              <span className="mt-10 block h-px w-10 bg-ink/30 transition-all duration-500 group-hover:w-20 group-hover:bg-brand-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-extrabold tracking-tightest text-ink md:text-3xl">
        {number}
      </p>
      <p className="mt-1 text-xs font-semibold text-ink/60">{label}</p>
    </div>
  );
}
