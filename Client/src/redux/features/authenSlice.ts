import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userName: localStorage.getItem("userName"),
  isLogin:
    localStorage.getItem("userName") !== null &&
    localStorage.getItem("userName") !== "" &&
    localStorage.getItem("userName") !== undefined,
};

export const authenSlice = createSlice({
  name: "authenSlice",
  initialState,
  reducers: {
    doLogin: (state, action) => {
      const { email, password } = action.payload;
      if (email === "nghiemtv@gmail.com" && password === "123456") {
        const userName = email.split("@")[0];
        localStorage.setItem("userName", userName);
        // toast.success("Đăng nhập thành công!");
        return {
          ...state,
          userName,
          isLogin: true,
        };
      }
      toast.error("Đăng nhập thất bại!");
      return {
        ...state,
        userName: "",
        isLogin: false,
      };
    },

    doLogout: (state) => {
      localStorage.removeItem("userName");
      return {
        ...state,
        userName: "",
        isLogin: false,
      };
    },

    doRegister: (state, action) => {
      const { email, password } = action.payload;

      //lưu tài khoản vào localStorage hoặc gọi API ở đây
      const userName = email.split("@")[0];
      localStorage.setItem("userName", userName);

      toast.success("Đăng ký thành công!");
      return {
        ...state,
        userName,
        isLogin: true,
      };
    },
  },
});

export const { doLogin, doLogout, doRegister } = authenSlice.actions;
export default authenSlice.reducer;
