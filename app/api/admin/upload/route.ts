import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFromType(t: string): string {
  switch (t) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const files = form.getAll("files").filter((x): x is File => x instanceof File);
  if (files.length === 0) {
    return NextResponse.json(
      { error: "업로드할 파일이 없습니다." },
      { status: 400 },
    );
  }
  if (files.length > 10) {
    return NextResponse.json(
      { error: "한 번에 최대 10개까지 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  const uploaded: { url: string; path: string; name: string }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      errors.push(`${file.name}: 지원하지 않는 형식 (${file.type})`);
      continue;
    }
    if (file.size > MAX_BYTES) {
      errors.push(
        `${file.name}: 5MB 초과 (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
      );
      continue;
    }

    const ext = extFromType(file.type);
    const date = new Date();
    const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    const random =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const path = `products/${yyyymm}/${random}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin()
      .storage.from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      errors.push(`${file.name}: ${error.message}`);
      continue;
    }

    uploaded.push({ url: publicUrl(path), path, name: file.name });
  }

  if (uploaded.length === 0) {
    return NextResponse.json(
      { error: "업로드 실패", details: errors },
      { status: 400 },
    );
  }

  return NextResponse.json({ uploaded, errors });
}
