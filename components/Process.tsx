const STEPS = [
  {
    no: "01",
    label: "공판장",
    en: "WHOLESALE",
    img: "/images/process-1.jpg",
    desc: "농협 나주·고령 등 국내 최대 축산물 공판장과 다이렉트 계약. 대표가 매일 직접 음료수를 들고 도축장을 방문해 눈으로 확인하고 매입합니다.",
  },
  {
    no: "02",
    label: "이송",
    en: "TRANSPORT",
    img: "/images/process-2.jpg",
    desc: "중간 단계를 최소화한 직거래 시스템으로 안정적인 물량 공급. 부폐 방지를 위해 항시 저온 컨디션을 유지한 채로 이송합니다.",
  },
  {
    no: "03",
    label: "선별",
    en: "SELECTION",
    img: "/images/process-3.jpg",
    desc: "최상의 원료육만 엄선합니다. 내가 먹지 못하는 식재료는 절대 사용하지 않는다는 원칙으로 한 번 더 점검합니다.",
  },
  {
    no: "04",
    label: "제조",
    en: "MANUFACTURE",
    img: "/images/process-4.jpg",
    desc: "특허받은 공법으로 혈흔과 이물질 유입을 차단. 주기적인 직원 위생 교육으로 처음부터 끝까지 사람의 손길을 더합니다.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-ink py-24 text-white md:py-32 lg:py-40"
    >
      {/* Decorative letters */}
      <div className="pointer-events-none absolute -right-10 top-12 select-none text-[180px] font-extrabold leading-none tracking-tightest text-white/[0.03] md:text-[280px] lg:text-[360px]">
        PROCESS
      </div>

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand-200">
              <span className="block h-px w-8 bg-brand-200" />
              MANUFACTURING PROCESS
            </p>
            <h2 className="heading-kr text-4xl md:text-5xl lg:text-[56px]">
              펫브로 제품 관리의
              <br />
              <span className="text-brand-200">1순위는 위생.</span>
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/70 md:text-[17px]">
              “첫째도, 둘째도 그리고 세 번째도 위생입니다. 저희 펫브로(PAT BRO)는
              원물 수급부터 가공 직전까지 체계화된 생산라인과 설비, 노하우로
              최상의 원료육 컨디션을 유지합니다.”
            </p>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-10">
              <Bullet title="국내 최대 축산물 공판장 직거래">
                농협 나주·고령 축산물 공판장과의 다이렉트 계약으로 안정적인 물량
                공급과 타사 대비 합리적인 단가 실현.
              </Bullet>
              <Bullet title="작업 시 항시 저온 유지">
                부폐 방지를 위해 모든 작업 단계에서 저온 컨디션을 유지합니다.
              </Bullet>
              <Bullet title="혈흔·이물질 유입 방지 특허 기술">
                건조 시 혈흔 및 이물질 유입을 차단하는 자체 특허 기술로 위생을
                보장합니다.
              </Bullet>
              <Bullet title="주기적인 직원 필수 위생교육">
                사람이 만드는 간식인 만큼, 만드는 사람부터 위생 교육을
                받습니다.
              </Bullet>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Timeline grid */}
            <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.no}
                  className={`reveal group relative aspect-square overflow-hidden bg-ink reveal-delay-${i + 1}`}
                >
                  <img
                    src={s.img}
                    alt={s.label}
                    className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-6 md:p-7 lg:p-8">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-5xl font-extrabold tracking-tightest text-brand-200/80 md:text-6xl">
                        {s.no}
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.3em] text-white/50">
                        STEP
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-200">
                        {s.en}
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold tracking-tightest md:text-3xl">
                        {s.label}
                      </h3>
                      <p className="mt-3 text-[13px] leading-relaxed text-white/70 md:text-sm">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality images */}
            <div className="mt-px grid grid-cols-2 gap-px bg-white/10">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink reveal">
                <img
                  src="/images/raw-material.jpg"
                  alt="저온 유지된 원료육"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-900 reveal reveal-delay-1">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-ink" />
                <div className="relative flex h-full flex-col justify-center p-6 md:p-8">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-200">
                    100% 한우 원료
                  </p>
                  <p className="mt-3 font-display text-3xl font-extrabold tracking-tightest md:text-4xl">
                    HANWOO
                    <br />
                    ONLY.
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    내가 먹지 못하는 식재료는 사용하지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-2 block h-px w-6 shrink-0 bg-brand-200" />
      <div>
        <h4 className="text-[15px] font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-white/60">{children}</p>
      </div>
    </div>
  );
}
