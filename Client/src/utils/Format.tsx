export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        currencyDisplay: "symbol", // hiển thị ₫
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};


export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
};