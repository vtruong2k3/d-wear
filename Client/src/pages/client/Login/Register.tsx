import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { doLoginWithGoogle, doRegister } from "../../../redux/features/client/thunks/authUserThunk";
import { useLoading } from "../../../contexts/LoadingContext";
import type { RegisterFormData } from "../../../types/auth/IAuth";
import type { AppDispatch, RootState } from "../../../redux/store";

//  Yup validation schema
const schema = yup.object().shape({
  username: yup.string().required("Tên người dùng là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup.string().min(5, "Mật khẩu tối thiểu 5 ký tự").required("Mật khẩu là bắt buộc"),
});

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state: RootState) => state.authenSlice);
  const { setLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  //  Gửi dữ liệu đăng ký
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await dispatch(doRegister(data)).unwrap();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  });

  // ✅ Google login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        toast.error("Không lấy được token từ Google!");
        return;
      }

      setLoading(true);
      try {
        await dispatch(doLoginWithGoogle({ accessToken: tokenResponse.access_token })).unwrap();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đăng nhập thất bại";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      toast.error("Đăng nhập Google thất bại!");
    },

    flow: "implicit",
  });

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  return (
    <div className="pt-20 pb-10 bg-[#e5e5e5]">
      <div className="container">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="font-semibold text-2xl text-center">Đăng ký</h2>

          <form onSubmit={onSubmit} className="mt-5">
            <input
              {...register("username")}
              type="text"
              className="mt-2 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Tên người dùng*"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
            )}

            <input
              {...register("email")}
              type="email"
              className="mt-3 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Email*"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}

            <input
              {...register("password")}
              type="password"
              className="mt-3 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Mật khẩu*"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="mt-5 w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 rounded-lg hover:bg-white hover:border-black hover:text-black border transition-all"
            >
              Đăng ký
            </button>
          </form>

          <div className="relative my-6 text-center">
            <hr className="border-t border-gray-300" />
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm text-gray-500">
              HOẶC
            </span>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
              <img
                src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                alt="Facebook"
                className="w-5 h-5"
              />
              <span className="text-sm">Facebook</span>
            </button>

            <button
              onClick={() => login()}
              className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm">Google</span>
            </button>
          </div>

          <p className="text-sm text-center mt-4">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="text-red-500 font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
