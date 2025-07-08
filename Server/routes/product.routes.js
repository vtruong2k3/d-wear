const express = require("express");
const productRouter = express.Router();
const upload = require("../middlewares/uploadProduct.middleware");
const productControler = require("../controllers/product.controller");

productRouter.post(
  "/product",
  upload.fields([
    { name: "productImage", maxCount: 8 },
    { name: "imageVariant", maxCount: 10 },
  ]),
  productControler.createProductWithVariants
);
productRouter.put(
  "/product/:id",
  upload.fields([
    { name: "productImage", maxCount: 8 },
    { name: "imageVariant", maxCount: 10 },
  ]),
  productControler.updateProductWithVariants
);
productRouter.delete(
  "/product/:id",
  productControler.deleteProductWithVariants
);
productRouter.get("/product", productControler.getAllProductWithVariants);
productRouter.get("/product/:id", productControler.getProductWithVariantsById);

productRouter.get("/product/items", productControler.getAllProdutsItem);

module.exports = productRouter;
