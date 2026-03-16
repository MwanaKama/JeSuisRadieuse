import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: CartProduct) => void;
  removeOne: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
}

const CART_STORAGE_KEY = 'jsr-global-cart';

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart(): Record<string, CartItem> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, CartItem>;
  } catch {
    return {};
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartById, setCartById] = useState<Record<string, CartItem>>(() => readStoredCart());

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartById));
  }, [cartById]);

  const items = useMemo(() => Object.values(cartById), [cartById]);

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  function addItem(product: CartProduct) {
    setCartById((current) => {
      const existing = current[product.id];
      if (existing) {
        return {
          ...current,
          [product.id]: {
            ...existing,
            quantity: existing.quantity + 1,
          },
        };
      }

      return {
        ...current,
        [product.id]: {
          ...product,
          quantity: 1,
        },
      };
    });
  }

  function removeOne(productId: string) {
    setCartById((current) => {
      const existing = current[productId];
      if (!existing) {
        return current;
      }

      if (existing.quantity <= 1) {
        const next = { ...current };
        delete next[productId];
        return next;
      }

      return {
        ...current,
        [productId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  }

  function removeItem(productId: string) {
    setCartById((current) => {
      if (!current[productId]) {
        return current;
      }
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  function clearCart() {
    setCartById({});
  }

  function getQuantity(productId: string) {
    return cartById[productId]?.quantity ?? 0;
  }

  const value: CartContextValue = {
    items,
    itemCount,
    total,
    addItem,
    removeOne,
    removeItem,
    clearCart,
    getQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
