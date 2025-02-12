import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { IUser, CustomRequest } from "../types/custom";

const getCurrentUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.userToken; // Get token from cookie

    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };
    console.log("decoded getcurrent token", decoded);

    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log(user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const logoutUser = (req: CustomRequest, res: Response): void => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  console.log("Logged out successfully");

  res.status(200).json({ message: "Logged out successfully" });
};

const createUser = async (req: CustomRequest, res: Response): Promise<void> => {
  const existingUser = await User.find({});

  const role = existingUser.length === 0 ? "super_admin" : "user";

  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    if (name && email) {
      const user = await User.create({
        name,
        email,
        password,
        role,
        isActive: true,
      });
      const token = user.createJwt();
      res.cookie("userToken", token, {
        httpOnly: true, // Prevents client-side access (more secure)
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
      });
      res.status(200).json({
        message: "Succesfully created a user",
        status: "success",
        userDetails: user,
        token,
      });
      return;
    }
  } catch (error) {
    console.log(error, `this is the body ${req.body}`);
  }
  res.status(404).json({
    message: "failed to create a user",
    status: "Failed",
    body: req.body,
  });
};

const login = async (req: CustomRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: "Please provide email and password",
      status: "Failed",
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      message: "There is no matching email, please sign up",
      status: "Failed",
    });
    return;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    res.status(400).json({
      message: "Wrong password provided",
      status: "Failed",
    });
    return;
  }

  user.isActive = true;
  await user.save();

  const token = user.createJwt();

  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Welcome back",
    status: "success",
    token,
  });
  return;
};

const updateProfile = async (req: CustomRequest, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(req.user?.userId, {
    ...req.body,
  });
};

const setFallBackAdmin = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isFallbackAdmin } = req.body;

    const user: IUser | null = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user && user.role !== "admin") {
      res.status(400).json({ message: "Only admins can be fallback admins" });
      return;
    }

    if (user) {
      user.isFallbackAdmin = isFallbackAdmin;
      await user.save();
      res.status(200).json({ message: `Fallback admin status updated`, user });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

const emergencyCode = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId, emergencyCode }: { userId: string; emergencyCode: string } =
      req.body;

    // Validate emergency code
    if (emergencyCode !== process.env.EMERGENCY_CODE) {
      res.status(403).json({ message: "Invalid emergency code" });
      return;
    }

    // Find the user by ID
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Ensure the user is a fallback admin
    if (!user?.isFallbackAdmin) {
      res.status(403).json({ message: "User is not a fallback admin" });
      return;
    }

    // Find the current super admin and demote them
    const currentSuperAdmin: IUser | null = await User.findOne({
      role: "super_admin",
    });
    if (currentSuperAdmin) {
      currentSuperAdmin.role = "admin";
      await currentSuperAdmin.save();
    }

    // Promote the fallback admin to super admin
    if (user) {
      user.role = "super_admin";
      user.isFallbackAdmin = false; // Remove fallback status
      await user.save();
      res.status(200).json({ message: "User promoted to super admin", user });
    }
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

const roleUpdate = async (req: CustomRequest, res: Response): Promise<void> => {
  const {
    body: { role },
    params: { id },
  } = req;

  if (req.user?.role !== "super_admin") {
    res.status(403).json({
      message: "Only the super admin can update roles.",
      status: "Forbidden",
    });
    return;
  }

  // Prevent granting super_admin role to anyone other than fallback admins
  if (role === "super_admin") {
    const targetUser = await User.findById(id);

    if (!targetUser) {
      res.status(404).json({ message: "User not found", status: "Error" });
      return;
    }

    if (!targetUser?.isFallbackAdmin) {
      res.status(403).json({
        message: "Only fallback admins can be promoted to super admin.",
        status: "Forbidden",
      });
      return;
    }
  }

  // Update the user's role
  const updateUser = await User.findByIdAndUpdate(id, { role }, { new: true });

  res.status(200).json({
    message: `Successfully updated ${updateUser?.name}'s role to ${role}.`,
    status: "Success",
  });
};

export {
  getCurrentUser,
  logoutUser,
  createUser,
  login,
  updateProfile,
  setFallBackAdmin,
  emergencyCode,
  roleUpdate,
};
