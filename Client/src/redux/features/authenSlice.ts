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
        return {
          ...state,
          userName,
          isLogin: true,
        };
      }
      toast.error("Login thất bại!");
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
  },
});

export const { doLogin, doLogout } = authenSlice.actions;
export default authenSlice.reducer;
