// types/voucher.ts

export type DiscountType = "percentage" | "fixed";

export type IVoucher = {
    _id?: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue: number;
    maxDiscountValue: number;
    maxUser: number;
    usedUsers?: string[];
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
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

export interface VoucherStats {
    total: number;
    active: number;
    inactive: number;
    expired: number;
    expiringSoon: number;
}

export interface CheckVoucherPayload {
    code: string;
    total: number;
    user_id: string | undefined;
}