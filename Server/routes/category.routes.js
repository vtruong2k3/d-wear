const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/category.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

categoryRouter.post(
  "/category",
  authAdminMiddelware,
  categoryController.createCategory
);
categoryRouter.get("/category", categoryController.getAllCategories);
categoryRouter.get("/category/:id", categoryController.getCategoryById);
categoryRouter.put(
  "/category/:id",
  authAdminMiddelware,
  categoryController.updateCategory
);
categoryRouter.delete(
  "/category/:id",
  authAdminMiddelware,
  categoryController.deleteCategory
);
module.exports = categoryRouter;
