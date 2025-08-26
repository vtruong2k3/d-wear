// utils/security.js
const crypto = require("crypto");

/** Hash SHA-256 (trả về hex) */
function hash(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex");
}

/** Sinh OTP 6 số, padding đủ 6 ký tự */
function genOtp6() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

module.exports = { hash, genOtp6 };
