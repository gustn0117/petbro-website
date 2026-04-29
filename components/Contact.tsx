export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink py-24 text-white md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute -left-10 bottom-12 select-none text-[180px] font-extrabold leading-none tracking-tightest text-white/[0.03] md:text-[280px] lg:text-[360px]">
        CONTACT
      </div>

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="reveal lg:col-span-6">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.4em] text-brand-200">
              <span className="block h-px w-8 bg-brand-200" />
              GET IN TOUCH
            </p>
            <h2 className="heading-kr text-4xl md:text-5xl lg:text-[72px]">
              건강한 간식,
              <br />
              <span className="text-brand-200">함께 만들어요.</span>
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              도매 / OEM / 입점 문의는 아래 연락처로 부탁드립니다.
              <br />
              펫브로는 더 많은 반려가족과 만나기를 기다립니다.
            </p>

            <div className="mt-12 space-y-px bg-white/5">
              <ContactRow label="WHOLESALE" value="010-2466-2313" href="tel:010-2466-2313" />
              <ContactRow
                label="ADDRESS"
                value="부산광역시 사상구 괘감로 98-1 펫브로"
              />
              <ContactRow
                label="INSTAGRAM"
                value="@unni_dog_2017 · @unnidog_2017"
                href="https://www.instagram.com/unni_dog_2017"
              />
              <ContactRow
                label="NAVER"
                value="언니도그 펫 슈퍼"
                href="https://search.naver.com/search.naver?query=언니도그+펫+슈퍼"
              />
            </div>
          </div>

          <div className="reveal reveal-delay-1 lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-900">
              <img
                src="/images/dogs-hero.jpg"
                alt=""
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                <p className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
                  BUSAN · KOREA
                </p>
                <p className="mt-3 font-display text-3xl font-extrabold tracking-tightest md:text-5xl">
                  WITH PET
                  <br />
                  FRIENDLY CAFE
                </p>
                <p className="mt-4 max-w-sm text-sm text-white/70">
                  사상구의 펫브로 본사는 사람과 반려견이 함께 쉬어갈 수 있는
                  카페 공간이기도 합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-center justify-between bg-white/5 px-6 py-5 transition-colors hover:bg-white/10 md:px-8 md:py-6">
      <span className="text-[11px] font-semibold tracking-[0.3em] text-brand-200">
        {label}
      </span>
      <span className="flex items-center gap-3 text-base font-semibold text-white md:text-lg">
        {value}
        {href && (
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </span>
    </div>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
