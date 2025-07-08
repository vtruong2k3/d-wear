const Joi = require("joi");

// const productValidate = {
//   createProduct: Joi.object({
//     product_name: Joi.string().min(3).max(500).required().messages({
//       "string.base": "Tên sản phẩm phải là chuỗi.",
//       "string.empty": "Tên sản phẩm không được để trống.",
//       "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự.",
//       "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự.",
//       "any.required": "Tên sản phẩm là bắt buộc.",
//     }),
//     description: Joi.string().max(5000).required().messages({
//       "string.base": "Mô tả phải là chuỗi.",
//       "string.empty": "Mô tả không được để trống.",
//       "string.max": "Mô tả không được vượt quá {#limit} ký tự.",
//       "any.required": "Mô tả là bắt buộc.",
//     }),
//     basePrice: Joi.number().min(0).required().messages({
//       "number.base": "Giá sản phẩm phải là số.",
//       "number.min": "Giá sản phẩm không được nhỏ hơn {#limit}.",
//       "any.required": "Giá sản phẩm là bắt buộc.",
//     }),
//     imageUrls: Joi.array()
//       .items(
//         Joi.string().messages({
//           "string.base": "Đường dẫn ảnh phải là chuỗi.",
//         })
//       )
//       .min(1)
//       .required()
//       .messages({
//         "array.base": "Danh sách ảnh phải là một mảng.",
//         "array.min": "Phải có ít nhất {#limit} ảnh.",
//         "any.required": "Danh sách ảnh là bắt buộc.",
//       }),
//     brand_id: Joi.string().length(24).required().messages({
//       "string.base": "ID thương hiệu phải là chuỗi.",
//       "string.length": "ID thương hiệu không hợp lệ.",
//       "any.required": "ID thương hiệu là bắt buộc.",
//     }),
//     category_id: Joi.string().length(24).required().messages({
//       "string.base": "ID danh mục phải là chuỗi.",
//       "string.length": "ID danh mục không hợp lệ.",
//       "any.required": "ID danh mục là bắt buộc.",
//     }),
//     gender: Joi.string().valid("male", "female", "unisex").messages({
//       "string.base": "Giới tính phải là chuỗi.",
//       "any.only":
//         "Giới tính phải là một trong các giá trị: male, famale, unisex.",
//     }),
//     material: Joi.string().allow("").messages({
//       "string.base": "Chất liệu phải là chuỗi.",
//     }),
//   }).unknown(true),
// };
const productValidate = {
  createProduct: Joi.object({
    product_name: Joi.string().min(3).max(500).required().messages({
      "string.base": "Tên sản phẩm phải là chuỗi.",
      "string.empty": "Tên sản phẩm không được để trống.",
      "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự.",
      "any.required": "Tên sản phẩm là bắt buộc.",
    }),
    description: Joi.string().max(5000).required().messages({
      "string.base": "Mô tả phải là chuỗi.",
      "string.empty": "Mô tả không được để trống.",
      "string.max": "Mô tả không được vượt quá {#limit} ký tự.",
      "any.required": "Mô tả là bắt buộc.",
    }),
    basePrice: Joi.number().min(0).required().messages({
      "number.base": "Giá sản phẩm phải là số.",
      "number.min": "Giá sản phẩm không được nhỏ hơn {#limit}.",
      "any.required": "Giá sản phẩm là bắt buộc.",
    }),
    imageUrls: Joi.array()
      .items(
        Joi.string().messages({
          "string.base": "Đường dẫn ảnh phải là chuỗi.",
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Danh sách ảnh phải là một mảng.",
        "array.min": "Phải có ít nhất {#limit} ảnh.",
        "any.required": "Danh sách ảnh là bắt buộc.",
      }),
    brand_id: Joi.string().length(24).required().messages({
      "string.base": "ID thương hiệu phải là chuỗi.",
      "string.length": "ID thương hiệu không hợp lệ.",
      "any.required": "ID thương hiệu là bắt buộc.",
    }),
    category_id: Joi.string().length(24).required().messages({
      "string.base": "ID danh mục phải là chuỗi.",
      "string.length": "ID danh mục không hợp lệ.",
      "any.required": "ID danh mục là bắt buộc.",
    }),
    gender: Joi.string().valid("male", "female", "unisex").messages({
      "string.base": "Giới tính phải là chuỗi.",
      "any.only":
        "Giới tính phải là một trong các giá trị: male, famale, unisex.",
    }),
    material: Joi.string().allow("").messages({
      "string.base": "Chất liệu phải là chuỗi.",
    }),
  }).unknown(true),

  updateProduct: Joi.object({
    product_name: Joi.string().min(3).max(500).messages({
      "string.base": "Tên sản phẩm phải là chuỗi.",
      "string.empty": "Tên sản phẩm không được để trống.",
      "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự.",
    }),
    description: Joi.string().max(5000).messages({
      "string.base": "Mô tả phải là chuỗi.",
      "string.max": "Mô tả không được vượt quá {#limit} ký tự.",
    }),
    basePrice: Joi.number().min(0).messages({
      "number.base": "Giá sản phẩm phải là số.",
      "number.min": "Giá sản phẩm không được nhỏ hơn {#limit}.",
    }),
    imageUrls: Joi.array()
      .items(
        Joi.string().messages({
          "string.base": "Đường dẫn ảnh phải là chuỗi.",
        })
      )
      .messages({
        "array.base": "Danh sách ảnh phải là một mảng.",
      }),
    brand_id: Joi.string().length(24).messages({
      "string.base": "ID thương hiệu phải là chuỗi.",
      "string.length": "ID thương hiệu không hợp lệ.",
    }),
    category_id: Joi.string().length(24).messages({
      "string.base": "ID danh mục phải là chuỗi.",
      "string.length": "ID danh mục không hợp lệ.",
    }),
    gender: Joi.string().valid("male", "female", "unisex").messages({
      "string.base": "Giới tính phải là chuỗi.",
      "any.only":
        "Giới tính phải là một trong các giá trị: male, famale, unisex.",
    }),
    material: Joi.string().allow("").messages({
      "string.base": "Chất liệu phải là chuỗi.",
    }),
  }).unknown(true),
};

//validate biến thể

const variantValidate = {
  create: Joi.object({
    product_id: Joi.string().required().messages({
      "any.required": "Thiếu product_id",
      "string.empty": "Product ID không được để trống",
    }),

    size: Joi.string()
      .valid("XS", "S", "M", "L", "XL", "XXL")
      .required()
      .messages({
        "any.only": "Size không hợp lệ",
        "any.required": "Size là bắt buộc",
        "string.empty": "Size không được để trống",
      }),

    color: Joi.string().required().messages({
      "any.required": "Màu là bắt buộc",
      "string.empty": "Màu không được để trống",
    }),

    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Tồn kho phải là số",
      "number.min": "Tồn kho không được âm",
      "any.required": "Tồn kho là bắt buộc",
    }),

    price: Joi.number().min(0).required().messages({
      "number.base": "Giá phải là số",
      "number.min": "Giá không được âm",
      "any.required": "Giá là bắt buộc",
    }),

    image: Joi.array().items(Joi.string()).messages({
      "array.base": "Ảnh phải là một mảng đường dẫn",
      "string.base": "Ảnh phải là đường dẫn dạng chuỗi",
    }),
  }),

  update: Joi.object({
    product_id: Joi.string().required().messages({
      "any.required": "Thiếu product_id",
      "string.empty": "Product ID không được để trống",
    }),
    size: Joi.string().valid("XS", "S", "M", "L", "XL", "XXL").required().messages({
      "any.only": "Size không hợp lệ",
      "any.required": "Size là bắt buộc",
      "string.empty": "Size không được để trống",
    }),
    color: Joi.string().required().messages({
      "any.required": "Màu là bắt buộc",
      "string.empty": "Màu không được để trống",
    }),
    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Tồn kho phải là số",
      "number.min": "Tồn kho không được âm",
      "any.required": "Tồn kho là bắt buộc",
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Giá phải là số",
      "number.min": "Giá không được âm",
      "any.required": "Giá là bắt buộc",
    }),
    image: Joi.array().items(Joi.string()).messages({
      "array.base": "Ảnh phải là một mảng đường dẫn",
      "string.base": "Ảnh phải là đường dẫn dạng chuỗi",
    }),
  })
  .unknown(true) // 👈 Cho phép tồn tại các field ngoài định nghĩa như _id
  
};

module.exports = {
  productValidate,
  variantValidate,
};
