const Joi = require("joi");
const reviewSchema = Joi.object({
  product_id: Joi.string().required().messages({
    "any.required": "Thiếu mã sản phẩm.",
    "string.base": "Mã sản phẩm không hợp lệ.",
  }),
  order_id: Joi.string().required().messages({
    "any.required": "Thiếu mã đơn hàng.",
    "string.base": "Mã đơn hàng không hợp lệ.",
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "any.required": "Vui lòng chọn số sao đánh giá.",
    "number.base": "Số sao phải là số.",
    "number.min": "Số sao tối thiểu là 1.",
    "number.max": "Số sao tối đa là 5.",
  }),
  comment: Joi.string().allow("", null),
});

module.exports = {
  reviewSchema,
};
