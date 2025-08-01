
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";

import { Button, message } from "antd";


import type { ErrorType } from "../../../types/error/IError";
import type { LoginFormValues } from "../../../types/auth/IAuth";

import "../../../styles/adminLogin.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { doLoginAdmin, fetchUserProfile } from "../../../redux/features/admin/thunks/authAdminThunk";


// Schema xác thực với yup
const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function AdminLogin() {
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isLogin, user } = useSelector((state: RootState) => state.authAdminSlice)

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
      // 
      await dispatch(doLoginAdmin(data)).unwrap();
      await dispatch(fetchUserProfile()).unwrap();

    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin && user?.role === "admin") {
      navigate('/admin/dashboard')
    }
  }, [isLogin, navigate, user])
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
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
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
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
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
