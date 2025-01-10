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
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    reason: { type: String },
  },
  { timestamps: true }
);
export default model<IReservation>("Reservation", reservationSchema);
