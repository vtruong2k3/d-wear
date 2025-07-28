// const express = require("express");
// const productRouter = express.Router();
// const upload = require("../middlewares/uploadProduct.middleware");
// const productControler = require("../controllers/product.controller");
// const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

// productRouter.post(
//   "/product",
//   authAdminMiddelware,
//   upload.fields([
//     { name: "productImage", maxCount: 8 },
//     { name: "imageVariant", maxCount: 10 },
//   ]),
//   productControler.createProductWithVariants
// );
// productRouter.put(
//   "/product/:id",
//   authAdminMiddelware,
//   upload.fields([
//     { name: "productImage", maxCount: 8 },
//     { name: "imageVariant", maxCount: 10 },
//   ]),
//   productControler.updateProductWithVariants
// );
// productRouter.delete(
//   "/product/:id",
//   authAdminMiddelware,
//   productControler.deleteProductWithVariants
// );
// productRouter.get("/product", productControler.getAllProductWithVariants);
// productRouter.get("/product/:id", productControler.getProductWithVariantsById);

// productRouter.get("/product/items", productControler.getAllProdutsItem);
// //xoá mềm
// productRouter.put(
//   "/product/:id/soft-delete",
//   productControler.softDeleteProduct
// );
// // hiển thị xoá mềm
// productRouter.get(
//   "product/deleted",
//   productControler.getAllDeletedProductWithVariants
// );
// module.exports = productRouter;
const express = require("express");
const productRouter = express.Router();
const upload = require("../middlewares/uploadProduct.middleware");
const productControler = require("../controllers/product.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

// 👉 Tạo các field động cho ảnh biến thể: imageVariant_0[], imageVariant_1[], ...
const variantFields = Array.from({ length: 20 }).map((_, i) => ({
  name: `imageVariant_${i}[]`,
  maxCount: 10,
}));

// ✅ Tạo sản phẩm + biến thể
productRouter.post(
  "/product",
  authAdminMiddelware,
  upload.fields([
    { name: "productImage", maxCount: 8 },
    ...variantFields
  ]),
  productControler.createProductWithVariants
);

// ✅ Sửa sản phẩm + biến thể
productRouter.put(
  "/product/:id",
  authAdminMiddelware,
  upload.fields([
    { name: "productImage", maxCount: 8 },
    ...variantFields
  ]),
  productControler.updateProductWithVariants
);

// ✅ Xoá cứng
productRouter.delete(
  "/product/:id",
  authAdminMiddelware,
  productControler.deleteProductWithVariants
);

// ✅ Lấy tất cả sản phẩm
productRouter.get("/product", productControler.getAllProductWithVariants);

// ✅ Lấy 1 sản phẩm kèm biến thể
productRouter.get("/product/:id", productControler.getProductWithVariantsById);

// ✅ Lấy item rút gọn
productRouter.get("/product/items", productControler.getAllProdutsItem);

// ✅ Xoá mềm
productRouter.put(
  "/product/:id/soft-delete",
  productControler.softDeleteProduct
);

// ✅ Lấy danh sách đã xoá mềm
productRouter.get(
  "/product/deleted",  // ⚠️ fix dấu `/` bị thiếu!
  productControler.getAllDeletedProductWithVariants
);

module.exports = productRouter;
