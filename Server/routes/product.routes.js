const express = require("express");
const productRouter = express.Router();
const upload = require("../middlewares/uploadProduct.middleware");
const productController = require("../controllers/product.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

//  Tạo các field động cho ảnh biến thể: imageVariant_0[], imageVariant_1[], ...
const variantFields = Array.from({ length: 100 }).map((_, i) => ({
  name: `imageVariant_${i}[]`,
  maxCount: 10,
}));

//  Lấy tất cả sản phẩm
productRouter.get("/product", productController.getAllProductWithVariants);
productRouter.get(
  "/product/by-category-band",
  productController.getProductByCategoryWithVariants
);

productRouter.get("/product/search", productController.searchProducts);
//  Lấy item rút gọn
productRouter.get("/product/items", productController.getAllProdutsItem);
//  Lấy danh sách đã xoá mềm
productRouter.get(
  "/product/deleted",
  productController.getAllDeletedProductWithVariants
);
//  Tạo sản phẩm + biến thể
productRouter.post(
  "/product",
  authAdminMiddelware,
  upload.fields([{ name: "productImage", maxCount: 8 }, ...variantFields]),
  productController.createProductWithVariants
);

//  Sửa sản phẩm + biến thể
productRouter.put(
  "/product/:id",
  authAdminMiddelware,
  upload.fields([{ name: "productImage", maxCount: 8 }, ...variantFields]),
  productController.updateProductWithVariants
);

//  Xoá cứng
productRouter.delete(
  "/product/:id",
  authAdminMiddelware,
  productController.deleteProductWithVariants
);
// Sản phẩm liên quan
productRouter.get(
  "/product/related/:categoryId",
  productController.getProductRelated
);
//  Xoá mềm
productRouter.put(
  "/product/:id/soft-delete",
  productController.softDeleteProduct
);

//  Rồi mới đến /product/:id
productRouter.get("/product/:id", productController.getProductWithVariantsById);

module.exports = productRouter;
