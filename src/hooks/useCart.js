import { useState, useMemo, useCallback } from "react";

/**
 * useCart - Savatcha holati va hisob-kitoblarini boshqarish uchun maxsus hook.
 */
export function useCart(initialItems = []) {
  const [cart, setCart] = useState(initialItems);

  const addToCart = useCallback((item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.id === id);
      if (!existing) return prevCart;
      if (existing.quantity === 1) {
        return prevCart.filter((cartItem) => cartItem.id !== id);
      }
      return prevCart.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalSum = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalSum,
    totalCount,
  };
}
