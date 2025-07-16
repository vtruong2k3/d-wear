const crypto = require("crypto");

/**
 * Tạo chữ ký HMAC SHA256 cho yêu cầu tạo thanh toán MoMo
 * @param {Object} params - Tham số ký
 * @param {string} secretKey - Khóa bí mật từ MoMo
 * @returns {{ rawSignature: string, signature: string }}
 */
function generateMomoSignature(params, secretKey) {
  const {
    accessKey,
    amount,
    extraData,
    ipnUrl,
    orderId,
    orderInfo,
    partnerCode,
    redirectUrl,
    requestId,
    requestType,
  } = params;

  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  return { rawSignature, signature };
}

/**
 * Tạo chữ ký để xác minh IPN từ MoMo (callback sau thanh toán)
 * @param {Object} data - Dữ liệu IPN từ MoMo gửi về
 * @param {string} secretKey - Khóa bí mật từ MoMo
 * @returns {string} signature
 */
function generateMomoIPNSignature(data, secretKey) {
  const rawSignature = [
    `accessKey=${data.accessKey}`,
    `amount=${data.amount}`,
    `extraData=${data.extraData}`,
    `message=${data.message}`,
    `orderId=${data.orderId}`,
    `orderInfo=${data.orderInfo}`,
    `orderType=${data.orderType}`,
    `partnerCode=${data.partnerCode}`,
    `payType=${data.payType}`,
    `requestId=${data.requestId}`,
    `responseTime=${data.responseTime}`,
    `resultCode=${data.resultCode}`,
    `transId=${data.transId}`,
  ].join("&");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  return signature;
}

module.exports = {
  generateMomoSignature,
  generateMomoIPNSignature,
};
