const express = require("express");
const brandRouter = express.Router();
const brandController = require("../controllers/brand.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

brandRouter.post("/brand", authAdminMiddelware, brandController.createBrand);
brandRouter.get("/brand", brandController.getAllBrands);
brandRouter.get("/brand/:id", brandController.getBrandById);
brandRouter.put("/brand/:id", authAdminMiddelware, brandController.updateBrand);
brandRouter.delete(
  "/brand/:id",
  authAdminMiddelware,
  brandController.deleteBrand
);

module.exports = brandRouter;
