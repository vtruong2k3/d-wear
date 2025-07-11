const Joi = require("joi");

const colorValidate = {
  create: Joi.object({
    color_name: Joi.string()
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.empty": "Tên màu không được để trống",
        "any.required": "Tên màu là bắt buộc",
        "string.min": "Tên màu phải có ít nhất {#limit} ký tự",
        "string.max": "Tên màu không được vượt quá {#limit} ký tự",
      }),
  }),

  update: Joi.object({
    color_name: Joi.string().trim().min(1).max(100).required().messages({
      "string.empty": "Tên màu không được để trống",
      "any.required": "Tên màu là bắt buộc",
      "string.min": "Tên màu phải có ít nhất {#limit} ký tự",
      "string.max": "Tên màu không được vượt quá {#limit} ký tự",
    }),
  }),
};

module.exports = colorValidate;
