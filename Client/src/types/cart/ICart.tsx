export interface AddToCartPayload {

    product_id: string;
    variant_id: string;
    quantity: number;

}
interface Product {
    _id: string;
    product_name: string;
    imageUrls: string[];
}
interface Variant {
    _id: string;
    size: string;
    color: string;
}

// types/cart/ICartItem.ts
export interface ICartItem {
    _id: string;
    user_id: string;
    product_id: Product
    variant_id: Variant
    quantity: number;
    price: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}
export interface GetCartResponse {
    carts: ICartItem[];        // Danh sách các sản phẩm trong giỏ
    totalAmount: number;       // Tổng tiền giỏ hàng
}
