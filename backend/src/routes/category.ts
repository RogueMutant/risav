import express, { Router } from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from "../controllers/category";

const router: Router = express.Router();

router
  .route("/v1")
  .get(getAllCategories)
  .post(createCategory)
  .delete(deleteCategory);

export default router;
