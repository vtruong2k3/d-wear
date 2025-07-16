const Payment = require("../models/payment");
const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/orders");
const {
  generateMomoSignature,
  generateMomoIPNSignature,
} = require("../utils/onlineSignature");

exports.createPayment = async (req, res) => {
  try {
    const { order_id, finalAmount } = req.body;

    // Kiểm tra đầu vào
    if (!order_id || !finalAmount) {
      return res.status(400).json({
        message: "Thiếu order_id hoặc số tiền thanh toán",
      });
    }

    if (Number(finalAmount) < 1000) {
      return res.status(400).json({
        message: "Số tiền không hợp lệ. Tối thiểu là 1.000 VND.",
      });
    }

    // Lấy thông tin cấu hình
    const accessKey = process.env.ACCESS_KEY_ID;
    const secretKey = process.env.SECRET_ACCESS_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const orderInfo = "Thanh toán đơn hàng D-Wear";
    const ipnUrl = process.env.MOMO_IPN_URL || "https://8ad10c5f6a1e.ngrok-free.app/api/momo/ipn";
    const redirectUrl = process.env.MOMO_REDIRECT_URL || "http://localhost:5173/payment";
    const requestType = "payWithMethod";
    const requestId = order_id;
    const amount = finalAmount.toString(); // Momo yêu cầu chuỗi
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";

    // Tạo chữ ký
    const signatureData = {
      accessKey,
      amount,
      extraData,
      ipnUrl,
      orderId: order_id,
      orderInfo,
      partnerCode,
      redirectUrl,
      requestId,
      requestType,
    };

    const { signature } = generateMomoSignature(signatureData, secretKey);

    // Gửi body cho MoMo
    const requestBody = {
      partnerCode,
      partnerName: "D-Wear",
      storeId: "D-WearStore",
      requestId,
      amount,
      orderId: order_id,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature,
    };

    console.log("▶️ Gửi yêu cầu tới MoMo:", requestBody);

    const momoRes = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = momoRes.data;

    if (data.resultCode === 0) {
      // Lưu vào DB nếu có model Payment
      await Payment.create({
        order_id,
        method: "momo",
        amount: Number(finalAmount),
        transactionCode: order_id,
        status: "pending",
        responseData: data,
      });

      return res.status(200).json({
        message: "Tạo yêu cầu thanh toán thành công",
        payUrl: data.payUrl,
        deeplink: data.deeplink,
        qrCodeUrl: data.qrCodeUrl,
      });
    } else {
      return res.status(400).json({
        message: "Tạo yêu cầu thanh toán thất bại",
        resultCode: data.resultCode,
        error: data.message || "Không rõ nguyên nhân",
      });
    }
  } catch (error) {
    console.error("❌ Lỗi tạo thanh toán MoMo:", error.message);
    return res.status(500).json({
      message: "Lỗi server khi tạo thanh toán MoMo",
      error: error.response?.data || error.message,
    });
  }
};



// exports.handleMomoIPN = async (req, res) => {
//   const data = req.body;
//   console.log("📥 IPN từ MoMo:", data);

//   const secretKey = process.env.SECRET_ACCESS_KEY;
//   const accessKey = process.env.ACCESS_KEY_ID;

//   // Tạo chữ ký đúng chuẩn IPN
//   const generatedSignature = generateMomoIPNSignature(
//     {
//       accessKey,
//       amount: data.amount,
//       extraData: data.extraData,
//       message: data.message,
//       orderId: data.orderId,
//       orderInfo: data.orderInfo,
//       orderType: data.orderType,
//       partnerCode: data.partnerCode,
//       payType: data.payType,
//       requestId: data.requestId,
//       responseTime: data.responseTime,
//       resultCode: data.resultCode,
//       transId: data.transId,
//     },
//     secretKey
//   );

//   if (data.signature !== generatedSignature) {
//     console.warn(" Chữ ký không hợp lệ");
//     return res.status(400).json({ message: "Chữ ký không hợp lệ" });
//   }

//   //  Chữ ký hợp lệ → cập nhật trạng thái đơn hàng
//   await Payment.findOneAndUpdate(
//     { order_id: data.orderId },
//     { status: data.resultCode === 0 ? "success" : "failed" },
//     { new: true }
//   );

//   return res.status(200).json({ message: "IPN thành công" });
// };
// exports.handleMomoIPN = async (req, res) => {
//   try {
//     const {
//       partnerCode,
//       orderId,
//       requestId,
//       amount,
//       orderInfo,
//       orderType,
//       transId,
//       resultCode,
//       message,
//       payType,
//       responseTime,
//       extraData,
//       signature,
//     } = req.body;

//     // ✅ Kiểm tra chữ ký hợp lệ (bắt buộc)
//     const secretKey = process.env.SECRET_ACCESS_KEY;
//     const rawSignature = `accessKey=${process.env.ACCESS_KEY_ID}&amount=${amount}&extraData=${extraData}&ipnUrl=${process.env.MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${process.env.MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=payWithMethod`;
//     const crypto = require("crypto");
//     const generatedSignature = crypto
//       .createHmac("sha256", secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     if (generatedSignature !== signature) {
//       return res.status(400).json({ message: "Chữ ký không hợp lệ" });
//     }

//     if (resultCode == 0) {
//       // ✅ Giao dịch thành công → Cập nhật đơn hàng
//       await Order.findOneAndUpdate(
//         { order_code: orderId },
//         {
//           paymentStatus: "paid",
//           status: "processing",
//           $set: { momoTransactionId: transId },
//         }
//       );
//       return res.status(200).json({ message: "Xác nhận IPN thành công" });
//     } else {
//       // ❌ Thanh toán thất bại → bạn có thể log lại nếu cần
//       return res.status(400).json({ message: "Thanh toán thất bại", resultCode });
//     }
//   } catch (err) {
//     console.error("❌ Lỗi IPN:", err.message);
//     return res.status(500).json({ message: "Lỗi server IPN", error: err.message });
//   }
// };
exports.handleMomoIPN = async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    console.log("📥 IPN từ MoMo:", req.body);

    // ✅ Tạo chữ ký chuẩn để xác thực IPN
    const secretKey = process.env.MOMO_SECRET_KEY;
    const accessKey = process.env.MOMO_ACCESS_KEY;

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const generatedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    if (signature !== generatedSignature) {
      console.warn("❌ Chữ ký không hợp lệ!");
      return res.status(400).json({ message: "Chữ ký không hợp lệ" });
    }

    // ✅ Cập nhật trạng thái đơn hàng nếu thanh toán thành công
    if (parseInt(resultCode) === 0) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "processing",
        momoTransactionId: transId,
      });

      // ✅ Cập nhật bảng Payment nếu bạn có
      await Payment.findOneAndUpdate(
        { order_id: orderId },
        {
          status: "success",
          transactionCode: transId,
          responseData: req.body,
        }
      );

      console.log(`✅ Đơn hàng ${orderId} đã thanh toán thành công`);
      return res.status(200).json({ message: "Xác nhận IPN thành công" });
    } else {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
        status: "cancelled",
      });

      await Payment.findOneAndUpdate(
        { order_id: orderId },
        { status: "failed", responseData: req.body }
      );

      console.warn(`❌ Đơn hàng ${orderId} thanh toán thất bại`);
      return res.status(200).json({ message: "Đã ghi nhận thanh toán thất bại" });
    }
  } catch (err) {
    console.error("❌ Lỗi IPN:", err.message);
    return res.status(500).json({ message: "Lỗi server IPN", error: err.message });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  try {
    const accessKey = process.env.ACCESS_KEY_ID;
    const secretKey = process.env.SECRET_ACCESS_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;

    const { order_id } = req.body;
    console.log(order_id);

    if (!order_id) {
      return res.status(400).json({ message: "Thiếu orderId" });
    }

    const requestId = order_id;
    const lang = "vi";

    // Raw signature đúng thứ tự
    const rawSignature = `accessKey=${accessKey}&orderId=${order_id}&partnerCode=${partnerCode}&requestId=${requestId}`;

    const signature = require("crypto")
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      requestId,
      orderId: order_id,
      lang,
      signature,
    };

    const momoRes = await require("axios").post(
      "https://test-payment.momo.vn/v2/gateway/api/query",
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.status(200).json({
      message: "Truy vấn trạng thái giao dịch thành công",
      data: momoRes.data,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return res.status(500).json({
      message: "Server error while checking payment status",
      error: error.message,
    });
  }
};

// POST /api/momo/verify

exports.verifyPaymentFromRedirect = async (req, res) => {
  try {
    const { order_id, trans_id } = req.body;

    if (!order_id || !trans_id) {
      return res.status(400).json({ message: "Thiếu order_id hoặc trans_id" });
    }

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // ✅ Cập nhật trạng thái
    order.paymentStatus = "paid";
    order.status = "processing";
    order.momoTransactionId = trans_id;
    await order.save();

    return res.status(200).json({ message: "Xác nhận thanh toán thành công" });
  } catch (err) {
    console.error("❌ verifyPaymentFromRedirect:", err.message);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


