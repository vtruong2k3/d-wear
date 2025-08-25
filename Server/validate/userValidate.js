const Joi = require("joi");
const createUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "username là bắt buộc",
    "string.min": "username phải có ít nhất 3 ký tự",
    "string.max": "username không được quá 50 ký tự",
    "any.required": "username là bắt buộc",
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "email là bắt buộc",
  }),
  password: Joi.string()
    .min(6)
    .allow("", null) // cho phép bỏ trống
    .messages({
      "string.min": "Mật khẩu tối thiểu 6 ký tự",
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]*$/)
    .max(20)
    .allow("", null)
    .messages({
      "string.pattern.base": "Số điện thoại không hợp lệ",
      "string.max": "Số điện thoại tối đa 20 ký tự",
    }),
  role: Joi.string().valid("admin", "user").default("user"),
  isActive: Joi.boolean().truthy("true").falsy("false").default(true),
});
const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "username là bắt buộc",
    "string.min": "username phải có ít nhất 3 ký tự",
    "string.max": "username không được quá 50 ký tự",
    "any.required": "username là bắt buộc",
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "email là bắt buộc",
  }),
  password: Joi.string()
    .min(6)
    .allow("", null) // cho phép bỏ trống
    .messages({
      "string.min": "Mật khẩu tối thiểu 6 ký tự",
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]*$/)
    .max(20)
    .allow("", null)
    .messages({
      "string.pattern.base": "Số điện thoại không hợp lệ",
      "string.max": "Số điện thoại tối đa 20 ký tự",
    }),
  role: Joi.string().valid("admin", "user").optional(),
  isActive: Joi.boolean().truthy("true").falsy("false").optional(),

  removeAvatar: Joi.boolean().truthy("true").falsy("false").optional(),
});
module.exports = {
  createUserSchema,
  updateUserSchema,
};
