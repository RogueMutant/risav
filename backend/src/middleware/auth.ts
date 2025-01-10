import "dotenv/config";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/custom";
import { NextFunction, Response } from "express";

interface jwtPayload {
  name: string;
  userId: string;
  role: "super_admin" | "admin" | "user";
}

const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  // console.log(token, authHeader);

  if (!token) {
    res
      .status(401)
      .json({ message: "Authentication required", status: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as jwtPayload;
    req.user = { ...decoded };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid token provided", status: "Unauthorized" });
  }
};

export { auth };
