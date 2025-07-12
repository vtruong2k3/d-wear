// types/voucher.ts

export type DiscountType = "percentage" | "fixed";

export type IVoucher = {
    _id?: string; // nếu từ MongoDB
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue: number;
    maxDiscountValue: number;
    maxUser: number;
    startDate: string; // ISO string (VD: '2024-06-30')
    endDate: string;
    isActive: boolean;
}
export type Vouchers = {
    vouchers: IVoucher[];
}
export interface CreateVoucherResponse {
    message: string;
    voucher: IVoucher;
}
export interface VoucherResponse {
    message: string;
    vouchers: IVoucher[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface CheckVoucherPayload {
    code: string;
    total: number;
    user_id: string | undefined;

}