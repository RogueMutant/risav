import mongoose, { Schema, model } from "mongoose";
import { IResource } from "../types/custom";

const resourceSchema: Schema = new mongoose.Schema<IResource>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: ["available", "reserved", "maintenance"],
      default: "available",
    },
    location: { type: String },
    reservationCount: { type: Number, default: 0 },
    imageUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provide the user"],
    },
  },
  { timestamps: true }
);
export default model<IResource>("Resource", resourceSchema);
