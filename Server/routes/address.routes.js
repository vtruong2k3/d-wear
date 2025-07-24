const express = require("express");
const addressRouter = express.Router();
const addressController = require("../controllers/address.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");

addressRouter.post(
  "/address",
  authUserMiddelware,
  addressController.addAddress
);
addressRouter.put(
  "/address/:id",
  authUserMiddelware,
  addressController.updateAddress
);
addressRouter.get(
  "/address",
  authUserMiddelware,
  addressController.getAddressesByUser
);
addressRouter.delete(
  "/address/:id",
  authUserMiddelware,
  addressController.deleteAddress
);
module.exports = addressRouter;
