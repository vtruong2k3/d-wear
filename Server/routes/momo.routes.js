const express = require("express");
const momoRouter = express.Router();

const momoController = require("../controllers/momo.controller");
momoRouter.post("/momo/create-payment", momoController.createPayment);
momoRouter.post("/momo/ipn", momoController.handleMomoIPN);
momoRouter.post("/momo/check", momoController.checkPaymentStatus);
module.exports = momoRouter;
