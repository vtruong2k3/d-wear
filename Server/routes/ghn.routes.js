const express = require("express");
const ghnRouter = express.Router();
const ghnController = require("../controllers/ghn.controller");
// tỉnh thành phố
ghnRouter.get("/ghn/provinces", ghnController.getProvinces);
//quận huyện
ghnRouter.get(
  "/ghn/districts/:provinceId",
  ghnController.getDistrictsByProvince
);
//xã Phường
ghnRouter.get("/ghn/wards/:districtId", ghnController.getWardsByDistrict);
// tính phí ship
ghnRouter.post("/ghn/calculate-fee", ghnController.calculateFee);

module.exports = ghnRouter;
