// Dữ liệu thống kê theo ngày (30 ngày gần nhất)
export const allDailyData = [
  {
    date: "2024-07-01",
    displayDate: "01/07",
    revenue: 45000000,
    orders: 23,
    customers: 15,
  },
  {
    date: "2024-07-02",
    displayDate: "02/07",
    revenue: 52000000,
    orders: 28,
    customers: 18,
  },
  {
    date: "2024-07-03",
    displayDate: "03/07",
    revenue: 48000000,
    orders: 25,
    customers: 16,
  },
  {
    date: "2024-07-04",
    displayDate: "04/07",
    revenue: 61000000,
    orders: 32,
    customers: 22,
  },
  {
    date: "2024-07-05",
    displayDate: "05/07",
    revenue: 55000000,
    orders: 29,
    customers: 19,
  },
  {
    date: "2024-07-06",
    displayDate: "06/07",
    revenue: 67000000,
    orders: 35,
    customers: 25,
  },
  {
    date: "2024-07-07",
    displayDate: "07/07",
    revenue: 58000000,
    orders: 31,
    customers: 21,
  },
  {
    date: "2024-07-08",
    displayDate: "08/07",
    revenue: 72000000,
    orders: 38,
    customers: 28,
  },
  {
    date: "2024-07-09",
    displayDate: "09/07",
    revenue: 69000000,
    orders: 36,
    customers: 26,
  },
  {
    date: "2024-07-10",
    displayDate: "10/07",
    revenue: 63000000,
    orders: 33,
    customers: 23,
  },
  {
    date: "2024-07-11",
    displayDate: "11/07",
    revenue: 75000000,
    orders: 41,
    customers: 30,
  },
  {
    date: "2024-07-12",
    displayDate: "12/07",
    revenue: 81000000,
    orders: 43,
    customers: 32,
  },
  {
    date: "2024-07-13",
    displayDate: "13/07",
    revenue: 78000000,
    orders: 42,
    customers: 31,
  },
  {
    date: "2024-07-14",
    displayDate: "14/07",
    revenue: 85000000,
    orders: 46,
    customers: 35,
  },
  {
    date: "2024-07-15",
    displayDate: "15/07",
    revenue: 92000000,
    orders: 48,
    customers: 38,
  },
  {
    date: "2024-07-16",
    displayDate: "16/07",
    revenue: 88000000,
    orders: 45,
    customers: 36,
  },
  {
    date: "2024-07-17",
    displayDate: "17/07",
    revenue: 94000000,
    orders: 51,
    customers: 41,
  },
  {
    date: "2024-07-18",
    displayDate: "18/07",
    revenue: 87000000,
    orders: 44,
    customers: 37,
  },
  {
    date: "2024-07-19",
    displayDate: "19/07",
    revenue: 91000000,
    orders: 49,
    customers: 39,
  },
  {
    date: "2024-07-20",
    displayDate: "20/07",
    revenue: 96000000,
    orders: 52,
    customers: 42,
  },
  {
    date: "2024-07-21",
    displayDate: "21/07",
    revenue: 96000000,
    orders: 52,
    customers: 42,
  },
];

// Tất cả đơn hàng mẫu
export const allOrders = [
  {
    key: "1",
    orderId: "#ORD-001",
    customer: "Nguyễn Văn A",
    product: "iPhone 15 Pro Max",
    amount: 29990000,
    status: "pending",
    date: "2024-07-20",
    displayDate: "20/07/2024",
  },
  {
    key: "2",
    orderId: "#ORD-002",
    customer: "Trần Thị B",
    product: "MacBook Air M2",
    amount: 24990000,
    status: "shipped",
    date: "2024-07-20",
    displayDate: "20/07/2024",
  },
  {
    key: "3",
    orderId: "#ORD-003",
    customer: "Lê Văn C",
    product: "iPad Pro",
    amount: 19990000,
    status: "delivered",
    date: "2024-07-19",
    displayDate: "19/07/2024",
  },
  {
    key: "4",
    orderId: "#ORD-004",
    customer: "Phạm Thị D",
    product: "AirPods Pro",
    amount: 5990000,
    status: "pending",
    date: "2024-07-19",
    displayDate: "19/07/2024",
  },
  {
    key: "5",
    orderId: "#ORD-005",
    customer: "Hoàng Văn E",
    product: "Apple Watch Series 9",
    amount: 8990000,
    status: "shipped",
    date: "2024-07-18",
    displayDate: "18/07/2024",
  },
  {
    key: "6",
    orderId: "#ORD-006",
    customer: "Võ Thị F",
    product: "Samsung Galaxy S24",
    amount: 21490000,
    status: "delivered",
    date: "2024-07-18",
    displayDate: "18/07/2024",
  },
  {
    key: "7",
    orderId: "#ORD-007",
    customer: "Đặng Văn G",
    product: "Dell XPS 13",
    amount: 32990000,
    status: "pending",
    date: "2024-07-17",
    displayDate: "17/07/2024",
  },
  {
    key: "8",
    orderId: "#ORD-008",
    customer: "Bùi Thị H",
    product: "Sony WH-1000XM5",
    amount: 7990000,
    status: "shipped",
    date: "2024-07-17",
    displayDate: "17/07/2024",
  },
];

// Top sản phẩm bán chạy
export const topProducts = [
  {
    key: "1",
    name: "iPhone 15 Pro Max",
    category: "Điện thoại",
    sold: 45,
    revenue: 1349550000,
    image: "📱",
    growth: 23.5,
  },
  {
    key: "2",
    name: "MacBook Air M2",
    category: "Laptop",
    sold: 28,
    revenue: 699720000,
    image: "💻",
    growth: 18.2,
  },
  {
    key: "3",
    name: "iPad Pro 11 inch",
    category: "Máy tính bảng",
    sold: 32,
    revenue: 639680000,
    image: "📟",
    growth: 15.8,
  },
  {
    key: "4",
    name: "AirPods Pro 2",
    category: "Phụ kiện",
    sold: 67,
    revenue: 401330000,
    image: "🎧",
    growth: 31.2,
  },
  {
    key: "5",
    name: "Apple Watch Series 9",
    category: "Đồng hồ thông minh",
    sold: 24,
    revenue: 215760000,
    image: "⌚",
    growth: 12.7,
  },
  {
    key: "6",
    name: "Samsung Galaxy S24",
    category: "Điện thoại",
    sold: 19,
    revenue: 408100000,
    image: "📱",
    growth: 9.4,
  },
];

// Cấu hình trạng thái đơn hàng
export const statusConfig = {
  pending: { color: "orange", text: "Chờ xử lý" },
  shipped: { color: "blue", text: "Đang giao" },
  delivered: { color: "green", text: "Đã giao" },
};
