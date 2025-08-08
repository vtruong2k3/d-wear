import React, { useState, useEffect } from 'react';
import {
  Eye,
  Package,
  CreditCard,
  User,
  Phone,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../../services/client/orderAPI';
import type { IOrder } from '../../../types/order/IOrder';
import { useLoading } from '../../../contexts/LoadingContext';
import type { ErrorType } from '../../../types/error/IError';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils/Format';
import socket from '../../../sockets/socket';


const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrders();
        setOrders(res.orders);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          'Đã xảy ra lỗi, vui lòng thử lại.';
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setLoading]);
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
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

  useEffect(() => {
    if (orders.length === 0) return;

    orders.forEach((order) => {
      socket.emit('joinRoom', order._id);
    });

    socket.on('orderStatusUpdate', ({ orderId, status }) => {
      setOrders((prevOrders) => {
        const updated = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        );

        const updatedOrder = updated.find(order => order._id === orderId);
        if (updatedOrder) {
          toast.success(`Trạng thái đơn hàng đã cập nhật: ${getStatusText(status)}`);
        }

        return updated;
      });
    });


    return () => {
      orders.forEach((order) => {
        socket.emit('leaveRoom', order._id);
      });
      socket.off('orderStatusUpdate');
    };
  }, [orders]);

  useEffect(() => {
    if (orders.length === 0) return;

    orders.forEach((order) => {
      socket.emit('joinRoom', order._id);
    });

    socket.on('cancelOrder', ({ orderId, status }) => {
      setOrders((prevOrders) => {
        const updated = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        );

        const updatedOrder = updated.find(order => order._id === orderId);
        if (updatedOrder) {
          toast.error(`Đơn hàng đã bị hủy: ${updatedOrder.order_code}`);
        }

        return updated;
      });
    });


    return () => {
      orders.forEach((order) => {
        socket.emit('leaveRoom', order._id);
      });
      socket.off('cancelOrder');
    };
  }, [orders]);
  useEffect(() => {
    // Tham gia phòng admin để nhận đơn mới
    socket.emit("joinRoom", "user");

    // Nhận đơn hàng mới
    socket.on("newOrder", ({ orders: newOrder }) => {
      setOrders((prev) => [newOrder, ...prev]); // thêm vào đầu danh sách
      toast.success(" Có đơn hàng mới!");
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusInVietnamese = (status: string) => {
    const statusMap: {
      [key: string]: { label: string; color: string; icon: React.ReactNode };
    } = {
      pending: {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-3 h-3" />,
      },
      confirmed: {
        label: 'Đã xác nhận',
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      processing: {
        label: 'Đang xử lý',
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="w-3 h-3" />,
      },
      shipped: {
        label: 'Đang giao hàng',
        color: 'bg-purple-100 text-purple-800',
        icon: <Truck className="w-3 h-3" />,
      },
      delivered: {
        label: 'Đã giao hàng',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      completed: {
        label: 'Hoàn thành',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-3 h-3" />,
      },
      refunded: {
        label: 'Đã hoàn tiền',
        color: 'bg-gray-100 text-gray-800',
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    return (
      statusMap[status.toLowerCase()] || {
        label: 'Hoàn thành',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />,
      }
    );
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Tiền mặt';
      case 'momo':
        return 'Ví MoMo';
      case 'vnpay':
        return 'Ví VNPAY';
      default:
        return 'Không xác định';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600">Theo dõi tất cả các đơn hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-4">
              Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {orders.length} đơn hàng
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tổng chi tiêu: {formatCurrency(
                        orders.reduce(
                          (total, order) => total + order.finalAmount,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order, index) => {
                const statusInfo = getStatusInVietnamese(order.status);
                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.order_code}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.receiverName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {getPaymentMethodText(order.paymentMethod)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.orderItems.length} sản phẩm
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(order.finalAmount)}
                        </p>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
