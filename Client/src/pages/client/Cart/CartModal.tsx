import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  addToCart,
  reduceFormCart,
  deleteFormCart,
} from "../../../redux/features/cartSlice";
import { useNavigate } from "react-router-dom";
import ico_trash from "../../../assets/images/ico_trash.png";
import { X } from "lucide-react";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(
    (state: RootState) => state.cartSlice.cartItems
  );

  if (!open) return null;

  const handleGoToCart = () => {
    navigate("/shopping-cart");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-[400px] bg-white h-full p-6 relative overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm nào...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b pb-4"
              >
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    ${item.price} x {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => dispatch(reduceFormCart(item))}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(addToCart(item))}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => dispatch(deleteFormCart(item.id))}
                      className="ml-auto"
                    >
                      <img src={ico_trash} className="w-4" alt="delete" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button
                onClick={handleGoToCart}
                className="w-full py-2 bg-black text-white rounded-lg"
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
