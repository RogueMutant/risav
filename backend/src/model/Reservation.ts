import mongoose, { Schema, model } from "mongoose";
import { IReservation } from "../types/custom";

const reservationSchema: Schema = new mongoose.Schema<IReservation>(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    resource: {
      type: mongoose.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    reservationDate: { type: Date, required: true },
    time: { type: [String], required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "confirmed"],
      default: "pending",
    },
    reason: { type: String },
  },
  { timestamps: true }
);
export default model<IReservation>("Reservation", reservationSchema);
