import express, { Router } from "express";
import {
  createUser,
  emergencyCode,
  login,
  roleUpdate,
  setFallBackAdmin,
} from "../controllers/auth";

const userAuth: Router = express.Router();

userAuth.route("/register").post(createUser);
userAuth.route("/login").post(login);
userAuth.route("/users/:id/fallback").put(setFallBackAdmin);
userAuth.route("/users/emergency-super-admin").put(emergencyCode);
userAuth.route("/users/role-update").put(roleUpdate);

export default userAuth;
