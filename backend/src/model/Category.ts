import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types/custom";

const categorySchema: Schema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "Provide user",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
