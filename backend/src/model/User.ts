require("dotenv").config();
import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../types/custom";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const userSchema: Schema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "user"],
      default: "user",
    },
    profileImageUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isFallbackAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    if (typeof this.password === "string")
      this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});
userSchema.methods.createJwt = function () {
  return Jwt.sign(
    { userId: this._id, userName: this.name, role: this.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_LIFETIME as string }
  );
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // console.log("Comparing passwords");
    // console.log("Candidate password length:", candidatePassword.length);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    // console.log("Password match result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

export default model<IUser>("User", userSchema);
