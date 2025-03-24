import { CustomRequest } from "../types/custom";
import Reservation from "../model/Reservation";
import Resource from "../model/Resource";
import { Response } from "express";
import mongoose from "mongoose";
import User from "../model/User";

const getAllMyReservations = async (
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
  res.status(200).json(allReservations);
};

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

const createReservation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const {
    reservationDate,
    time,
    reason,
    resourceId,
    resource: name,
  } = req.body;
  const userId = req.user?.userId;

  if (!reservationDate || !time || !resourceId) {
    res
      .status(400)
      .json({ message: "Missing required fields", status: "Failed" });
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found", status: "Failed" });
    return;
  }
  const userEmail = user.email;
  const userName = user.name;

  // Check if the resource exists and has available items
  const resource = await Resource.findById(resourceId);
  if (!resource || resource.itemCount < 1) {
    res.status(400).json({
      message: "Resource unavailable or insufficient items",
      status: "Failed",
    });
    return;
  }

  const matchingResource = await Reservation.findOne({
    resource: resourceId,
    reservationDate,
    time,
  });
  if (matchingResource) {
    res.status(403).json({
      message: "Resource already reserved",
      status: "Failed",
    });
    console.log("Resource already reserved");

    return;
  }

  const existingReservation = await Reservation.findOne({
    resource: resourceId,
    reservationDate,
    time,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingReservation) {
    res.status(409).json({
      message:
        "This resource is already reserved for the selected date and time",
      status: "Failed",
      existingReservation,
    });
    return;
  }
  const newReservation = await Reservation.create({
    createdBy: userId,
    reservationDate,
    time,
    status: "pending",
    reason,
    name,
    userName,
    userEmail,
    resource: resourceId,
  });

  res.status(201).json({
    message: "You have successfully made a reservation. Awaiting confirmation.",
    status: "Success",
    reservation: newReservation,
  });
};

const cancelReservation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { reservationId } = req.body;
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
    res.status(404).json({
      message: "Reservation not found or you are not authorized to cancel it",
      status: "Failed",
    });
    return;
  }
  if (reservation.status === "cancelled") {
    res.status(403).json({
      message: "Reservation already cancelled!",
      status: "Failed",
    });
    return;
  }
  if (reservation.status === "confirmed" || reservation.status === "pending") {
    await Resource.findByIdAndUpdate(reservation.resource, {
      $inc: { reservationCount: -1 },
    });
  }

  await Reservation.findByIdAndUpdate(reservationId, { status: "cancelled" });

  res.status(200).json({
    message: "You have successfully cancelled your reservation",
    status: "Success",
    reservation,
  });
};

const updateReservationStatus = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { status, reservationId } = req.body;
  const isAdmin = req.user?.role;

  if (isAdmin !== "admin" && isAdmin !== "super_admin") {
    res.status(403).json({
      message: "Only admins can update reservation status",
      status: "Failed",
    });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res
      .status(400)
      .json({ message: "Invalid reservation ID", status: "Failed" });
    return;
  }

  if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
    res.status(400).json({
      message: "Invalid status. Must be 'pending', 'confirmed', or 'cancelled'",
      status: "Failed",
    });
    return;
  }

  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    res.status(404).json({
      message: "Reservation not found",
      status: "Failed",
    });
    return;
  }

  const oldStatus = reservation.status;
  if (status === "confirmed") {
    const conflictingReservation = await Reservation.findOne({
      _id: { $ne: reservationId },
      resource: reservation.resource,
      reservationDate: reservation.reservationDate,
      time: reservation.time,
      status: "confirmed",
    });

    if (conflictingReservation) {
      res.status(409).json({
        message:
          "Cannot confirm reservation: There is already a confirmed reservation for this resource at the same time",
        status: "Failed",
        conflictingReservation,
      });
      return;
    }
  }

  if (oldStatus !== "confirmed" && status === "confirmed") {
    await Resource.findByIdAndUpdate(reservation.resource, {
      $inc: { reservationCount: 1 },
    });
  } else if (oldStatus === "confirmed" && status !== "confirmed") {
    await Resource.findByIdAndUpdate(reservation.resource, {
      $inc: { reservationCount: -1 },
    });
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(
    reservationId,
    { status },
    { new: true }
  );

  res.status(200).json({
    message: `Reservation status updated from '${oldStatus}' to '${status}'`,
    status: "Success",
    reservation: updatedReservation,
  });
};

const getAllReservations = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const isAdmin = req.user?.role;

  if (isAdmin !== "admin" && isAdmin !== "super_admin") {
    res.status(403).json({
      message: "Only admins can update reservation status",
      status: "Failed",
    });
    return;
  }

  const allReservations = await Reservation.find()
    .sort("createdAt")
    .populate("createdBy", "name email");

  res.status(200).json({
    message: "All reservations retrieved",
    status: "Success",
    reservations: allReservations,
  });
};

export {
  getAllMyReservations,
  getReservation,
  createReservation,
  cancelReservation,
  updateReservationStatus,
  getAllReservations,
};
