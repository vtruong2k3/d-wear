const Joi = require("joi");

const sizeValidate = {
  create: Joi.object({
    size_name: Joi.string().min(1).required().messages({
      "string.empty": "Tên size không được để trống",
      "any.required": "Tên size là bắt buộc",
    }),
  }),

  update: Joi.object({
    size_name: Joi.string().min(1).required().messages({
      "string.empty": "Tên size không được để trống",
      "any.required": "Tên size là bắt buộc",
    }),
  }),
};

module.exports = sizeValidate;
