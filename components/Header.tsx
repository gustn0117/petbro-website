"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart/CartProvider";

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
  const { totalQuantity, open: openCart, hydrated } = useCart();

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
        {/* Logo */}
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

        {/* Desktop nav */}
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

        {/* Right side: tel + cart + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="tel:010-2466-2313"
            className={`hidden rounded-full border px-5 py-2.5 text-xs font-semibold tracking-[0.14em] transition-all lg:inline-flex ${
              solid
                ? "border-ink text-ink hover:bg-ink hover:text-white"
                : "border-white/60 text-white hover:bg-white hover:text-ink"
            }`}
          >
            도매문의 010-2466-2313
          </a>

          <button
            onClick={openCart}
            aria-label="장바구니 열기"
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              solid
                ? "text-ink hover:bg-ink hover:text-white"
                : "text-white hover:bg-white/15"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {hydrated && totalQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-[18px] text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </button>

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
