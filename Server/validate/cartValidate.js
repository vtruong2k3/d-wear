const Joi = require("joi");
const cartValidate = {
  addTocart: Joi.object({
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
  }),
};
module.exports = cartValidate;
