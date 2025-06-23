const express = require("express");
const brandRouter = express.Router();
const brandController = require("../controllers/brand.controller");

brandRouter.post("/brand", brandController.createBrand);
brandRouter.get("/brand", brandController.getAllBrands);
brandRouter.get("/brand/:id", brandController.getBrandById);
brandRouter.put("/brand/:id", brandController.updateBrand);
brandRouter.delete("/brand/:id", brandController.deleteBrand);

module.exports = brandRouter;
