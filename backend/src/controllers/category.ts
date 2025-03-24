import Category from "../model/Category";
import Reservation from "../model/Reservation";
import Resource from "../model/Resource";
import { CustomRequest, ICategory } from "../types/custom";
import { Response } from "express";

const createCategory = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const createdBy = req.user?.userId;

    console.log("Create category request:", {
      name,
      createdBy,
      userRole: req.user?.role,
    });

    // Check user authentication
    if (!req.user || !createdBy) {
      res.status(401).json({
        message: "Not authenticated",
        status: "unauthorized",
      });
      return;
    }

    // Check user authorization
    if (req.user.role !== "super_admin" && req.user.role !== "admin") {
      res.status(403).json({
        message: "You do not have the authority",
        status: "unauthorized",
      });
      return;
    }

    // Validate category name
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        message: "Valid category name is required",
        status: "Failed",
      });
      return;
    }

    // Check for existing category
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      res.status(400).json({
        message: "Category already exists",
        status: "Failed",
      });
      return;
    }

    // Create category
    const category = new Category({
      name: name.trim(),
      createdBy,
    });

    const savedCategory = await category.save();
    console.log("Category created successfully:", savedCategory);

    res.status(201).json({
      message: "Category created",
      status: "success",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Failed to create category",
      status: "Failed",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

const getAllCategories = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const categories = await Category.find();
  if (categories) {
    res.status(200).json(categories);
    return;
  }
  res
    .status(500)
    .json({ message: "There are no categories", status: "An error occurred" });
};

const deleteCategory = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { categoryName } = req.body;

    // Check if the category exists
    const id = await Category.findOne({ name: categoryName });
    if (!id) {
      res.status(404).json({ message: "Invalid category ID" });
      return;
    }

    // Find all resources associated with this category
    const resourcesInCategory = await Resource.find({ category: id._id });

    // Check if any of these resources are being used in reservations
    const isCategoryUsed = await Reservation.exists({
      resource: { $in: resourcesInCategory.map((r) => r._id) },
    });

    if (isCategoryUsed) {
      res
        .status(400)
        .json({ message: "Category is in use and cannot be deleted" });
      return;
    }

    // If the category is not in use, delete it
    await Category.findByIdAndDelete(id._id);
    res
      .status(200)
      .json({ message: "Category deleted successfully", categoryName });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

export { createCategory, getAllCategories, deleteCategory };
