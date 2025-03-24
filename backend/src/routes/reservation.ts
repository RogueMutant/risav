import express, { Router } from "express";
import {
  cancelReservation,
  createReservation,
  getAllMyReservations,
  getReservation,
  updateReservationStatus,
  getAllReservations,
} from "../controllers/reservationController";

const router: Router = express.Router();

router.route("/v1").get(getAllReservations);
router.route("/get-my-reservations/v1").get(getAllMyReservations);
router.route("/v1/update").patch(updateReservationStatus);
router.route("/v1").post(createReservation);
router.route("/v1").post(getReservation);
router.route("/v1/cancel").patch(cancelReservation);
export default router;
