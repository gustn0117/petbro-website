// Cache-buster bumped after replacing cert images with redacted originals.
const CV = "?v=2026043017";

type PressItem = {
  outlet: string;
  date: string;
  title: string;
  summary: string;
  url?: string;
  images?: { src: string; alt: string }[];
};

const PRESS: PressItem[] = [
  {
    outlet: "조은인터뷰",
    date: "INTERVIEW",
    title: "펫브로(PAT BRO) 임정현 대표, 새해에 언니우스틱으로 만나요",
    summary:
      "위생을 최우선시 하는 애견간식 제조업체 펫브로 임정현 대표 인터뷰. 100% 국내산 한우로 만든 언니우스틱의 시작과 새해 인사를 전합니다.",
    url: "https://naver.me/FU9vznSp",
  },
  {
    outlet: "피플투데이",
    date: "INTERVIEW",
    title: "사람이나 강아지 모두 스트레스 받지 않는 세상",
    summary:
      "사람과 반려견 모두가 스트레스 없는 세상을 꿈꾸는 펫브로의 이야기. 위생 우선·국내 최초 특허 기술로 완성한 수제 간식의 철학.",
    url: "https://naver.me/xqbobtSn",
  },
  {
    outlet: "올치올치",
    date: "2022",
    title: "‘2022년 상반기 동물사랑 천사기업’ 선정",
    summary:
      "부산시가 반려동물 관련 업체 6개사를 ‘동물사랑 천사기업’으로 선정하고, 부산시 제1호 참여형 반려견 놀이터에서 천사기업 명패 수여식과 기부 물품 전달식을 개최했습니다. 펫브로는 ‘부산시 동물사랑 나눔뱅크’에 반려동물 사료, 의류, 용품 등을 기부하며 사회 공헌에 동참했습니다.",
    images: [
      { src: "/images/award-plaque.jpg", alt: "동물사랑 천사기업 명패" },
      { src: "/images/award-event.jpg", alt: "천사기업 행사" },
    ],
  },
  {
    outlet: "연합뉴스",
    date: "2022",
    title: "부산시, 2022년 유망업종 제조업체 선정",
    summary:
      "부산시는 부산경제진흥원과 함께 반려동물 수제 간식 업종 소상공인의 마케팅을 지원했습니다. 펫브로는 유망업종 반려동물 수제간식 사업에 선정되어 온라인 판로 개척 및 온·오프라인 홍보 마케팅을 지원받게 되었습니다.",
    images: [
      { src: "/images/food-display.jpg", alt: "펫브로 제품 디스플레이" },
    ],
  },
];

const CERTS = [
  {
    src: `/images/patent-1-drying.jpg${CV}`,
    label: "특허증 · 간식 건조장치",
    en: "Patent No. 10-2379135",
    detail: "애완동물 간식용 건조장치 및 이를 이용한 간식 제조방법",
  },
  {
    src: `/images/patent-2-rack.jpg${CV}`,
    label: "특허증 · 간식 건조대",
    en: "Patent No. 10-2729562",
    detail: "애완동물 간식 건조대",
  },
  {
    src: `/images/trademark-class35.jpg${CV}`,
    label: "상표등록증 · 제35류",
    en: "Trademark No. 40-2120315",
    detail: "반려동물용 수제간식 도매업 등 10건",
  },
  {
    src: `/images/trademark-class31.jpg${CV}`,
    label: "상표등록증 · 제31류",
    en: "Trademark No. 40-2120314",
    detail: "반려동물용 수제간식 19건",
  },
  {
    src: `/images/feed-mfg-cert.jpg${CV}`,
    label: "사료제조업 등록증",
    en: "Feed Manufacturer Reg.",
    detail: "단미사료 제조업 · 부산광역시장 6260000-502-2021-0027",
  },
];

export default function News() {
  return (
    <section
      id="news"
      className="relative overflow-hidden bg-cream py-24 md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute -right-10 top-12 select-none text-[180px] font-extrabold leading-none tracking-tightest text-black/[0.03] md:text-[280px] lg:text-[360px]">
        NEWS
      </div>

      <div className="container-x relative">
        <div className="reveal max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand">
            <span className="block h-px w-8 bg-brand" />
            NEWS · CERTIFICATIONS
          </p>
          <h2 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[56px]">
            언론이 주목한
            <br />
            <span className="text-brand">펫브로의 발걸음.</span>
          </h2>
        </div>

        {/* Press cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-10">
          {PRESS.map((p, i) => {
            const cardBody = (
              <article
                className={`reveal group h-full bg-white p-8 transition-shadow hover:shadow-2xl md:p-10 reveal-delay-${(i % 4) + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-white">
                    PRESS · {p.outlet}
                  </span>
                  <span className="text-xs text-ink/50">{p.date}</span>
                </div>
                <h3 className="mt-6 text-2xl font-extrabold leading-tight text-ink md:text-[28px]">
                  {p.title}
                </h3>
                <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
                  {p.summary}
                </p>

                {p.images && p.images.length > 0 && (
                  <div
                    className={`relative mt-8 overflow-hidden bg-ink/10 ${
                      p.images.length > 1
                        ? "grid grid-cols-2 gap-px"
                        : ""
                    }`}
                  >
                    {p.images.length > 1 ? (
                      p.images.map((img) => (
                        <div key={img.src} className="aspect-[4/3] bg-cream">
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="relative aspect-[16/10] bg-cream">
                        <img
                          src={p.images[0].src}
                          alt={p.images[0].alt}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                )}

                {p.url && (
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-ink transition-colors group-hover:text-brand">
                    기사 보기 ↗
                  </span>
                )}
              </article>
            );
            if (p.url) {
              return (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {cardBody}
                </a>
              );
            }
            return <div key={i}>{cardBody}</div>;
          })}
        </div>

        {/* Certifications */}
        <div className="reveal mt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-brand">
                CERTIFICATIONS
              </p>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
                특허 · 상표 · 제조업 등록증
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
                국내 최초 특허받은 제조 기술과 등록된 상표권. 펫브로는 정식 사료
                제조업 등록을 통해 검증된 시설에서 간식을 만듭니다.
              </p>
            </div>
            <span className="hidden text-xs text-ink/40 md:block">
              특허 2건 · 상표 2건 · 제조업 등록
            </span>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 md:gap-6">
            {CERTS.map((c, i) => (
              <div
                key={c.label}
                className={`reveal reveal-delay-${(i % 4) + 1} group cursor-pointer`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-lg ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <img
                    src={c.src}
                    alt={c.label}
                    className="h-full w-full object-contain p-3"
                  />
                </div>
                <p className="mt-3 text-[10px] font-semibold tracking-[0.3em] text-ink/50">
                  {c.en}
                </p>
                <p className="mt-1 text-sm font-bold text-ink">{c.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
