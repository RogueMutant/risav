import express, { Router } from "express";
import {
  cancelReservation,
  createReservation,
  getAllMyReservation,
  getReservation,
} from "../controllers/reservationController";

const router: Router = express.Router();

router.route("/v1").get(getAllMyReservation);
router.route("/v1").post(createReservation);
router.route("/v1/:id").post(getReservation).delete(cancelReservation);
export default router;
