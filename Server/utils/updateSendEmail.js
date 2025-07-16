const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email cập nhật trạng thái đơn hàng
 * @param {string} toEmail - Email người nhận
 * @param {Object} order - Thông tin đơn hàng (đã cập nhật)
 */
const sendOrderStatusUpdateEmail = async (toEmail, order) => {
  const formattedDate = new Date(order.updatedAt).toLocaleString("vi-VN");
  const statusMap = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao thành công",
    cancelled: "Đã huỷ",
  };
  const statusText = statusMap[order.status] || order.status;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;">
      <h2 style="color: #2d8cf0;">Cập nhật trạng thái đơn hàng từ D-Wear</h2>

      <p>Xin chào <strong>${order.receiverName}</strong>,</p>

      <p>Trạng thái đơn hàng của bạn đã được cập nhật.</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td><strong>Mã đơn hàng:</strong></td><td>${order.order_code}</td></tr>
        <tr><td><strong>Trạng thái mới:</strong></td><td style="color: #e91e63;"><strong>${statusText}</strong></td></tr>
        <tr><td><strong>Thời gian cập nhật:</strong></td><td>${formattedDate}</td></tr>
        <tr><td><strong>Phương thức thanh toán:</strong></td><td>${
          order.paymentMethod === "cod"
            ? "Thanh toán khi nhận hàng (COD)"
            : "Thanh toán online"
        }</td></tr>
        <tr><td><strong>Địa chỉ giao hàng:</strong></td><td>${order.shippingAddress}</td></tr>
        <tr><td><strong>Số điện thoại:</strong></td><td>${order.phone}</td></tr>
      </table>

      <p style="margin-top: 24px;">Cảm ơn bạn đã mua sắm tại <strong>D-Wear</strong>. Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.</p>

      <p style="margin-top: 24px;">Trân trọng,<br/><strong>Đội ngũ D-Wear</strong></p>

      <hr style="margin-top: 32px;">
      <p style="font-size: 12px; color: #999;">Đây là email tự động, vui lòng không trả lời lại email này.</p>
    </div>
  `;

  const mailOptions = {
    from: `"D-Wear Shop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Cập nhật trạng thái đơn hàng #${order.order_code}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOrderStatusUpdateEmail;