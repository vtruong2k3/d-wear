import React, { useEffect, useState } from "react";
import { getOrders } from "../../../services/client/orderAPI";
import { Link } from "react-router-dom";

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lịch sử đơn hàng
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Mã đơn hàng:</span>{" "}
                    {order._id}
                  </p>
                  <p>
                    <span className="font-semibold">Ngày đặt:</span>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Tổng tiền:</span>{" "}
                    {order.totalPrice.toLocaleString()} VND
                  </p>
                </div>

                <div className="mt-4 text-right">
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
