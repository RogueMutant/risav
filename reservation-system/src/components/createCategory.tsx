import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "./authContext";
import "../styles/index.css";

interface categoryProps {
  onCreated: (categoryName: string) => void;
  onCancel: () => void;
}

export const CreateCategory: React.FC<categoryProps> = ({
  onCreated,
  onCancel,
}) => {
  const { error: fetchError, fetchData } = useFetch(
    "/api/categories/v1",
    false,
    "post"
  );
  const [categoryName, setCategoryName] = useState<string>("");
  const { refreshUserData } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      console.error("Category name cannot be empty");
      return;
    }

    try {
      const result = await fetchData({
        name: categoryName.trim(), // Changed to match backend expectation
      });

      if (result) {
        console.log("Category created:", result);
        onCreated(categoryName);
        refreshUserData();
        setCategoryName("");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      if (fetchError) {
        console.error("Fetch error:", fetchError);
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="create-category-form ">
        <label htmlFor="category-name">Category Name:</label>
        <input
          type="text"
          id="category-name"
          name="category-name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit">Create Category</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>{" "}
      </form>
    </div>
  );
};
