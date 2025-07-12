// src/redux/features/client/cartSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import {
  addToCartThunk,
  deleteCartItemThunk,
  getCartThunk,
  updateCartQuantityThunk,
} from "./thunks/cartThunk";
import type { ICartItem } from "../../../types/cart/ICart";

// export interface ICartItem {
//   _id: string;
//   user_id: string;
//   product_id: IProduct;
//   variant_id: IVariant;
//   quantity: number;
//   price: number;
//   totalPrice: number;
//   createdAt: string;
//   updatedAt: string;
// }

interface CartState {
  cartItems: ICartItem[];
  loading: boolean;
  error: string | null;
  totalAmount: number;
}

const initialState: CartState = {
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
      // Thêm sản phẩm vào giỏ
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        addToCartThunk.fulfilled,
        (state, action: PayloadAction<ICartItem>) => {
          const newItem = action.payload;
          const existingIndex = state.cartItems.findIndex(
            (item) => item.variant_id._id === newItem.variant_id._id
          );

          if (existingIndex !== -1) {
            // Cập nhật số lượng và tổng tiền nếu đã tồn tại
            const existing = state.cartItems[existingIndex];
            state.cartItems[existingIndex] = {
              ...existing,
              quantity: newItem.quantity,
              totalPrice: newItem.price * newItem.quantity,
              updatedAt: new Date().toISOString(),
            };
          } else {
            // Thêm mới item
            state.cartItems.push({
              ...newItem,
              totalPrice: newItem.price * newItem.quantity,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }

          state.loading = false;
        }
      )
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })

      // Lấy giỏ hàng
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCartThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ carts: ICartItem[]; totalAmount: number }>
        ) => {
          state.loading = false;
          state.cartItems = action.payload.carts;
          state.totalAmount = action.payload.totalAmount;
        }
      )
      .addCase(
        deleteCartItemThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== action.payload
          );
        }
      )
      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })

      // Cập nhật số lượng sản phẩm trong giỏ
      .addCase(updateCartQuantityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartQuantityThunk.fulfilled,
        (state, action: PayloadAction<ICartItem>) => {
          state.loading = false;
          const updated = action.payload;

          const idx = state.cartItems.findIndex(
            (item) => item._id === updated._id // Tốt nhất nên so sánh theo _id của chính cart item
          );

          if (idx !== -1) {
            state.cartItems[idx] = {
              ...state.cartItems[idx],
              quantity: updated.quantity,
              totalPrice: updated.price * updated.quantity,
              updatedAt: new Date().toISOString(),
            };
          } else {
            // fallback thật sự cần thiết?
            // bạn có thể bỏ đoạn này để tránh "tự thêm mới"
            console.warn("Không tìm thấy item cần cập nhật, không thêm mới");
          }
        }
      )
      .addCase(updateCartQuantityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });
  },
});

export default cartSlice.reducer;
