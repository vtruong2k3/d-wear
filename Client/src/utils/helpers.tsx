// Hàm định dạng tiền tệ
export const formatCurrency = (amount: number) => {
    return `₫${amount.toLocaleString()}`;
};

// Hàm định dạng số ngắn gọn (ví dụ: 1000000 -> 1M)
export const formatShortNumber = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(0)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
};

// Hàm lọc dữ liệu theo khoảng ngày
export const filterDataByDateRange = (data, startDate, endDate, dateField = 'date') => {
    return data.filter(item =>
        item[dateField] >= startDate && item[dateField] <= endDate
    );
};

// Hàm tính tổng doanh thu
export const calculateTotalRevenue = (data) => {
    return data.reduce((sum, item) => sum + (item.revenue || 0), 0);
};

// Hàm tính tổng đơn hàng
export const calculateTotalOrders = (data) => {
    return data.reduce((sum, item) => sum + (item.orders || 0), 0);
};

// Hàm tính tổng khách hàng
export const calculateTotalCustomers = (data) => {
    return data.reduce((sum, item) => sum + (item.customers || 0), 0);
};

// Hàm tạo dữ liệu trạng thái đơn hàng
export const createOrderStatusData = (orders) => {
    const statusCount = { pending: 0, shipped: 0, delivered: 0, cancelled: 0 };

    orders.forEach(order => {
        statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    return [
        { name: 'Chờ xử lý', value: statusCount.pending, color: '#ff9500' },
        { name: 'Đang giao', value: statusCount.shipped, color: '#1890ff' },
        { name: 'Đã giao', value: statusCount.delivered, color: '#52c41a' },
        { name: 'Đã hủy', value: statusCount.cancelled || 2, color: '#f5222d' },
    ];
};

// Hàm kiểm tra xem có dữ liệu không
export const hasData = (data) => {
    return data && Array.isArray(data) && data.length > 0;
};

// Hàm tính phần trăm tăng trưởng
export const calculateGrowthPercentage = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
};

// Hàm sinh màu ngẫu nhiên cho biểu đồ
export const generateRandomColor = () => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Hàm validation ngày tháng
export const isValidDateRange = (startDate, endDate) => {
    return startDate && endDate && startDate <= endDate;
};