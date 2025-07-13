export interface IOrder {
    _id: string;
    order_code: string;
    user_id: string;

    orderItems: string[]; // danh sách id của OrderItem
    createdAt: string; // ISO date string
    updatedAt: string;

    receiverName: string;
    shippingAddress: string;
    phone: string;
    note?: string;

    paymentMethod: 'cod' | 'vnpay' | 'banking'; // hoặc bạn mở rộng thêm
    paymentStatus: 'paid' | 'unpaid';

    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // tùy logic

    total: number;        // Tổng giá trước giảm giá
    discount: number;     // Giảm giá
    finalAmount: number;  // Tổng giá sau giảm giá

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
    variant_id: Variant;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}


export interface OrderDetailResponse {
    message: string
    order: IOrder;
    orderItems: OrderItem[];
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
    paymentMethod: "cod" | "momo" | "vnpay";
    voucher_id: string | null;
    items: OrderItems[];
    note: string;
}


export interface GetOrdersResponse {
    orders: IOrder[];
}
