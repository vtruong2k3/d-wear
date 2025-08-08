import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import type { OrderDetailResponse } from "../../../types/order/IOrder";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderDetail } from "../../../services/client/orderAPI";

import type { ErrorType } from "../../../types/error/IError";
import { useLoading } from "../../../contexts/LoadingContext";
import { formatCurrency } from "../../../utils/Format";
import socket from "../../../sockets/socket";
import { Modal, Input } from "antd";




const OrderDetailPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { setLoading } = useLoading();
  const cancelReasons = [
    "Tôi đặt nhầm sản phẩm",
    "Tôi tìm thấy giá tốt hơn ở nơi khác",
    "Thời gian giao hàng quá lâu",
    "Tôi thay đổi quyết định",
    "Lý do khác",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");
  const handleCancelOrder = async () => {
    const reasonToSend =
      selectedReason === "Lý do khác" ? cancelReason.trim() : selectedReason;

    if (!reasonToSend) {
      toast.error("Vui lòng chọn hoặc nhập lý do hủy đơn hàng");
      return;
    }

    try {
      setLoading(true);
      const reason = reasonToSend;

      const res = await cancelOrder(id, reason);

      toast.success(res.message);

      setOrder((prev) =>
        prev ? { ...prev, order: { ...prev.order, status: "cancelled" } } : prev
      );

      setIsModalOpen(false);
      setSelectedReason("");
      setCancelReason("");
    } catch (error) {

      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };
  const getOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrderDetail(id);
      setOrder(res);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  }, [id, setLoading]);


  useEffect(() => {
    if (!id) return;
    getOrderDetails();
  }, [id, getOrderDetails]);



  useEffect(() => {
    if (!id || id === "payment") return;

    socket.emit("joinRoom", id);

    socket.on("orderStatusUpdate", (data) => {
      if (data?.orderId === id) {
        setOrder((prev) =>
          prev
            ? {
              ...prev,
              order: { ...prev.order, status: data.status },
            }
            : prev
        );
        toast.success(`Trạng thái đơn hàng đã cập nhật: ${getStatusText(data.status)}`);
      }
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("orderStatusUpdate");
    };
  }, [id]);

  // Sửa socket cancelOrder
  useEffect(() => {
    if (!id || id === "payment") return; // s Chặn lỗi Cast to ObjectId

    socket.emit("joinRoom", id);

    socket.on("cancelOrder", (data) => {
      if (data?.orderId === id) {
        setOrder((prev) =>
          prev
            ? {
              ...prev,
              order: { ...prev.order, status: data.status },
            }
            : prev
        );
        toast.error(`Đơn hàng ${data.order_code} đã bị huỷ vì lí do: ${data.cancellationReason}`)
      }
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("cancelOrder");
    };
  }, [id]);



  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Tiền mặt";
      case "momo":
        return "Ví MoMo";
      case "vnpay":
        return "Ví VNPAY";
      default:
        return "Không xác định";
    }
  };

  const getPaymentStatus = (paymentStatus: string, paymentMethod: string) => {
    if (paymentMethod === "cod") {
      // COD payment status logic
      switch (paymentStatus) {
        case "paid":
          return {
            label: "Đã thanh toán",
            color: "bg-green-100 text-green-800",
            icon: <CheckCircle className="w-4 h-4" />
          };
        case "pending":
        case "unpaid":
        default:
          return {
            label: "Thanh toán khi nhận hàng",
            color: "bg-yellow-100 text-yellow-800",
            icon: <Clock className="w-4 h-4" />
          };
      }
    } else {
      // Online payment status logic
      switch (paymentStatus) {
        case "paid":
        case "completed":
          return {
            label: "Đã thanh toán",
            color: "bg-green-100 text-green-800",
            icon: <CheckCircle className="w-4 h-4" />
          };
        case "pending":
          return {
            label: "Đang xử lý thanh toán",
            color: "bg-yellow-100 text-yellow-800",
            icon: <Clock className="w-4 h-4" />
          };
        case "failed":
          return {
            label: "Thanh toán thất bại",
            color: "bg-red-100 text-red-800",
            icon: <XCircle className="w-4 h-4" />
          };
        case "unpaid":
        default:
          return {
            label: "Chưa thanh toán",
            color: "bg-red-100 text-red-800",
            icon: <XCircle className="w-4 h-4" />
          };
      }
    }
  };

  const renderColorIndicator = (color: string) => {
    const colorMap = {
      trắng: "bg-white border-2 border-gray-300",
      đen: "bg-black",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
      gray: "bg-gray-500",
      "titanium natural": "bg-gradient-to-r from-gray-300 to-gray-400",
      "space black": "bg-gradient-to-r from-gray-800 to-black",
      silver: "bg-gradient-to-r from-gray-200 to-gray-300",
      gold: "bg-gradient-to-r from-yellow-300 to-yellow-500",
    } as const;

    type ColorKey = keyof typeof colorMap;
    const lowerColor = color.toLowerCase();

    const colorClass =
      lowerColor in colorMap ? colorMap[lowerColor as ColorKey] : "bg-gray-300";

    return (
      <div className={`w-4 h-4 rounded-full ${colorClass} inline-block mr-2`} />
    );
  };
  useEffect(() => {
    if (!id) return;

    socket.emit("joinRoom", id);

    socket.on("orderStatusUpdate", (data) => {

      if (data?.orderId === id) {
        setOrder((prev) =>
          prev
            ? {
              ...prev,
              order: { ...prev.order, status: data.status },
            }
            : prev
        );
        toast.success(`Trạng thái đơn hàng đã cập nhật: ${getStatusText(data.status)}`);
      }
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("orderStatusUpdate");
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    socket.emit("joinRoom", id);

    socket.on("cancelOrder", (data) => {
      if (data?.orderId === id) {
        setOrder((prev) =>
          prev
            ? {
              ...prev,
              order: { ...prev.order, status: data.status },
            }
            : prev
        );
      }
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("cancelOrder");
    };
  }, [id]);
  const getStatusInVietnamese = (status: string) => {
    const statusMap: {
      [key: string]: { label: string; color: string; icon: React.ReactNode };
    } = {
      pending: {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
      },
      confirmed: {
        label: 'Đã xác nhận',
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      processing: {
        label: 'Đang xử lý',
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="w-4 h-4" />,
      },
      shipped: {
        label: 'Đang giao hàng',
        color: 'bg-purple-100 text-purple-800',
        icon: <Truck className="w-4 h-4" />,
      },
      delivered: {
        label: 'Đã giao hàng',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      completed: {
        label: 'Hoàn thành',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-4 h-4" />,
      },
      refunded: {
        label: 'Đã hoàn tiền',
        color: 'bg-gray-100 text-gray-800',
        icon: <XCircle className="w-4 h-4" />,
      },
    };

    return (
      statusMap[status.toLowerCase()] || {
        label: 'Hoàn thành',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
      }
    );
  };
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInVietnamese(order.order.status);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại danh sách đơn hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chi tiết đơn hàng
          </h1>
        </div>

        {/* Main Content - Full Width Grid */}
        <div className="space-y-6">
          {/* Order Info - Full Width */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Thông tin đơn hàng
                </h2>
                <p className="text-gray-600">
                  Mã đơn hàng:{" "}
                  <span className="font-bold ">{order.order.order_code}</span>
                </p>
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
              >
                {statusInfo.icon}
                <span className="ml-2">
                  {statusInfo.label}
                </span>
              </div>
            </div>
            {/* className="grid grid-cols-1 md:grid-cols-3 gap-6" */}
            <div className="flex gap-50">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-medium">
                    {new Date(order.order.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium">
                    {getPaymentMethodText(order.order.paymentMethod)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPaymentStatus(order.order.paymentStatus || 'unpaid', order.order.paymentMethod).color}`}>
                    {getPaymentStatus(order.order.paymentStatus || 'unpaid', order.order.paymentMethod).icon}
                    <span className="ml-1">
                      {getPaymentStatus(order.order.paymentStatus || 'unpaid', order.order.paymentMethod).label}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Cancel Reason - Only show if order is cancelled and has cancel reason */}
          {order.order.status === "cancelled" && order.order.cancellationReason && (
            <div className="bg-red-50 !border !border-red-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Lý do hủy đơn hàng
                  </h3>
                  <p className="text-red-700 bg-red-100 p-4 rounded-lg">
                    {order.order.cancellationReason}
                  </p>
                  {order.order.cancellationReason && (
                    <p className="text-sm text-red-600 mt-2">
                      Đã hủy vào: {new Date(order.order.updatedAt).toLocaleDateString("vi-VN")} lúc {new Date(order.order.updatedAt).toLocaleTimeString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Items - Full Width */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sản phẩm đã đặt ({order.orderItems.length} sản phẩm)
            </h3>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={
                      item.product_image &&
                        item.product_image.length > 0
                        ? item.product_image.startsWith("http")
                          ? item.product_image
                          : `http://localhost:5000/${item.product_image.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "/default.png"
                    }
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-sans text-gray-900 mb-1">
                      {item.product_name}
                    </h4>
                    <div className="flex items-center space-x-4 mb-2">
                      {item.size && (
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">
                            Size:
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md font-medium">
                            {item.size}
                          </span>
                        </div>
                      )}
                      {item.color && (
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">
                            Màu:
                          </span>
                          <div className="flex items-center">
                            {renderColorIndicator(item.color)}
                            <span className="text-xs font-medium text-gray-700 capitalize">
                              {item.color}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm font-sans font-medium text-blue-600">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {order.order.note && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ghi chú
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {order.order.note}
              </p>
            </div>
          )}
          {/* Three Column Layout for Summary, Address, and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tổng cộng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {order.order.discount > 0
                      ? formatCurrency(order.order.discount)
                      : formatCurrency(order.order.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">{order.order.shippingFee ? formatCurrency(order.order.shippingFee) : "Miễn phí"}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {formatCurrency(order.order.finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.order.receiverName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-600">{order.order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-600">
                      {order.order.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác
              </h3>
              <div className="space-y-3">
                {["pending", "processing"].includes(order.order.status) && (
                  <>
                    <button
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Hủy đơn hàng
                    </button>

                    <Modal
                      title="Xác nhận hủy đơn hàng"
                      open={isModalOpen}
                      onOk={handleCancelOrder}
                      onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedReason("");
                        setCancelReason("");
                      }}
                      okText="Xác nhận"
                      cancelText="Hủy"
                    >
                      <p>Bạn có chắc chắn muốn hủy đơn hàng?</p>

                      <div className="space-y-2 mt-4">
                        {cancelReasons.map((reason, index) => (
                          <div key={index}>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                value={reason}
                                checked={selectedReason === reason}
                                onChange={(e) =>
                                  setSelectedReason(e.target.value)
                                }
                                className="mr-2"
                              />
                              {reason}
                            </label>
                          </div>
                        ))}
                      </div>

                      {selectedReason === "Lý do khác" && (
                        <Input.TextArea
                          rows={4}
                          className="mt-3"
                          placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      )}
                    </Modal>
                  </>
                )}
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Liên hệ hỗ trợ
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Tải hóa đơn
                </button>
              </div>
            </div>
          </div>

          {/* Notes - Full Width */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;