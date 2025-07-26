const Joi = require("joi");

// Định nghĩa schema
const profileUpdateSchema = Joi.object({
  username: Joi.string().min(2).max(50).required().messages({
    "string.base": "Tên phải là chuỗi",
    "string.empty": "Tên không được để trống",
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được dài quá 50 ký tự",
    "any.required": "Vui lòng nhập tên",
  }),

  phone: Joi.string()
    .pattern(/^0\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Số điện thoại không hợp lệ (phải có 10 chữ số và bắt đầu bằng 0)",
      "string.empty": "Số điện thoại không được để trống",
      "any.required": "Vui lòng nhập số điện thoại",
    }),
});

// Xuất module
module.exports = profileUpdateSchema;
