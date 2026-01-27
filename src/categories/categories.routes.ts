import { Router } from "express";
import { categoriesController } from "./categories.controller.js";
// import { verifyToken } from "../auth/auth.middleware"; // optional

const router = Router();

// Uncomment if you want to protect all category routes
// router.use(verifyToken);

/**
 * @route GET /categories
 * @desc Get all categories
 */
router.get("/", categoriesController.getAllCategories);

/**
 * @route POST /categories
 * @desc Create a new category
 */
router.post("/", categoriesController.createCategory);

/**
 * @route PATCH /categories/:id
 * @desc Update category (partial update)
 */
router.patch("/:id", categoriesController.updateCategory);

/**
 * @route DELETE /categories/:id
 * @desc Delete category
 */
router.delete("/:id", categoriesController.deleteCategory);

export default router;
