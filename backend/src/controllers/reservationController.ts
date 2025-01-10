import { CustomRequest } from "../types/custom";
import Reservation from "../model/Reservation";
import { Response } from "express";
import mongoose from "mongoose";

// Get all reservations for the logged-in user
const getAllMyReservation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res
      .status(403)
      .json({ message: "User not authenticated", status: "Failed" });
    return;
  }

  const allReservations = await Reservation.find({ createdBy: userId }).sort(
    "createdAt"
  );

  if (!allReservations.length) {
    res.status(404).json({
      message: "You have not made any reservations yet!",
      status: "Failed",
    });
    return;
  }

  res.status(200).json({
    message: "Here are all your reservations",
    status: "Success",
    reservations: allReservations,
  });
};

// Get a specific reservation by ID
const getReservation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { reservationId } = req.params;
  const userId = req.user?.userId;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res
      .status(400)
      .json({ message: "Invalid reservation ID", status: "Failed" });
    return;
  }

  const reservation = await Reservation.findOne({
    _id: reservationId,
    createdBy: userId,
  });

  if (!reservation) {
    res
      .status(404)
      .json({ message: "Reservation not found", status: "Failed" });
    return;
  }

  res.status(200).json({
    message: "Here is your reservation",
    status: "Success",
    reservation,
  });
};

// Create a new reservation
const createReservation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { startDate, endDate, status, reason } = req.body;
  const userId = req.user?.userId;

  if (!startDate || !endDate || !reason) {
    res
      .status(400)
      .json({ message: "Missing required fields", status: "Failed" });
    return;
  }

  const newReservation = await Reservation.create({
    createdBy: userId,
    startDate,
    endDate,
    status,
    reason,
  });

  res.status(201).json({
    message: "You have successfully made a reservation",
    status: "Success",
    reservation: newReservation,
  });
};

// Cancel a reservation
const cancelReservation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { reservationId } = req.params;
  const userId = req.user?.userId;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res
      .status(400)
      .json({ message: "Invalid reservation ID", status: "Failed" });
    return;
  }

  const reservation = await Reservation.findOneAndDelete({
    _id: reservationId,
    createdBy: userId,
  });

  if (!reservation) {
    res.status(404).json({
      message: "Reservation not found or you are not authorized to cancel it",
      status: "Failed",
    });
    return;
  }

  res.status(200).json({
    message: "You have successfully cancelled your reservation",
    status: "Success",
    reservation,
  });
};

export {
  getAllMyReservation,
  getReservation,
  createReservation,
  cancelReservation,
};
