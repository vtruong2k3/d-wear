import React from "react";
import ico_trash from "../../../assets/images/ico_trash.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  deleteFormCart,
  reduceFormCart,
} from "../../../redux/features/cartSlice";
import useAuth from "../../../hooks/Client/useAuth";
import type { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

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

  const handleAddToCart = (cart: CartItem) => {
    dispatch(
      addToCart({
        ...cart,
        quantity: cart.quantity + 1,
      })
    );
    toast.success(`Tăng số lượng thành công`);
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
    toast.success("Xóa thành công");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div>
      <section className="pt-20">
        <h2 className="text-3xl font-semibold text-center">Shopping Cart</h2>
        <div className="container mt-10">
          <div className="grid grid-cols-6 gap-8">
            <div className="col-span-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left border-b">
                    <th className="p-4 text-sm text-gray-600">Product</th>
                    <th className="p-4 text-sm text-gray-600 text-center">
                      Quantity
                    </th>
                    <th className="p-4 text-sm text-gray-600">Total</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-10 text-gray-500 text-lg"
                      >
                        Giỏ hàng của bạn đang trống
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((cart) => (
                      <tr
                        key={cart.id}
                        className="border-b hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 border rounded overflow-hidden">
                              <img
                                src={cart.thumbnail}
                                alt={cart.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                {cart.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                Giá: ${cart.price}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center relative">
                            <button
                              onClick={() => handleReduceFormCart(cart)}
                              className="text-lg px-3 py-1 border rounded-full text-gray-700 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="mx-3 text-sm">
                              {cart.quantity}
                            </span>
                            <button
                              onClick={() => handleAddToCart(cart)}
                              className="text-lg px-3 py-1 border rounded-full text-gray-700 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-700">
                          ${cart.price * cart.quantity}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteCart(cart.id)}
                            className="hover:opacity-70"
                          >
                            <img
                              className="w-5 h-5"
                              src={ico_trash}
                              alt="Xóa"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="mt-9">
                <p className="text-md font-medium">
                  Special instructions for seller
                </p>
                <textarea
                  placeholder="How can we help you?"
                  className="text-md mt-3 border border-gray-300 p-4 w-full rounded-md resize-none"
                  rows={5}
                ></textarea>
              </div>
            </div>

            <div className="col-span-2">
              <div className="p-7 bg-[#f7f4ef] rounded-lg">
                <h3 className="uppercase font-medium text-sm">
                  FREE SHIPPING ON ORDERS $100.00
                </h3>
                <p className="text-sm mt-2">
                  Congratulations, you've got free shipping!
                </p>
                <p className="bg-[#14c100] w-full h-1 mt-5 rounded-full"></p>
              </div>

              <div className="p-6 mt-4 bg-[#f6f6f6] rounded-lg">
                <span className="text-sm font-medium">Coupon</span>
                <p className="mt-2 mb-6 text-sm text-gray-500">
                  * Discount will be calculated and applied at checkout
                </p>
                <input
                  type="text"
                  className="h-10 px-4 text-sm border border-gray-300 rounded-md w-full"
                  placeholder="Coupon code"
                />
                <p className="mt-6 font-semibold text-base">
                  Total: ${" "}
                  {cartItems.reduce(
                    (sum, current) => sum + current.price * current.quantity,
                    0
                  )}
                </p>

                <button
                  onClick={handleCheckout}
                  className="h-[50px] mt-6 bg-black w-full text-white font-semibold text-sm rounded-full hover:bg-white border hover:border-black hover:text-black transition-all"
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingCart;
