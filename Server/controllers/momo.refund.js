exports.refundMoMo = async (amount, transId) => {
  try {
    const accessKey = process.env.ACCESS_KEY_ID;
    const secretKey = process.env.SECRET_ACCESS_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;

    if (!accessKey || !secretKey || !partnerCode) {
      console.error("Thiếu cấu hình MoMo để hoàn tiền.");
      return { success: false, message: "Thiếu cấu hình MoMo" };
    }

    const orderId = `refund_${transId}_${Date.now()}`;
    const requestId = orderId;
    const description = "Hoàn tiền đơn hàng D-Wear";
    const lang = "vi";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`;
    
    const signature = require("crypto")
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      orderId,
      requestId,
      amount,
      transId,
      lang,
      description,
      signature,
    };

    const response = await require("axios").post(
      "https://test-payment.momo.vn/v2/gateway/api/refund",
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.resultCode === 0) {
      return { success: true, data: response.data };
    } else {
      console.error("Lỗi hoàn tiền MoMo:", response.data);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API hoàn tiền MoMo:", error.response?.data || error.message);
    return { success: false, message: error.message };
  }
};
