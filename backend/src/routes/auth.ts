import express, { Router } from "express";
import {
  createUser,
  logoutUser,
  emergencyCode,
  login,
  roleUpdate,
  setFallBackAdmin,
  getCurrentUser,
  updateProfile,
} from "../controllers/auth";
import { auth } from "../middleware/auth";

const userAuth: Router = express.Router();

userAuth.get("/me", getCurrentUser);
userAuth.route("/register").post(createUser);
userAuth.route("/login").post(login);
userAuth.route("/updateProfile").patch(updateProfile);
userAuth.route("/logout").post(logoutUser);
userAuth.route("/users/:id/fallback").put(setFallBackAdmin);
userAuth.route("/users/emergency-super-admin").put(emergencyCode);
userAuth.route("/users/role-update").put(roleUpdate);

export default userAuth;
