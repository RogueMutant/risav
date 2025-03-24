import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../model/Category";
import Resource from "../model/Resource";
import { CustomRequest, IResource } from "../types/custom";
import User from "../model/User";

const getAllResources = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const user = await User.findOne({ role: "super_admin" });
  if (!user) {
    console.log("User not found");
    return;
  }
  const createdBy = req.user?.userId;

  const resources = await Resource.find({ createdBy: user.id }).populate(
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

const createResource = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const {
    name,
    category,
    description,
    resourceStatus,
    imageUrl,
    location,
    itemCount,
    availableDays,
    availableTime,
  } = req.body;

  // Check user authorization
  if (req.user?.role !== "super_admin" && req.user?.role !== "admin") {
    res.status(403).json({
      message: "You do not have the authority",
      status: "unauthorized",
    });
    return;
  }
  // Validate category
  const validCategory = await Category.findOne({ name: category });
  if (!validCategory) {
    res.status(400).json({ message: "Invalid category" });
    return;
  }

  const resource: IResource = new Resource({
    name,
    category: validCategory._id,
    description,
    resourceStatus,
    imageUrl,
    location,
    itemCount,
    availableDays,
    availableTime,
    createdBy: req.user?.userId,
  });
  await resource.save();
  console.log("Token form resource", req.cookies.userToken);
  res.status(201).json({ message: "Resource created successfully", resource });
};

const updateResource = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    name,
    category,
    description,
    resourceStatus,
    imageUrl,
    location,
    itemCount,
    availableDays,
    availableTime,
  } = req.body;

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

  const validCategory = await Category.findOne({ name: category });
  if (!validCategory) {
    res.status(400).json({ message: "Invalid category" });
    return;
  }

  const updatedResource = await Resource.findByIdAndUpdate(
    id,
    {
      name,
      category: validCategory._id,
      description,
      resourceStatus,
      imageUrl,
      location,
      itemCount,
      availableDays,
      availableTime,
      createdBy: req.user?.userId,
    },
    { new: true, runValidators: true }
  );

  if (!updatedResource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res.status(200).json({
    message: "Resource updated successfully",
    resource: updatedResource,
  });
};

const deleteResource = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(403).json({ message: "User not authenticated" });
    return;
  }
  console.log("resource id:", id);

  const resource = await Resource.findById(id);
  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  if (resource.reservationCount > 0) {
    res
      .status(400)
      .json({ message: "Cannot delete resource. It has active reservations." });
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
