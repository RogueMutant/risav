import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { IUser, CustomRequest } from "../types/custom";
import Category from "../model/Category";
import Resource from "../model/Resource";
import bcrypt from "bcryptjs";

const getAllUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.userToken;
    console.log("token fromm getAll", token);

    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const all_users = await User.find({}).select("-password");
    if (!all_users) {
      res.status(404).json({ message: "No users found", status: "failed" });
      return;
    }
    res.status(200).json({
      all_users,
      message: "Gotten all users",
      count: all_users.length,
      status: "Success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: "failed" });
  }
};

const getCurrentUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.userToken; // Get token from cookie
    console.log("token form getCurrent", token);

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
    const categories = await Category.find({});
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log(user, categories);

    res.status(200).json({ user, categories });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const logoutUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.isActive = false;
        await user.save();
      }
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

const createUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({
        message: "Please provide all required fields",
        status: "Failed",
      });
      return;
    }

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      res.status(400).json({
        message: "Email already in use",
        status: "Failed",
      });
      return;
    }

    // Determine role
    const existingUsers = await User.find({});
    const role = existingUsers.length === 0 ? "super_admin" : "user";

    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive: true,
    });

    const token = user.createJwt();
    res.clearCookie("userToken");
    // Set cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Successfully created user",
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Failed to create user",
      status: "Failed",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

const login = async (req: CustomRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  if (!email || !password) {
    console.log("Missing email or password");
    res.status(400).json({
      message: "Please provide email and password",
      status: "Failed",
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("No user found with email:", email);
    res.status(400).json({
      message: "There is no matching email, please sign up",
      status: "Failed",
    });
    return;
  }

  console.log("Comparing passwords for user:", user.email);
  const isValid = await user.comparePassword(password);
  console.log("Password comparison result:", isValid);

  if (!isValid) {
    console.log("Invalid password for user:", user.email);
    res.status(400).json({
      message: "Wrong password provided",
      status: "Failed",
    });
    return;
  }

  user.isActive = true;
  await user.save();

  const token = user.createJwt();
  res.clearCookie("userToken");
  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Welcome back",
    status: "success",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
    token,
  });
  console.log("Logged in successfully", user._id);
  return;
};

const updateProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      email,
      name,
      phoneNumber,
      password,
      profileImageUrl,
      userId: id,
    } = req.body;

    if (!id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const updateData: Record<string, any> = {};

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (profileImageUrl) {
      updateData.profileImageUrl = profileImageUrl;
    }
    const newId = id.toString();

    const updatedUser = await User.findByIdAndUpdate(newId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.log("profile update request: ", updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
  getAllUsers,
  getCurrentUser,
  logoutUser,
  createUser,
  login,
  updateProfile,
  setFallBackAdmin,
  emergencyCode,
  roleUpdate,
};
