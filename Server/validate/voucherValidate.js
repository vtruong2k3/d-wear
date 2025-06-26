const Joi = require("joi");

const voucherValidate = {
  create: Joi.object({
    code: Joi.string().min(3).max(100).required().messages({
      "string.base": "Mã voucher phải là chuỗi.",
      "string.empty": "Mã voucher không được để trống.",
      "string.min": "Mã voucher phải có ít nhất {#limit} ký tự.",
      "string.max": "Mã voucher không được vượt quá {#limit} ký tự.",
      "any.required": "Mã voucher là bắt buộc.",
    }),
    discountType: Joi.string()
      .valid("percentage", "fixed")
      .required()
      .messages({
        "string.base": "Loại giảm giá phải là chuỗi.",
        "any.only": "Loại giảm giá phải là 'percentage' hoặc 'fixed'.",
        "any.required": "Loại giảm giá là bắt buộc.",
      }),
    discountValue: Joi.number().min(1).required().messages({
      "number.base": "Giá trị giảm giá phải là số.",
      "number.min": "Giá trị giảm giá phải lớn hơn 0.",
      "any.required": "Giá trị giảm giá là bắt buộc.",
    }),
    minOrderValue: Joi.number().min(0).messages({
      "number.base": "Giá trị đơn hàng tối thiểu phải là số.",
      "number.min": "Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.",
    }),
    maxDiscountValue: Joi.number().min(0).messages({
      "number.base": "Giá trị giảm giá tối đa phải là số.",
      "number.min": "Giá trị giảm giá tối đa không được nhỏ hơn 0.",
    }),
    maxUser: Joi.number().min(0).messages({
      "number.base": "Số lượng người dùng tối đa phải là số.",
      "number.min": "Số lượng người dùng tối đa không được nhỏ hơn 0.",
    }),
    startDate: Joi.date().required().messages({
      "date.base": "Ngày bắt đầu phải là ngày hợp lệ.",
      "any.required": "Ngày bắt đầu là bắt buộc.",
    }),
    endDate: Joi.date().required().messages({
      "date.base": "Ngày kết thúc phải là ngày hợp lệ.",
      "any.required": "Ngày kết thúc là bắt buộc.",
    }),
    isActive: Joi.boolean().messages({
      "boolean.base": "Trạng thái hoạt động phải là true hoặc false.",
    }),
  }),

  update: Joi.object({
    code: Joi.string().min(3).max(50).messages({
      "string.base": "Mã voucher phải là chuỗi.",
      "string.empty": "Mã voucher không được để trống.",
      "string.min": "Mã voucher phải có ít nhất {#limit} ký tự.",
      "string.max": "Mã voucher không được vượt quá {#limit} ký tự.",
    }),
    discountType: Joi.string().valid("percentage", "fixed").messages({
      "string.base": "Loại giảm giá phải là chuỗi.",
      "any.only": "Loại giảm giá phải là 'percentage' hoặc 'fixed'.",
    }),
    discountValue: Joi.number().min(1).messages({
      "number.base": "Giá trị giảm giá phải là số.",
      "number.min": "Giá trị giảm giá phải lớn hơn 0.",
    }),
    minOrderValue: Joi.number().min(0).messages({
      "number.base": "Giá trị đơn hàng tối thiểu phải là số.",
      "number.min": "Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.",
    }),
    maxDiscountValue: Joi.number().min(0).messages({
      "number.base": "Giá trị giảm giá tối đa phải là số.",
      "number.min": "Giá trị giảm giá tối đa không được nhỏ hơn 0.",
    }),
    maxUser: Joi.number().min(0).messages({
      "number.base": "Số lượng người dùng tối đa phải là số.",
      "number.min": "Số lượng người dùng tối đa không được nhỏ hơn 0.",
    }),
    startDate: Joi.date().messages({
      "date.base": "Ngày bắt đầu phải là ngày hợp lệ.",
    }),
    endDate: Joi.date().messages({
      "date.base": "Ngày kết thúc phải là ngày hợp lệ.",
    }),
    isActive: Joi.boolean().messages({
      "boolean.base": "Trạng thái hoạt động phải là true hoặc false.",
    }),
  }),
};

module.exports = voucherValidate;
