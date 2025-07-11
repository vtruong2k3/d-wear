import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetail } from "../../../services/client/orderAPI";

interface OrderItem {
  productId: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
}

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetail(orderId as string);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chi tiết đơn hàng
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Chi tiết đơn hàng
          </h1>
          <p className="text-gray-700">
            <span className="font-medium">Mã đơn hàng:</span> {order._id}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Ngày đặt:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Tổng tiền:</span>{" "}
            {order.totalPrice.toLocaleString()} VND
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Sản phẩm trong đơn hàng
        </h2>
        <ul className="space-y-4">
          {order.items.map((item, index) => (
            <li
              key={index}
              className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="text-gray-700">
                <span className="font-medium">Sản phẩm:</span>{" "}
                {item.productId.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Số lượng:</span> {item.quantity}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Giá:</span>{" "}
                {item.price.toLocaleString()} VND
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center">
          <Link
            to="/orders"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            ← Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
