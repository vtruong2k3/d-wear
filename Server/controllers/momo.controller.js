const Payment = require("../models/payment");
// const axios = require("axios");

// const { generateMomoSignature } = require("../utils/onlineSignature");

// exports.createPayment = async (req, res) => {
//   try {
//     const { finalAmount } = req.body;

//     if (!finalAmount || finalAmount < 1000) {
//       return res.status(400).json({
//         message: "Số tiền không hợp lệ. Tối thiểu là 1000 VND.",
//       });
//     }

//     // Config từ biến môi trường
//     const accessKey = process.env.ACCESS_KEY_ID;
//     const secretKey = process.env.SECRET_ACCESS_KEY;
//     const partnerCode = "MOMO";
//     const redirectUrl = "http://localhost:5173/";
//     const ipnUrl = "http://localhost:5173/";

//     // Tạo mã đơn hàng & các thông tin cần thiết
//     const orderId = `${partnerCode}_${Date.now()}`;
//     const orderInfo = `Thanh toán đơn hàng #${orderId}`;
//     const requestType = "captureWallet";
//     const requestId = orderId;
//     const extraData = "";
//     const autoCapture = true;
//     const lang = "vi";

//     const signature = generateMomoSignature(
//       {
//         accessKey,
//         amount: finalAmount,
//         extraData,
//         ipnUrl,
//         orderId,
//         orderInfo,
//         partnerCode,
//         redirectUrl,
//         requestId,
//         requestType,
//       },
//       secretKey
//     );
//     const requestBody = {
//       partnerCode,
//       partnerName: "Test",
//       storeId: "MomoTestStore",
//       requestId,
//       amount: finalAmount,
//       orderId,
//       orderInfo,
//       redirectUrl,
//       ipnUrl,
//       lang,
//       requestType,
//       autoCapture,
//       extraData,
//       orderGroupId: "",
//       signature,
//     };

//     // Gửi yêu cầu thanh toán đến MoMo
//     const momoResponse = await axios.post(
//       "https://test-payment.momo.vn/v2/gateway/api/create",
//       requestBody,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Content-Length": Buffer.byteLength(requestBody),
//         },
//       }
//     );
//     if (momoResponse.data.resultCode !== 0) {
//       return res.status(400).json({
//         message: "Tạo thanh toán thất bại",
//         data: momoResponse.data,
//       });
//     }
//     // Lưu log thanh toán vào DB
//     await Payment.create({
//       order_id: orderId,
//       method: "momo",
//       amount: finalAmount,
//       transactionCode: orderId,
//       status: "pending",
//       responseData: momoResponse.data,
//     });

//     // Trả về response để frontend redirect sang link MoMo
//     return res.status(200).json(momoResponse.data);
//   } catch (error) {
//     console.error("Lỗi khi tạo thanh toán MoMo:", error);
//     return res.status(500).json({
//       message: "Lỗi server khi tạo thanh toán MoMo",
//       error: error.message,
//     });
//   }
// };
// // controllers/momoController.js
// exports.handleMomoIPN = async (req, res) => {
//   const data = req.body;
//   console.log("📥 IPN từ MoMo:", data);

//   // Kiểm tra chữ ký tại đây (nếu cần), sau đó cập nhật trạng thái đơn hàng
//   if (data.resultCode === 0) {
//     // thanh toán thành công
//     await Payment.findOneAndUpdate(
//       { order_id: data.orderId },
//       { status: "success" }
//     );
//   } else {
//     await Payment.findOneAndUpdate(
//       { order_id: data.orderId },
//       { status: "failed" }
//     );
//   }

//   return res.status(200).json({ message: "IPN received" });
// };
const axios = require("axios");

const {
  generateMomoSignature,
  generateMomoIPNSignature,
} = require("../utils/onlineSignature");

exports.createPayment = async (req, res) => {
  try {
    const { order_id, finalAmount } = req.body;

    if (!finalAmount || finalAmount < 1000) {
      return res.status(400).json({
        message: "Số tiền không hợp lệ. Tối thiểu là 1000 VND.",
      });
    }

    const accessKey = process.env.ACCESS_KEY_ID;
    const secretKey = process.env.SECRET_ACCESS_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const orderInfo = "Thanh toán đơn hàng D-Wear";
    const ipnUrl = "https://2478ba5e1e91.ngrok-free.app/api/momo/ipn";
    const redirectUrl = "http://localhost:5173/";
    const requestType = "payWithMethod";
    const amount = finalAmount;
    const requestId = order_id;
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";

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

    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
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

    const momoRes = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    const { data } = momoRes;

    if (data.resultCode === 0) {
      await Payment.create({
        order_id,
        method: "momo",
        amount: finalAmount,
        transactionCode: order_id,
        status: "pending",
        responseData: data,
      });
      return res.status(200).json({
        message: "Tạo yêu cầu thanh toán thành công",
        data,
      });
    } else {
      return res.status(400).json({
        message: "Tạo yêu cầu thanh toán thất bại",
        error: data.message,
        resultCode: data.resultCode,
      });
    }
  } catch (error) {
    console.error("Lỗi tạo thanh toán MoMo:", error.message);
    return res.status(500).json({
      message: "Lỗi server khi tạo thanh toán MoMo",
      error: error.response?.data || error.message,
    });
  }
};

exports.handleMomoIPN = async (req, res) => {
  const data = req.body;
  console.log("📥 IPN từ MoMo:", data);

  const secretKey = process.env.SECRET_ACCESS_KEY;
  const accessKey = process.env.ACCESS_KEY_ID;

  // Tạo chữ ký đúng chuẩn IPN
  const generatedSignature = generateMomoIPNSignature(
    {
      accessKey,
      amount: data.amount,
      extraData: data.extraData,
      message: data.message,
      orderId: data.orderId,
      orderInfo: data.orderInfo,
      orderType: data.orderType,
      partnerCode: data.partnerCode,
      payType: data.payType,
      requestId: data.requestId,
      responseTime: data.responseTime,
      resultCode: data.resultCode,
      transId: data.transId,
    },
    secretKey
  );

  if (data.signature !== generatedSignature) {
    console.warn(" Chữ ký không hợp lệ");
    return res.status(400).json({ message: "Chữ ký không hợp lệ" });
  }

  //  Chữ ký hợp lệ → cập nhật trạng thái đơn hàng
  await Payment.findOneAndUpdate(
    { order_id: data.orderId },
    { status: data.resultCode === 0 ? "success" : "failed" },
    { new: true }
  );

  return res.status(200).json({ message: "IPN thành công" });
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
