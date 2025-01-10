import express, { Router } from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from "../controllers/category";

const router: Router = express.Router();

router.route("/v1").post(createCategory);
router.route("/v1/:id").delete(deleteCategory);
router.route("/v1").get(getAllCategories);

export default router;
