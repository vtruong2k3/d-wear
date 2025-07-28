const express = require("express");
const productRouter = express.Router();
const upload = require("../middlewares/uploadProduct.middleware");
const productControler = require("../controllers/product.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

productRouter.post(
  "/product",
  authAdminMiddelware,
  upload.fields([
    { name: "productImage", maxCount: 8 },
    { name: "imageVariant", maxCount: 10 },
  ]),
  productControler.createProductWithVariants
);
productRouter.put(
  "/product/:id",
  authAdminMiddelware,
  upload.fields([
    { name: "productImage", maxCount: 8 },
    { name: "imageVariant", maxCount: 10 },
  ]),
  productControler.updateProductWithVariants
);
productRouter.delete(
  "/product/:id",
  authAdminMiddelware,
  productControler.deleteProductWithVariants
);
productRouter.get("/product", productControler.getAllProductWithVariants);
productRouter.get("/product/:id", productControler.getProductWithVariantsById);

productRouter.get("/product/items", productControler.getAllProdutsItem);
//xoá mềm
productRouter.put(
  "/product/:id/soft-delete",
  productControler.softDeleteProduct
);
// hiển thị xoá mềm
productRouter.get(
  "product/deleted",
  productControler.getAllDeletedProductWithVariants
);
module.exports = productRouter;
