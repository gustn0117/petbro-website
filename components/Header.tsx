"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/about", label: "ABOUT", kr: "회사소개" },
  { href: "/process", label: "PROCESS", kr: "제조공정" },
  { href: "/products", label: "PRODUCTS", kr: "제품" },
  { href: "/news", label: "NEWS", kr: "언론보도" },
  { href: "/contact", label: "CONTACT", kr: "문의" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
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

  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-white/85 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between md:h-[84px]">
        <Link
          href="/"
          aria-label="PAT BRO 펫브로 홈"
          className={`flex items-center gap-3 transition-colors ${
            solid ? "text-ink" : "text-white"
          }`}
        >
          <img
            src={solid ? "/images/patbro-mark.png" : "/images/patbro-mark-white.png"}
            alt=""
            className="h-9 w-9 md:h-10 md:w-10"
          />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold tracking-tightest md:text-[26px]">
              PAT BRO
            </span>
            <span className="hidden text-[10px] font-semibold tracking-[0.3em] opacity-60 md:inline">
              펫브로
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-[13px] font-semibold tracking-[0.18em] transition-colors ${
                  solid
                    ? `${active ? "text-brand" : "text-ink"} hover:text-brand`
                    : `${active ? "text-white" : "text-white/90"} hover:text-white`
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 block h-px transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  } ${solid ? "bg-brand" : "bg-white"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:010-2466-2313"
            className={`rounded-full border px-5 py-2.5 text-xs font-semibold tracking-[0.14em] transition-all ${
              solid
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
            solid || open ? "text-ink" : "text-white"
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
            <Link
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
            </Link>
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
