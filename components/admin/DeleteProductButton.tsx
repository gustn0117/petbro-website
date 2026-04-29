"use client";

import { useTransition } from "react";

export default function DeleteProductButton({
  id,
  name,
  action,
}: {
  id: string;
  name: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        if (!confirm(`'${name}' 상품을 삭제하시겠습니까?\n관련 데이터는 복구되지 않습니다.`)) {
          return;
        }
        startTransition(() => action(formData));
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:opacity-50"
      >
        {pending ? "삭제 중..." : "삭제"}
      </button>
    </form>
  );
}
