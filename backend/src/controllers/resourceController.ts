import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../model/Category";
import Resource from "../model/Resource";
import { CustomRequest, IResource } from "../types/custom";

const getAllResources = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const createdBy = req.user?.userId;

  const resources = await Resource.find({ createdBy: createdBy }).populate(
    "category",
    "name"
  ); // Populate only the category name
  res.status(200).json(resources);
};

const getResource = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  // Validate the resource ID format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid resource ID" });
    return;
  }

  const resource = await Resource.findById(id).populate("category", "name");

  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res
    .status(200)
    .json({ message: "Here is the resource", status: "Success", resource });
};

// Create a new resource
const createResource = async (req: Request, res: Response): Promise<void> => {
  const { name, category, description, status, imageUrl, location } = req.body;

  // Validate category
  const validCategory = await Category.findById(category);
  if (!validCategory) {
    res.status(400).json({ message: "Invalid category" });
    return;
  }

  const resource: IResource = new Resource({
    name,
    category,
    description,
    status,
    imageUrl,
    location,
  });

  await resource.save();
  res.status(201).json({ message: "Resource created successfully", resource });
};

const updateResource = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, category, description, status, imageUrl, location } = req.body;

  const userId = req.user?.userId;
  if (!userId) {
    res.status(403).json({ message: "User not authenticated" });
    return;
  }

  const resource = await Resource.findById(id);
  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  if (resource.createdBy.toString() !== userId) {
    res
      .status(403)
      .json({ message: "You are not authorized to update this resource" });
    return;
  }

  if (category) {
    const validCategory = await Category.findById(category);
    if (!validCategory) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }
  }

  const updatedResource = await Resource.findByIdAndUpdate(
    id,
    { name, category, description, status, imageUrl, location },
    { new: true, runValidators: true }
  );

  if (!updatedResource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res
    .status(200)
    .json({
      message: "Resource updated successfully",
      resource: updatedResource,
    });
};

const deleteResource = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(403).json({ message: "User not authenticated" });
    return;
  }

  const deletedResource = await Resource.findOneAndDelete({
    _id: id,
    createdBy: userId,
  });

  if (!deletedResource) {
    res
      .status(404)
      .json({ message: "Resource not found or not authorized to delete" });
    return;
  }
  res
    .status(200)
    .json({ message: "Resource deleted successfully", status: "success" });
};

export {
  getResource,
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
};
