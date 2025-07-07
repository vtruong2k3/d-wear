import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import authenSlice from "./features/authenSlice";

// Định nghĩa type cho extra (truyền từ component vào thunk)
interface ExtraArg {
  setLoading?: (value: boolean) => void;
}

const reducer = combineReducers({
  cartSlice,
  authenSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          setLoading: () => {},
        }, // 👈 Khởi tạo rỗng, ta sẽ truyền khi dispatch
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
