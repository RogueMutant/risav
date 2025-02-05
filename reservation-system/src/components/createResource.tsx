import React, { useState } from "react";
import { Resource } from "../types/custom";
import { useParams } from "react-router-dom";
import { BsX } from "react-icons/bs";
import { useResources } from "../components/resourceContext"; // Import the context hook
import "../styles/createResourceForm.css";

interface CreateResourceProps {
  categories: string[];
  onCancel: () => void;
}

export const CreateResource: React.FC<CreateResourceProps> = ({
  categories,
  onCancel,
}) => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { createResource } = useResources(); // Use the context hook
  const [resourceData, setResourceData] = useState<Resource>({
    name: "",
    description: "",
    category: categoryName || "",
    image: null as File | null,
  });
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setResourceData({ ...resourceData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setResourceData({
      ...resourceData,
      image: file,
    });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  };

  const handleRemoveImage = () => {
    setResourceData({ ...resourceData, image: null });
    setPreviewURL(null);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the createResource function from the context
      createResource(resourceData);
      console.log("Resource created:", resourceData);

      // Reset the form
      setResourceData({
        name: "",
        description: "",
        category: categoryName || "",
        image: null,
      });
      setPreviewURL(null);

      const form = e.target as HTMLFormElement;
      form.reset();

      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // Close the form (optional, if you want to close it after submission)
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
          onChange={handleChange}
          placeholder="Enter resource name"
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
              onClick={handleRemoveImage}
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
          onChange={handleChange}
          placeholder="Enter a description"
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
