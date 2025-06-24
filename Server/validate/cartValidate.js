const Joi = require("joi");
const cartValidate = {
  addTocart: Joi.object({
    user_id: Joi.string().required().messages({
      "string.empty": "user_id là bắt buộc",
    }),
    product_id: Joi.string().required().messages({
      "string.empty": "product_id là bắt buộc",
    }),
    variant_id: Joi.string().required().messages({
      "string.empty": "variant_id là bắt buộc",
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      "any.required": "quantity là bắt buộc",
      "number.base": "quantity phải là số",
      "number.min": "Số lượng tối thiểu là 0",
    }),
    price: Joi.number().integer().messages({
      "number.base": "price phải là số",
      "number.integer": "price phải là số nguyên",
    }),
  }),
};
module.exports = cartValidate;
