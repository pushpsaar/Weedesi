"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Size } from "@/lib/types";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  size: Size;
  price: number;
  qty: number;
}

interface StoreState {
  cart: CartLine[];
  wishlist: string[]; // product ids
  addToCart: (line: CartLine) => void;
  updateQty: (productId: string, size: Size, color: string, qty: number) => void;
  removeFromCart: (productId: string, size: Size, color: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  cartTotal: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = "vedesi_cart";
const WISHLIST_KEY = "vedesi_wishlist";

function lineKey(l: { productId: string; size: Size; color: string }) {
  return `${l.productId}__${l.size}__${l.color}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Reading localStorage must happen after mount (it isn't available during
  // SSR), so we deliberately hydrate state in an effect rather than in the
  // initial render — this is the one legitimate case for setState-in-effect.
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISHLIST_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (c) setCart(JSON.parse(c));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (w) setWishlist(JSON.parse(w));
    } catch {
      // ignore corrupt storage
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l) === key ? { ...l, qty: l.qty + line.qty } : l
        );
      }
      return [...prev, line];
    });
  }, []);

  const updateQty = useCallback(
    (productId: string, size: Size, color: string, qty: number) => {
      setCart((prev) =>
        prev.map((l) =>
          lineKey(l) === lineKey({ productId, size, color })
            ? { ...l, qty: Math.max(1, qty) }
            : l
        )
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, size: Size, color: string) => {
      setCart((prev) =>
        prev.filter((l) => lineKey(l) !== lineKey({ productId, size, color }))
      );
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.qty * l.price, 0),
    [cart]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        cartCount,
        cartTotal,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
