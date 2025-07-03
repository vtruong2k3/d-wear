
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { loginAdminAPI } from "../../../services/authAPI";
import { toast } from "react-toastify";
import { Button } from "antd";
import "../../../styles/adminLogin.css";
import type { ErrorType } from "../../../types/error/IError";
import type { LoginFormValues, LoginResponse } from "../../../types/auth/IAuth";


// sử dụng yup để validate
const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const res: LoginResponse = await loginAdminAPI(data);
      localStorage.setItem("token", res.token);
      toast.success(res.message)

      navigate("/admin/dashboard");
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <Shield color="white" size={30} />
          </div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">
            Đăng nhập để truy cập hệ thống quản trị
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Nhập email của bạn"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Nhập mật khẩu"
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <Button
            htmlType="submit"
            type="primary"
            block
            loading={loading}
            className="login-button"
          >
            Đăng Nhập
          </Button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            © 2024 Admin Portal. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
}

// <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
//   <div className="w-full max-w-md">
//     {/* Login Card */}
//     <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
//           <Shield className="w-8 h-8 text-white" />
//         </div>
//         <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
//         <p className="text-gray-300">Đăng nhập vào hệ thống quản trị</p>
//       </div>

//       {/* Login Form */}
//       <div className="space-y-6">
//         {/* Email Input */}
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Mail className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
//           />
//         </div>

//         {/* Password Input */}
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Lock className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Mật khẩu"
//             className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
//           >
//             {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//           </button>
//         </div>

//         {/* Remember Me & Forgot Password */}
//         <div className="flex items-center justify-between">
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
//             />
//             <span className="ml-2 text-sm text-gray-300">Ghi nhớ đăng nhập</span>
//           </label>
//           <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
//             Quên mật khẩu?
//           </a>
//         </div>

//         {/* Login Button */}
//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 shadow-lg"
//         >
//           Đăng nhập
//         </button>
//       </div>

//       {/* Divider */}
//       <div className="mt-6 mb-6">
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-white/20"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-transparent text-gray-400">hoặc</span>
//           </div>
//         </div>
//       </div>

//       {/* Alternative Login Options */}
//       <div className="space-y-3">
//         <button className="w-full flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
//           <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//           </svg>
//           Đăng nhập với Google
//         </button>

//         <button className="w-full flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
//           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//           </svg>
//           Đăng nhập với Facebook
//         </button>
//       </div>

//       {/* Footer */}
//       <div className="mt-8 text-center">
//         <p className="text-gray-400 text-sm">
//           © 2025 Admin Panel. All rights reserved.
//         </p>
//       </div>
//     </div>

//     {/* Decorative Elements */}
//     <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl -z-10"></div>
//     <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl -z-10"></div>
//   </div>
// </div>


