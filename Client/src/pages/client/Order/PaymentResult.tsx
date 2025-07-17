import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Result, Spin } from "antd";
import { SmileOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { ErrorType } from "../../../types/error/IError";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const resultCode = searchParams.get("resultCode");
    const transId = searchParams.get("transId"); // ✅ Lấy thêm transId

    // ✅ Nếu không có orderId, báo lỗi ngay
    if (!orderId || orderId === "payment") {
      toast.error("Không tìm thấy mã đơn hàng hợp lệ");
      navigate("/orders");
      return;
    }

    const verifyPayment = async () => {
      try {
        if (resultCode === "0") {
          // ✅ Gửi verify lên BE với đủ dữ liệu
          const res = await axios.post("/api/momo/verify", {
            order_id: orderId,
            trans_id: transId || "",
          });

          console.log("✅ Xác minh thanh toán:", res.data);
          toast.success("Thanh toán thành công");
        } else {
          toast.error("Thanh toán thất bại hoặc bị hủy");
        }
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);

        // ✅ Tự động quay về trang đơn hàng sau 3 giây
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        marginTop: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Spin size="large" tip="Đang xác minh thanh toán..." />
      ) : (
        <Result
          status={searchParams.get("resultCode") === "0" ? "success" : "error"}
          title={
            searchParams.get("resultCode") === "0"
              ? "Thanh toán thành công!"
              : "Thanh toán thất bại!"
          }
          subTitle="Bạn sẽ được chuyển hướng về trang đơn hàng trong giây lát."
          icon={
            searchParams.get("resultCode") === "0" ? (
              <SmileOutlined style={{ color: "#52c41a" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            )
          }
        />
      )}
    </div>
  );
};

export default PaymentResult;
