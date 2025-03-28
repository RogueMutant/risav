import express, { Router } from "express";
import {
  createResource,
  deleteResource,
  getAllResources,
  getResource,
  updateResource,
} from "../controllers/resourceController";

const router: Router = express.Router();

router.route("/v1/:id").get(getResource);
router.route("/v1").get(getAllResources);
router.route("/v1").post(createResource);
router.route("/v1").patch(updateResource).delete(deleteResource);
export default router;
