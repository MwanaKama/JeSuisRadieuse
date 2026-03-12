import { useEffect, useMemo, useState } from 'react';

import type { CartItem, Product } from '../types/shop';

const CART_STORAGE_KEY = 'jsr-store-cart';

function readStoredCart(): Record<string, number> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useCart(products: Product[]) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => readStoredCart());

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(quantities));
  }, [quantities]);

  const items = useMemo<CartItem[]>(() => {
    return Object.entries(quantities)
      .map(([productId, quantity]) => {
        const product = products.find((entry) => entry.id === productId);
        if (!product || quantity <= 0) {
          return null;
        }

        return {
          ...product,
          quantity
        };
      })
      .filter((item): item is CartItem => item !== null);
  }, [products, quantities]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  function addToCart(productId: string) {
    setQuantities((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1
    }));
  }

  function removeFromCart(productId: string) {
    setQuantities((current) => {
      const next = { ...current };
      const currentQuantity = next[productId] || 0;

      if (currentQuantity <= 1) {
        delete next[productId];
        return next;
      }

      next[productId] = currentQuantity - 1;
      return next;
    });
  }

  function setQuantity(productId: string, quantity: number) {
    setQuantities((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  }

  function clearCart() {
    setQuantities({});
  }

  return {
    quantities,
    items,
    subtotal,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart
  };
}