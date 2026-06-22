import { Input, Button, Divider, Form } from "antd";
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
import loginBanner from "../../../assets/auth/login-banner.png";

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
    } finally {
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
    toast("Tính năng Facebook đang phát triển", { icon: "ℹ️" });
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT: Image Panel ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative auth-image-overlay auth-slide-in-left overflow-hidden">
        <img
          src={loginBanner}
          alt="D-Wear Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white w-full">
          <div className="auth-fade-in-up auth-delay-2">
            <h2 className="!text-5xl font-black tracking-tight !mb-3 !text-white drop-shadow-lg">
              D-WEAR
            </h2>
            <div className="auth-brand-shimmer h-[2px] w-24 mb-5 rounded-full"></div>
            <p className="!text-lg !text-white/85 font-light leading-relaxed max-w-sm">
              Phong cách thời trang dành cho bạn. Khám phá bộ sưu tập mới nhất ngay hôm nay.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: Form Panel ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="auth-fade-in-up auth-delay-1 mb-10">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                D-WEAR
              </span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
            </div>

            <h1 className="!text-3xl lg:!text-4xl font-black !text-gray-900 !mb-2">
              Chào mừng trở lại
            </h1>
            <p className="!text-gray-500 !text-base">
              Đăng nhập vào tài khoản D-Wear của bạn
            </p>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            onFinishFailed={({ errorFields }) =>
              form.scrollToField(errorFields[0]?.name)
            }
            validateTrigger="onBlur"
            className="auth-fade-in-up auth-delay-2"
          >
            <Form.Item
              name="email"
              label={<span className="font-semibold text-gray-700">Email</span>}
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="!text-gray-400" />}
                placeholder="Nhập email của bạn"
                className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
                size="large"
                type="email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-semibold text-gray-700">Mật khẩu</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 5, message: "Mật khẩu tối thiểu 5 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="!text-gray-400" />}
                placeholder="Nhập mật khẩu"
                className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="current-password"
              />
            </Form.Item>

            <div className="flex justify-end -mt-2 mb-6">
              <Link
                to="/forgot-password"
                className="!text-sm !text-amber-600 hover:!text-amber-700 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={!loading && <LoginOutlined />}
              className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 !rounded-xl !text-base !font-bold !shadow-lg !transition-all !duration-300 hover:!shadow-xl hover:!scale-[1.02]"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </Form>

          {/* Divider */}
          <div className="auth-fade-in-up auth-delay-3 my-8">
            <Divider className="!border-gray-200">
              <span className="!text-gray-400 !text-sm font-medium !px-3">
                HOẶC
              </span>
            </Divider>
          </div>

          {/* Social Login */}
          <div className="auth-fade-in-up auth-delay-4 flex gap-4">
            <Button
              onClick={() => login()}
              loading={googleLoading}
              icon={!googleLoading && <GoogleOutlined />}
              className="!flex-1 !h-12 !border-2 !border-gray-200 hover:!border-red-300 !text-gray-600 hover:!text-red-500 !rounded-xl !font-semibold !transition-all !duration-300 hover:!shadow-md"
            >
              {googleLoading ? "..." : "Google"}
            </Button>

            <Button
              onClick={handleFacebookLogin}
              icon={<FacebookOutlined />}
              className="!flex-1 !h-12 !border-2 !border-gray-200 hover:!border-blue-300 !text-gray-600 hover:!text-blue-500 !rounded-xl !font-semibold !transition-all !duration-300 hover:!shadow-md"
            >
              Facebook
            </Button>
          </div>

          {/* Register Link */}
          <div className="auth-fade-in-up auth-delay-5 text-center mt-10 pt-8 border-t border-gray-100">
            <p className="text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="!text-amber-600 hover:!text-amber-700 !font-semibold hover:underline transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;