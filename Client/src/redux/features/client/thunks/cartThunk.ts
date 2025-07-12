import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAddToCart,
  fetchGetCart,
  updateCartQuantity,
} from "../../../../services/client/apiCartService";
import toast from "react-hot-toast";

import type { GetCartResponse } from "../../../../types/cart/ICart";

interface AddToCartPayload {
  product_id: string;
  variant_id: string;
  quantity: number;
}

interface CartItem {
  _id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
}

// 👇 dùng AppThunkAPI tại đây
export const addToCartThunk = createAsyncThunk<
  CartItem, // ✅ kiểu return
  AddToCartPayload
>("cart/addToCart", async (payload, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  try {
    const res = await fetchAddToCart(payload);
    dispatch(getCartThunk());

    toast.success(res.message);
    return res.data;
  } catch (err: any) {
    const messageError =
      err?.response?.data?.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng";
    return rejectWithValue(messageError);
  }
});

export const getCartThunk = createAsyncThunk<GetCartResponse>(
  "cart/getCart",
  async (_, thunkAPI) => {
    try {
      const data = await fetchGetCart();
      console.log(data); // ← Gọi API
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Lỗi lấy giỏ hàng");
    }
  }
);

interface UpdateCartPayload {
  variant_id: string;
  quantity: number;
}

export const updateCartQuantityThunk = createAsyncThunk(
  "cart/updateQuantity",
  async (payload: UpdateCartPayload, { rejectWithValue }) => {
    try {
      const data = await updateCartQuantity(payload);
      toast.success(data.message);
      return data.cart; // trả về cart item đã cập nhật
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
      return rejectWithValue(error.response?.data);
    }
  }
);
