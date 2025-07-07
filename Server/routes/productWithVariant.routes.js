const express = require("express");
const router = express.Router();
const productWithVariantController = require("../controllers/productWithVariant.controller");
const upload = require("../middlewares/uploadProduct.middleware");

router.post(
  "/",
  upload.fields([
    { name: "productImage", maxCount: 8 },
    { name: "imageVariant", maxCount: 10 },
  ]),
  productWithVariantController.createProductWithVariants
);
router.put(
  "/:id",
  upload.fields([
    { name: "productImage", maxCount: 8 },
    { name: "imageVariant", maxCount: 10 },
  ]),
  productWithVariantController.updateProductWithVariants
);
router.delete("/:id", productWithVariantController.deleteProductWithVariants);
router.get("/", productWithVariantController.getAllProductWithVariants);
router.get("/:id", productWithVariantController.getProductWithVariantsById);

module.exports = router;
