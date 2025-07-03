
const Joi = require("joi");

const categoryValidate = {
  create: Joi.object({
    category_name: Joi.string().min(2).max(100).required().messages({
      "string.base": "Tên danh mục phải là chuỗi.",
      "string.empty": "Tên danh mục không được để trống.",
      "string.min": "Tên danh mục phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên danh mục không được vượt quá {#limit} ký tự.",
      "any.required": "Tên danh mục là bắt buộc.",
    }),
  }),

  update: Joi.object({
    category_name: Joi.string().min(2).max(100).messages({
      "string.base": "Tên danh mục phải là chuỗi.",
      "string.empty": "Tên danh mục không được để trống.",
      "string.min": "Tên danh mục phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên danh mục không được vượt quá {#limit} ký tự.",
    }),
  }),
};

module.exports = categoryValidate;

