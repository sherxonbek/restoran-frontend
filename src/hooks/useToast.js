import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useToast - Vaqtinchalik bildirishnomalarni boshqarish uchun maxsus hook.
 * Avtomatik timeout tozalash xususiyatiga ega (memory leak bo'lmaydi).
 */
export function useToast(defaultDuration = 3000) {
  const [toast, setToast] = useState("");
  const timerRef = useRef(null);

  const showToast = useCallback((message, duration = defaultDuration) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(message);
    timerRef.current = setTimeout(() => {
      setToast("");
    }, duration);
  }, [defaultDuration]);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast("");
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toast, showToast, hideToast };
}
