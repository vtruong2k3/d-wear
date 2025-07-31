const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("../controllers/review.controller");
const upload = require("../middlewares/uploadReview.middleware");
const authUserMiddelware = require("../middlewares/auth.middleware");

reviewRouter.post(
  "/review",
  authUserMiddelware,
  upload.fields([{ name: "reviewImage", maxCount: 5 }]),
  reviewController.reviewOrderProduct
);

reviewRouter.get(
  "/review/:productId",
  authUserMiddelware,
  reviewController.getAllReview
);
module.exports = reviewRouter;
