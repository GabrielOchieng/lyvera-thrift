import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
};

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const isItemInCart = state.cart.find((i) => i.id === item.id);
          if (isItemInCart) return state; // Don't add if already there (thrift items are unique)
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "lyvera-cart" }, // Name of the item in localStorage
  ),
);
