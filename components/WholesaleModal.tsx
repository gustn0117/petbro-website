"use client";

import { useEffect } from "react";

export default function WholesaleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center px-4 transition-all duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal={open}
      aria-labelledby="wholesale-modal-title"
    >
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.97]"
        }`}
      >
        {/* Header strip */}
        <div className="relative bg-ink px-7 py-6 text-white">
          <p className="text-[10px] font-semibold tracking-[0.4em] text-brand-200">
            WHOLESALE NOTICE
          </p>
          <h2
            id="wholesale-modal-title"
            className="mt-2 font-display text-2xl font-extrabold tracking-tightest text-white md:text-[28px]"
          >
            도매 문의 안내
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-6">
          {/* Notice card */}
          <div className="rounded-2xl bg-cream px-5 py-4">
            <p className="flex items-start gap-2 text-sm font-semibold text-ink">
              <span aria-hidden className="text-brand">●</span>
              <span>본 상품은 <strong className="text-brand">오프라인 도매 전용</strong> 입니다.</span>
            </p>
            <p className="mt-2 pl-5 text-[13px] leading-relaxed text-ink/65">
              온라인 단품 판매가 아닌, 매장·유통사 등 사업자 단위 거래만 진행됩니다.
            </p>
          </div>

          {/* Required */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-ink/55">
              REQUIRED
            </p>
            <ul className="mt-3 space-y-2.5">
              <Item>
                <strong className="text-ink">사업자등록증</strong> 사본 첨부 (필수)
              </Item>
              <Item>희망 상품 / 수량 / 입점 매장 정보</Item>
              <Item>회신받을 담당자 연락처</Item>
            </ul>
          </div>

          {/* Channels */}
          <div className="mt-6 grid gap-2.5">
            <a
              href="tel:010-2466-2313"
              className="group flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-white transition hover:bg-brand"
            >
              <span className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] font-semibold tracking-[0.3em] text-brand-200">
                    전화 문의
                  </span>
                  <span className="block text-base font-extrabold tracking-tightest">
                    010-2466-2313
                  </span>
                </span>
              </span>
              <span className="text-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="https://www.instagram.com/unni_dog_2017"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-ink/12 bg-white px-5 py-4 text-ink transition hover:border-ink hover:bg-ink/[0.03]"
            >
              <span className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] font-semibold tracking-[0.3em] text-ink/55">
                    DM 문의
                  </span>
                  <span className="block text-sm font-bold">@unni_dog_2017</span>
                </span>
              </span>
              <span className="text-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <p className="mt-5 text-center text-xs text-ink/50">
            평일 09:00 — 18:00 운영 · 주말 / 공휴일 휴무
          </p>
        </div>
      </div>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[14px] leading-relaxed text-ink/75">
      <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
      <span>{children}</span>
    </li>
  );
}
