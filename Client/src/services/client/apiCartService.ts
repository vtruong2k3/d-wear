import axios from "axios";
import type { AddToCartPayload, ICartItem } from "../../types/cart/ICart";
interface UpdateQuantityPayload {
  product_id?: string;
  variant_id: string;
  quantity: number;
}

export const deleteProductCart = async (id: string | undefined) => {
  const res = await axios.delete(`/api/cart/items/${id}`);
  return res.data;
};
export const updateCartQuantity = async (payload: UpdateQuantityPayload) => {
  const response = await axios.put("/api/cart/items", payload);
  return response.data; // { message, cart }
};
export const fetchAddToCart = async (data: AddToCartPayload) => {
  const res = await axios.post("/api/cart/items", data);
  return res.data;
};

export const fetchGetCart = async (): Promise<{
  carts: ICartItem[];
  totalAmount: number;
}> => {
  const res = await axios.get("/api/cart");
  return res.data;
};
export const fetchUpdateCartQuantity = async (
  cartId: string,
  quantity: number
) => {
  const res = await axios.put(`/cart/${cartId}`, { quantity });
  return res.data; // { message, data }
};
