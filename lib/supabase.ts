import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SCHEMA = "petbro_website";

// Public read client (browser-safe).
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: SCHEMA },
  auth: { persistSession: false },
});

// Server-only admin client. Bypasses RLS via service role key.
// NEVER import this from client components.
export function supabaseAdmin() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: SCHEMA },
    auth: { persistSession: false },
  });
}

export type PricingTier = {
  min_qty: number;
  /** null = unlimited (top tier) */
  max_qty: number | null;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  en: string | null;
  spec: string | null;
  description: string | null;
  tags: string[];
  price: number;
  consumer_price: number | null;
  pricing_tiers: PricingTier[];
  min_order_quantity: number;
  stock: number;
  images: string[];
  detail_images: string[];
  status: "active" | "draft" | "archived";
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  link_label: string | null;
  link_url: string | null;
  status: "active" | "draft";
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Partner = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  status: "active" | "draft";
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  postcode: string | null;
  address: string;
  address_detail: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  vat_amount: number;
  total: number;
  payment_status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  toss_payment_key: string | null;
  toss_order_id: string | null;
  memo: string | null;
  fulfillment_status: "pending" | "preparing" | "shipped" | "delivered" | "cancelled";
  tracking_number: string | null;
  created_at: string;
  paid_at: string | null;
  updated_at: string;
};
