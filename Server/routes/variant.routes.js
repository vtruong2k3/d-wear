const express = require("express");
const variantRouter = express.Router();
const variantControlller = require("../controllers/variant.controller");
const upload = require("../middlewares/uploadProduct.middleware");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

variantRouter.get(
  "/variant",
  authAdminMiddelware,
  variantControlller.getAllVariant
);
variantRouter.get("/variant/:id", variantControlller.getIdVariant);
variantRouter.get(
  "/variant/product/:id",
  variantControlller.getIdProductVariant
);

variantRouter.post(
  "/variant",
  upload.fields([{ name: "imageVariant", maxCount: 5 }]),
  variantControlller.createVariant
);

variantRouter.put(
  "/variant/:id",
  upload.fields([{ name: "imageVariant", maxCount: 5 }]),
  variantControlller.updateVariant
);

variantRouter.delete("/variant/:id", variantControlller.deleteVariant);
variantRouter.delete(
  "/variant/product/:id",
  variantControlller.deleteIdProductVariant
);

module.exports = variantRouter;
