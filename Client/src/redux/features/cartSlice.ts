import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const storedCart = localStorage.getItem("cartItems");

const initialState: CartState = {
  cartItems: storedCart ? JSON.parse(storedCart) : [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { cartItems } = state;
      const payload = action.payload;
      const isCheckProduct = cartItems.some((item) => item.id === payload.id);
      if (isCheckProduct) {
        const updateCarts = cartItems.map((product) =>
          product.id === payload.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
        state.cartItems = updateCarts;
      } else {
        state.cartItems.push(payload);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    reduceFormCart: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload;
      if (payload.quantity > 1) {
        state.cartItems = state.cartItems.map((item) =>
          item.id === payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== payload.id
        );
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    deleteFormCart: (state, action: PayloadAction<number>) => {
      const payload = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const { addToCart, reduceFormCart, deleteFormCart } = cartSlice.actions;

export default cartSlice.reducer;
