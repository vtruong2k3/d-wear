import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";

import { toast } from "react-toastify";
import useAuth from "../../../hooks/Client/useAuth";
import { useNavigate } from "react-router-dom";
import { getCartThunk } from "../../../redux/features/client/thunks/cartThunk";
import { formatCurrency } from "../../../utils/Format";


interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

const ShoppingCart = () => {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { cartItems } = useSelector((state: RootState) => state.cartSlice);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch])
  const selectedTotal = useMemo(() => {
    console.log(cartItems)
    return cartItems
      .filter((item) => selectedItems.includes(item._id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems, selectedItems]);

  // const handleAddToCart = (cart: CartItem) => {
  //   dispatch(addToCartThunk({ ...cart, quantity: cart.quantity + 1 }));
  //   toast.success("Tăng số lượng thành công");
  // };

  const handleReduceFormCart = (cart: CartItem) => {
    if (cart.quantity <= 1) {
      toast.warning("Không thể giảm tiếp số lượng!");
      return;
    }
    // dispatch(reduceFormCart(cart));
    toast.success("Giảm số lượng thành công");
  };

  const handleDeleteCart = (id: number) => {
    // dispatch(deleteFormCart(id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    toast.success("Xóa thành công");
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
    } else {
      navigate("/checkout", { state: { selectedItems } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600 text-center">
            {cartItems.length > 0
              ? `${cartItems.length} sản phẩm trong giỏ hàng`
              : "Giỏ hàng trống"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Quay lại trang chủ
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Chọn tất cả ({cartItems.length} sản phẩm)
                    </span>
                  </label>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((cart) => (
                    <div
                      key={cart._id}
                      className={`p-6 transition-all duration-200 ${selectedItems.includes(cart.id)
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(cart._id)}
                          onChange={() => handleSelectItem(cart._id)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />

                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 ml-5 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={
                                cart.product_id.imageUrls && cart.product_id.imageUrls.length > 0
                                  ? cart.product_id.imageUrls[0].startsWith("http")
                                    ? cart.product_id.imageUrls[0]
                                    : `http://localhost:5000/${cart.product_id.imageUrls[0].replace(/\\/g, "/")}`
                                  : "/default.png"
                              }
                              alt={cart.product_id.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {cart.product_id.product_name}
                          </h3>
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(cart.price)}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleReduceFormCart(cart)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 ml-3 text-center font-semibold text-gray-900">
                            {cart.quantity}
                          </span>
                          <button
                            onClick={() => handleAddToCart(cart)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="text-right ">
                          <div className="m-0 text-xl font-bold text-gray-900">
                            {formatCurrency(cart.price * cart.quantity)}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteCart(cart._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng đơn hàng</h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        Miễn phí vận chuyển cho đơn hàng trên 100.000đ
                      </span>
                    </div>
                    <div className="mt-2 bg-green-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (selectedTotal / 100) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Sản phẩm đã chọn</span>
                      <span>{selectedItems.length} sản phẩm</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Tạm tính</span>
                      <span>${selectedTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Phí vận chuyển</span>
                      <span>
                        {selectedTotal >= 100 ? (
                          <span className="text-green-600 font-semibold">Miễn phí</span>
                        ) : (
                          "$10.00"
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-xl">
                      <span>Tổng cộng</span>
                      <span>

                        {formatCurrency((
                          selectedTotal +
                          (selectedTotal >= 100 ? 0 : 10)
                        ))}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full mt-6 py-3 rounded-lg text-white font-semibold ${selectedItems.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-black hover:bg-gray-900"
                      } transition-colors`}
                  >
                    {selectedItems.length === 0
                      ? "Chọn sản phẩm để thanh toán"
                      : "Thanh toán ngay"}
                  </button>

                  <p className="mt-3 text-center text-gray-400 text-xs">
                    Bảo mật thanh toán 100% với SSL
                  </p>
                </div>
              </div>

              {/* Ghi chú đơn hàng */}
              <div className="mt-6">
                <label
                  htmlFor="order-note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú cho người bán (tuỳ chọn)
                </label>
                <textarea
                  id="order-note"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Nhập ghi chú đặc biệt cho đơn hàng..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
