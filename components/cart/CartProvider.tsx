"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PricingTier } from "@/lib/supabase";
import { resolveUnitPrice } from "@/lib/pricing";

export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  /** Base / fallback price used when no tiers apply. */
  price: number;
  quantity: number;
  image: string | null;
  pricing_tiers: PricingTier[];
  min_order_quantity: number;
};

export function unitPriceForItem(item: CartItem): number {
  return resolveUnitPrice(item.pricing_tiers, item.quantity, item.price).price;
}

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "petbro_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load from sessionStorage (cart is ephemeral UI state — server validates at checkout).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore corrupted cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode, quota). Cart still works in-memory.
    }
  }, [items, hydrated]);

  const add: CartContextValue["add"] = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.product_id === item.product_id);
      const minQty = item.min_order_quantity ?? 10;
      if (existing) {
        // When merging, refresh tier/min snapshot from latest add so admin
        // changes propagate without forcing a session reset.
        const merged = {
          ...existing,
          pricing_tiers: item.pricing_tiers ?? existing.pricing_tiers,
          min_order_quantity: minQty,
          price: item.price ?? existing.price,
          quantity: existing.quantity + quantity,
        };
        merged.quantity = Math.max(merged.quantity, minQty);
        return prev.map((x) =>
          x.product_id === item.product_id ? merged : x,
        );
      }
      return [
        ...prev,
        { ...item, quantity: Math.max(quantity, minQty) },
      ];
    });
    setIsOpen(true);
  }, []);

  const setQuantity: CartContextValue["setQuantity"] = useCallback(
    (productId, quantity) => {
      setItems((prev) =>
        prev
          .map((x) => {
            if (x.product_id !== productId) return x;
            const minQty = x.min_order_quantity ?? 1;
            // 0 → remove; otherwise clamp to min
            if (quantity <= 0) return { ...x, quantity: 0 };
            return { ...x, quantity: Math.max(minQty, quantity) };
          })
          .filter((x) => x.quantity > 0),
      );
    },
    [],
  );

  const remove: CartContextValue["remove"] = useCallback((productId) => {
    setItems((prev) => prev.filter((x) => x.product_id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((s, x) => s + x.quantity, 0);
    const subtotal = items.reduce(
      (s, x) => s + unitPriceForItem(x) * x.quantity,
      0,
    );
    return {
      items,
      totalQuantity,
      subtotal,
      add,
      setQuantity,
      remove,
      clear,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      hydrated,
    };
  }, [items, isOpen, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
