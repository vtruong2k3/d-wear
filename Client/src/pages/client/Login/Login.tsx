import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../redux/store";
import type { AppDispatch, RootState } from "../../../redux/store";
import { doLogin } from "../../../redux/features/authenSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import useHandleChange from "../../../hooks/Client/useHandleChange";

// Định nghĩa kiểu cho form login
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isLogin = useSelector((state: RootState) => state.authenSlice.isLogin);

  const { formData, handleChange } = useHandleChange<LoginFormData>({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    dispatch(doLogin(formData));
  };

  useEffect(() => {
    if (isLogin) {
      toast.success("Login thành công");
      navigate("/");
    }
  }, [isLogin, navigate]);

  return (
    <>
      <div className="pt-20 pb-10 bg-[#e5e5e5]">
  <div className="container">
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="font-semibold text-2xl text-center">Đăng nhập</h2>
      <div className="mt-5">
        <input
          name="email"
          type="email"
          className="mt-2 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email*"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="mt-3 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Password*"
          onChange={handleChange}
        />

        <a href="#" className="text-xs mt-3 block hover:underline text-right">
          Quên mật khẩu?
        </a>

        <button
          onClick={handleLogin}
          className="mt-4 w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 rounded-lg hover:bg-white hover:border-black hover:text-black border transition-all"
        >
          Login
        </button>

        <div className="relative my-6 text-center">
          <hr className="border-t border-gray-300" />
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm text-gray-500">
            HOẶC
          </span>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
              alt="Facebook"
              className="w-5 h-5"
            />
            <span className="text-sm">Facebook</span>
          </button>
          <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-red-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm">Google</span>
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>


      <section className="pt-12 pb-12"></section>
    </>
  );
};

export default Login;
