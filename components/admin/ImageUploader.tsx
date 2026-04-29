"use client";

import { useRef, useState } from "react";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  /** Preview layout. 'grid' for thumbnails, 'stack' for full-width vertical previews. */
  layout?: "grid" | "stack";
  /** Show a "대표" badge + reorder action on the first item (gallery use). */
  showPrimary?: boolean;
  hint?: string;
  emptyHint?: string;
  /** Native multiple attribute on the input. */
  multiple?: boolean;
};

export default function ImageUploader({
  value,
  onChange,
  layout = "grid",
  showPrimary = false,
  hint = "JPG · PNG · WebP · GIF · 최대 5MB",
  emptyHint,
  multiple = true,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function remove(url: string) {
    onChange(value.filter((x) => x !== url));
  }

  function makePrimary(url: string) {
    if (!value.includes(url) || value[0] === url) return;
    onChange([url, ...value.filter((x) => x !== url)]);
  }

  function move(url: string, delta: -1 | 1) {
    const idx = value.indexOf(url);
    if (idx < 0) return;
    const next = idx + delta;
    if (next < 0 || next >= value.length) return;
    const copy = [...value];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    onChange(copy);
  }

  async function upload(files: FileList | File[]) {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of arr) fd.append("files", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          [data.error, ...(data.details || [])].filter(Boolean).join("\n"),
        );
      }
      const urls: string[] = (data.uploaded || []).map(
        (u: { url: string }) => u.url,
      );
      onChange([...value, ...urls]);
      if (data.errors && data.errors.length > 0) {
        setError(data.errors.join("\n"));
      }
    } catch (e: any) {
      setError(e.message || "업로드 실패");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
        }}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 px-6 text-center transition ${
          dragActive
            ? "border-brand bg-brand-50/40"
            : "border-ink/15 bg-[#fafafa] hover:border-ink/40 hover:bg-cream/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) upload(e.target.files);
          }}
          disabled={uploading}
        />
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`mb-3 ${dragActive ? "text-brand" : "text-ink/40"}`}
        >
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <p className="text-sm font-semibold text-ink">
          {uploading
            ? "업로드 중..."
            : dragActive
              ? "여기에 놓아주세요"
              : "이미지를 드래그하거나 클릭해서 선택"}
        </p>
        <p className="mt-1 text-xs text-ink/50">
          {hint}
          {multiple ? " · 한 번에 최대 10개" : ""}
        </p>
      </label>

      {error && (
        <div className="whitespace-pre-line rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {value.length > 0 ? (
        <>
          <div className="flex items-center justify-between text-xs text-ink/55">
            <span>
              총 {value.length}개
              {showPrimary && " · 첫 이미지가 대표 이미지로 사용됩니다."}
              {layout === "stack" && " · 위에서 아래로 표시됩니다."}
            </span>
          </div>

          {layout === "grid" ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {value.map((img, i) => (
                <li
                  key={img}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-cream ring-1 ring-black/10"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {showPrimary && i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      대표
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-ink/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                    {showPrimary && i !== 0 && (
                      <button
                        type="button"
                        onClick={() => makePrimary(img)}
                        className="rounded bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink transition hover:bg-white"
                      >
                        대표 지정
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(img)}
                      className="rounded bg-red-600/95 px-2 py-1 text-[10px] font-semibold text-white transition hover:bg-red-600"
                      aria-label="이미지 삭제"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // STACK: vertical previews, full-width per image, with reorder + delete
            <ul className="space-y-3">
              {value.map((img, i) => (
                <li
                  key={img}
                  className="group relative overflow-hidden rounded-xl bg-cream ring-1 ring-black/10"
                >
                  <img src={img} alt="" className="block w-full" />
                  <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => move(img, -1)}
                      disabled={i === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-ink shadow ring-1 ring-black/5 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="위로 이동"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(img, 1)}
                      disabled={i === value.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-ink shadow ring-1 ring-black/5 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="아래로 이동"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(img)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/95 text-xs font-bold text-white shadow transition hover:bg-red-600"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="absolute left-2 top-2 rounded bg-ink/85 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        emptyHint && <p className="text-xs text-ink/50">{emptyHint}</p>
      )}
    </div>
  );
}
