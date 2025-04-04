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
  getAllUsers,
  createAdmin,
} from "../controllers/auth";

const userAuth: Router = express.Router();
userAuth.get("/all-users", getAllUsers);
userAuth.get("/me", getCurrentUser);
userAuth.post("/create-admin", createAdmin);
userAuth.route("/register").post(createUser);
userAuth.route("/login").post(login);
userAuth.route("/updateProfile").patch(updateProfile);
userAuth.route("/logout").post(logoutUser);
userAuth.route("/users/:id/fallback").put(setFallBackAdmin);
userAuth.route("/users/emergency-super-admin").put(emergencyCode);
userAuth.route("/users/role-update").put(roleUpdate);

export default userAuth;
