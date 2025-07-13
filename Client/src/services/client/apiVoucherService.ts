import axios from "axios";
import type { CheckVoucherPayload } from "../../types/voucher/IVoucher";

export const fetCheckVoucher = async ({
  code,
  total,
  user_id,
}: CheckVoucherPayload) => {
  const res = await axios.post("/api/voucher/check", {
    code,
    total,
    user_id,
  });
  return res;
};
