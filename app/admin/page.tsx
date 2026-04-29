import { redirect } from "next/navigation";
import { isAdmin, setAdminSession, adminPassword } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "/admin/products");

  if (password !== adminPassword()) {
    redirect(`/admin?error=invalid${redirectTo ? `&redirect=${encodeURIComponent(redirectTo)}` : ""}`);
  }

  setAdminSession();
  redirect(redirectTo || "/admin/products");
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  if (isAdmin()) {
    redirect(searchParams.redirect || "/admin/products");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/images/patbro-mark.png" alt="" className="mx-auto h-14 w-14" />
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tightest text-ink">
            ADMIN
          </h1>
          <p className="mt-2 text-sm text-ink/60">PAT BRO 관리자 페이지</p>
        </div>

        <form
          action={login}
          className="space-y-4 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5"
        >
          <input
            type="hidden"
            name="redirect"
            defaultValue={searchParams.redirect || ""}
          />
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[11px] font-semibold tracking-[0.3em] text-ink/60"
            >
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3.5 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              placeholder="비밀번호 입력"
            />
          </div>

          {searchParams.error === "invalid" && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              비밀번호가 올바르지 않습니다.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-ink py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition hover:bg-brand"
          >
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink/50">
          관리자 전용 페이지입니다.
        </p>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
