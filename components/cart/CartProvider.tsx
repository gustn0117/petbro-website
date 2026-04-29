"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

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
      if (existing) {
        return prev.map((x) =>
          x.product_id === item.product_id
            ? { ...x, quantity: x.quantity + quantity }
            : x,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity: CartContextValue["setQuantity"] = useCallback(
    (productId, quantity) => {
      setItems((prev) =>
        prev
          .map((x) =>
            x.product_id === productId
              ? { ...x, quantity: Math.max(0, quantity) }
              : x,
          )
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
    const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0);
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
