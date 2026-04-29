"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function OrderClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
