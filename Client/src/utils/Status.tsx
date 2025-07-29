export const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
        pending: "Chờ xử lý",
        processing: "Đang xử lý",
        shipped: "Đã giao hàng",
        delivered: "Đã giao",
        cancelled: "Đã hủy"
    };
    return statusLabels[status] || status;
};
export const getPaymentStatusLabel = (paymentStatus: string) => {
    const paymentStatusLabels: Record<string, string> = {
        unpaid: "Chưa thanh toán",
        paid: "Đã thanh toán",
        refunded: "Đã hoàn tiền"
    };
    return paymentStatusLabels[paymentStatus] || paymentStatus;
};
export const paymentColor: Record<string, string> = {
    unpaid: "volcano",    // Đỏ
    paid: "green",         // Xanh lá
    refunded: "geekblue",  // Xanh dương nhạt
};

export const getPaymentMethodLabel = (method: string) => {
    const methodLabels: Record<string, string> = {
        cod: "Thanh toán khi nhận hàng",
        momo: "Ví MoMo",
    };
    return methodLabels[method] || method;
};

export const paymentMethodColor: Record<string, string> = {
    cod: "cyan",
    momo: "purple",
};