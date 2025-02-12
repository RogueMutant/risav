import React, { useState } from "react";
import { Resource } from "../types/custom";
import { useParams } from "react-router-dom";
import { BsX } from "react-icons/bs";
import { useResources } from "../components/resourceContext";
import "react-calendar/dist/Calendar.css";
import "../styles/createResourceForm.css";

interface CreateResourceProps {
  categories: string[];
  onCancel: () => void;
}

const daysOfWeek = [
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
}) => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [storeStartTime, setStartTime] = useState<string | null>(null);
  const [storeEndTime, setEndTime] = useState<string | null>(null);
  const { createResource } = useResources();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [resourceData, setResourceData] = useState<Resource>({
    name: "",
    description: "",
    category: categoryName || "",
    image: null as File | null,
    availableDays: [],
    startTime: "",
    endTime: "",
    resourceCount: 1,
  });
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    setResourceData((prev) => ({ ...prev, availableDays: selectedDays })); // Update resourceData
  };

  const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartTime(value);
    setResourceData((prev) => ({ ...prev, startTime: value.concat(" AM") }));
  };

  const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (storeStartTime && value < storeStartTime) {
      alert("End time must be after start time!");
      return;
    }
    setEndTime(value);
    setResourceData((prev) => ({ ...prev, endTime: value.concat(" PM") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resourceData.startTime || !resourceData.endTime) {
      alert("Please set both start and end times.");
      return;
    }

    try {
      createResource(resourceData);
      console.log("Resource created:", resourceData);

      setResourceData({
        name: "",
        description: "",
        category: categoryName || "",
        image: null,
        availableDays: [],
        startTime: "",
        endTime: "",
        resourceCount: 1,
      });

      setPreviewURL(null);
      onCancel();
    } catch (err) {
      console.error("Error creating resource:", err);
    }
  };

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-resource-form"
      >
        <BsX className="close-icon" onClick={onCancel} />

        <label htmlFor="name">Resource Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) =>
            setResourceData({ ...resourceData, name: e.target.value })
          }
          placeholder="Enter resource name"
        />

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setResourceData({ ...resourceData, image: file });
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setPreviewURL(reader.result as string);
              reader.readAsDataURL(file);
            } else {
              setPreviewURL(null);
            }
          }}
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
        {/* Resource Count */}
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
          <button type="submit">Create Resource</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
