const express = require("express");
const momoRouter = express.Router();

const momoController = require("../controllers/momo.controller");
momoRouter.post("/create-payment", momoController.createPayment);
momoRouter.post("/ipn", momoController.handleMomoIPN);
momoRouter.post("/check", momoController.checkPaymentStatus);
momoRouter.post("/verify", momoController.verifyPaymentFromRedirect); 
module.exports = momoRouter;
