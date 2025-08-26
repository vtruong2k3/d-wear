// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Link, useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
// import toast from "react-hot-toast";

// import type { AppDispatch, RootState } from "../../../redux/store";
// import { doLogin, doLoginWithGoogle } from "../../../redux/features/client/thunks/authUserThunk";
// import { useLoading } from "../../../contexts/LoadingContext";

// //  Khai báo schema Yup
// const schema = yup.object({
//   email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
//   password: yup.string().min(5, "Mật khẩu tối thiểu 5 ký tự").required("Mật khẩu là bắt buộc"),
// });

// type LoginFormData = yup.InferType<typeof schema>;

// const Login: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { isLogin, token } = useSelector((state: RootState) => state.authenSlice);
//   const { setLoading } = useLoading();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = handleSubmit(async (data) => {
//     setLoading(true);
//     try {
//       await dispatch(doLogin(data)).unwrap();
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Đăng nhập thất bại!";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   });

//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       if (!tokenResponse?.access_token) {
//         toast.error("Không lấy được token từ Google!");
//         return;
//       }

//       setLoading(true);
//       try {
//         await dispatch(
//           doLoginWithGoogle({ accessToken: tokenResponse.access_token })
//         ).unwrap();
//       } catch (error) {
//         const errorMessage =
//           error instanceof Error ? error.message : "Đăng nhập thất bại";
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     },
//     onError: () => {
//       toast.error("Đăng nhập Google thất bại!");
//     },
//     flow: "implicit",
//   });

//   useEffect(() => {
//     if (isLogin && token) navigate("/");
//   }, [isLogin, navigate, token]);

//   return (
//     <div className="pt-20 pb-10 bg-[#e5e5e5]">
//       <div className="container">
//         <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
//           <h2 className="font-semibold text-2xl text-center">Đăng nhập</h2>

//           <form onSubmit={onSubmit} className="mt-5">
//             <input
//               type="email"
//               {...register("email")}
//               placeholder="Email*"
//               className="mt-2 w-full h-[50px] border border-gray-300 p-4 rounded-lg text-sm"
//             />
//             {errors.email && (
//               <p className="text-sm text-red-500">{errors.email.message}</p>
//             )}

//             <input
//               type="password"
//               {...register("password")}
//               placeholder="Mật khẩu*"
//               className="mt-3 w-full h-[50px] border border-gray-300 p-4 rounded-lg text-sm"
//             />
//             {errors.password && (
//               <p className="text-sm text-red-500">{errors.password.message}</p>
//             )}

//             <div className="text-right mt-3 text-xs">
//               <a href="#" className="hover:underline">Quên mật khẩu?</a>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 w-full h-[50px] bg-black text-white uppercase font-semibold text-sm rounded-lg hover:bg-white hover:border hover:text-black transition-all"
//             >
//               Đăng nhập
//             </button>
//           </form>

//           <div className="relative my-6 text-center">
//             <hr className="border-t border-gray-300" />
//             <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm text-gray-500">
//               HOẶC
//             </span>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={() => toast.error("Tính năng Facebook đang phát triển")}
//               className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
//             >
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
//                 alt="Facebook"
//                 className="w-5 h-5"
//               />
//               <span className="text-sm">Facebook</span>
//             </button>
//             <button
//               onClick={() => login()}
//               className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
//             >
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
//                 alt="Google"
//                 className="w-5 h-5"
//               />
//               <span className="text-sm">Google</span>
//             </button>
//           </div>

//           <p className="text-sm text-center mt-4">
//             Bạn chưa có tài khoản?{" "}
//             <Link to="/register" className="text-blue-600 font-medium hover:underline">
//               Đăng ký
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { Input, Button, Divider, Card, message, Form } from "antd";
import {

  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LoginOutlined,

} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import type { LoginFormData } from "../../../types/auth/IAuth";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { doLogin, doLoginWithGoogle } from "../../../redux/features/client/thunks/authUserThunk";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin, token } = useSelector((state: RootState) => state.authenSlice);
  const [form] = Form.useForm<LoginFormData>();



  const handleSubmit = async () => {







    setLoading(true);
    try {
      const values = await form.validateFields();
      await dispatch(doLogin(values)).unwrap();

    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
    finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        toast.error("Không lấy được token từ Google!");
        return;
      }

      setGoogleLoading(true);
      try {
        await dispatch(
          doLoginWithGoogle({ accessToken: tokenResponse.access_token })
        ).unwrap();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đăng nhập thất bại";
        toast.error(errorMessage);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại!");
    },
    flow: "implicit",
  });
  useEffect(() => {
    if (isLogin && token) navigate("/");
  }, [isLogin, navigate, token]);

  const handleFacebookLogin = () => {
    message.info("Tính năng Facebook đang phát triển");
  };

  return (
    <div className="  !bg-gradient-to-br !from-slate-50 !via-white !to-gray-50 flex items-center justify-center !py-12 !px-10">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 !w-32 !h-32 !bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 !w-40 !h-40 !bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="!w-full max-w-md relative">
        <Card className="!border-0 shadow-2xl rounded-3xl overflow-hidden !bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="!text-4xl font-black !text-gray-900 !mb-2 pt-8">
              Đăng Nhập
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="!w-8 !h-1 !bg-gradient-to-r !from-amber-400 !to-orange-500 rounded-full"></div>
              <span className="!text-lg font-semibold !bg-gradient-to-r !from-amber-600 !to-orange-600 bg-clip-text text-transparent">
                D-WEAR
              </span>
              <div className="!w-8 !h-1 !bg-gradient-to-r !from-amber-400 !to-orange-500 rounded-full"></div>
            </div>
            <p className="text-gray-600">
              Chào mừng bạn trở lại với D-Wear
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              onFinishFailed={({ errorFields }) =>
                form.scrollToField(errorFields[0]?.name)
              }
              validateTrigger="onBlur"
            >
              <div className="space-y-2 mb-5">
                <label className="text-gray-700 font-semibold block">Email</label>
                <Form.Item

                  name="email"

                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Nhập email của bạn"
                    className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300 py-3"
                    size="large"
                    type="email"
                    autoComplete="email"
                  />
                </Form.Item>

              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-semibold block">Mật khẩu</label>
                <Form.Item

                  name="password"

                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 5, message: "Mật khẩu tối thiểu 5 ký tự" },

                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu"
                    className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300 py-3"
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    autoComplete="current-password"
                  />
                </Form.Item>

              </div>
            </Form>

            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="!text-sm !text-amber-600 hover:!text-amber-700 hover:underline transition-colors duration-200"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="primary"
              loading={loading}
              icon={!loading && <LoginOutlined />}
              onClick={handleSubmit}
              className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <Divider className="!border-gray-300">
              <span className="!bg-white !px-4 !text-gray-500 !text-sm font-medium">
                HOẶC ĐĂNG NHẬP BẰNG
              </span>
            </Divider>
          </div>

          {/* Social Login */}
          <div className="space-y-4">
            <Button
              onClick={() => login()}
              loading={googleLoading}
              icon={!googleLoading && <GoogleOutlined />}
              className="!w-full !h-12 !border-2 !border-gray-200 hover:!border-red-400 !text-gray-700 hover:!text-red-600 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              {googleLoading ? "Đang xử lý..." : "Tiếp tục với Google"}
            </Button>

            <Button
              onClick={handleFacebookLogin}
              icon={<FacebookOutlined />}
              className="!w-full !h-12 !border-2 !border-gray-200 hover:!border-blue-400 !text-gray-700 hover:!text-blue-600 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Tiếp tục với Facebook
            </Button>
          </div>



          {/* Register Link */}
          <div className="text-center !mt-8 !pt-6 !border-t !border-gray-200">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="!text-amber-600 hover:!text-amber-700 font-semibold hover:underline transition-colors duration-200"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </Card>


      </div>
    </div>
  );
};

export default Login;