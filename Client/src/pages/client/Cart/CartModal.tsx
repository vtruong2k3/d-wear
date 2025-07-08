import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  addToCart,
  reduceFormCart,
  deleteFormCart,
} from "../../../redux/features/client/cartSlice";
import { useNavigate } from "react-router-dom";
import ico_trash from "../../../assets/images/ico_trash.png";
import { X, ShoppingCart } from "lucide-react";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const cartItems = useSelector(
    (state: RootState) => state.cartSlice.cartItems
  );

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Delay để trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Đợi animation kết thúc rồi mới unmount
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleGoToCart = () => {
    navigate("/shopping-cart");
    handleClose();
  };

  const handleCheckout = () => {
    navigate("/checkout");
    handleClose();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${isVisible ? 'bg-black/50' : 'bg-black/0'
        }`}
      onClick={handleClose}
    >
      <div
        className={`w-[360px] bg-white h-full p-6 relative overflow-y-auto transform transition-transform duration-300 ease-out shadow-2xl rounded-l-2xl ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute right-4 top-4 hover:bg-gray-100 rounded-full p-1 transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Giỏ hàng</h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <ShoppingCart size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">
              Chưa có sản phẩm nào trong giỏ hàng
            </p>
            <p className="text-gray-400 text-sm text-center mt-2">
              Hãy thêm sản phẩm để bắt đầu mua sắm
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b pb-4 mb-4"
                >
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      ${item.price} x {item.quantity}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(reduceFormCart(item))}
                        className="px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(addToCart(item))}
                        className="px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch(deleteFormCart(item.id))}
                        className="ml-auto hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <img src={ico_trash} className="w-4" alt="delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phần tổng tiền và nút action */}
            <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-lg font-bold text-red-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Thanh toán
                </button>
                <button
                  onClick={handleGoToCart}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Xem giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;