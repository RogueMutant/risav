import React, { useState, useEffect } from "react";
import { Resource } from "../types/custom";
import { useParams } from "react-router-dom";
import { BsX } from "react-icons/bs";
import { useResource } from "../hooks/useResource";
import "react-calendar/dist/Calendar.css";
import "../styles/createResourceForm.css";

interface CreateResourceProps {
  categories: string[];
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: Resource;
}

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const CreateResource: React.FC<CreateResourceProps> = ({
  categories,
  onCancel,
  isEditing = false,
  initialData,
}) => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [storeStartTime, setStartTime] = useState<string | null>(null);
  const [storeEndTime, setEndTime] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialData?.availableDays || []
  );
  const [resourceData, setResourceData] = useState<Resource>(
    isEditing && initialData
      ? initialData
      : {
          name: "",
          description: "",
          category: categoryName || "",
          imageUrl: null as File | null,
          availableDays: [],
          availableTime: ["", ""],
          resourceCount: 1,
          location: "",
        }
  );
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const { createResource, updateResource, isLoading } = useResource();

  useEffect(() => {
    if (isEditing && initialData?.imageUrl) {
      setPreviewURL(initialData.imageUrl as string);
    }
  }, [isEditing, initialData]);

  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    setResourceData((prev) => ({ ...prev, availableDays: selectedDays }));
  };

  const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartTime(value);
    setResourceData((prev) => ({
      ...prev,
      availableTime: [value + " AM", prev.availableTime[1]],
    }));
  };

  const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndTime(value);
    setResourceData((prev) => ({
      ...prev,
      availableTime: [prev.availableTime[0], value + " PM"],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewURL(objectUrl);
      setResourceData((prev) => ({
        ...prev,
        imageUrl: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDays.length) {
      alert("Please select at least 1 available day!");
      return;
    }
    if (!resourceData.availableTime[0] || !resourceData.availableTime[1]) {
      alert("Please set both start and end times.");
      return;
    }

    const updatedResourceData = {
      ...resourceData,
      availableDays: selectedDays,
    };

    try {
      if (isEditing && initialData) {
        await updateResource(initialData._id as string, updatedResourceData);
        alert("Resource updated successfully!");
      } else {
        await createResource(updatedResourceData);
        alert("Resource created successfully!");
      }

      setResourceData({
        name: "",
        description: "",
        category: categoryName || "",
        imageUrl: null,
        availableDays: [],
        availableTime: ["", ""],
        resourceCount: 1,
        location: "",
      });
      setSelectedDays([]);
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
        setPreviewURL(null);
      }
      onCancel();
    } catch (err) {
      console.error("Error:", err);
      alert(
        `Failed to ${
          isEditing ? "update" : "create"
        } resource. Please try again.`
      );
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-resource-form"
      >
        <BsX className="close-icon" onClick={onCancel} />
        <h2>{isEditing ? "Edit Resource" : "Create Resource"}</h2>

        <label htmlFor="name">Resource Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) =>
            setResourceData({ ...resourceData, name: e.target.value })
          }
          placeholder="Enter resource name"
          value={resourceData.name}
          required
        />

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
        />

        {previewURL && (
          <div className="image-preview">
            <img src={previewURL} alt="Preview" />
            <button
              type="button"
              onClick={() => setPreviewURL(null)}
              className="remove-image"
            >
              Remove Image
            </button>
          </div>
        )}

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={(e) =>
            setResourceData({ ...resourceData, description: e.target.value })
          }
          placeholder="Enter a description"
          value={resourceData.description}
        />

        <label htmlFor="location">Location</label>
        <textarea
          id="location"
          name="location"
          onChange={(e) =>
            setResourceData({ ...resourceData, location: e.target.value })
          }
          placeholder="Enter a location"
          value={resourceData.location}
        />

        <label htmlFor="availableDays">Available Days</label>
        <div className="days-of-week-container">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className={`day-tile ${
                selectedDays.includes(day) ? "selected" : ""
              }`}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="time-picker-container">
          <label htmlFor="startTime">From</label>
          <input
            type="time"
            id="from-time"
            className="time-input"
            value={storeStartTime || ""}
            onChange={handleStart}
          />
          <label htmlFor="endTime">To</label>
          <input
            type="time"
            id="end-time"
            className="time-input"
            value={storeEndTime || ""}
            onChange={handleEnd}
          />
        </div>

        <label htmlFor="resourceCount">Resource Count</label>
        <input
          type="number"
          id="resourceCount"
          name="resourceCount"
          min="1"
          onChange={(e) =>
            setResourceData({
              ...resourceData,
              resourceCount: parseInt(e.target.value),
            })
          }
          value={resourceData.resourceCount}
        />

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="create-btn">
            {isLoading ? (
              <span className="spinner"></span>
            ) : isEditing ? (
              "Update Resource"
            ) : (
              "Create Resource"
            )}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
