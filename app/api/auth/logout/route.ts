import { NextResponse } from "next/server";
import { clearUserSession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  clearUserSession();
  const url = new URL("/", req.url);
  return NextResponse.redirect(url, { status: 303 });
}
