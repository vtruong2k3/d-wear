import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import authenSlice from "./features/authenSlice";

const reducer = combineReducers({
  cartSlice,
  authenSlice,
});

const store = configureStore({
  reducer,
});
export default store;
