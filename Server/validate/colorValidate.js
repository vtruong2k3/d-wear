const Joi = require("joi");

const colorValidate = {
  create: Joi.object({
    color_name: Joi.string().min(1).required().messages({
      "string.empty": "Tên màu không được để trống",
      "any.required": "Tên màu là bắt buộc",
    }),
  }),

  update: Joi.object({
    color_name: Joi.string().min(1).required().messages({
      "string.empty": "Tên màu không được để trống",
      "any.required": "Tên màu là bắt buộc",
    }),
  }),
};

module.exports = colorValidate;
