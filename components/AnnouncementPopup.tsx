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
    if (!announcement || !announcement.image_url) return;
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
      const persistKey = `${PERSIST_PREFIX}${announcement.id}`;
      if (window.localStorage.getItem(persistKey)) return;
      const sessionFlag = window.sessionStorage.getItem(SESSION_KEY);
      if (sessionFlag === announcement.id) return;
    } catch {}
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

  if (!announcement || !announcement.image_url) return null;

  const hasLink = !!announcement.link_url;
  const isExternal =
    !!announcement.link_url && announcement.link_url.startsWith("http");

  const imageEl = (
    <img
      src={announcement.image_url}
      alt=""
      className="block w-full"
    />
  );

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-all duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal={open}
    >
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={closeOnce}
        aria-hidden
      />
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.97]"
        }`}
      >
        {/* Close button — always visible over the image */}
        <button
          type="button"
          onClick={closeOnce}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/85 text-white/90 backdrop-blur-sm transition hover:bg-ink hover:text-white"
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

        {/* Image — clickable if link_url is set */}
        {hasLink ? (
          <a
            href={announcement.link_url!}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            onClick={closeOnce}
            className="block"
          >
            {imageEl}
          </a>
        ) : (
          imageEl
        )}

        {/* Footer with dismiss controls */}
        <div className="flex items-center justify-between border-t border-black/8 bg-cream px-5 py-3 text-xs">
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
