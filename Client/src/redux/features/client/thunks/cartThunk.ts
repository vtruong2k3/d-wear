import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteProductCart,
  fetchAddToCart,
  fetchGetCart,
  updateCartQuantity,
} from "../../../../services/client/apiCartService";
import toast from "react-hot-toast";

import type { GetCartResponse, ICartItem } from "../../../../types/cart/ICart";
import type { ErrorType } from "../../../../types/error/IError";

interface AddToCartPayload {
  product_id: string;
  variant_id: string;
  quantity: number;
}

// 👇 dùng AppThunkAPI tại đây
export const addToCartThunk = createAsyncThunk<
  ICartItem, // <- kiểu payload trả về khi fulfilled
  AddToCartPayload // kiểu argument truyền vào
>("cart/addToCart", async (payload, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  try {
    const res = await fetchAddToCart(payload);
    dispatch(getCartThunk());
    toast.success(res.message);
    return res.data;
  } catch (error) {
    const errorMessage =
      (error as ErrorType).response?.data?.message ||
      (error as ErrorType).message ||
      "Đã xảy ra lỗi, vui lòng thử lại.";
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const getCartThunk = createAsyncThunk<GetCartResponse>(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchGetCart();

      return data;
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";

      // Chuyển errorMessage sang string nếu nó là object
      const msg =
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage);

      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateCartQuantityThunk = createAsyncThunk(
  "cart/updateQuantity",
  async (payload: AddToCartPayload, { rejectWithValue }) => {
    try {
      const data = await updateCartQuantity(payload);

      toast.success(data.message);
      return data.cart; // trả về cart item đã cập nhật
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCartItemThunk = createAsyncThunk(
  "cart/deleteItem",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await deleteProductCart(id);
      toast.success(data.message);
      return id; // trả về id để xóa trong state
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
