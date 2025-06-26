const Joi = require("joi");

const brandValidation = {
  create: Joi.object({
    brand_name: Joi.string().min(2).max(100).required().messages({
      "string.base": "Tên thương hiệu phải là chuỗi ký tự.",
      "string.empty": "Tên thương hiệu không được để trống.",
      "string.min": "Tên thương hiệu phải có ít nhất 2 ký tự.",
      "string.max": "Tên thương hiệu không được vượt quá 100 ký tự.",
      "any.required": "Tên thương hiệu là bắt buộc.",
    }),
  }),
  update: Joi.object({
    brand_name: Joi.string().min(2).max(100).required().messages({
      "string.base": "Tên thương hiệu phải là chuỗi ký tự.",
      "string.empty": "Tên thương hiệu không được để trống.",
      "string.min": "Tên thương hiệu phải có ít nhất 2 ký tự.",
      "string.max": "Tên thương hiệu không được vượt quá 100 ký tự.",
      "any.required": "Tên thương hiệu là bắt buộc.",
    }),
  }),
};

module.exports = brandValidation;
