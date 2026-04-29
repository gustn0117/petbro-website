import Link from "next/link";

export default function OrderFailPage({
  searchParams,
}: {
  searchParams: { code?: string; message?: string; orderId?: string };
}) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream px-6 pt-24">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">
          !
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tightest text-ink md:text-3xl">
          결제가 취소되었습니다.
        </h1>
        <p className="mt-4 text-sm text-ink/70">
          {searchParams.message || "결제를 완료하지 못했습니다. 다시 시도해주세요."}
        </p>
        {searchParams.code && (
          <p className="mt-2 font-mono text-xs text-ink/40">{searchParams.code}</p>
        )}
        <div className="mt-10 flex flex-col gap-2">
          <Link
            href="/checkout"
            className="rounded-full bg-ink py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
          >
            다시 시도하기
          </Link>
          <Link
            href="/products"
            className="text-xs font-semibold text-ink/60 transition hover:text-ink"
          >
            쇼핑 계속하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

export const dynamic = "force-dynamic";
