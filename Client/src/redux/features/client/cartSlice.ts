// src/redux/slices/cartSlice.ts

import toast from "react-hot-toast";
import { addToCartThunk, getCartThunk } from "./thunks/cartThunk";
import { createSlice } from "@reduxjs/toolkit";
import type { ICartItem } from "../../../types/cart/ICart";

interface CartItem {
  _id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  cartItems: ICartItem[];
  loading: boolean;
  error: string | null;
  totalAmount: number; // ✅ Add this
}

const initialState: CartState = {
  items: [],
  cartItems: [],
  loading: false,
  error: null,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingIndex = state.items.findIndex(
          (item) => item.variant_id === newItem.variant_id
        );

        if (existingIndex !== -1) {
          state.items[existingIndex].quantity = newItem.quantity;
        } else {
          state.items.push(newItem);
        }

        state.loading = false;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });

    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.carts;
        console.log(state.cartItems);
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(getCartThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
