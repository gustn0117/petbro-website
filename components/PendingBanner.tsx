"use client";

import { usePathname } from "next/navigation";

export default function PendingBanner({
  status,
  reason,
}: {
  status: "pending" | "rejected";
  reason?: string | null;
}) {
  const pathname = usePathname();
  // Hide banner on auth pages and admin
  if (
    !pathname ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/order")
  ) {
    return null;
  }

  if (status === "rejected") {
    return (
      <div className="sticky top-[72px] z-30 border-b border-red-200 bg-red-50 md:top-[84px]">
        <div className="container-x flex items-center gap-3 py-2.5 text-xs">
          <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
            반려
          </span>
          <p className="text-red-800">
            가입이 반려되었습니다.
            {reason && (
              <span className="ml-1 text-red-700/80">사유 · {reason}</span>
            )}{" "}
            <a
              href="tel:010-7721-4150"
              className="ml-1 font-semibold underline-offset-2 hover:underline"
            >
              010-7721-4150
            </a>
            으로 문의 부탁드립니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[72px] z-30 border-b border-amber-200 bg-amber-50 md:top-[84px]">
      <div className="container-x flex items-center gap-3 py-2.5 text-xs">
        <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
          승인 대기
        </span>
        <p className="text-amber-900">
          사업자등록증 확인 후 영업일 기준 1일 이내 승인됩니다. 승인 전까지는
          가격 확인 및 주문이 제한됩니다.
        </p>
      </div>
    </div>
  );
}
