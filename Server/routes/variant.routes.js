const express = require("express");
const variantRouter = express.Router();
const variantController = require("../controllers/variant.controller");
const upload = require("../middlewares/uploadProduct.middleware");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

variantRouter.get(
  "/variant",
  authAdminMiddelware,
  variantController.getAllVariant
);
// hiển thị xoá mềm
variantRouter.get(
  "/variant/soft-delete",
  variantController.getSoftDeletedVariants
);

variantRouter.get(
  "/variant/product/:id",
  variantController.getIdProductVariant
);
variantRouter.get("/variant/:id", variantController.getIdVariant);
variantRouter.post(
  "/variant",
  upload.fields([{ name: "imageVariant", maxCount: 5 }]),
  variantController.createVariant
);

variantRouter.put(
  "/variant/:id",
  upload.fields([{ name: "imageVariant", maxCount: 5 }]),
  variantController.updateVariant
);
variantRouter.post(
  "/variant/bulk",
  upload.fields([{ name: "imageVariant", maxCount: 100 }]),
  variantController.createVariantBulk
);
variantRouter.delete("/variant/:id", variantController.deleteVariant);
variantRouter.delete(
  "/variant/product/:id",
  variantController.deleteIdProductVariant
);
// xoá mềm
variantRouter.put(
  "/variant/:id/soft-delete",
  variantController.softDeleteVariant
);

module.exports = variantRouter;
