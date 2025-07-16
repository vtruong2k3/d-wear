// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail", // dùng Gmail, có thể thay bằng smtp khác
//   auth: {
//     user: process.env.EMAIL_USER, // Ví dụ: yourshop@gmail.com
//     pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App password, không phải mật khẩu Gmail thường)
//   },
// });

// /**
//  * Gửi email xác nhận đơn hàng
//  * @param {string} toEmail - Email người nhận
//  * @param {Object} order - Đối tượng đơn hàng
//  */
// const sendOrderConfirmationEmail = async (toEmail, order) => {
//   const formattedTotal = order.finalAmount.toLocaleString("vi-VN") + "₫";
//   const formattedDate = new Date(order.createdAt).toLocaleString("vi-VN");

//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;">
//       <h2 style="color: #2d8cf0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Xác nhận đơn hàng từ D-Wear</h2>

//       <p>Xin chào <strong>${order.receiverName}</strong>,</p>

//       <p>Cảm ơn bạn đã đặt hàng tại <strong>D-Wear</strong>. Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.</p>

//       <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//         <tr>
//           <td><strong>Mã đơn hàng:</strong></td>
//           <td>${order.order_code}</td>
//         </tr>
//         <tr>
//           <td><strong>Ngày đặt:</strong></td>
//           <td>${formattedDate}</td>
//         </tr>
//         <tr>
//           <td><strong>Tổng thanh toán:</strong></td>
//           <td style="color: #e91e63;"><strong>${formattedTotal}</strong></td>
//         </tr>
//         <tr>
//           <td><strong>Phương thức thanh toán:</strong></td>
//           <td>${
//             order.paymentMethod === "cod"
//               ? "Thanh toán khi nhận hàng (COD)"
//               : "Thanh toán online"
//           }</td>
//         </tr>
//         <tr>
//           <td><strong>Địa chỉ giao hàng:</strong></td>
//           <td>${order.shippingAddress}</td>
//         </tr>
//         <tr>
//           <td><strong>Số điện thoại:</strong></td>
//           <td>${order.phone}</td>
//         </tr>
//       </table>

//       <p style="margin-top: 24px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.</p>

//       <p style="margin-top: 24px;">Trân trọng,<br/><strong>Đội ngũ D-Wear</strong></p>

//       <hr style="margin-top: 32px;">
//       <p style="font-size: 12px; color: #999;">Đây là email tự động, vui lòng không trả lời lại email này.</p>
//     </div>
//   `;

//   const mailOptions = {
//     from: `"D-Wear Shop" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: `Xác nhận đơn hàng #${order.order_code}`,
//     html: htmlContent,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendOrderConfirmationEmail;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email xác nhận đơn hàng (có danh sách sản phẩm)
 * @param {string} toEmail - Email người nhận
 * @param {Object} order - Đối tượng đơn hàng
 */
const sendOrderConfirmationEmail = async (toEmail, order) => {
  const formattedTotal = order.finalAmount.toLocaleString("vi-VN") + "₫";
  const formattedDate = new Date(order.createdAt).toLocaleString("vi-VN");

  // Tạo bảng danh sách sản phẩm (có hình ảnh, tên, màu, size, SL, giá)
  const productListHTML = order.items
    .map(
      (item, index) => `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${
          index + 1
        }</td>
        <td style="border: 1px solid #ccc; padding: 8px; display: flex; align-items: center;">
          <img src="${
            item.image
          }" alt="product image" width="60" height="60" style="object-fit: cover; margin-right: 8px;" />
          <div>
            <div><strong>${item.name}</strong></div>
            <div style="font-size: 13px; color: #555;">Màu: ${
              item.color
            } - Size: ${item.size}</div>
          </div>
        </td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${
          item.quantity
        }</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${(
          item.price * item.quantity
        ).toLocaleString("vi-VN")}₫</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;">
      <h2 style="color: #2d8cf0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Xác nhận đơn hàng từ D-Wear</h2>

      <p>Xin chào <strong>${order.receiverName}</strong>,</p>

      <p>Cảm ơn bạn đã đặt hàng tại <strong>D-Wear</strong>. Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td><strong>Mã đơn hàng:</strong></td><td>${
          order.order_code
        }</td></tr>
        <tr><td><strong>Ngày đặt:</strong></td><td>${formattedDate}</td></tr>
        <tr><td><strong>Tổng thanh toán:</strong></td><td style="color: #e91e63;"><strong>${formattedTotal}</strong></td></tr>
        <tr><td><strong>Phương thức thanh toán:</strong></td><td>${
          order.paymentMethod === "cod"
            ? "Thanh toán khi nhận hàng (COD)"
            : "Thanh toán online"
        }</td></tr>
        <tr><td><strong>Địa chỉ giao hàng:</strong></td><td>${
          order.shippingAddress
        }</td></tr>
        <tr><td><strong>Số điện thoại:</strong></td><td>${order.phone}</td></tr>
      </table>

      <h3 style="margin-top: 32px; color: #2d8cf0;">Danh sách sản phẩm</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ccc; padding: 8px;">#</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Sản phẩm</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Số lượng</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${productListHTML}
        </tbody>
      </table>

      <p style="margin-top: 24px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.</p>

      <p style="margin-top: 24px;">Trân trọng,<br/><strong>Đội ngũ D-Wear</strong></p>

      <hr style="margin-top: 32px;">
      <p style="font-size: 12px; color: #999;">Đây là email tự động, vui lòng không trả lời lại email này.</p>
    </div>
  `;

  const mailOptions = {
    from: `"D-Wear Shop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Xác nhận đơn hàng #${order.order_code}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOrderConfirmationEmail;
