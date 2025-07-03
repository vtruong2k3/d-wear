import axios from "axios";
import {
  type IVoucher,
  type CreateVoucherResponse,
  type VoucherResponse,
} from "../types/voucher/IVoucher";

export const fetchGetAllVouchers = async (
  page = 1,
  limit = 10
): Promise<VoucherResponse> => {
  const res = await axios.get<VoucherResponse>("/api/voucher", {
    params: { page, limit },
  });
  return res.data;
};

export const fetchCreateVoucher = async (
  data: Omit<IVoucher, "_id" | "createdAt" | "updatedAt">
): Promise<CreateVoucherResponse> => {
  try {
    const response = await axios.post<CreateVoucherResponse>(
      "/api/voucher",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo voucher:", error);
    throw new Error("Không thể tạo voucher");
  }
};

export const fetchUpdateVoucher = async (
  id: string,
  payload: Omit<IVoucher, "_id" | "createdAt" | "updatedAt">
): Promise<CreateVoucherResponse> => {
  const response = await axios.put<CreateVoucherResponse>(
    `/api/voucher/${id}`,
    payload
  );
  return response.data;
};

export const fetchDeleteVoucher = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axios.delete(`/api/voucher/${id}`);
  return res.data;
};
