import { Input, Button, Steps, Form, message } from "antd";
import {
  MailOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";
import { userCheckOtp, userForgotPassword, userResetPassword } from "../../../services/client/authService";
import { Link, useNavigate } from "react-router-dom";
import loginBanner from "../../../assets/auth/login-banner.png";

const { Step } = Steps;

export interface ForgotPasswordForm {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string | undefined>(undefined);
  const [form] = Form.useForm<ForgotPasswordForm>();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentStep === 1 && countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, currentStep, canResend]);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await userForgotPassword(values.email);
      setEmail(values.email || "");
      setTimeout(() => {
        message.success(res.message);
        setCurrentStep(1);
        setCountdown(60);
        setCanResend(false);
        setLoading(false);
      }, 1500);
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

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await userCheckOtp(email, values.otp);
      setOtp(values.otp);
      setTimeout(() => {
        message.success(res.message);
        setCurrentStep(2);
        setLoading(false);
      }, 1500);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Mã OTP không đúng, vui lòng thử lại.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await userResetPassword(email, otp, values.password);
      setTimeout(() => {
        message.success(res.message);
        setCurrentStep(3);
        setLoading(false);
      }, 1500);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setCountdown(60);
    try {
      setTimeout(() => {
        message.success("Mã OTP mới đã được gửi!");
      }, 1000);
    } catch (error) {
      toast.error("Không thể gửi lại mã OTP!" + error);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Quên mật khẩu";
      case 1: return "Xác thực OTP";
      case 2: return "Đặt lại mật khẩu";
      case 3: return "Hoàn thành!";
      default: return "Quên mật khẩu";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 0: return "Nhập email để nhận mã xác thực";
      case 1: return "Nhập mã OTP đã được gửi về email";
      case 2: return "Tạo mật khẩu mới cho tài khoản";
      case 3: return "Mật khẩu đã được đặt lại thành công";
      default: return "";
    }
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
        <div className="relative z-10 flex flex-col justify-end p-12 text-white w-full">
          <div className="auth-fade-in-up auth-delay-2">
            <h2 className="!text-5xl font-black tracking-tight !mb-3 !text-white drop-shadow-lg">
              D-WEAR
            </h2>
            <div className="auth-brand-shimmer h-[2px] w-24 mb-5 rounded-full"></div>
            <p className="!text-lg !text-white/85 font-light leading-relaxed max-w-sm">
              Bảo mật tài khoản là ưu tiên hàng đầu của chúng tôi.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: Form Panel ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="auth-fade-in-up auth-delay-1 mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                D-WEAR
              </span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
            </div>

            <h1 className="!text-3xl lg:!text-4xl font-black !text-gray-900 !mb-2">
              {getStepTitle()}
            </h1>
            <p className="!text-gray-500 !text-base">
              {getStepDescription()}
            </p>
          </div>

          {/* Progress Steps */}
          {currentStep < 3 && (
            <div className="auth-fade-in-up auth-delay-2 mb-8">
              <Steps current={currentStep} size="small">
                <Step title="Email" icon={<MailOutlined />} />
                <Step title="OTP" icon={<SafetyCertificateOutlined />} />
                <Step title="Mật khẩu" icon={<LockOutlined />} />
              </Steps>
            </div>
          )}

          {/* Step 0: Email Input */}
          {currentStep === 0 && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSendOTP}
              className="auth-fade-in-up auth-delay-3"
            >
              <Form.Item
                name="email"
                label={<span className="font-semibold text-gray-700">Email</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
                getValueFromEvent={(e) => e.target.value.replace(/\s/g, "")}
                validateTrigger="onBlur"
              >
                <Input
                  type="email"
                  prefix={<MailOutlined className="!text-gray-400" />}
                  placeholder="Nhập email của bạn"
                  className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
                  size="large"
                  allowClear
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 !rounded-xl !text-base !font-bold !shadow-lg !transition-all !duration-300 hover:!shadow-xl hover:!scale-[1.02]"
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </Button>
            </Form>
          )}

          {/* Step 1: OTP Verification */}
          {currentStep === 1 && (
            <div className="auth-fade-in-up auth-delay-3">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MailOutlined className="text-2xl text-amber-600" />
                </div>
                <p className="text-gray-600">
                  Mã OTP đã được gửi đến email <br />
                  <strong>{email}</strong>
                </p>
              </div>

              <Form form={form} onFinish={handleVerifyOTP} layout="vertical" colon={false}>
                <Form.Item
                  name="otp"
                  label={<span className="font-semibold text-gray-700">Mã OTP</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập mã OTP!" },
                    { len: 6, message: "OTP phải gồm 6 chữ số!" },
                    { pattern: /^\d{6}$/, message: "OTP chỉ gồm số (0-9)!" },
                  ]}
                  getValueFromEvent={(e) => (e?.target?.value ?? "").replace(/\D/g, "").slice(0, 6)}
                  validateTrigger={["onChange", "onBlur"]}
                  hasFeedback
                >
                  <Input
                    prefix={<SafetyCertificateOutlined className="!text-gray-400" />}
                    placeholder="Nhập mã OTP 6 chữ số"
                    className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3 !text-center !text-lg !tracking-wider"
                    size="large"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="\d*"
                    allowClear={false}
                  />
                </Form.Item>

                <div className="text-center mb-6">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="!text-sm !text-amber-600 hover:!text-amber-700 hover:underline transition-colors"
                      disabled={loading}
                    >
                      Gửi lại mã OTP
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">Gửi lại mã sau {countdown}s</p>
                  )}
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 !rounded-xl !text-base !font-bold !shadow-lg !transition-all !duration-300 hover:!shadow-xl hover:!scale-[1.02]"
                >
                  {loading ? "Đang xác thực..." : "Xác thực OTP"}
                </Button>
              </Form>
            </div>
          )}

          {/* Step 2: Reset Password */}
          {currentStep === 2 && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleResetPassword}
              colon={false}
              className="auth-fade-in-up auth-delay-3"
            >
              <Form.Item
                name="password"
                label={<span className="font-semibold text-gray-700">Mật khẩu mới</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 5, message: "Mật khẩu tối thiểu 5 ký tự!" },
                ]}
                getValueFromEvent={(e) => (e?.target?.value ?? "").replace(/\s/g, "")}
                validateTrigger={["onBlur", "onChange"]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="!text-gray-400" />}
                  placeholder="Nhập mật khẩu mới"
                  size="large"
                  autoComplete="new-password"
                  className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="font-semibold text-gray-700">Xác nhận mật khẩu</span>}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value === getFieldValue("password")) return Promise.resolve();
                      return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
                    },
                  }),
                ]}
                getValueFromEvent={(e) => (e?.target?.value ?? "").replace(/\s/g, "")}
                validateTrigger={["onBlur", "onChange"]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="!text-gray-400" />}
                  placeholder="Nhập lại mật khẩu mới"
                  size="large"
                  autoComplete="new-password"
                  className="!rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 !transition-colors !duration-300 !py-3"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 !rounded-xl !text-base !font-bold !shadow-lg !transition-all !duration-300 hover:!shadow-xl hover:!scale-[1.02]"
              >
                {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
              </Button>
            </Form>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <div className="auth-fade-in-up text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleOutlined className="text-3xl text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Đặt lại mật khẩu thành công!
                </h3>
                <p className="text-gray-600">
                  Mật khẩu của bạn đã được cập nhật. <br />
                  Bạn có thể đăng nhập với mật khẩu mới.
                </p>
              </div>

              <Button
                type="primary"
                onClick={() => navigate('/login')}
                className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 !rounded-xl !text-base !font-bold !shadow-lg !transition-all !duration-300 hover:!shadow-xl hover:!scale-[1.02]"
              >
                Đăng nhập ngay
              </Button>
            </div>
          )}

          {/* Back Button */}
          {currentStep > 0 && currentStep < 3 && (
            <div className="mt-6">
              <Button
                onClick={goBack}
                icon={<ArrowLeftOutlined />}
                className="!border-0 !text-gray-600 hover:!text-gray-800 !px-0"
                type="text"
              >
                Quay lại
              </Button>
            </div>
          )}

          {/* Login Link */}
          <div className="auth-fade-in-up auth-delay-5 text-center mt-10 pt-8 border-t border-gray-100">
            <p className="text-gray-500">
              Nhớ mật khẩu?{" "}
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

export default ForgotPassword;