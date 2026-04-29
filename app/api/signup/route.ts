import { NextResponse } from "next/server";
import {
  hashPassword,
  normalizeEmail,
  setUserSession,
} from "@/lib/customer-auth";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "business-certs";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIZ_NUMBER_RE = /^\d{3}-?\d{2}-?\d{5}$/;

function extFromType(t: string): string {
  switch (t) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const email = normalizeEmail(String(form.get("email") || ""));
  const password = String(form.get("password") || "");
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const business_name = String(form.get("business_name") || "").trim();
  const business_number = String(form.get("business_number") || "").trim();
  const business_owner = String(form.get("business_owner") || "").trim();
  const business_address = String(form.get("business_address") || "").trim();
  const business_type = String(form.get("business_type") || "").trim();
  const business_item = String(form.get("business_item") || "").trim();
  const tax_email = String(form.get("tax_email") || "").trim();
  const is_simplified_tax =
    String(form.get("is_simplified_tax") || "") === "true";
  const cert = form.get("business_cert");

  // Validation
  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json(
      { error: "올바른 이메일을 입력해주세요." },
      { status: 400 },
    );
  if (!password || password.length < 8)
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 합니다." },
      { status: 400 },
    );
  if (!name)
    return NextResponse.json(
      { error: "담당자 이름을 입력해주세요." },
      { status: 400 },
    );
  if (!business_name)
    return NextResponse.json(
      { error: "상호(업체명)를 입력해주세요." },
      { status: 400 },
    );
  if (!business_number || !BIZ_NUMBER_RE.test(business_number))
    return NextResponse.json(
      { error: "사업자등록번호 10자리(예: 123-45-67890)를 입력해주세요." },
      { status: 400 },
    );
  if (!business_owner)
    return NextResponse.json(
      { error: "대표자명을 입력해주세요." },
      { status: 400 },
    );
  if (!business_address)
    return NextResponse.json(
      { error: "사업장 주소를 입력해주세요." },
      { status: 400 },
    );
  if (!tax_email || !EMAIL_RE.test(tax_email))
    return NextResponse.json(
      { error: "세금계산서를 받을 이메일을 입력해주세요." },
      { status: 400 },
    );
  if (!(cert instanceof File) || cert.size === 0)
    return NextResponse.json(
      { error: "사업자등록증 사본을 첨부해주세요." },
      { status: 400 },
    );
  if (!ALLOWED.has(cert.type))
    return NextResponse.json(
      { error: "JPG · PNG · WebP · PDF 파일만 업로드 가능합니다." },
      { status: 400 },
    );
  if (cert.size > MAX_BYTES)
    return NextResponse.json(
      { error: "파일 용량은 10MB 이하여야 합니다." },
      { status: 400 },
    );

  // Duplicate check
  const { data: existing } = await supabaseAdmin()
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 이메일입니다." },
      { status: 409 },
    );
  }

  // Upload cert
  const ext = extFromType(cert.type);
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const path = `${random}.${ext}`;
  const buffer = Buffer.from(await cert.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin()
    .storage.from(BUCKET)
    .upload(path, buffer, {
      contentType: cert.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "사업자등록증 업로드에 실패했습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }

  // Hash password
  const password_hash = await hashPassword(password);

  // Create user
  const { data: created, error: insertError } = await supabaseAdmin()
    .from("users")
    .insert({
      email,
      password_hash,
      name,
      phone: phone || null,
      business_name,
      business_number,
      business_owner,
      business_address,
      business_type: business_type || null,
      business_item: business_item || null,
      tax_email,
      is_simplified_tax,
      business_cert_path: path,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !created) {
    // Best-effort cleanup of uploaded cert
    await supabaseAdmin().storage.from(BUCKET).remove([path]);
    return NextResponse.json(
      { error: insertError?.message || "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }

  setUserSession(created.id);

  return NextResponse.json({ ok: true, status: "pending" });
}
