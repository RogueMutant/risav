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
router.route("/v1/:id").patch(updateReservationStatus);
router.route("/v1").post(createReservation);
router.route("/v1/:id").post(getReservation).delete(cancelReservation);
export default router;
