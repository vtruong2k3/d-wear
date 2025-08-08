import type { UserType } from "../IUser";


export interface IOrder {
    _id: string;
    order_code: string;
    user_id: string;

    orderItems: string[]; // danh sách id của OrderItem
    createdAt: string; // ISO date string
    updatedAt: string;
    shippingFee: number; // Phí vận chuyển
    receiverName: string;
    shippingAddress: string;
    phone: string;
    note?: string;
    email?: string; // Thêm trường email nếu cần
    paymentMethod: 'cod' | 'vnpay' | 'banking'; // hoặc bạn mở rộng thêm
    paymentStatus: 'paid' | 'unpaid';

    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // tùy logic

    total: number;        // Tổng giá trước giảm giá
    discount: number;     // Giảm giá
    finalAmount: number;  // Tổng giá sau giảm giá
    cancellationReason?: string; // Lý do hủy đơn hàng, nếu có
    voucher_id?: string;
}

export interface Product {
    _id: string;
    product_name: string;
    imageUrls: string[];
}

export interface Variant {
    _id: string;
    size: string;
    color: string;
}

export interface OrderItem {
    _id: string;
    order_id: string;
    product_id: Product;
    product_image: string;
    product_name: string;
    variant_id: Variant;
    quantity: number;
    size: string;
    color: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}


export interface OrderDetailResponse {
    message: string
    order: IOrder;
    orderItems: OrderItem[];
    user: UserType
}

export interface OrderItems {
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
}

export interface OrderData {
    user_id: string;
    email: string;
    receiverName: string;
    shippingAddress: string;
    phone: string;
    shippingFee: number;
    paymentMethod: "cod" | "momo" | "vnpay";
    voucher_id: string | null;
    items: OrderItems[];
    note: string;
}

export interface checkOrderReviewType {
    canReview: boolean,
    order_id: string | undefined
}

export interface GetOrdersResponse {
    message: string;
    orders: IOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
