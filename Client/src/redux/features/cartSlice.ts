import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
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
    },
  },
});

export const { addToCart,reduceFormCart ,deleteFormCart} = cartSlice.actions;
export default cartSlice.reducer;
