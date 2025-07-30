const Review = require("../models/reviews");

exports.reviewOrderProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log("Lỗi khi bình luận", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
