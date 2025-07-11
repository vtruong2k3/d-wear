const Joi = require("joi");

const sizeSchema = Joi.object({
  size_name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Tên size không được để trống",
    "string.min": "Tên size phải có ít nhất {#limit} ký tự",
    "string.max": "Tên size không được vượt quá {#limit} ký tự",
    "any.required": "Tên size là bắt buộc",
  }),
});

const sizeValidate = {
  create: sizeSchema,
  update: sizeSchema,
};

module.exports = sizeValidate;
