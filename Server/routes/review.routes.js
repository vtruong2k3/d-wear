const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("../controllers/review.controller");
const upload = require("../middlewares/uploadReview.middleware");
const authUserMiddelware = require("../middlewares/auth.middleware");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

reviewRouter.post(
  "/review",
  authUserMiddelware,
  upload.fields([{ name: "reviewImage", maxCount: 5 }]),
  reviewController.reviewOrderProduct
);
reviewRouter.put("/review/approved/:reviewId", reviewController.updateAppoved);
reviewRouter.post(
  "/review/:reviewId/reply",
  authAdminMiddelware,
  reviewController.reviewRely
);

reviewRouter.get(
  "/review/:productId",

  reviewController.getAllReview
);
reviewRouter.get(
  "/review",
  authAdminMiddelware,
  reviewController.getAllReviewAdmin
);
module.exports = reviewRouter;
