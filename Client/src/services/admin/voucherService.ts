import axios from "axios";
import {
  type IVoucher,
  type CreateVoucherResponse,
  type VoucherResponse,
  type VoucherStats,
} from "../../types/voucher/IVoucher";

export interface VoucherFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  discountType?: string;
  isActive?: string;
}

export const fetchGetAllVouchers = async (
  params: VoucherFilterParams
): Promise<VoucherResponse> => {
  const res = await axios.get<VoucherResponse>("/api/voucher", { params });
  return res.data;
};

export const fetchVoucherStats = async (): Promise<VoucherStats> => {
  const res = await axios.get<VoucherStats>("/api/voucher/stats");
  return res.data;
};

export const fetchCreateVoucher = async (
  data: Omit<IVoucher, "_id" | "createdAt" | "updatedAt">
): Promise<CreateVoucherResponse> => {
  const response = await axios.post<CreateVoucherResponse>(
    "/api/voucher",
    data
  );
  return response.data;
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
