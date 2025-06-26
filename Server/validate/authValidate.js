const Joi = require("joi");
const authValidate = {
  register: Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.base": "Username phải là chuỗi",
      "string.empty": "Username không được để trống",
      "string.min": "Username phải có ít nhất {#limit} ký tự",
      "any.required": "Username là bắt buộc",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Email không hợp lệ",
      "string.empty": "Email không được để trống",
      "any.required": "Email là bắt buộc",
    }),

    password: Joi.string().min(5).required().messages({
      "string.min": "Password phải có ít nhất {#limit} ký tự",
      "string.empty": "Password không được để trống",
      "any.required": "Password là bắt buộc",
    }),
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email không hợp lệ",
      "string.empty": "Email không được để trống",
      "any.required": "Email là bắt buộc",
    }),

    password: Joi.string().min(5).required().messages({
      "string.min": "Password phải có ít nhất {#limit} ký tự",
      "string.empty": "Password không được để trống",
      "any.required": "Password là bắt buộc",
    }),
  }),
};
module.exports = authValidate;
