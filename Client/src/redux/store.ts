import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/client/cartSlice";
import authenSlice from "./features/client/authenSlice";
import authAdminSlice from "./features/admin/adminSlice";

// Định nghĩa type cho extra (truyền từ component vào thunk)
interface ExtraArg {
  setLoading?: (value: boolean) => void;
}

const reducer = combineReducers({
  cartSlice,
  authenSlice,
  authAdminSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          setLoading: () => {},
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 👇 Type cho thunkAPI để dùng trong createAsyncThunk
export type AppThunkAPI = {
  dispatch: AppDispatch;
  state: RootState;
  extra: ExtraArg;
  rejectValue: string;
};

export default store;
