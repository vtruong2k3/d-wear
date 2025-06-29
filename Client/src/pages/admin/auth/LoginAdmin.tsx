import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "antd";

import { loginAdminAPI } from "../../../services/authAPI";
import type { ErrorType } from "../../../types/error/IError";
import type { LoginFormValues, LoginResponse } from "../../../types/auth/IAuth";

import "../../../styles/adminLogin.css";

// Schema xác thực với yup
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
      toast.success(res.message);
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
