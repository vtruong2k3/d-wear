// Thống kê tổng quan hôm nay (/api/statistics/summary)
export interface SummaryResponse {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    shippingOrders: number;
}

// Một dòng thống kê theo ngày (/api/statistics/daily hoặc /filter)
export interface DailyStatItem {
    date: string;
    displayDate: string;
    revenue: number;
    orders: number;
    customers: number;
}

// Danh sách dữ liệu theo ngày
export type DailyDataResponse = DailyStatItem[];

// Đơn hàng mới nhất (/api/statistics/new-orders hoặc trong /filter)
export interface OrderItem {
    orderId: string;
    customer: string;
    phone?: string;
    amount: number;
    status: string;
    date: string;
    displayDate: string;
}

// Danh sách đơn hàng
export type LatestOrdersResponse = OrderItem[];

// Trạng thái đơn hàng (/api/statistics/order-status)
export interface OrderStatusStat {
    name: string;   // e.g., "pending", "shipped", "delivered"
    value: number;
}
export type OrderStatusResponse = OrderStatusStat[];

// Sản phẩm bán chạy (/api/statistics/top-products)
export interface TopProduct {
    name: string;
    image: string;
    sold: number;
    revenue: number;
    growth: string | number; // e.g., "23.5"
}
export type TopProductsResponse = TopProduct[];

// Kết quả lọc theo khoảng ngày (/api/statistics/filter)
export interface FilterByDateResponse {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    shippingOrders: number;
    dailyData: DailyStatItem[];
    orders: OrderItem[];
}

// Tổng quan
export interface SummaryData {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    shippingOrders: number;
}

// Dữ liệu mỗi ngày
export interface DailyStat {
    date: string;
    displayDate: string;
    revenue: number;
    orders: number;
    customers: number;
}

// Đơn hàng
export interface OrderStat {
    orderId: string;
    customer: string;
    phone?: string;
    amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    displayDate: string;
}

// Top sản phẩm
export interface TopProduct {
    name: string;
    image: string;
    sold: number;
    revenue: number;
    growth: number | string;
}

// Dữ liệu sau khi lọc
export interface FilteredStatistics {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    shippingOrders: number;
    dailyData: DailyStat[];
    orders: OrderStat[];
}
export interface StatCardProps {
    title?: string;
    value: number | string;
    prefix?: string;
    precision?: number;
    trend: 'up' | 'down';
    trendValue: number;
    icon: React.ReactNode;
}