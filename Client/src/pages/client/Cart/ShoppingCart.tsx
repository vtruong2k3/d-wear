
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  deleteFormCart,
  reduceFormCart,
} from "../../../redux/features/client/cartSlice";
import useAuth from "../../../hooks/Client/useAuth";
import type { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cartSlice);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const selectedTotal = useMemo(() => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems, selectedItems]);

  const handleAddToCart = (cart: CartItem) => {
    dispatch(addToCart({ ...cart, quantity: cart.quantity + 1 }));
    toast.success("Tăng số lượng thành công");
  };

  const handleReduceFormCart = (cart: CartItem) => {
    if (cart.quantity <= 1) {
      toast.warning("Không thể giảm tiếp số lượng!");
      return;
    }
    dispatch(reduceFormCart(cart));
    toast.success("Giảm số lượng thành công");
  };

  const handleDeleteCart = (id: number) => {
    dispatch(deleteFormCart(id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    toast.success("Xóa thành công");
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600 text-center">
            {cartItems.length > 0 ? `${cartItems.length} sản phẩm trong giỏ hàng` : "Giỏ hàng trống"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2-2m2 2l2-2M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Product List */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Select All Header */}
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

                {/* Product Items */}
                <div className="divide-y divide-gray-200">
                  {cartItems.map(cart => (
                    <div
                      key={cart.id}
                      className={`p-6 transition-all duration-200 ${selectedItems.includes(cart.id)
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(cart.id)}
                          onChange={() => handleSelectItem(cart.id)}
                          className="w-5 h-5  text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />

                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 ml-5 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={cart.thumbnail}
                              alt={cart.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {cart.title}
                          </h3>
                          <p className="text-xl font-bold text-blue-600">
                            ${cart.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleReduceFormCart(cart)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right ">
                          <div className="m-0 text-xl font-bold text-gray-900">
                            ${(cart.price * cart.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCart(cart.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Tổng đơn hàng
                  </h2>

                  {/* Free Shipping Banner */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        Miễn phí vận chuyển cho đơn hàng trên 100.000đ
                      </span>
                    </div>
                    <div className="mt-2 bg-green-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: selectedTotal >= 100 ? '100%' : `${(selectedTotal / 100) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Sản phẩm đã chọn:</span>
                      <span className="font-medium">{selectedItems.length}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span className="font-medium">${selectedTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="font-medium">
                        {selectedTotal >= 100 ? "Miễn phí" : "$10.00"}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${(selectedTotal + (selectedTotal >= 100 ? 0 : 10)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${selectedItems.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:opacity-80 active:scale-95"
                      }`}
                  >
                    {selectedItems.length === 0
                      ? "Chọn sản phẩm để thanh toán"
                      : "Thanh toán ngay"}
                  </button>



                  <p className="text-sm text-gray-500 text-center mt-4">
                    Bảo mật thanh toán 100% với SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {cartItems.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ghi chú đặc biệt cho người bán
            </h3>
            <textarea
              placeholder="Có điều gì đặc biệt bạn muốn chúng tôi biết về đơn hàng này?"
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;