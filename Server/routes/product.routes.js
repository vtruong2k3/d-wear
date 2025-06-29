const express = require("express");
const productRouter = express.Router();
const upload = require("../middlewares/uploadProduct.middleware");
const productControler = require("../controllers/product.controller");

productRouter.post(
  "/product",
  upload.fields([{ name: "productImage", maxCount: 5 }]),
  productControler.createProduct
);

productRouter.get("/product", productControler.getAllProducts);
productRouter.get("/product/items", productControler.getAllProdutsItem);
productRouter.get("/product/:id", productControler.getProductById);

productRouter.put(
  "/product/:id",
  upload.fields([{ name: "productImage", maxCount: 5 }]),
  productControler.updateProduct
);

productRouter.delete("/product/:id", productControler.deleteProduct);

module.exports = productRouter;
