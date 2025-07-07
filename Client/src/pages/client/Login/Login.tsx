import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import type { AppDispatch, RootState } from "../../../redux/store";
import { doLogin, doLoginWithGoogle } from "../../../redux/features/authenSlice";
import { useLoading } from "../../../contexts/LoadingContext";

//  Khai báo schema Yup
const schema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup.string().min(5, "Mật khẩu tối thiểu 5 ký tự").required("Mật khẩu là bắt buộc"),
});

type LoginFormData = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state: RootState) => state.authenSlice);
  const { setLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await dispatch(doLogin(data)).unwrap();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        toast.error("Không lấy được token từ Google!");
        return;
      }

      setLoading(true);
      try {
        await dispatch(
          doLoginWithGoogle({ accessToken: tokenResponse.access_token })
        ).unwrap();
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
    if (isLogin) navigate("/");
  }, [isLogin, navigate]);

  return (
    <div className="pt-20 pb-10 bg-[#e5e5e5]">
      <div className="container">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="font-semibold text-2xl text-center">Đăng nhập</h2>

          <form onSubmit={onSubmit} className="mt-5">
            <input
              type="email"
              {...register("email")}
              placeholder="Email*"
              className="mt-2 w-full h-[50px] border border-gray-300 p-4 rounded-lg text-sm"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            <input
              type="password"
              {...register("password")}
              placeholder="Mật khẩu*"
              className="mt-3 w-full h-[50px] border border-gray-300 p-4 rounded-lg text-sm"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            <div className="text-right mt-3 text-xs">
              <a href="#" className="hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              className="mt-4 w-full h-[50px] bg-black text-white uppercase font-semibold text-sm rounded-lg hover:bg-white hover:border hover:text-black transition-all"
            >
              Đăng nhập
            </button>
          </form>

          <div className="relative my-6 text-center">
            <hr className="border-t border-gray-300" />
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm text-gray-500">
              HOẶC
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => toast.error("Tính năng Facebook đang phát triển")}
              className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
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
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
