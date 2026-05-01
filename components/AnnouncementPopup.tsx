"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Announcement } from "@/lib/supabase";

const SESSION_KEY = "petbro_ann_dismissed_session";
const PERSIST_PREFIX = "petbro_ann_dismissed_";

export default function AnnouncementPopup({ announcement }: { announcement: Announcement }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!announcement) return;
    // Don't pop on auth/admin/order routes — would interrupt critical flows.
    if (
      !pathname ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/order/")
    ) {
      return;
    }
    try {
      // Permanent dismissal of this exact announcement
      const persistKey = `${PERSIST_PREFIX}${announcement.id}`;
      if (window.localStorage.getItem(persistKey)) return;
      // Session-only dismissal (any dismiss this session counts)
      const sessionFlag = window.sessionStorage.getItem(SESSION_KEY);
      if (sessionFlag === announcement.id) return;
    } catch {
      // Storage unavailable; show once anyway.
    }
    // Slight delay for nicer entrance after page paint
    const t = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(t);
  }, [announcement, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOnce();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function closeOnce() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, announcement.id);
    } catch {}
    setOpen(false);
  }
  function closeForever() {
    try {
      window.localStorage.setItem(`${PERSIST_PREFIX}${announcement.id}`, "1");
    } catch {}
    setOpen(false);
  }

  if (!announcement) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-all duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal={open}
      aria-labelledby="ann-title"
    >
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={closeOnce}
        aria-hidden
      />
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.97]"
        }`}
      >
        <div className="relative bg-ink px-7 py-6 text-white">
          <p className="text-[10px] font-semibold tracking-[0.4em] text-brand-200">
            NOTICE · 공지사항
          </p>
          <h2
            id="ann-title"
            className="mt-2 font-display text-xl font-extrabold tracking-tightest text-white md:text-2xl"
          >
            {announcement.title}
          </h2>
          <button
            type="button"
            onClick={closeOnce}
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
          {announcement.body && (
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink/80">
              {announcement.body}
            </p>
          )}

          {announcement.link_url && (
            <a
              href={announcement.link_url}
              target={announcement.link_url.startsWith("http") ? "_blank" : undefined}
              rel={announcement.link_url.startsWith("http") ? "noreferrer" : undefined}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
              onClick={closeOnce}
            >
              {announcement.link_label || "자세히 보기"} →
            </a>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-black/8 bg-cream px-7 py-3 text-xs">
          <button
            type="button"
            onClick={closeForever}
            className="text-ink/55 transition hover:text-ink hover:underline"
          >
            다시 보지 않기
          </button>
          <button
            type="button"
            onClick={closeOnce}
            className="font-semibold text-ink transition hover:text-brand"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
