
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate, Link } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
// import toast from "react-hot-toast";

// import { doLoginWithGoogle, doRegister } from "../../../redux/features/client/thunks/authUserThunk";
// import { useLoading } from "../../../contexts/LoadingContext";
// import type { RegisterFormData } from "../../../types/auth/IAuth";
// import type { AppDispatch, RootState } from "../../../redux/store";

// //  Yup validation schema
// const schema = yup.object().shape({
//   username: yup.string().required("Tên người dùng là bắt buộc"),
//   email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
//   password: yup.string().min(5, "Mật khẩu tối thiểu 5 ký tự").required("Mật khẩu là bắt buộc"),
// });

// const Register: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { isLogin } = useSelector((state: RootState) => state.authenSlice);
//   const { setLoading } = useLoading();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: yupResolver(schema),
//   });

//   //  Gửi dữ liệu đăng ký
//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       setLoading(true);
//       await dispatch(doRegister(data)).unwrap();

//       navigate("/");

//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Đăng ký thất bại!";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   });

//   //  Google login
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       if (!tokenResponse?.access_token) {
//         toast.error("Không lấy được token từ Google!");
//         return;
//       }

//       setLoading(true);
//       try {
//         await dispatch(doLoginWithGoogle({ accessToken: tokenResponse.access_token })).unwrap();
//         if (isLogin) {
//           navigate("/");
//         }
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



//   return (
//     <div className="pt-20 pb-10 bg-[#e5e5e5]">
//       <div className="container">
//         <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
//           <h2 className="font-semibold text-2xl text-center">Đăng ký</h2>

//           <form onSubmit={onSubmit} className="mt-5">
//             <input
//               {...register("username")}
//               type="text"
//               className="mt-2 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="Tên người dùng*"
//             />
//             {errors.username && (
//               <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
//             )}

//             <input
//               {...register("email")}
//               type="email"
//               className="mt-3 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="Email*"
//             />
//             {errors.email && (
//               <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
//             )}

//             <input
//               {...register("password")}
//               type="password"
//               className="mt-3 w-full h-[50px] border border-gray-300 p-5 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="Mật khẩu*"
//             />
//             {errors.password && (
//               <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
//             )}

//             <button
//               type="submit"
//               className="mt-5 w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 rounded-lg hover:bg-white hover:border-black hover:text-black border transition-all"
//             >
//               Đăng ký
//             </button>
//           </form>

//           <div className="relative my-6 text-center">
//             <hr className="border-t border-gray-300" />
//             <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-sm text-gray-500">
//               HOẶC
//             </span>
//           </div>

//           <div className="flex gap-4">
//             <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
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
//             Bạn đã có tài khoản?{" "}
//             <Link to="/login" className="text-red-500 font-medium hover:underline">
//               Đăng nhập
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import { Input, Button, Divider, Card, message, Checkbox, Form } from "antd";
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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin, token } = useSelector((state: RootState) => state.authenSlice);



  const [agreeTerms, setAgreeTerms] = useState(false);
  const [form] = Form.useForm<RegisterFormData>();
  // Error states


  const [agreeTermsError, setAgreeTermsError] = useState("");





  const handleSubmit = async () => {


    setAgreeTermsError("");

    let hasError = false;





    // Terms agreement validation
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
    message.info("Tính năng Facebook đang phát triển");
  };

  return (
    <div className=" !bg-gradient-to-br !from-slate-50 !via-white !to-gray-50 flex items-center justify-center !py-12 !px-10">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 !w-32 !h-32 !bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 !w-40 !h-40 !bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="!w-full max-w-md relative">
        <Card className="!border-0 shadow-2xl rounded-3xl overflow-hidden !bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="!text-4xl font-black !text-gray-900 !mb-2 pt-8">
              Đăng Ký
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="!w-8 !h-1 !bg-gradient-to-r !from-amber-400 !to-orange-500 rounded-full"></div>
              <span className="!text-lg font-semibold !bg-gradient-to-r !from-amber-600 !to-orange-600 bg-clip-text text-transparent">
                D-WEAR
              </span>
              <div className="!w-8 !h-1 !bg-gradient-to-r !from-amber-400 !to-orange-500 rounded-full"></div>
            </div>
            <p className="text-gray-600">
              Tạo tài khoản mới để bắt đầu với D-Wear
            </p>
          </div>

          {/* Register Form */}
          <div className="space-y-6">

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onFinishFailed={({ errorFields }) =>
                form.scrollToField(errorFields[0]?.name)
              }
              validateTrigger="onBlur"
              requiredMark="optional"
            >
              {/* Họ và tên */}
              <label className="text-gray-700 font-semibold block mb-1">Họ và tên</label>
              <Form.Item
                name="username"

                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên" },
                  { min: 2, message: "Ít nhất 2 ký tự" },
                  { pattern: /^(?!\s*$).+$/, message: "Không chỉ chứa khoảng trắng" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập họ và tên của bạn"
                  size="large"
                  autoComplete="name"
                  className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300 py-3"
                />
              </Form.Item>

              {/* Email */}
              <label className="text-gray-700 font-semibold block mb-1">Email</label>
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
                  size="large"
                  type="email"
                  autoComplete="email"
                  className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300 py-3"
                />
              </Form.Item>

              {/* Mật khẩu */}
              <label className="text-gray-700 font-semibold block mb-1">Mật khẩu</label>
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
                  size="large"
                  autoComplete="new-password"
                  iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300 py-3"
                />
              </Form.Item>


            </Form>


            {/* Terms Agreement */}
            <div className="space-y-2">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="text-gray-700"
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
                <p className="text-sm text-red-500">{agreeTermsError}</p>
              )}
            </div>

            <Button
              type="primary"
              loading={loading}
              icon={!loading && <UserAddOutlined />}
              onClick={handleSubmit}
              className="!w-full !h-12 !bg-gradient-to-r !from-gray-900 !to-slate-800 hover:!from-gray-800 hover:!to-slate-700 !border-0 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
            >
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <Divider className="!border-gray-300">
              <span className="!bg-white !px-4 !text-gray-500 !text-sm font-medium">
                HOẶC ĐĂNG KÝ BẰNG
              </span>
            </Divider>
          </div>

          {/* Social Register */}
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
              onClick={handleFacebookRegister}
              icon={<FacebookOutlined />}
              className="!w-full !h-12 !border-2 !border-gray-200 hover:!border-blue-400 !text-gray-700 hover:!text-blue-600 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Tiếp tục với Facebook
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center !mt-8 !pt-6 !border-t !border-gray-200">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="!text-amber-600 hover:!text-amber-700 font-semibold hover:underline transition-colors duration-200"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;