import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "business-certs";

// GET /api/admin/users/cert?path=xxxx -> redirect to time-limited signed URL
export async function GET(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "path 누락" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .createSignedUrl(path, 60 * 10); // 10 minutes

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "서명 URL 생성 실패" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(data.signedUrl, 307);
}
