import axios from "axios";

export const initiateMomoPayment = async (
  finalAmount: number,
  order_id: string | undefined
) => {
  const res = await axios.post("/api/momo/create-payment", {
    finalAmount,
    order_id,
  });
  return res.data;
};
