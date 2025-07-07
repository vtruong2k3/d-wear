import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import type { AppDispatch, RootState } from "../../../redux/store";
import { doLoginWithGoogle } from "../../../redux/features/authenSlice";



const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state: RootState) => state.authenSlice);

  // Google Login custom
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (tokenResponse?.access_token) {
        dispatch(doLoginWithGoogle(tokenResponse.access_token));
      } else {
        toast.error("Không lấy được token từ Google!");
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại!");
    },
    flow: "implicit",
  });

  useEffect(() => {
    if (isLogin) navigate("/");
  }, [isLogin, navigate]);

  const handleFacebookLogin = () => {
    toast.info("Tính năng Facebook đang được phát triển!");
  };

  return (
    <div className="pt-20 pb-10 bg-[#f5f5f5] min-h-screen">
      <div className="container">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="font-semibold text-2xl text-center">Đăng nhập</h2>

          <div className="mt-5">
            <input
              type="email"
              placeholder="Email*"
              className="mt-2 w-full h-[50px] border border-gray-300 p-4 rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Mật khẩu*"
              className="mt-3 w-full h-[50px] border border-gray-300 p-4 rounded-lg text-sm"
            />
            <div className="text-right mt-3 text-xs">
              <a href="#" className="hover:underline">Quên mật khẩu?</a>
            </div>

            <button className="mt-4 w-full h-[50px] bg-black text-white uppercase font-semibold text-sm rounded-lg hover:bg-white hover:border hover:text-black transition-all">
              Đăng nhập
            </button>

            <div className="relative my-6 text-center">
              <hr className="border-t border-gray-300" />
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm text-gray-500">
                HOẶC
              </span>
            </div>

            {/* Nút Facebook & Google với kích thước đều nhau */}
            <div className="flex gap-4">
              {/* Facebook */}
              <button
                onClick={handleFacebookLogin}
                className="flex-1 h-[50px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-50 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                <span>Facebook</span>
              </button>

              {/* Google */}
              <button
                onClick={() => login()}
                className="flex-1 h-[50px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-red-50 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                  alt="Google"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-gray-700">Google</span>
              </button>
            </div>

            <p className="text-sm text-center mt-4">
              Bạn chưa có tài khoản?{" "}
              <a href="/register" className="text-blue-600 font-medium hover:underline">
                Đăng ký
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;