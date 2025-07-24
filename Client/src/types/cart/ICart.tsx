export interface AddToCartPayload {

    product_id: string;
    variant_id: string;
    quantity: number;

}
// interface Product {
//     _id: string;
//     product_name: string;
//     imageUrls: string[];
// }
// interface Variant {
//     _id: string;
//     size: string;
//     color: string;
// }

// types/cart/ICartItem.ts
export interface ICartItem {
    _id: string;
    user_id?: string;
    product_id: string;
    product_image: string;
    product_name: string;
    variant_id: string;
    size: string;
    color: string;
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
export interface UpdateCartPayload {
    variant_id: string;
    quantity: number;
}
