"use client";

import { useEffect, useState } from "react";

const NAV = [
  { href: "#about", label: "ABOUT", kr: "회사소개" },
  { href: "#process", label: "PROCESS", kr: "제조공정" },
  { href: "#products", label: "PRODUCTS", kr: "제품" },
  { href: "#news", label: "NEWS", kr: "언론보도" },
  { href: "#contact", label: "CONTACT", kr: "문의" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between md:h-[84px]">
        <a
          href="#top"
          className={`flex items-baseline gap-2 transition-colors ${
            scrolled ? "text-ink" : "text-white"
          }`}
        >
          <span className="font-display text-2xl font-extrabold tracking-tightest md:text-[28px]">
            PAT BRO
          </span>
          <span className="hidden text-xs font-medium tracking-[0.2em] opacity-70 md:inline">
            PETBRO
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group relative text-[13px] font-semibold tracking-[0.18em] transition-colors ${
                scrolled ? "text-ink hover:text-brand" : "text-white/90 hover:text-white"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 block h-px w-0 transition-all duration-300 group-hover:w-full ${
                  scrolled ? "bg-brand" : "bg-white"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:010-2466-2313"
            className={`rounded-full border px-5 py-2.5 text-xs font-semibold tracking-[0.14em] transition-all ${
              scrolled
                ? "border-ink text-ink hover:bg-ink hover:text-white"
                : "border-white/60 text-white hover:bg-white hover:text-ink"
            }`}
          >
            도매문의 010-2466-2313
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`relative h-10 w-10 lg:hidden ${
            scrolled || open ? "text-ink" : "text-white"
          }`}
          aria-label="메뉴 열기"
        >
          <span
            className={`absolute left-2 top-3 h-0.5 w-6 bg-current transition-all ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-2 top-[18px] h-0.5 w-6 bg-current transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-2 top-6 h-0.5 w-6 bg-current transition-all ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 top-[72px] z-40 flex flex-col bg-white transition-all duration-500 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 pt-10">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline justify-between border-b border-black/10 py-5"
              style={{
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <span className="font-display text-3xl font-extrabold tracking-tightest text-ink group-hover:text-brand">
                {item.label}
              </span>
              <span className="text-sm text-ink/60">{item.kr}</span>
            </a>
          ))}
          <a
            href="tel:010-2466-2313"
            onClick={() => setOpen(false)}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-semibold tracking-[0.14em] text-white"
          >
            도매문의 010-2466-2313
          </a>
        </nav>
      </div>
    </header>
  );
}
