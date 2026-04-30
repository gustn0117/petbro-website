import Link from "next/link";

const NAV_GROUPS = [
  {
    title: "브랜드",
    links: [
      { href: "/about", label: "회사소개" },
      { href: "/process", label: "제조공정" },
      { href: "/partners", label: "파트너사" },
      { href: "/news", label: "언론보도" },
    ],
  },
  {
    title: "쇼핑",
    links: [
      { href: "/products", label: "전체 상품" },
      { href: "/checkout", label: "장바구니 / 주문" },
    ],
  },
  {
    title: "고객지원",
    links: [
      { href: "/contact", label: "문의" },
      { href: "tel:010-7721-4150", label: "010-7721-4150", ext: true },
      {
        href: "https://www.instagram.com/patbro_company",
        label: "Instagram",
        ext: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900 text-white/60">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <img
                src="/images/patbro-mark-white.png"
                alt=""
                className="h-12 w-12 md:h-14 md:w-14"
              />
              <div>
                <p className="font-display text-3xl font-extrabold tracking-tightest text-white md:text-4xl">
                  PAT BRO
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-white/50">
                  펫브로 · NATURAL PET FOOD
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              위생을 최우선시 하는 애견간식 제조업체. 100% 국내산 한우와
              국내 최초 특허 기술로 완성한 프리미엄 수제 우스틱.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.18em] text-white/55">
              <span className="rounded-full border border-white/15 px-3 py-1">100% 한우</span>
              <span className="rounded-full border border-white/15 px-3 py-1">특허 제조 기술</span>
              <span className="rounded-full border border-white/15 px-3 py-1">SINCE 2021</span>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_GROUPS.map((g) => (
            <div key={g.title} className="md:col-span-2">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
                {g.title.toUpperCase()}
              </p>
              <ul className="mt-5 space-y-3">
                {g.links.map((l) => (
                  <li key={l.href}>
                    {l.ext ? (
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Address */}
          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
              ADDRESS
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              부산광역시 사상구 괘감로 98-1
              <br />
              펫브로 본사
            </p>
            <p className="mt-4 text-xs text-white/45">
              사람과 반려견이 함께 쉬어가는
              <br />
              카페 공간을 운영합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/30">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} PAT BRO 펫브로. All rights reserved.</span>
          <span className="font-mono">특허 제 10-2379135 호 · 사업자 등록번호 364-17-01429</span>
        </div>
      </div>
    </footer>
  );
}
