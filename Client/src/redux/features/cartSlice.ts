import { createSlice } from "@reduxjs/toolkit";
<<<<<<< HEAD
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
=======

const initialState = {
  cartItems: [],
>>>>>>> 4d9fd166946a83b928822e39def219e7ca83d3da
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
<<<<<<< HEAD
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
    },

    deleteFormCart: (state, action: PayloadAction<number>) => {
      const payload = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== payload);
=======
    addToCart: (state, action) => {
      const { cartItems } = state;
      const { payload } = action;
      const isCheckProduct = cartItems.some((item) => item.id === payload.id);
      if (isCheckProduct) {
        const updateCarts = cartItems.map((product) => {
          if (product.id === payload.id) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          }
          return product;
        });
        return {
          ...state,
          cartItems: updateCarts,
        };
      }
      return {
        ...state,
        cartItems: [...cartItems, payload],
      };
    },
    reduceFormCart: (state, action) => {
      const { cartItems } = state;
      const { payload } = action;
      if (payload.quantity > 1) {
        const updateCartItems = cartItems.map((item) => {
          if (item.id === payload.id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        return {
          ...state,
          cartItems: updateCartItems,
        };
      } else {
        const updateCartItems = cartItems.filter(
          (item) => item.id !== payload.id
        );
        return {
          ...state,
          cartItems: updateCartItems,
        };
      }
    },
    deleteFormCart: (state, action) => {
      const { cartItems } = state;
      const { payload } = action;
      const updateCartItems = cartItems.filter(
        (item) => item.id !== payload
      );
      return {
        ...state,
        cartItems: updateCartItems,
      };
>>>>>>> 4d9fd166946a83b928822e39def219e7ca83d3da
    },
  },
});

<<<<<<< HEAD
export const { addToCart, reduceFormCart, deleteFormCart } = cartSlice.actions;
=======
export const { addToCart,reduceFormCart ,deleteFormCart} = cartSlice.actions;
>>>>>>> 4d9fd166946a83b928822e39def219e7ca83d3da
export default cartSlice.reducer;
