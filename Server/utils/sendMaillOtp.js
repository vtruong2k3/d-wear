// utils/sendOtpEmail.js
const nodemailer = require("nodemailer");

/**
 * Gmail khuyến nghị dùng App Password (bật 2FA -> tạo mật khẩu ứng dụng)
 * EMAIL_USER = your@gmail.com
 * EMAIL_PASS = <app-password-16-ký-tự>
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email OTP
 * @param {string} toEmail - email người nhận
 * @param {string|number} otp - mã OTP (6 số)
 * @param {{ appName?: string, minutes?: number, from?: string }} opts
 */
async function sendOtpEmail(
  toEmail,
  otp,
  {
    appName = "d-wear",
    minutes = 5,
    from = `"${appName} Support" <${process.env.EMAIL_USER}>`,
  } = {}
) {
  const subject = `Mã OTP xác minh – ${appName}`;
  const text = `${appName} – Mã OTP của bạn: ${otp}. Hiệu lực ${minutes} phút.`;
  const html = buildOtpHtml({ appName, otp: String(otp), minutes });

  await transporter.sendMail({ from, to: toEmail, subject, text, html });
}

function buildOtpHtml({ appName, otp, minutes }) {
  const otpPretty = String(otp).replace(/(\d)(?=\d)/g, "$1 ");
  return `
  <!doctype html>
  <html lang="vi"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
  <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:16px 20px;background:#111;color:#fff;font-weight:bold;font-size:18px;">${escapeHtml(
            appName
          )}</td></tr>
          <tr><td style="padding:20px;">
            <h1 style="margin:0 0 8px 0;font-size:20px;">Mã OTP xác minh</h1>
            <p style="margin:0 0 10px 0;color:#444">Vui lòng dùng mã dưới đây để xác minh/đặt lại mật khẩu.</p>
            <div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:10px;padding:16px;text-align:center;">
              <div style="font-size:28px;letter-spacing:6px;font-weight:700;font-family:Consolas,Monaco,monospace;">${escapeHtml(
                otpPretty
              )}</div>
              <div style="margin-top:6px;font-size:13px;color:#555;">Mã có hiệu lực trong <b>${minutes} phút</b>.</div>
            </div>
            <p style="margin:12px 0 0 0;color:#666;font-size:14px;">Nếu bạn không yêu cầu, hãy bỏ qua email này. Không chia sẻ mã cho bất kỳ ai.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { sendOtpEmail };
