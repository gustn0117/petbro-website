export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900 py-12 text-white/60">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl font-extrabold tracking-tightest text-white md:text-4xl">
              PAT BRO
            </p>
            <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-white/50">
              위생을 최우선시 하는 애견간식 제조업체
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/50">
              부산광역시 사상구 괘감로 98-1 펫브로
              <br />
              도매문의 010-2466-2313 · @unni_dog_2017
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm md:grid-cols-3">
            <FooterLink href="#about" label="회사소개" />
            <FooterLink href="#process" label="제조공정" />
            <FooterLink href="#products" label="제품" />
            <FooterLink href="#news" label="언론보도" />
            <FooterLink href="#contact" label="문의" />
            <FooterLink
              href="https://www.instagram.com/unni_dog_2017"
              label="인스타그램"
              ext
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} PAT BRO 펫브로. All rights reserved.</span>
          <span>특허 제 10-2379135 호 · 사업자 등록번호 364-17-01429</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  ext,
}: {
  href: string;
  label: string;
  ext?: boolean;
}) {
  return (
    <a
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noreferrer" : undefined}
      className="py-1 text-white/60 transition-colors hover:text-brand-200"
    >
      {label}
    </a>
  );
}
