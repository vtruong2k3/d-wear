import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";

import useAuth from "../../../hooks/Client/useAuth";
import { useNavigate } from "react-router-dom";
import { deleteCartItemThunk, updateCartQuantityThunk } from "../../../redux/features/client/thunks/cartThunk";
import { formatCurrency } from "../../../utils/Format";
import type { ICartItem } from "../../../types/cart/ICart";
import toast from "react-hot-toast";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { cartItems } = useSelector((state: RootState) => state.cartSlice);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();


  const selectedTotal = useMemo(() => {
    return cartItems
      .filter((item: ICartItem) => item._id && selectedItems.includes(item._id))
      .reduce((sum, item) => {
        const price = Number(item.price);
        const qty = Number(item.quantity);
        return sum + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
      }, 0);
  }, [cartItems, selectedItems]);

  const handleAddToCart = (cartItems: ICartItem) => {

    dispatch(updateCartQuantityThunk({
      product_id: cartItems.product_id,
      variant_id: cartItems.variant_id,
      quantity: cartItems.quantity + 1
    }))
      .unwrap()
      .catch(() => {
        toast.error("Tăng số lượng thất bại");
      });
  };

  const handleReduceFormCart = (cartItems: ICartItem) => {
    dispatch(updateCartQuantityThunk({
      product_id: cartItems.product_id,
      variant_id: cartItems.variant_id,
      quantity: cartItems.quantity - 1
    }))
      .unwrap()
      .catch(() => {
        toast.error("Giảm số lượng thất bại");
      });
  };

  const handleSelectItem = (id: string) => {
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

  const handleDeleteCart = (cartId: string) => {
    dispatch(deleteCartItemThunk(cartId));
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
    } else {
      navigate("/checkout", { state: { selectedItems } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
            <div className="text-6xl mb-6 opacity-30">🛍️</div>
            <p className="text-xl font-medium text-gray-500">Giỏ hàng của bạn đang trống.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-900 shadow-lg transition-all active:scale-95"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900 cursor-pointer accent-black"
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
                      className={`p-6 transition-all duration-200 ${selectedItems.includes(cart._id)
                        ? "bg-gray-50 border-l-[3px] border-black"
                        : "hover:bg-gray-50/50"
                        }`}
                    >
                      <div className="flex items-start  space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(cart._id)}
                          onChange={() => handleSelectItem(cart._id)}
                          className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900 mt-1 cursor-pointer accent-black"
                        />

                        <div className="flex-shrink-0 ml-3">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={
                                cart.product_image && cart.product_image.length > 0
                                  ? cart.product_image.startsWith("http")
                                    ? cart.product_image
                                    : `http://localhost:5000/${cart.product_image.replace(/\\/g, "/")}`
                                  : "/default.png"
                              }
                              alt={cart.product_name}
                              className="w-full h-full object-contain "
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 pr-4">
                              {cart.product_name}
                            </h3>
                            <button
                              onClick={() => handleDeleteCart(cart._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Xóa sản phẩm"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Hiển thị size và màu */}
                          <div className="flex items-center space-x-4 mb-3">
                            {cart.size && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Size:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {cart.size}
                                </span>
                              </div>
                            )}
                            {cart.color && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Màu:</span>
                                <div className="flex items-center space-x-1.5">
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: cart.color }}
                                  ></div>
                                  <span className="text-sm font-semibold text-gray-900">{cart.color}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            <p className="text-xl font-bold text-red-600">{formatCurrency(cart.price)}</p>

                            {/* Nút điều khiển số lượng */}
                            <div className="flex items-center border border-gray-300 rounded-lg bg-white h-10 overflow-hidden">
                              <button
                                onClick={() => handleReduceFormCart(cart)}
                                disabled={cart.quantity <= 1}
                                className={`flex items-center justify-center w-10 h-full transition-colors ${cart.quantity <= 1
                                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                  : "hover:bg-gray-100 text-gray-600"
                                  }`}
                              >
                                <span className="text-lg font-medium">-</span>
                              </button>
                              <div className="flex items-center justify-center w-12 h-full text-base font-bold text-gray-900 border-x border-gray-200">
                                {cart.quantity}
                              </div>
                              <button
                                onClick={() => handleAddToCart(cart)}
                                className="flex items-center justify-center w-10 h-full hover:bg-gray-100 text-gray-600 transition-colors"
                              >
                                <span className="text-lg font-medium">+</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-sm sticky top-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng đơn hàng</h2>

                  {/* <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                  </div> */}

                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Sản phẩm đã chọn</span>
                      <span>{selectedItems.length} sản phẩm</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(selectedTotal)}</span>
                    </div>
                    {/* <div className="flex justify-between text-gray-600 text-sm">
                      <span>Phí vận chuyển</span>
                      <span>
                        {selectedTotal >= 100 ? (
                          <span className="text-green-600 font-semibold">Miễn phí</span>
                        ) : (
                          "30.000đ"
                        )}
                      </span>
                    </div> */}
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-xl">
                      <span>Tổng cộng</span>
                      <span className="text-red-600">
                        {formatCurrency((
                          selectedTotal === 0 ? 0 : selectedTotal + (selectedTotal >= 100 ? 0 : 10)
                        ))}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full h-16 mt-6 py-3 rounded-lg text-white font-semibold ${selectedItems.length === 0
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;