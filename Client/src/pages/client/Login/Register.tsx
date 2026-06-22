import { Input, Button, Divider, Checkbox, Form } from "antd";
import {
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterFormData } from "../../../types/auth/IAuth";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { doLoginWithGoogle, doRegister } from "../../../redux/features/client/thunks/authUserThunk";
import { useGoogleLogin } from "@react-oauth/google";
import registerBanner from "../../../assets/auth/register-banner.png";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin, token } = useSelector((state: RootState) => state.authenSlice);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [form] = Form.useForm<RegisterFormData>();
  const [agreeTermsError, setAgreeTermsError] = useState("");

  const handleSubmit = async () => {
    setAgreeTermsError("");
    let hasError = false;

    if (!agreeTerms) {
      setAgreeTermsError("Vui lòng đồng ý với điều khoản sử dụng!");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const values = await form.validateFields();
      await dispatch(doRegister(values)).unwrap();
      navigate("/");
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
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
        await dispatch(doLoginWithGoogle({ accessToken: tokenResponse.access_token })).unwrap();
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

  const handleFacebookRegister = () => {
    toast("Tính năng Facebook đang phát triển", { icon: "ℹ️" });
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT: Image Panel ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative auth-image-overlay auth-slide-in-left overflow-hidden">
        <img
          src={registerBanner}
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
              Khám phá phong cách của bạn. Tham gia cộng đồng thời trang D-Wear ngay hôm nay.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: Form Panel ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="auth-fade-in-up auth-delay-1 mb-8">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                D-WEAR
              </span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
            </div>

            <h1 className="!text-3xl lg:!text-4xl font-black !text-gray-900 !mb-2">
              Tạo tài khoản
            </h1>
            <p className="!text-gray-500 !text-base">
              Đăng ký để bắt đầu trải nghiệm mua sắm
            </p>
          </div>

          {/* Register Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={({ errorFields }) =>
              form.scrollToField(errorFields[0]?.name)
            }
            validateTrigger="onBlur"
            requiredMark="optional"
            className="auth-fade-in-up auth-delay-2"
          >
            <Form.Item
              name="username"
              label={<span className="font-semibold text-gray-700">Họ và tên</span>}
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên" },
                { min: 2, message: "Ít nhất 2 ký tự" },
                { pattern: /^(?!\s*$).+$/, message: "Không chỉ chứa khoảng trắng" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="!text-gray-400" />}
                placeholder="Nhập họ và tên của bạn"
                size="large"
                autoComplete="name"
                className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
              />
            </Form.Item>

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
                size="large"
                type="email"
                autoComplete="email"
                className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
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
                size="large"
                autoComplete="new-password"
                iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
              />
            </Form.Item>
          </Form>

          {/* Terms Agreement */}
          <div className="auth-fade-in-up auth-delay-3 mb-6">
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (e.target.checked) setAgreeTermsError("");
              }}
              className="!text-gray-700"
            >
              <span className="text-sm">
                Tôi đồng ý với{" "}
                <a href="#" className="!text-amber-600 hover:!text-amber-700 hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="!text-amber-600 hover:!text-amber-700 hover:underline">
                  Chính sách bảo mật
                </a>
              </span>
            </Checkbox>
            {agreeTermsError && (
              <p className="text-sm text-red-500 mt-1">{agreeTermsError}</p>
            )}
          </div>

          <div className="auth-fade-in-up auth-delay-3">
            <Button
              type="primary"
              loading={loading}
              icon={!loading && <UserAddOutlined />}
              onClick={handleSubmit}
              className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 !rounded-xl !text-base !font-bold !shadow-lg !transition-all !duration-300 hover:!shadow-xl hover:!scale-[1.02]"
            >
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </div>

          {/* Divider */}
          <div className="auth-fade-in-up auth-delay-4 my-8">
            <Divider className="!border-gray-200">
              <span className="!text-gray-400 !text-sm font-medium !px-3">
                HOẶC
              </span>
            </Divider>
          </div>

          {/* Social Register */}
          <div className="auth-fade-in-up auth-delay-5 flex gap-4">
            <Button
              onClick={() => login()}
              loading={googleLoading}
              icon={!googleLoading && <GoogleOutlined />}
              className="!flex-1 !h-12 !border-2 !border-gray-200 hover:!border-red-300 !text-gray-600 hover:!text-red-500 !rounded-xl !font-semibold !transition-all !duration-300 hover:!shadow-md"
            >
              {googleLoading ? "..." : "Google"}
            </Button>

            <Button
              onClick={handleFacebookRegister}
              icon={<FacebookOutlined />}
              className="!flex-1 !h-12 !border-2 !border-gray-200 hover:!border-blue-300 !text-gray-600 hover:!text-blue-500 !rounded-xl !font-semibold !transition-all !duration-300 hover:!shadow-md"
            >
              Facebook
            </Button>
          </div>

          {/* Login Link */}
          <div className="auth-fade-in-up auth-delay-6 text-center mt-10 pt-8 border-t border-gray-100">
            <p className="text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="!text-amber-600 hover:!text-amber-700 !font-semibold hover:underline transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;