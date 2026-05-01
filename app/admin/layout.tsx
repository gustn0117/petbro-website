import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminSession, isAdmin } from "@/lib/auth";

async function logout() {
  "use server";
  clearAdminSession();
  redirect("/admin");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page renders bare (no chrome). Other admin pages get full layout.
  if (!isAdmin()) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-ink">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white">
        <div className="flex h-16 items-center justify-between px-6 lg:px-10">
          <Link href="/admin/products" className="flex items-center gap-3">
            <img src="/images/patbro-mark.png" alt="" className="h-8 w-8" />
            <span className="font-display text-xl font-extrabold tracking-tightest">
              PAT BRO · ADMIN
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <AdminNavLink href="/admin/products" label="상품" />
            <AdminNavLink href="/admin/orders" label="주문" />
            <AdminNavLink href="/admin/users" label="회원" />
            <AdminNavLink href="/admin/partners" label="파트너" />
            <AdminNavLink href="/admin/popups" label="팝업" />
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-xs font-semibold text-ink/60 transition hover:text-ink md:inline"
            >
              사이트 보기 ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink/80 transition hover:border-ink hover:text-ink"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
        <nav className="flex items-center gap-1 border-t border-black/5 px-6 md:hidden">
          <AdminNavLink href="/admin/products" label="상품" />
          <AdminNavLink href="/admin/orders" label="주문" />
          <AdminNavLink href="/admin/users" label="회원" />
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink"
    >
      {label}
    </Link>
  );
}
